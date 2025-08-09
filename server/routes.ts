import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertStrategySchema, insertBacktestRunSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');

    // Send initial data
    ws.send(JSON.stringify({
      type: 'connected',
      data: { message: 'WebSocket connection established' }
    }));

    // Simulate market data updates
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'marketData',
          data: {
            timestamp: new Date().toISOString(),
            price: 20000 + Math.random() * 100,
            size: Math.floor(Math.random() * 100) + 1,
            side: Math.random() > 0.5 ? 'BID' : 'ASK'
          }
        }));
      }
    }, 1000);

    ws.on('close', () => {
      clearInterval(interval);
      console.log('Client disconnected from WebSocket');
    });

    ws.on('message', (message) => {
      try {
        const parsed = JSON.parse(message.toString());
        console.log('Received WebSocket message:', parsed);
        
        // Handle different message types
        if (parsed.type === 'startBacktest') {
          // Simulate backtest progress updates
          let progress = 0;
          const progressInterval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
              progress = 100;
              clearInterval(progressInterval);
            }
            
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'backtestProgress',
                data: { progress, status: progress >= 100 ? 'completed' : 'running' }
              }));
            }
          }, 500);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
  });

  // Strategies API
  app.get("/api/strategies", async (req, res) => {
    try {
      const strategies = await storage.getAllStrategies();
      res.json(strategies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch strategies" });
    }
  });

  app.get("/api/strategies/:id", async (req, res) => {
    try {
      const strategy = await storage.getStrategy(req.params.id);
      if (!strategy) {
        return res.status(404).json({ error: "Strategy not found" });
      }
      res.json(strategy);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch strategy" });
    }
  });

  app.post("/api/strategies", async (req, res) => {
    try {
      const validatedData = insertStrategySchema.parse(req.body);
      const strategy = await storage.createStrategy(validatedData);
      res.status(201).json(strategy);
    } catch (error) {
      res.status(400).json({ error: "Invalid strategy data" });
    }
  });

  app.put("/api/strategies/:id", async (req, res) => {
    try {
      const validatedData = insertStrategySchema.partial().parse(req.body);
      const strategy = await storage.updateStrategy(req.params.id, validatedData);
      if (!strategy) {
        return res.status(404).json({ error: "Strategy not found" });
      }
      res.json(strategy);
    } catch (error) {
      res.status(400).json({ error: "Invalid strategy data" });
    }
  });

  // Datasets API
  app.get("/api/datasets", async (req, res) => {
    try {
      const datasets = await storage.getAllDatasets();
      res.json(datasets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch datasets" });
    }
  });

  // Backtest Runs API
  app.get("/api/backtest-runs", async (req, res) => {
    try {
      const runs = await storage.getAllBacktestRuns();
      res.json(runs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch backtest runs" });
    }
  });

  app.post("/api/backtest-runs", async (req, res) => {
    try {
      const validatedData = insertBacktestRunSchema.parse(req.body);
      const run = await storage.createBacktestRun(validatedData);
      
      // Broadcast to WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'backtestStarted',
            data: run
          }));
        }
      });
      
      res.status(201).json(run);
    } catch (error) {
      res.status(400).json({ error: "Invalid backtest run data" });
    }
  });

  app.get("/api/backtest-runs/:id/trades", async (req, res) => {
    try {
      const trades = await storage.getTradesByBacktestRun(req.params.id);
      res.json(trades);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trades" });
    }
  });

  // Market Data API
  app.get("/api/market-data/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { start, end } = req.query;
      
      const startTime = start ? new Date(start as string) : undefined;
      const endTime = end ? new Date(end as string) : undefined;
      
      const data = await storage.getMarketDataBySymbol(symbol, startTime, endTime);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  return httpServer;
}
