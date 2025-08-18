import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User profiles table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const strategies = pgTable("strategies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  code: text("code").notNull(),
  parameters: jsonb("parameters").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const datasets = pgTable("datasets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  dataQuality: real("data_quality").default(0),
  eventCount: integer("event_count").default(0),
});

export const backtestRuns = pgTable("backtest_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  strategyId: varchar("strategy_id").references(() => strategies.id).notNull(),
  datasetId: varchar("dataset_id").references(() => datasets.id).notNull(),
  status: text("status").notNull(), // 'running', 'completed', 'failed'
  results: jsonb("results"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const trades = pgTable("trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  backtestRunId: varchar("backtest_run_id").references(() => backtestRuns.id).notNull(),
  timestamp: timestamp("timestamp").notNull(),
  side: text("side").notNull(), // 'BUY', 'SELL'
  price: real("price").notNull(),
  size: integer("size").notNull(),
  pnl: real("pnl").default(0),
  slippage: real("slippage").default(0),
  queueRank: integer("queue_rank"),
});

export const marketData = pgTable("market_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").notNull(),
  symbol: text("symbol").notNull(),
  eventType: text("event_type").notNull(), // 'ADD', 'CANCEL', 'TRADE'
  side: text("side"), // 'BID', 'ASK'
  price: real("price"),
  size: integer("size"),
  orderId: text("order_id"),
});

export const insertStrategySchema = createInsertSchema(strategies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDatasetSchema = createInsertSchema(datasets).omit({
  id: true,
});

export const insertBacktestRunSchema = createInsertSchema(backtestRuns).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
});

export type Strategy = typeof strategies.$inferSelect;
export type InsertStrategy = z.infer<typeof insertStrategySchema>;
export type Dataset = typeof datasets.$inferSelect;
export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type BacktestRun = typeof backtestRuns.$inferSelect;
export type InsertBacktestRun = z.infer<typeof insertBacktestRunSchema>;
export type Trade = typeof trades.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type MarketData = typeof marketData.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;

// User types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
