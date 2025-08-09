import { type Strategy, type InsertStrategy, type Dataset, type InsertDataset, type BacktestRun, type InsertBacktestRun, type Trade, type InsertTrade, type MarketData, type InsertMarketData } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Strategies
  getStrategy(id: string): Promise<Strategy | undefined>;
  getAllStrategies(): Promise<Strategy[]>;
  createStrategy(strategy: InsertStrategy): Promise<Strategy>;
  updateStrategy(id: string, strategy: Partial<InsertStrategy>): Promise<Strategy | undefined>;
  
  // Datasets
  getDataset(id: string): Promise<Dataset | undefined>;
  getAllDatasets(): Promise<Dataset[]>;
  createDataset(dataset: InsertDataset): Promise<Dataset>;
  
  // Backtest Runs
  getBacktestRun(id: string): Promise<BacktestRun | undefined>;
  getAllBacktestRuns(): Promise<BacktestRun[]>;
  createBacktestRun(run: InsertBacktestRun): Promise<BacktestRun>;
  updateBacktestRun(id: string, run: Partial<BacktestRun>): Promise<BacktestRun | undefined>;
  
  // Trades
  getTradesByBacktestRun(backtestRunId: string): Promise<Trade[]>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  
  // Market Data
  getMarketDataBySymbol(symbol: string, startTime?: Date, endTime?: Date): Promise<MarketData[]>;
  createMarketData(data: InsertMarketData): Promise<MarketData>;
}

export class MemStorage implements IStorage {
  private strategies: Map<string, Strategy> = new Map();
  private datasets: Map<string, Dataset> = new Map();
  private backtestRuns: Map<string, BacktestRun> = new Map();
  private trades: Map<string, Trade> = new Map();
  private marketData: Map<string, MarketData> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed with sample strategies
    const strategy1: Strategy = {
      id: "strategy-1",
      name: "Maker Queue Aware",
      code: `// Strategy: Maker Queue Aware
function onMarketData(book, trades) {
  const imbalance = calculateImbalance(book);
  const churnRising = isChurnRising(trades);
  
  if (imbalance > 0.6 && churnRising) {
    joinBid(book.bestBid, 1);
  } else if (imbalance < -0.6 && churnRising) {
    joinAsk(book.bestAsk, 1);
  }
  
  // Risk management
  if (getPosition() > maxPosition) {
    reducePosition();
  }
}`,
      parameters: {
        timeWindow: { start: "06:00", end: "15:30" },
        fees: 0.45,
        tickSize: 0.25,
        lotSize: 1,
        takeProfit: 8,
        stopLoss: 6,
        useMBO: true,
        useLatency: true,
        latencyProfile: { distribution: "Gaussian", mean: 10, stdDev: 3 },
        positionLimits: { maxLong: 10, maxShort: 10 }
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const dataset1: Dataset = {
      id: "dataset-1",
      name: "NQ 2025-08 (5 days)",
      symbol: "NQH25",
      startDate: new Date("2025-08-01"),
      endDate: new Date("2025-08-05"),
      dataQuality: 98.7,
      eventCount: 2300000,
    };

    this.strategies.set(strategy1.id, strategy1);
    this.datasets.set(dataset1.id, dataset1);
  }

  // Strategy methods
  async getStrategy(id: string): Promise<Strategy | undefined> {
    return this.strategies.get(id);
  }

  async getAllStrategies(): Promise<Strategy[]> {
    return Array.from(this.strategies.values());
  }

  async createStrategy(insertStrategy: InsertStrategy): Promise<Strategy> {
    const id = randomUUID();
    const strategy: Strategy = {
      ...insertStrategy,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.strategies.set(id, strategy);
    return strategy;
  }

  async updateStrategy(id: string, updateData: Partial<InsertStrategy>): Promise<Strategy | undefined> {
    const existing = this.strategies.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updateData, updatedAt: new Date() };
    this.strategies.set(id, updated);
    return updated;
  }

  // Dataset methods
  async getDataset(id: string): Promise<Dataset | undefined> {
    return this.datasets.get(id);
  }

  async getAllDatasets(): Promise<Dataset[]> {
    return Array.from(this.datasets.values());
  }

  async createDataset(insertDataset: InsertDataset): Promise<Dataset> {
    const id = randomUUID();
    const dataset: Dataset = { 
      ...insertDataset, 
      id,
      dataQuality: insertDataset.dataQuality ?? null,
      eventCount: insertDataset.eventCount ?? null
    };
    this.datasets.set(id, dataset);
    return dataset;
  }

  // Backtest Run methods
  async getBacktestRun(id: string): Promise<BacktestRun | undefined> {
    return this.backtestRuns.get(id);
  }

  async getAllBacktestRuns(): Promise<BacktestRun[]> {
    return Array.from(this.backtestRuns.values());
  }

  async createBacktestRun(insertRun: InsertBacktestRun): Promise<BacktestRun> {
    const id = randomUUID();
    const run: BacktestRun = {
      ...insertRun,
      id,
      results: insertRun.results ?? null,
      startedAt: new Date(),
      completedAt: null,
    };
    this.backtestRuns.set(id, run);
    return run;
  }

  async updateBacktestRun(id: string, updateData: Partial<BacktestRun>): Promise<BacktestRun | undefined> {
    const existing = this.backtestRuns.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updateData };
    this.backtestRuns.set(id, updated);
    return updated;
  }

  // Trade methods
  async getTradesByBacktestRun(backtestRunId: string): Promise<Trade[]> {
    return Array.from(this.trades.values()).filter(trade => trade.backtestRunId === backtestRunId);
  }

  async createTrade(insertTrade: InsertTrade): Promise<Trade> {
    const id = randomUUID();
    const trade: Trade = { 
      ...insertTrade, 
      id,
      pnl: insertTrade.pnl ?? null,
      slippage: insertTrade.slippage ?? null,
      queueRank: insertTrade.queueRank ?? null
    };
    this.trades.set(id, trade);
    return trade;
  }

  // Market Data methods
  async getMarketDataBySymbol(symbol: string, startTime?: Date, endTime?: Date): Promise<MarketData[]> {
    return Array.from(this.marketData.values()).filter(data => {
      if (data.symbol !== symbol) return false;
      if (startTime && data.timestamp < startTime) return false;
      if (endTime && data.timestamp > endTime) return false;
      return true;
    });
  }

  async createMarketData(insertData: InsertMarketData): Promise<MarketData> {
    const id = randomUUID();
    const data: MarketData = { 
      ...insertData, 
      id,
      side: insertData.side ?? null,
      price: insertData.price ?? null,
      size: insertData.size ?? null,
      orderId: insertData.orderId ?? null
    };
    this.marketData.set(id, data);
    return data;
  }
}

export const storage = new MemStorage();
