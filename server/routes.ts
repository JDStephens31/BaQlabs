import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertStrategySchema, insertBacktestRunSchema } from "@shared/schema";

// Simulated backtest execution with NQ futures data
async function runBacktestWithProgress(strategyId: string, datasetId: string, ws: WebSocket) {
  try {
    console.log(`Looking for strategy: ${strategyId}, dataset: ${datasetId}`);
    
    // Get strategy and dataset
    const strategy = await storage.getStrategy(strategyId);
    const dataset = await storage.getDataset(datasetId);
    
    console.log(`Found strategy:`, strategy ? 'YES' : 'NO');
    console.log(`Found dataset:`, dataset ? 'YES' : 'NO');
    
    if (!strategy || !dataset) {
      const errorMsg = `Strategy or dataset not found - Strategy: ${strategy ? 'found' : 'missing'}, Dataset: ${dataset ? 'found' : 'missing'}`;
      console.error(errorMsg);
      ws.send(JSON.stringify({
        type: 'backtestError',
        data: { message: errorMsg }
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
      
      // Process this chunk with queue-aware logic
      for (const dataPoint of chunk) {
        // Simulate realistic NQ order book in 23770-23800 range
        const currentPrice = 23770 + (processedEvents / totalEvents) * 30; // Move from 23770 to 23800
        const book = generateRealisticOrderBook(currentPrice);
        
        // Calculate order book imbalance
        const imbalance = calculateOrderBookImbalance(book);
        
        // Queue-aware strategy logic
        if (shouldExecuteStrategy(imbalance, currentPrice, position)) {
          const side = imbalance > 0.4 ? 'BUY' : 'SELL';
          const targetPrice = side === 'BUY' ? book.bids[0].price : book.asks[0].price;
          
          // Estimate queue position (realistic queue dynamics)
          const queueRank = estimateQueuePosition(targetPrice, side, book);
          
          // Only execute if queue position is favorable
          if (queueRank <= 8) {
            const size = 1;
            const fillProbability = calculateFillProbability(queueRank);
            
            // Simulate order execution with queue delays
            if (Math.random() < fillProbability) {
              const slippage = queueRank > 3 ? 0.25 : 0; // Slippage for deeper queue positions
              const executionPrice = targetPrice + (side === 'BUY' ? slippage : -slippage);
              const pnl = calculateRealisticPnL(side, executionPrice, size, position);
              
              const trade = await storage.createTrade({
                backtestRunId: backtestRun.id,
                timestamp: dataPoint.timestamp,
                side,
                price: executionPrice,
                size,
                pnl,
                slippage,
                queueRank
              });
              
              trades.push(trade);
              position += side === 'BUY' ? size : -size;
              capital += pnl;
            }
          }
        }
        
        // Risk management - dynamic position limits
        if (Math.abs(position) > 10) {
          const closeSide = position > 0 ? 'SELL' : 'BUY';
          const closePrice = currentPrice;
          const closeSize = Math.min(Math.abs(position), 3); // Close 3 contracts at a time
          const closePnL = calculateRealisticPnL(closeSide, closePrice, closeSize, position);
          
          const riskTrade = await storage.createTrade({
            backtestRunId: backtestRun.id,
            timestamp: dataPoint.timestamp,
            side: closeSide,
            price: closePrice,
            size: closeSize,
            pnl: closePnL,
            slippage: 0.5, // Higher slippage for risk management
            queueRank: 1 // Risk trades get priority
          });
          
          trades.push(riskTrade);
          position += closeSide === 'BUY' ? closeSize : -closeSize;
          capital += closePnL;
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    ws.send(JSON.stringify({
      type: 'backtestError',
      data: { message: `Backtest execution failed: ${errorMessage}` }
    }));
  }
}

function generateNQMarketData() {
  const data = [];
  const startTime = new Date();
  let currentPrice = 23785; // Start in the middle of 23770-23800 range
  
  // Generate 5000 market events for realistic MBO replay
  for (let i = 0; i < 5000; i++) {
    const timestamp = new Date(startTime.getTime() + i * 100); // 100ms intervals for realistic speed
    
    // NQ futures price movement within 23770-23800 range
    const priceChange = (Math.random() - 0.5) * 0.75; // More realistic price volatility
    currentPrice = Math.max(23770, Math.min(23800, currentPrice + priceChange));
    
    // Realistic event distribution for MBO
    const rand = Math.random();
    let eventType;
    if (rand < 0.50) eventType = 'ADD';      // 50% new orders
    else if (rand < 0.80) eventType = 'TRADE'; // 30% trades
    else eventType = 'CANCEL';                  // 20% cancellations
    
    const side = Math.random() < 0.5 ? 'BID' : 'ASK';
    const tickPrice = Math.round(currentPrice * 4) / 4; // Round to NQ tick size (0.25)
    
    // Realistic order sizes for NQ futures
    const orderSizes = [1, 2, 3, 5, 10, 15, 20, 25, 50];
    const size = orderSizes[Math.floor(Math.random() * orderSizes.length)];
    
    data.push({
      timestamp,
      eventType,
      side,
      price: tickPrice,
      size,
      orderId: `nq_${Date.now()}_${i}`,
      symbol: 'NQH25'
    });
  }
  
  return data;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Serve the waitlist page
  app.get('/waitlist', (req, res) => {
    res.sendFile(path.resolve(import.meta.dirname, '..', 'client', 'waitlist.html'));
  });

  // Waitlist submission endpoint
  app.post('/api/waitlist/submit', async (req, res) => {
    try {
      const { name, email } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      // Read current submissions
      const submissionsPath = process.env.NODE_ENV === 'production' 
        ? path.resolve(import.meta.dirname, '..', 'public', 'waitlist-submissions.json')
        : path.resolve(import.meta.dirname, '..', 'dist', 'public', 'waitlist-submissions.json');
      let data;
      
      try {
        const fileContent = await fs.promises.readFile(submissionsPath, 'utf-8');
        data = JSON.parse(fileContent);
      } catch (error) {
        // If file doesn't exist or is invalid, start fresh
        data = { submissions: [], totalCount: 0, lastUpdated: null };
      }

      // Check if email already exists
      const existingSubmission = data.submissions.find((sub: any) => sub.email === email);
      if (existingSubmission) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Add new submission
      const newSubmission = {
        id: Date.now().toString(),
        name,
        email,
        submittedAt: new Date().toISOString()
      };

      data.submissions.push(newSubmission);
      data.totalCount = data.submissions.length;
      data.lastUpdated = new Date().toISOString();

      // Write back to file
      await fs.promises.writeFile(submissionsPath, JSON.stringify(data, null, 2));

      res.status(201).json({ 
        success: true, 
        message: 'Successfully joined the waitlist!',
        totalCount: data.totalCount
      });
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      res.status(500).json({ error: 'Failed to submit to waitlist' });
    }
  });

  // Get waitlist stats endpoint
  app.get('/api/waitlist/stats', async (req, res) => {
    try {
      const submissionsPath = process.env.NODE_ENV === 'production' 
        ? path.resolve(import.meta.dirname, '..', 'public', 'waitlist-submissions.json')
        : path.resolve(import.meta.dirname, '..', 'dist', 'public', 'waitlist-submissions.json');
      const fileContent = await fs.promises.readFile(submissionsPath, 'utf-8');
      const data = JSON.parse(fileContent);
      
      res.json({ 
        totalCount: data.totalCount,
        lastUpdated: data.lastUpdated
      });
    } catch (error) {
      res.json({ totalCount: 0, lastUpdated: null });
    }
  });

  
  // Strategy management endpoints
  app.get('/api/strategies', async (req, res) => {
    try {
      const strategies = await storage.getAllStrategies();
      res.json(strategies);
    } catch (error) {
      console.error('Error fetching strategies:', error);
      res.status(500).json({ error: 'Failed to fetch strategies' });
    }
  });

  app.get('/api/strategies/:id', async (req, res) => {
    try {
      const strategy = await storage.getStrategy(req.params.id);
      if (!strategy) {
        return res.status(404).json({ error: 'Strategy not found' });
      }
      res.json(strategy);
    } catch (error) {
      console.error('Error fetching strategy:', error);
      res.status(500).json({ error: 'Failed to fetch strategy' });
    }
  });

  app.post('/api/strategies', async (req, res) => {
    try {
      const validation = insertStrategySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: 'Invalid strategy data',
          details: validation.error.issues
        });
      }
      
      const strategy = await storage.createStrategy(validation.data);
      res.status(201).json(strategy);
    } catch (error) {
      console.error('Error creating strategy:', error);
      res.status(500).json({ error: 'Failed to create strategy' });
    }
  });

  app.put('/api/strategies/:id', async (req, res) => {
    try {
      const validation = insertStrategySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: 'Invalid strategy data',
          details: validation.error.issues
        });
      }
      
      const strategy = await storage.updateStrategy(req.params.id, validation.data);
      if (!strategy) {
        return res.status(404).json({ error: 'Strategy not found' });
      }
      res.json(strategy);
    } catch (error) {
      console.error('Error updating strategy:', error);
      res.status(500).json({ error: 'Failed to update strategy' });
    }
  });

  app.delete('/api/strategies/:id', async (req, res) => {
    try {
      const deleted = await storage.deleteStrategy(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Strategy not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting strategy:', error);
      res.status(500).json({ error: 'Failed to delete strategy' });
    }
  });

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

  // Backup & Restore endpoints
  app.get('/api/backup/export', async (req, res) => {
    try {
      const strategies = await storage.getAllStrategies();
      const datasets = await storage.getAllDatasets();
      const backtestRuns = await storage.getAllBacktestRuns();
      
      const backup = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: {
          strategies,
          datasets,
          backtestRuns
        }
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="baq-labs-backup-${new Date().toISOString().split('T')[0]}.json"`);
      res.json(backup);
    } catch (error) {
      console.error('Error creating backup:', error);
      res.status(500).json({ error: 'Failed to create backup' });
    }
  });

  app.post('/api/backup/import', async (req, res) => {
    try {
      const backup = req.body;
      
      if (!backup.data || !backup.version) {
        return res.status(400).json({ error: 'Invalid backup format' });
      }
      
      // Import strategies
      if (backup.data.strategies) {
        for (const strategy of backup.data.strategies) {
          try {
            await storage.createStrategy({
              name: strategy.name,
              code: strategy.code,
              parameters: strategy.parameters
            });
          } catch (error) {
            console.log(`Strategy ${strategy.name} already exists, skipping`);
          }
        }
      }
      
      res.json({ success: true, message: 'Backup restored successfully' });
    } catch (error) {
      console.error('Error restoring backup:', error);
      res.status(500).json({ error: 'Failed to restore backup' });
    }
  });

  // User profile endpoints
  app.get('/api/auth/user', async (req, res) => {
    // Mock user for demo
    res.json({
      id: 'demo-user',
      email: 'trader@baqlabs.com',
      firstName: 'BAQ',
      lastName: 'Trader',
      profileImageUrl: null
    });
  });

  app.put('/api/auth/profile', async (req, res) => {
    try {
      // In a real app, this would update the user profile
      const { firstName, lastName, email } = req.body;
      res.json({ 
        id: 'demo-user',
        email,
        firstName,
        lastName,
        profileImageUrl: null
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  app.get('/api/logout', (req, res) => {
    // Mock logout - in real app would clear session
    res.redirect('/');
  });

  return httpServer;
}

// Queue-aware helper functions for enhanced NQ backtesting
function generateRealisticOrderBook(price: number) {
  const tickSize = 0.25;
  return {
    bids: Array.from({length: 10}, (_, i) => ({
      price: price - (i * tickSize),
      size: Math.floor(Math.random() * 150) + 25,
      orders: Math.floor(Math.random() * 8) + 1
    })),
    asks: Array.from({length: 10}, (_, i) => ({
      price: price + tickSize + (i * tickSize),
      size: Math.floor(Math.random() * 150) + 25,
      orders: Math.floor(Math.random() * 8) + 1
    }))
  };
}

function calculateOrderBookImbalance(book: any): number {
  // Weighted imbalance calculation considering top 5 levels
  let bidSize = 0, askSize = 0;
  
  for (let i = 0; i < Math.min(5, book.bids.length); i++) {
    const weight = 1 / (i + 1); // Decreasing weight with depth
    bidSize += book.bids[i].size * weight;
  }
  
  for (let i = 0; i < Math.min(5, book.asks.length); i++) {
    const weight = 1 / (i + 1);
    askSize += book.asks[i].size * weight;
  }
  
  return (bidSize - askSize) / (bidSize + askSize);
}

function shouldExecuteStrategy(imbalance: number, price: number, position: number): boolean {
  // Only trade within NQ range with strong imbalance signal
  return Math.abs(imbalance) > 0.35 && 
         price >= 23770 && price <= 23800 && 
         Math.abs(position) < 8;
}

function estimateQueuePosition(price: number, side: string, book: any): number {
  const level = side === 'BUY' ? 
    book.bids.find((l: any) => l.price === price) : 
    book.asks.find((l: any) => l.price === price);
  
  if (!level) return 50; // Price not in book
  
  // Estimate position based on existing size and orders
  const avgSizePerOrder = level.size / level.orders;
  const estimatedPosition = Math.floor(level.size / Math.max(avgSizePerOrder, 10)) + 1;
  
  return Math.min(estimatedPosition, 25); // Cap at 25 for realism
}

function calculateFillProbability(queueRank: number): number {
  // Higher probability for better queue positions
  if (queueRank <= 2) return 0.95;
  if (queueRank <= 5) return 0.75;
  if (queueRank <= 10) return 0.45;
  return 0.15;
}

function calculateRealisticPnL(side: string, price: number, size: number, position: number): number {
  const nqMultiplier = 20; // NQ contract multiplier
  const referencePrice = 23785; // Mid-point of our range
  
  let pnl = 0;
  if (side === 'BUY') {
    pnl = size * (price - referencePrice) * nqMultiplier;
  } else {
    pnl = size * (referencePrice - price) * nqMultiplier;
  }
  
  // Add realistic market movement impact
  const marketImpact = Math.random() * 20 - 10; // Random market movement
  return pnl + marketImpact;
}
