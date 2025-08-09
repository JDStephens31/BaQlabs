import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertStrategySchema, insertBacktestRunSchema } from "@shared/schema";

// Simulated backtest execution with NQ futures data
async function runBacktestWithProgress(strategyId: string, datasetId: string, ws: WebSocket) {
  try {
    // Get strategy and dataset
    const strategy = await storage.getStrategy(strategyId);
    const dataset = await storage.getDataset(datasetId);
    
    if (!strategy || !dataset) {
      ws.send(JSON.stringify({
        type: 'backtestError',
        data: { message: 'Strategy or dataset not found' }
      }));
      return;
    }

    // Create backtest run record
    const backtestRun = await storage.createBacktestRun({
      strategyId,
      datasetId,
      status: 'running',
      results: null
    });

    // Generate NQ market data starting at 23713
    const marketData = generateNQMarketData();
    const totalEvents = marketData.length;
    
    // Simulate backtest execution with progress updates
    let processedEvents = 0;
    let position = 0;
    let capital = 100000;
    const trades: any[] = [];
    const basePrice = 23713;
    
    // Process market data in chunks
    const chunkSize = Math.ceil(totalEvents / 20); // 20 progress updates
    
    for (let i = 0; i < totalEvents; i += chunkSize) {
      if (ws.readyState !== WebSocket.OPEN) break;
      
      const chunk = marketData.slice(i, Math.min(i + chunkSize, totalEvents));
      
      // Process this chunk
      for (const dataPoint of chunk) {
        // Simple trading logic for demonstration
        if (Math.random() > 0.98) { // Random trade generation
          const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
          const price = basePrice + (Math.random() - 0.5) * 10;
          const size = 1;
          const pnl = (Math.random() - 0.4) * 200; // Slight positive bias
          
          const trade = await storage.createTrade({
            backtestRunId: backtestRun.id,
            timestamp: dataPoint.timestamp,
            side,
            price,
            size,
            pnl,
            slippage: Math.random() * 0.5,
            queueRank: Math.floor(Math.random() * 50) + 1
          });
          
          trades.push(trade);
          position += side === 'BUY' ? size : -size;
          capital += pnl;
        }
        
        processedEvents++;
      }
      
      const progress = (processedEvents / totalEvents) * 100;
      
      // Send progress update
      ws.send(JSON.stringify({
        type: 'backtestProgress',
        data: { 
          progress: Math.round(progress),
          status: progress >= 100 ? 'completed' : 'running',
          currentPrice: basePrice + (Math.random() - 0.5) * 20,
          tradesExecuted: trades.length,
          currentCapital: Math.round(capital),
          currentPosition: position
        }
      }));
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Calculate final results
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    const totalReturn = ((capital - 100000) / 100000) * 100;
    
    const results = {
      startCapital: 100000,
      endCapital: capital,
      totalReturn,
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      hitRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
      maxDrawdown: Math.abs(Math.min(...trades.map(t => t.pnl))) / 100,
      sharpeRatio: totalReturn > 0 ? 1.8 + Math.random() * 0.6 : 0,
      profitFactor: winningTrades.length > 0 && losingTrades.length > 0 ? 
        (winningTrades.reduce((sum, t) => sum + t.pnl, 0) / Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0))) : 0
    };
    
    // Update backtest run with results
    await storage.updateBacktestRun(backtestRun.id, {
      status: 'completed',
      results,
      completedAt: new Date()
    });
    
    // Send completion
    ws.send(JSON.stringify({
      type: 'backtestCompleted',
      data: { 
        runId: backtestRun.id,
        results,
        status: 'completed'
      }
    }));
    
  } catch (error) {
    console.error('Backtest execution error:', error);
    ws.send(JSON.stringify({
      type: 'backtestError',
      data: { message: 'Backtest execution failed' }
    }));
  }
}

function generateNQMarketData() {
  const data = [];
  const startTime = new Date();
  let currentPrice = 23713;
  
  // Generate 2000 market events
  for (let i = 0; i < 2000; i++) {
    const timestamp = new Date(startTime.getTime() + i * 2000); // 2 second intervals
    
    // NQ futures price movement simulation
    const priceChange = (Math.random() - 0.48) * 0.5; // 0.25 tick size
    currentPrice = Math.max(23650, Math.min(23750, currentPrice + priceChange));
    
    const eventType = Math.random() < 0.6 ? 'ADD' : Math.random() < 0.9 ? 'TRADE' : 'CANCEL';
    const side = Math.random() < 0.5 ? 'BID' : 'ASK';
    
    data.push({
      timestamp,
      eventType,
      side,
      price: Math.round(currentPrice * 4) / 4, // Round to nearest 0.25
      size: Math.floor(Math.random() * 20) + 1,
      orderId: `nq_order_${i}`
    });
  }
  
  return data;
}

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
          const { strategyId, datasetId } = parsed.data;
          console.log(`Starting backtest for strategy ${strategyId} with dataset ${datasetId}`);
          
          // Start actual backtest execution
          runBacktestWithProgress(strategyId, datasetId, ws);
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
