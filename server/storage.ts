import { type Strategy, type InsertStrategy, type Dataset, type InsertDataset, type BacktestRun, type InsertBacktestRun, type Trade, type InsertTrade, type MarketData, type InsertMarketData } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Strategies
  getStrategy(id: string): Promise<Strategy | undefined>;
  getAllStrategies(): Promise<Strategy[]>;
  createStrategy(strategy: InsertStrategy): Promise<Strategy>;
  updateStrategy(id: string, strategy: Partial<InsertStrategy>): Promise<Strategy | undefined>;
  deleteStrategy(id: string): Promise<boolean>;
  
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
    // Seed with comprehensive strategy examples
    const strategy1: Strategy = {
      id: "maker-queue-aware",
      name: "Maker Queue Aware",
      code: `// Strategy: Advanced Queue-Aware Market Making
// Description: Sophisticated market making with queue position tracking
// Asset: NQ Futures (ES works too)
// Created: ${new Date().toLocaleDateString()}

let position = 0;
let activeOrders = new Map();
let queuePositions = new Map();
let lastTradeTime = 0;

// Strategy Parameters
const params = {
  maxPosition: 8,
  queueThreshold: 12,
  imbalanceThreshold: 0.35,
  maxQueueTime: 45000, // 45 seconds
  tickSize: 0.25,
  priceRange: { min: 23700, max: 23850 },
  riskLimit: 0.02 // 2% of account
};

function onMarketData(book, trades, marketData) {
  const timestamp = Date.now();
  const bestBid = book.bids[0];
  const bestAsk = book.asks[0];
  const midPrice = (bestBid.price + bestAsk.price) / 2;
  const spread = bestAsk.price - bestBid.price;
  
  // Only trade in optimal price range
  if (midPrice < params.priceRange.min || midPrice > params.priceRange.max) {
    return;
  }
  
  // Calculate order book imbalance
  const imbalance = calculateImbalance(book);
  const volatility = calculateVolatility(trades);
  
  // Update queue positions for active orders
  updateQueuePositions(book, trades, timestamp);
  
  // Cancel stale orders
  manageQueueOrders(timestamp);
  
  // Entry logic - only when conditions are favorable
  if (shouldEnterPosition(imbalance, volatility, spread, timestamp)) {
    if (imbalance > params.imbalanceThreshold && position < params.maxPosition) {
      const targetPrice = bestBid.price;
      const estimatedQueuePos = estimateQueuePosition(targetPrice, 'BID', book);
      
      if (estimatedQueuePos <= params.queueThreshold) {
        placeLimitOrder('BUY', targetPrice, 1, timestamp);
        log(\`Joining bid queue at \${targetPrice}, est. position: \${estimatedQueuePos}\`);
      }
    } else if (imbalance < -params.imbalanceThreshold && position > -params.maxPosition) {
      const targetPrice = bestAsk.price;
      const estimatedQueuePos = estimateQueuePosition(targetPrice, 'ASK', book);
      
      if (estimatedQueuePos <= params.queueThreshold) {
        placeLimitOrder('SELL', targetPrice, 1, timestamp);
        log(\`Joining ask queue at \${targetPrice}, est. position: \${estimatedQueuePos}\`);
      }
    }
  }
  
  // Risk management
  if (Math.abs(position) > params.maxPosition) {
    hedgePosition();
  }
}

function calculateImbalance(book) {
  let bidSize = 0, askSize = 0;
  const levels = Math.min(5, book.bids.length, book.asks.length);
  
  for (let i = 0; i < levels; i++) {
    const weight = Math.pow(0.8, i); // Exponential decay
    bidSize += book.bids[i].size * weight;
    askSize += book.asks[i].size * weight;
  }
  
  return (bidSize - askSize) / (bidSize + askSize);
}

function calculateVolatility(trades) {
  if (trades.length < 10) return 0;
  
  const prices = trades.slice(-20).map(t => t.price);
  const returns = [];
  
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i] / prices[i-1]));
  }
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  
  return Math.sqrt(variance) * Math.sqrt(252); // Annualized
}

function shouldEnterPosition(imbalance, volatility, spread, timestamp) {
  // Don't trade if spread is too wide
  if (spread > params.tickSize * 3) return false;
  
  // Don't trade during high volatility
  if (volatility > 0.25) return false;
  
  // Minimum time between trades
  if (timestamp - lastTradeTime < 2000) return false;
  
  return Math.abs(imbalance) > params.imbalanceThreshold;
}

function estimateQueuePosition(price, side, book) {
  const levels = side === 'BID' ? book.bids : book.asks;
  const level = levels.find(l => Math.abs(l.price - price) < 0.01);
  
  if (!level) return 999;
  
  // Estimate position based on current size and historical patterns
  return Math.min(Math.floor(level.size * 0.7) + Math.random() * 5, 50);
}

function updateQueuePositions(book, trades, timestamp) {
  // Update queue ranks based on trades and order book changes
  for (let [orderId, order] of activeOrders) {
    if (order.status === 'PENDING') {
      const newRank = estimateCurrentQueueRank(order, book, trades);
      queuePositions.set(orderId, {
        ...queuePositions.get(orderId),
        currentRank: newRank,
        lastUpdate: timestamp
      });
    }
  }
}

function manageQueueOrders(timestamp) {
  for (let [orderId, queueInfo] of queuePositions) {
    const order = activeOrders.get(orderId);
    if (!order) continue;
    
    const timeInQueue = timestamp - (order.timestamp || 0);
    
    if (timeInQueue > params.maxQueueTime || queueInfo.currentRank > params.queueThreshold * 2) {
      cancelOrder(orderId);
      log(\`Cancelled order \${orderId}: time=\${timeInQueue}ms, rank=\${queueInfo.currentRank}\`);
    }
  }
}

function placeLimitOrder(side, price, size, timestamp) {
  const orderId = \`order_\${timestamp}_\${Math.random().toString(36).substr(2, 9)}\`;
  
  activeOrders.set(orderId, {
    id: orderId,
    side,
    price,
    size,
    status: 'PENDING',
    timestamp
  });
  
  queuePositions.set(orderId, {
    orderId,
    initialRank: estimateQueuePosition(price, side === 'BUY' ? 'BID' : 'ASK', {}),
    currentRank: 0,
    lastUpdate: timestamp
  });
  
  lastTradeTime = timestamp;
  
  // This would integrate with actual trading system
  log(\`Placed \${side} order: \${size} @ \${price}\`);
}

function cancelOrder(orderId) {
  activeOrders.delete(orderId);
  queuePositions.delete(orderId);
  // Integration point with trading system
}

function hedgePosition() {
  // Emergency position reduction
  if (position > params.maxPosition) {
    placeLimitOrder('SELL', getBestAsk() - params.tickSize, Math.min(2, position), Date.now());
  } else if (position < -params.maxPosition) {
    placeLimitOrder('BUY', getBestBid() + params.tickSize, Math.min(2, Math.abs(position)), Date.now());
  }
}

function log(message) {
  console.log(\`[\${new Date().toISOString()}] MM: \${message}\`);
}

// Helper functions (would be provided by trading framework)
function getBestBid() { return 23785.00; }
function getBestAsk() { return 23785.25; }
function estimateCurrentQueueRank(order, book, trades) { return Math.floor(Math.random() * 20) + 1; }`,
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
      id: "nq-2025-08",
      name: "NQ 2025-08 (5 days)",
      symbol: "NQH25",
      startDate: new Date("2025-08-01"),
      endDate: new Date("2025-08-05"),
      dataQuality: 98.7,
      eventCount: 2300000,
    };

    // Add more sample datasets to match the frontend
    const dataset2: Dataset = {
      id: "es-2025-07",
      name: "ES 2025-07 (10 days)",
      symbol: "ESN25",
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-07-10"),
      dataQuality: 99.2,
      eventCount: 4500000,
    };

    const dataset3: Dataset = {
      id: "rty-2025-06",
      name: "RTY 2025-06 (3 days)",
      symbol: "RTYM25",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-06-03"),
      dataQuality: 97.8,
      eventCount: 1200000,
    };

    const strategy2: Strategy = {
      id: "mean-reversion-v3",
      name: "Mean Reversion v3",
      code: `// Strategy: Advanced Mean Reversion with Bollinger Bands
// Description: Statistical arbitrage using mean reversion signals
// Asset: NQ/ES Futures
// Version: 3.2.1

let position = 0;
let priceHistory = [];
let tradeCount = 0;
let lastSignalTime = 0;

// Strategy Parameters
const config = {
  lookbackPeriod: 50,
  stdDevMultiplier: 2.0,
  minPriceMove: 2.0, // Minimum move to consider signal
  maxPosition: 6,
  stopLoss: 12.0, // Points
  takeProfit: 8.0, // Points
  cooldownPeriod: 30000, // 30 seconds between signals
  volumeThreshold: 100 // Minimum volume for signal validation
};

function onMarketData(book, trades, marketData) {
  const timestamp = Date.now();
  const currentPrice = (book.bids[0].price + book.asks[0].price) / 2;
  
  // Update price history
  priceHistory.push({
    price: currentPrice,
    timestamp: timestamp,
    volume: book.bids[0].size + book.asks[0].size
  });
  
  // Keep only required history
  if (priceHistory.length > config.lookbackPeriod * 2) {
    priceHistory = priceHistory.slice(-config.lookbackPeriod);
  }
  
  // Need minimum history for calculations
  if (priceHistory.length < config.lookbackPeriod) {
    return;
  }
  
  // Calculate Bollinger Bands
  const { sma, upperBand, lowerBand, currentZ } = calculateBollingerBands(currentPrice);
  
  // Calculate momentum indicators
  const momentum = calculateMomentum(20);
  const rsi = calculateRSI(14);
  
  // Volume analysis
  const avgVolume = calculateAverageVolume(10);
  const currentVolume = book.bids[0].size + book.asks[0].size;
  const volumeRatio = currentVolume / avgVolume;
  
  // Signal generation
  const signals = generateSignals(currentPrice, sma, upperBand, lowerBand, currentZ, momentum, rsi, volumeRatio);
  
  // Execute trades based on signals
  if (signals.action !== 'HOLD' && canTrade(timestamp)) {
    executeTrade(signals, currentPrice, timestamp);
  }
  
  // Risk management
  manageRisk(currentPrice);
  
  log(\`Price: \${currentPrice.toFixed(2)}, SMA: \${sma.toFixed(2)}, Z-Score: \${currentZ.toFixed(2)}, RSI: \${rsi.toFixed(1)}, Signal: \${signals.action}\`);
}

function calculateBollingerBands(currentPrice) {
  const prices = priceHistory.slice(-config.lookbackPeriod).map(h => h.price);
  
  // Simple Moving Average
  const sma = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  
  // Standard Deviation
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / prices.length;
  const stdDev = Math.sqrt(variance);
  
  // Bollinger Bands
  const upperBand = sma + (config.stdDevMultiplier * stdDev);
  const lowerBand = sma - (config.stdDevMultiplier * stdDev);
  
  // Z-Score (how many standard deviations from mean)
  const currentZ = (currentPrice - sma) / stdDev;
  
  return { sma, upperBand, lowerBand, stdDev, currentZ };
}

function calculateMomentum(period) {
  if (priceHistory.length < period + 1) return 0;
  
  const current = priceHistory[priceHistory.length - 1].price;
  const past = priceHistory[priceHistory.length - period - 1].price;
  
  return ((current - past) / past) * 100;
}

function calculateRSI(period = 14) {
  if (priceHistory.length < period + 1) return 50;
  
  const prices = priceHistory.slice(-period - 1).map(h => h.price);
  let gains = 0, losses = 0;
  
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function generateSignals(price, sma, upperBand, lowerBand, zScore, momentum, rsi, volumeRatio) {
  let action = 'HOLD';
  let confidence = 0;
  let reason = '';
  
  // Mean reversion signals
  if (zScore > 2.0 && rsi > 70 && momentum > 0.5) {
    action = 'SELL';
    confidence = Math.min(Math.abs(zScore) * 0.3 + (rsi - 70) * 0.02, 1.0);
    reason = 'Overbought mean reversion';
  } else if (zScore < -2.0 && rsi < 30 && momentum < -0.5) {
    action = 'BUY';
    confidence = Math.min(Math.abs(zScore) * 0.3 + (30 - rsi) * 0.02, 1.0);
    reason = 'Oversold mean reversion';
  }
  
  return { action, confidence, reason, zScore, rsi, momentum };
}

function canTrade(timestamp) {
  return timestamp - lastSignalTime >= config.cooldownPeriod && Math.abs(position) < config.maxPosition;
}

function executeTrade(signals, currentPrice, timestamp) {
  if (signals.confidence < 0.6) return;
  
  const size = 1;
  if (signals.action === 'BUY') {
    position += size;
    log(\`BUY executed: \${size} @ \${currentPrice} | \${signals.reason}\`);
  } else if (signals.action === 'SELL') {
    position -= size;
    log(\`SELL executed: \${size} @ \${currentPrice} | \${signals.reason}\`);
  }
  lastSignalTime = timestamp;
}

function manageRisk(currentPrice) {
  if (Math.abs(position) > config.maxPosition * 0.8) {
    const reduceSize = 1;
    if (position > 0) {
      position -= reduceSize;
      log(\`Risk: Reduced long position\`);
    } else {
      position += reduceSize;
      log(\`Risk: Reduced short position\`);
    }
  }
}

function log(message) {
  console.log(\`[\${new Date().toISOString()}] MR: \${message}\`);
}`,
      parameters: {
        lookbackPeriod: 50,
        stdDevMultiplier: 2.0,
        maxPosition: 6,
        riskLimit: 0.02,
        cooldownPeriod: 30000
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const strategy3: Strategy = {
      id: "momentum-breakout",
      name: "Momentum Breakout",
      code: `// Strategy: Momentum Breakout Trading
// Description: Trend following with breakout confirmation
// Asset: NQ/ES Futures
// Author: Trading Team

let position = 0;
let entryPrice = 0;
let stopLoss = 0;
let trailingStop = 0;
let priceHistory = [];
let volumeHistory = [];

const settings = {
  breakoutPeriod: 20,
  volumeMultiplier: 1.8,
  atrPeriod: 14,
  stopLossATR: 2.5,
  trailingStopATR: 1.8,
  maxPosition: 4,
  minVolume: 150,
  trendStrengthThreshold: 0.7
};

function onMarketData(book, trades, marketData) {
  const currentPrice = (book.bids[0].price + book.asks[0].price) / 2;
  const currentVolume = trades.reduce((sum, t) => sum + t.size, 0);
  const timestamp = Date.now();
  
  // Update historical data
  updateHistory(currentPrice, currentVolume, timestamp);
  
  // Need minimum history
  if (priceHistory.length < settings.breakoutPeriod + settings.atrPeriod) {
    return;
  }
  
  // Calculate technical indicators
  const { high, low, atr } = calculateTechnicals();
  const volumeProfile = analyzeVolume();
  const trendStrength = calculateTrendStrength();
  
  // Update trailing stop for existing positions
  if (position !== 0) {
    updateTrailingStop(currentPrice, atr);
    
    // Check exit conditions
    if (shouldExit(currentPrice)) {
      exitPosition(currentPrice);
      return;
    }
  }
  
  // Check for breakout signals
  const breakoutSignal = detectBreakout(currentPrice, high, low, volumeProfile, trendStrength);
  
  if (breakoutSignal.direction !== 'NONE' && position === 0) {
    enterPosition(breakoutSignal, currentPrice, atr);
  }
  
  log(\`Price: \${currentPrice}, High: \${high}, Low: \${low}, Volume: \${volumeProfile.ratio.toFixed(2)}, Trend: \${trendStrength.toFixed(2)}, Signal: \${breakoutSignal.direction}\`);
}

function updateHistory(price, volume, timestamp) {
  priceHistory.push({ price, timestamp });
  volumeHistory.push({ volume, timestamp });
  
  // Keep only required history
  const maxHistory = Math.max(settings.breakoutPeriod, settings.atrPeriod) + 10;
  if (priceHistory.length > maxHistory) {
    priceHistory = priceHistory.slice(-maxHistory);
    volumeHistory = volumeHistory.slice(-maxHistory);
  }
}

function calculateTechnicals() {
  const recentPrices = priceHistory.slice(-settings.breakoutPeriod);
  const high = Math.max(...recentPrices.map(p => p.price));
  const low = Math.min(...recentPrices.map(p => p.price));
  
  // Calculate ATR (Average True Range)
  const atrPrices = priceHistory.slice(-settings.atrPeriod);
  let atrSum = 0;
  
  for (let i = 1; i < atrPrices.length; i++) {
    const current = atrPrices[i].price;
    const previous = atrPrices[i-1].price;
    const trueRange = Math.abs(current - previous);
    atrSum += trueRange;
  }
  
  const atr = atrSum / (atrPrices.length - 1);
  
  return { high, low, atr };
}

function analyzeVolume() {
  const recentVolume = volumeHistory.slice(-10);
  const currentVolume = recentVolume[recentVolume.length - 1]?.volume || 0;
  const avgVolume = recentVolume.reduce((sum, v) => sum + v.volume, 0) / recentVolume.length;
  
  return {
    current: currentVolume,
    average: avgVolume,
    ratio: avgVolume > 0 ? currentVolume / avgVolume : 0,
    isHigh: currentVolume > avgVolume * settings.volumeMultiplier
  };
}

function calculateTrendStrength() {
  const period = 20;
  if (priceHistory.length < period) return 0;
  
  const prices = priceHistory.slice(-period).map(p => p.price);
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  
  // Calculate linear regression slope
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  
  for (let i = 0; i < prices.length; i++) {
    sumX += i;
    sumY += prices[i];
    sumXY += i * prices[i];
    sumXX += i * i;
  }
  
  const n = prices.length;
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  // Normalize slope to trend strength (0-1)
  return Math.min(Math.abs(slope) / (lastPrice * 0.001), 1);
}

function detectBreakout(currentPrice, high, low, volumeProfile, trendStrength) {
  let direction = 'NONE';
  let confidence = 0;
  
  // Bullish breakout conditions
  if (currentPrice > high && 
      volumeProfile.isHigh && 
      trendStrength > settings.trendStrengthThreshold &&
      volumeProfile.current > settings.minVolume) {
    direction = 'LONG';
    confidence = Math.min(
      ((currentPrice - high) / high) * 1000 + // Price penetration
      (volumeProfile.ratio - 1) * 0.5 + // Volume confirmation
      trendStrength * 0.3, // Trend strength
      1.0
    );
  }
  
  // Bearish breakout conditions
  else if (currentPrice < low && 
           volumeProfile.isHigh && 
           trendStrength > settings.trendStrengthThreshold &&
           volumeProfile.current > settings.minVolume) {
    direction = 'SHORT';
    confidence = Math.min(
      ((low - currentPrice) / low) * 1000 + // Price penetration
      (volumeProfile.ratio - 1) * 0.5 + // Volume confirmation
      trendStrength * 0.3, // Trend strength
      1.0
    );
  }
  
  return { direction, confidence, volumeProfile, trendStrength };
}

function enterPosition(signal, currentPrice, atr) {
  if (signal.confidence < 0.6) return;
  
  const size = Math.min(settings.maxPosition, 2);
  
  if (signal.direction === 'LONG') {
    position = size;
    entryPrice = currentPrice;
    stopLoss = currentPrice - (atr * settings.stopLossATR);
    trailingStop = currentPrice - (atr * settings.trailingStopATR);
    
    log(\`LONG entry: \${size} @ \${currentPrice}, SL: \${stopLoss.toFixed(2)}, Confidence: \${signal.confidence.toFixed(2)}\`);
    
  } else if (signal.direction === 'SHORT') {
    position = -size;
    entryPrice = currentPrice;
    stopLoss = currentPrice + (atr * settings.stopLossATR);
    trailingStop = currentPrice + (atr * settings.trailingStopATR);
    
    log(\`SHORT entry: \${size} @ \${currentPrice}, SL: \${stopLoss.toFixed(2)}, Confidence: \${signal.confidence.toFixed(2)}\`);
  }
}

function updateTrailingStop(currentPrice, atr) {
  const trailingDistance = atr * settings.trailingStopATR;
  
  if (position > 0) {
    // Long position - trail stop up
    const newTrailingStop = currentPrice - trailingDistance;
    if (newTrailingStop > trailingStop) {
      trailingStop = newTrailingStop;
    }
  } else if (position < 0) {
    // Short position - trail stop down
    const newTrailingStop = currentPrice + trailingDistance;
    if (newTrailingStop < trailingStop) {
      trailingStop = newTrailingStop;
    }
  }
}

function shouldExit(currentPrice) {
  if (position > 0) {
    return currentPrice <= stopLoss || currentPrice <= trailingStop;
  } else if (position < 0) {
    return currentPrice >= stopLoss || currentPrice >= trailingStop;
  }
  return false;
}

function exitPosition(currentPrice) {
  const pnl = position > 0 ? 
    (currentPrice - entryPrice) * Math.abs(position) :
    (entryPrice - currentPrice) * Math.abs(position);
  
  log(\`EXIT: Position \${position} @ \${currentPrice}, Entry: \${entryPrice.toFixed(2)}, PnL: \${pnl.toFixed(2)}\`);
  
  position = 0;
  entryPrice = 0;
  stopLoss = 0;
  trailingStop = 0;
}

function log(message) {
  console.log(\`[\${new Date().toISOString()}] MOM: \${message}\`);
}`,
      parameters: {
        breakoutPeriod: 20,
        volumeMultiplier: 1.8,
        maxPosition: 4,
        stopLossATR: 2.5,
        trendStrengthThreshold: 0.7
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const strategy4: Strategy = {
      id: "pairs-trading",
      name: "Pairs Trading",
      code: `// Strategy: Statistical Pairs Trading
// Description: Market neutral strategy trading price divergences
// Assets: ES vs NQ Futures correlation
// Style: Market Neutral

let position_es = 0;
let position_nq = 0;
let spread_history = [];
let correlation_window = [];
let entry_threshold = 0;
let exit_threshold = 0;

const config = {
  lookback_period: 100,
  correlation_threshold: 0.8,
  entry_z_score: 2.0,
  exit_z_score: 0.5,
  max_position_each: 3,
  spread_calculation_period: 20,
  hedge_ratio_period: 50,
  stop_loss_z_score: 3.5
};

function onMarketData(book, trades, marketData) {
  // Assuming we get data for both ES and NQ
  const es_price = getESPrice(book, trades); // Mock function
  const nq_price = getNQPrice(book, trades); // Mock function
  
  if (!es_price || !nq_price) return;
  
  // Calculate spread and hedge ratio
  const hedge_ratio = calculateHedgeRatio();
  const current_spread = nq_price - (hedge_ratio * es_price);
  
  // Update spread history
  updateSpreadHistory(current_spread, es_price, nq_price);
  
  // Need minimum history for statistical calculations
  if (spread_history.length < config.lookback_period) {
    return;
  }
  
  // Calculate statistical measures
  const { mean, std_dev, z_score } = calculateSpreadStatistics(current_spread);
  
  // Update correlation
  const correlation = calculateCorrelation();
  
  // Only trade if correlation is strong enough
  if (Math.abs(correlation) < config.correlation_threshold) {
    log(\`Correlation too low: \${correlation.toFixed(3)}, skipping trade signals\`);
    return;
  }
  
  // Generate trading signals
  const signal = generatePairsSignal(z_score, correlation);
  
  // Execute trades
  if (signal.action !== 'HOLD') {
    executePairsTrade(signal, es_price, nq_price, hedge_ratio, z_score);
  }
  
  // Risk management
  managePairsRisk(z_score);
  
  log(\`ES: \${es_price}, NQ: \${nq_price}, Spread: \${current_spread.toFixed(2)}, Z-Score: \${z_score.toFixed(2)}, Correlation: \${correlation.toFixed(3)}, Signal: \${signal.action}\`);
}

function updateSpreadHistory(spread, es_price, nq_price) {
  spread_history.push({
    spread: spread,
    es_price: es_price,
    nq_price: nq_price,
    timestamp: Date.now()
  });
  
  // Keep only required history
  if (spread_history.length > config.lookback_period + 20) {
    spread_history = spread_history.slice(-config.lookback_period);
  }
}

function calculateHedgeRatio() {
  if (spread_history.length < config.hedge_ratio_period) {
    return 1.0; // Default ratio
  }
  
  const recent_data = spread_history.slice(-config.hedge_ratio_period);
  const es_prices = recent_data.map(d => d.es_price);
  const nq_prices = recent_data.map(d => d.nq_price);
  
  // Calculate linear regression slope (hedge ratio)
  let sum_x = 0, sum_y = 0, sum_xy = 0, sum_xx = 0;
  const n = es_prices.length;
  
  for (let i = 0; i < n; i++) {
    sum_x += es_prices[i];
    sum_y += nq_prices[i];
    sum_xy += es_prices[i] * nq_prices[i];
    sum_xx += es_prices[i] * es_prices[i];
  }
  
  const hedge_ratio = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
  return isNaN(hedge_ratio) ? 1.0 : hedge_ratio;
}

function calculateSpreadStatistics(current_spread) {
  const spreads = spread_history.map(h => h.spread);
  
  // Calculate mean
  const mean = spreads.reduce((sum, s) => sum + s, 0) / spreads.length;
  
  // Calculate standard deviation
  const variance = spreads.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / spreads.length;
  const std_dev = Math.sqrt(variance);
  
  // Calculate z-score
  const z_score = std_dev > 0 ? (current_spread - mean) / std_dev : 0;
  
  return { mean, std_dev, z_score };
}

function calculateCorrelation() {
  if (spread_history.length < 20) return 0;
  
  const recent_data = spread_history.slice(-50);
  const es_prices = recent_data.map(d => d.es_price);
  const nq_prices = recent_data.map(d => d.nq_price);
  
  const n = es_prices.length;
  let sum_es = 0, sum_nq = 0, sum_es_sq = 0, sum_nq_sq = 0, sum_es_nq = 0;
  
  for (let i = 0; i < n; i++) {
    sum_es += es_prices[i];
    sum_nq += nq_prices[i];
    sum_es_sq += es_prices[i] * es_prices[i];
    sum_nq_sq += nq_prices[i] * nq_prices[i];
    sum_es_nq += es_prices[i] * nq_prices[i];
  }
  
  const correlation = (n * sum_es_nq - sum_es * sum_nq) / 
    Math.sqrt((n * sum_es_sq - sum_es * sum_es) * (n * sum_nq_sq - sum_nq * sum_nq));
  
  return isNaN(correlation) ? 0 : correlation;
}

function generatePairsSignal(z_score, correlation) {
  let action = 'HOLD';
  let confidence = 0;
  
  // Entry signals - spread divergence
  if (z_score > config.entry_z_score && hasNoPosition()) {
    // Spread too high - short NQ, long ES
    action = 'SHORT_NQ_LONG_ES';
    confidence = Math.min(Math.abs(z_score) / config.entry_z_score, 1.0);
  } else if (z_score < -config.entry_z_score && hasNoPosition()) {
    // Spread too low - long NQ, short ES
    action = 'LONG_NQ_SHORT_ES';
    confidence = Math.min(Math.abs(z_score) / config.entry_z_score, 1.0);
  }
  // Exit signals - spread convergence
  else if (hasPosition() && Math.abs(z_score) < config.exit_z_score) {
    action = 'CLOSE';
    confidence = 1.0 - Math.abs(z_score) / config.exit_z_score;
  }
  
  return { action, confidence, z_score };
}

function executePairsTrade(signal, es_price, nq_price, hedge_ratio, z_score) {
  if (signal.confidence < 0.7) return;
  
  const trade_size = 1;
  
  if (signal.action === 'SHORT_NQ_LONG_ES') {
    position_nq = -trade_size;
    position_es = Math.round(trade_size * hedge_ratio);
    log(\`Pairs Entry: SHORT NQ \${trade_size} @ \${nq_price}, LONG ES \${position_es} @ \${es_price}\`);
    
  } else if (signal.action === 'LONG_NQ_SHORT_ES') {
    position_nq = trade_size;
    position_es = -Math.round(trade_size * hedge_ratio);
    log(\`Pairs Entry: LONG NQ \${trade_size} @ \${nq_price}, SHORT ES \${Math.abs(position_es)} @ \${es_price}\`);
    
  } else if (signal.action === 'CLOSE') {
    const nq_pnl = position_nq * (nq_price - getEntryPrice('NQ'));
    const es_pnl = position_es * (es_price - getEntryPrice('ES'));
    const total_pnl = nq_pnl + es_pnl;
    
    log(\`Pairs Exit: NQ PnL: \${nq_pnl.toFixed(2)}, ES PnL: \${es_pnl.toFixed(2)}, Total: \${total_pnl.toFixed(2)}\`);
    
    position_nq = 0;
    position_es = 0;
  }
}

function managePairsRisk(z_score) {
  // Emergency exit if spread diverges too much
  if (hasPosition() && Math.abs(z_score) > config.stop_loss_z_score) {
    log(\`STOP LOSS: Z-score \${z_score.toFixed(2)} exceeded threshold \${config.stop_loss_z_score}\`);
    position_nq = 0;
    position_es = 0;
  }
}

// Helper functions
function hasPosition() {
  return position_nq !== 0 || position_es !== 0;
}

function hasNoPosition() {
  return position_nq === 0 && position_es === 0;
}

function getESPrice(book, trades) {
  // Mock function - in real implementation, get ES price from data feed
  return 5000 + Math.random() * 100;
}

function getNQPrice(book, trades) {
  // Mock function - in real implementation, get NQ price from data feed
  return (book.bids[0].price + book.asks[0].price) / 2;
}

function getEntryPrice(symbol) {
  // Mock function - track entry prices per symbol
  return symbol === 'NQ' ? 20000 : 5000;
}

function log(message) {
  console.log(\`[\${new Date().toISOString()}] PAIRS: \${message}\`);
}`,
      parameters: {
        entry_z_score: 2.0,
        exit_z_score: 0.5,
        correlation_threshold: 0.8,
        max_position_each: 3,
        stop_loss_z_score: 3.5
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const strategy5: Strategy = {
      id: "market-making",
      name: "Market Making",
      code: `// Strategy: Professional Market Making
// Description: Two-sided liquidity provision with inventory management
// Asset: NQ Futures
// Style: Market Neutral with Inventory Risk

let inventory = 0;
let totalBuyOrders = 0;
let totalSellOrders = 0;
let lastInventoryAdjustment = 0;
let bidOrders = new Map();
let askOrders = new Map();
let dailyPnL = 0;

const params = {
  maxInventory: 12,
  targetSpread: 0.75, // Target spread in ticks
  minSpread: 0.25,    // Minimum spread to maintain
  orderSize: 2,
  inventorySkew: 0.1, // How much to skew quotes based on inventory
  maxOrdersPerSide: 4,
  quoteRefreshMs: 500,
  riskAdjustmentFactor: 0.05
};

function onMarketData(book, trades, marketData) {
  const timestamp = Date.now();
  const bestBid = book.bids[0];
  const bestAsk = book.asks[0];
  const midPrice = (bestBid.price + bestAsk.price) / 2;
  const currentSpread = bestAsk.price - bestBid.price;
  
  // Calculate market conditions
  const marketMetrics = analyzeMarket(book, trades);
  
  // Manage existing orders
  manageOrders(book, timestamp);
  
  // Inventory management
  const inventoryAdjustment = calculateInventoryAdjustment();
  
  // Calculate optimal quotes
  const quotes = calculateOptimalQuotes(midPrice, currentSpread, marketMetrics, inventoryAdjustment);
  
  // Place new quotes if conditions are favorable
  if (shouldQuote(marketMetrics, currentSpread)) {
    placeQuotes(quotes, timestamp);
  }
  
  // Risk management
  manageInventoryRisk(midPrice);
  
  log(\`Mid: \${midPrice}, Spread: \${currentSpread}, Inventory: \${inventory}, Quotes: \${quotes.bidPrice.toFixed(2)}/\${quotes.askPrice.toFixed(2)}\`);
}

function analyzeMarket(book, trades) {
  // Calculate market volatility
  const recentTrades = trades.slice(-20);
  const prices = recentTrades.map(t => t.price);
  const volatility = calculateVolatility(prices);
  
  // Order book analysis
  const topLevels = 3;
  let bidSize = 0, askSize = 0;
  
  for (let i = 0; i < Math.min(topLevels, book.bids.length); i++) {
    bidSize += book.bids[i].size;
  }
  for (let i = 0; i < Math.min(topLevels, book.asks.length); i++) {
    askSize += book.asks[i].size;
  }
  
  const orderImbalance = (bidSize - askSize) / (bidSize + askSize);
  
  // Trade flow analysis
  const tradeFlowBias = analyzeTradeFlow(recentTrades);
  
  return {
    volatility: volatility,
    orderImbalance: orderImbalance,
    tradeFlowBias: tradeFlowBias,
    topOfBookSize: { bid: book.bids[0].size, ask: book.asks[0].size }
  };
}

function calculateVolatility(prices) {
  if (prices.length < 2) return 0;
  
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i] / prices[i-1]));
  }
  
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  
  return Math.sqrt(variance) * Math.sqrt(252 * 24 * 60); // Annualized volatility
}

function analyzeTradeFlow(trades) {
  if (trades.length === 0) return 0;
  
  let buyVolume = 0, sellVolume = 0;
  
  trades.forEach(trade => {
    // Simplified trade classification (in reality, use more sophisticated methods)
    if (trade.side === 'BUY') {
      buyVolume += trade.size;
    } else {
      sellVolume += trade.size;
    }
  });
  
  const totalVolume = buyVolume + sellVolume;
  return totalVolume > 0 ? (buyVolume - sellVolume) / totalVolume : 0;
}

function calculateInventoryAdjustment() {
  // Adjust quotes based on current inventory to encourage mean reversion
  const inventoryRatio = inventory / params.maxInventory;
  const adjustment = inventoryRatio * params.inventorySkew;
  
  return {
    bidAdjustment: -adjustment, // Lower bids when long inventory
    askAdjustment: -adjustment  // Lower asks when long inventory
  };
}

function calculateOptimalQuotes(midPrice, currentSpread, metrics, inventoryAdj) {
  // Base spread calculation
  let targetSpread = Math.max(params.targetSpread, params.minSpread);
  
  // Adjust spread based on market conditions
  targetSpread *= (1 + metrics.volatility * 2); // Wider spreads in volatile markets
  targetSpread *= (1 + Math.abs(metrics.orderImbalance) * 0.5); // Wider if imbalanced
  
  // Calculate bid/ask prices
  const halfSpread = targetSpread / 2;
  let bidPrice = midPrice - halfSpread + inventoryAdj.bidAdjustment;
  let askPrice = midPrice + halfSpread + inventoryAdj.askAdjustment;
  
  // Ensure minimum spread
  if (askPrice - bidPrice < params.minSpread) {
    const adjustment = (params.minSpread - (askPrice - bidPrice)) / 2;
    bidPrice -= adjustment;
    askPrice += adjustment;
  }
  
  // Round to tick size (0.25 for NQ)
  bidPrice = Math.floor(bidPrice * 4) / 4;
  askPrice = Math.ceil(askPrice * 4) / 4;
  
  return {
    bidPrice: bidPrice,
    askPrice: askPrice,
    bidSize: calculateOrderSize('BID', metrics),
    askSize: calculateOrderSize('ASK', metrics)
  };
}

function calculateOrderSize(side, metrics) {
  let size = params.orderSize;
  
  // Adjust size based on inventory
  if (side === 'BID' && inventory > params.maxInventory * 0.5) {
    size = Math.max(1, Math.floor(size * 0.7)); // Smaller bids when long
  } else if (side === 'ASK' && inventory < -params.maxInventory * 0.5) {
    size = Math.max(1, Math.floor(size * 0.7)); // Smaller asks when short
  }
  
  // Adjust based on market conditions
  if (metrics.volatility > 0.02) {
    size = Math.max(1, Math.floor(size * 0.8)); // Smaller in volatile markets
  }
  
  return size;
}

function shouldQuote(metrics, currentSpread) {
  // Don't quote in extremely volatile conditions
  if (metrics.volatility > 0.05) return false;
  
  // Don't add liquidity if spread is already very tight
  if (currentSpread <= params.minSpread) return false;
  
  // Don't quote if inventory is at maximum
  if (Math.abs(inventory) >= params.maxInventory) return false;
  
  return true;
}

function placeQuotes(quotes, timestamp) {
  // Cancel existing orders if prices have moved significantly
  cancelAllOrders();
  
  // Place bid orders
  if (inventory < params.maxInventory) {
    const bidOrderId = \`bid_\${timestamp}_\${Math.random().toString(36).substr(2, 9)}\`;
    bidOrders.set(bidOrderId, {
      id: bidOrderId,
      price: quotes.bidPrice,
      size: quotes.bidSize,
      timestamp: timestamp
    });
    placeLimitOrder('BUY', quotes.bidPrice, quotes.bidSize);
    log(\`Bid placed: \${quotes.bidSize} @ \${quotes.bidPrice}\`);
  }
  
  // Place ask orders
  if (inventory > -params.maxInventory) {
    const askOrderId = \`ask_\${timestamp}_\${Math.random().toString(36).substr(2, 9)}\`;
    askOrders.set(askOrderId, {
      id: askOrderId,
      price: quotes.askPrice,
      size: quotes.askSize,
      timestamp: timestamp
    });
    placeLimitOrder('SELL', quotes.askPrice, quotes.askSize);
    log(\`Ask placed: \${quotes.askSize} @ \${quotes.askPrice}\`);
  }
}

function manageOrders(book, timestamp) {
  const bestBid = book.bids[0].price;
  const bestAsk = book.asks[0].price;
  
  // Cancel orders that are no longer competitive
  for (let [orderId, order] of bidOrders) {
    if (order.price < bestBid - 0.25 || timestamp - order.timestamp > params.quoteRefreshMs) {
      cancelOrder(orderId);
      bidOrders.delete(orderId);
    }
  }
  
  for (let [orderId, order] of askOrders) {
    if (order.price > bestAsk + 0.25 || timestamp - order.timestamp > params.quoteRefreshMs) {
      cancelOrder(orderId);
      askOrders.delete(orderId);
    }
  }
}

function manageInventoryRisk(midPrice) {
  const inventoryValue = inventory * midPrice;
  const maxInventoryValue = params.maxInventory * midPrice * 0.8;
  
  // Emergency inventory reduction
  if (Math.abs(inventoryValue) > maxInventoryValue) {
    const reduceSize = Math.min(2, Math.floor(Math.abs(inventory) * 0.3));
    
    if (inventory > 0) {
      // Reduce long inventory
      placeLimitOrder('SELL', midPrice - 0.5, reduceSize);
      inventory -= reduceSize;
      log(\`Emergency inventory reduction: SELL \${reduceSize}\`);
    } else {
      // Reduce short inventory
      placeLimitOrder('BUY', midPrice + 0.5, reduceSize);
      inventory += reduceSize;
      log(\`Emergency inventory reduction: BUY \${reduceSize}\`);
    }
    
    lastInventoryAdjustment = Date.now();
  }
}

function cancelAllOrders() {
  bidOrders.forEach((order, orderId) => cancelOrder(orderId));
  askOrders.forEach((order, orderId) => cancelOrder(orderId));
  bidOrders.clear();
  askOrders.clear();
}

// Mock trading functions (would integrate with actual trading system)
function placeLimitOrder(side, price, size) {
  // Integration point with trading system
  if (side === 'BUY') {
    totalBuyOrders++;
  } else {
    totalSellOrders++;
  }
}

function cancelOrder(orderId) {
  // Integration point with trading system
  log(\`Cancelled order: \${orderId}\`);
}

function log(message) {
  console.log(\`[\${new Date().toISOString()}] MM: \${message}\`);
}`,
      parameters: {
        maxInventory: 12,
        targetSpread: 0.75,
        orderSize: 2,
        inventorySkew: 0.1,
        quoteRefreshMs: 500
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.strategies.set(strategy1.id, strategy1);
    this.strategies.set(strategy2.id, strategy2);
    this.strategies.set(strategy3.id, strategy3);
    this.strategies.set(strategy4.id, strategy4);
    this.strategies.set(strategy5.id, strategy5);
    this.datasets.set(dataset1.id, dataset1);
    this.datasets.set(dataset2.id, dataset2);
    this.datasets.set(dataset3.id, dataset3);
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

  async deleteStrategy(id: string): Promise<boolean> {
    return this.strategies.delete(id);
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
