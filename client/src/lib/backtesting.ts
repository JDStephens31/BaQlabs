export interface BacktestParameters {
  timeWindow: { start: string; end: string };
  fees: number;
  tickSize: number;
  lotSize: number;
  takeProfit: number;
  stopLoss: number;
  useMBO: boolean;
  useLatency: boolean;
  latencyProfile: {
    distribution: string;
    mean: number;
    stdDev: number;
  };
  positionLimits: { maxLong: number; maxShort: number };
}

export interface BacktestResults {
  startCapital: number;
  endCapital: number;
  totalReturn: number;
  maxDrawdown: number;
  hitRate: number;
  sharpeRatio: number;
  profitFactor: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
}

export interface Trade {
  timestamp: Date;
  side: 'BUY' | 'SELL';
  price: number;
  size: number;
  pnl: number;
  slippage: number;
  queueRank?: number;
}

export interface MarketDataPoint {
  timestamp: Date;
  eventType: 'ADD' | 'CANCEL' | 'TRADE';
  side?: 'BID' | 'ASK';
  price?: number;
  size?: number;
  orderId?: string;
}

export interface OrderBookLevel {
  price: number;
  size: number;
  orders: number;
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  timestamp: Date;
}

export interface TradingContext {
  book: OrderBook;
  recentTrades: Trade[];
  position: number;
  unrealizedPnl: number;
  capital: number;
}

export class BacktestingEngine {
  private parameters: BacktestParameters;
  private position: number = 0;
  private capital: number = 100000;
  private trades: Trade[] = [];
  private isRunning: boolean = false;
  private orderBook: OrderBook;
  private basePrice: number = 23713; // NQ starting price
  private currentTime: Date = new Date();
  private equityCurve: Array<{timestamp: Date, equity: number, drawdown: number}> = [];
  private peakEquity: number = 100000;

  constructor(parameters: BacktestParameters) {
    this.parameters = parameters;
    this.orderBook = this.initializeOrderBook();
  }

  private initializeOrderBook(): OrderBook {
    const bids: OrderBookLevel[] = [];
    const asks: OrderBookLevel[] = [];
    
    // Create realistic NQ order book around 23713
    for (let i = 0; i < 10; i++) {
      bids.push({
        price: this.basePrice - (i + 1) * this.parameters.tickSize,
        size: Math.floor(Math.random() * 50) + 10,
        orders: Math.floor(Math.random() * 20) + 5
      });
      
      asks.push({
        price: this.basePrice + (i + 1) * this.parameters.tickSize,
        size: Math.floor(Math.random() * 50) + 10,
        orders: Math.floor(Math.random() * 20) + 5
      });
    }
    
    return {
      bids: bids.sort((a, b) => b.price - a.price),
      asks: asks.sort((a, b) => a.price - b.price),
      timestamp: new Date()
    };
  }

  async runBacktest(strategyCode: string, marketData: MarketDataPoint[]): Promise<BacktestResults> {
    this.isRunning = true;
    this.position = 0;
    this.capital = 100000;
    this.trades = [];
    this.equityCurve = [];
    this.peakEquity = 100000;

    // Generate synthetic NQ market data if none provided
    const processedData = marketData.length > 0 ? marketData : this.generateNQMarketData();
    
    // Execute strategy on each market data point
    for (let i = 0; i < processedData.length && this.isRunning; i++) {
      const dataPoint = processedData[i];
      this.currentTime = dataPoint.timestamp;
      
      // Update order book based on market data
      this.updateOrderBook(dataPoint);
      
      // Execute trading strategy
      await this.executeStrategy(strategyCode, dataPoint, i);
      
      // Update equity curve
      this.updateEquityCurve();
      
      // Simulate processing time
      if (i % 50 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }

    return this.calculateResults();
  }

  private generateNQMarketData(): MarketDataPoint[] {
    const data: MarketDataPoint[] = [];
    const startTime = new Date();
    let currentPrice = this.basePrice;
    
    // Generate 5000 market events (about 1 trading session)
    for (let i = 0; i < 5000; i++) {
      const timestamp = new Date(startTime.getTime() + i * 1000); // 1 second intervals
      
      // Price random walk with slight upward bias
      const priceChange = (Math.random() - 0.48) * this.parameters.tickSize * 4;
      currentPrice = Math.max(23600, Math.min(23800, currentPrice + priceChange));
      
      // Generate different event types
      const eventType = Math.random() < 0.7 ? 'ADD' : Math.random() < 0.9 ? 'TRADE' : 'CANCEL';
      const side = Math.random() < 0.5 ? 'BID' : 'ASK';
      
      data.push({
        timestamp,
        eventType: eventType as 'ADD' | 'CANCEL' | 'TRADE',
        side,
        price: Math.round(currentPrice / this.parameters.tickSize) * this.parameters.tickSize,
        size: Math.floor(Math.random() * 20) + 1,
        orderId: `order_${i}`
      });
    }
    
    return data;
  }

  private updateOrderBook(dataPoint: MarketDataPoint): void {
    if (!dataPoint.price || !dataPoint.side) return;
    
    const levels = dataPoint.side === 'BID' ? this.orderBook.bids : this.orderBook.asks;
    const levelIndex = levels.findIndex(level => Math.abs(level.price - dataPoint.price!) < 0.01);
    
    if (dataPoint.eventType === 'ADD') {
      if (levelIndex >= 0) {
        levels[levelIndex].size += dataPoint.size || 0;
        levels[levelIndex].orders += 1;
      } else {
        levels.push({
          price: dataPoint.price,
          size: dataPoint.size || 0,
          orders: 1
        });
        levels.sort((a, b) => dataPoint.side === 'BID' ? b.price - a.price : a.price - b.price);
      }
    } else if (dataPoint.eventType === 'CANCEL' && levelIndex >= 0) {
      levels[levelIndex].size = Math.max(0, levels[levelIndex].size - (dataPoint.size || 0));
      levels[levelIndex].orders = Math.max(0, levels[levelIndex].orders - 1);
      
      if (levels[levelIndex].size <= 0) {
        levels.splice(levelIndex, 1);
      }
    }
    
    this.orderBook.timestamp = dataPoint.timestamp;
  }

  private async executeStrategy(strategyCode: string, dataPoint: MarketDataPoint, index: number): Promise<void> {
    try {
      // Create trading context
      const context: TradingContext = {
        book: this.orderBook,
        recentTrades: this.trades.slice(-10),
        position: this.position,
        unrealizedPnl: this.calculateUnrealizedPnl(),
        capital: this.capital
      };
      
      // Simple strategy logic (since we can't execute user code safely)
      const signal = this.analyzeMarket(context, dataPoint);
      
      if (signal && Math.abs(this.position) < this.parameters.positionLimits.maxLong) {
        const trade = this.executeTrade(signal, dataPoint);
        if (trade) {
          this.trades.push(trade);
          this.position += trade.side === 'BUY' ? trade.size : -trade.size;
          this.capital += trade.pnl;
        }
      }
      
      // Risk management
      this.checkRiskLimits();
      
    } catch (error) {
      console.error('Strategy execution error:', error);
    }
  }

  private analyzeMarket(context: TradingContext, dataPoint: MarketDataPoint): 'BUY' | 'SELL' | null {
    if (!this.orderBook.bids.length || !this.orderBook.asks.length) return null;
    
    const bestBid = this.orderBook.bids[0];
    const bestAsk = this.orderBook.asks[0];
    const spread = bestAsk.price - bestBid.price;
    
    // Calculate order book imbalance
    const bidVolume = this.orderBook.bids.slice(0, 5).reduce((sum, level) => sum + level.size, 0);
    const askVolume = this.orderBook.asks.slice(0, 5).reduce((sum, level) => sum + level.size, 0);
    const imbalance = (bidVolume - askVolume) / (bidVolume + askVolume);
    
    // Simple mean reversion + momentum strategy
    const recentPrices = this.trades.slice(-20).map(t => t.price);
    if (recentPrices.length < 10) return null;
    
    const avgPrice = recentPrices.reduce((sum, p) => sum + p, 0) / recentPrices.length;
    const currentPrice = bestBid.price + spread / 2;
    const priceDeviation = (currentPrice - avgPrice) / avgPrice;
    
    // Trading conditions
    const strongImbalance = Math.abs(imbalance) > 0.3;
    const tightSpread = spread <= this.parameters.tickSize * 2;
    const momentum = priceDeviation > 0.001;
    
    if (strongImbalance && tightSpread && Math.random() > 0.95) {
      if (imbalance > 0 && momentum) return 'BUY';
      if (imbalance < 0 && !momentum) return 'SELL';
    }
    
    return null;
  }

  private executeTrade(signal: 'BUY' | 'SELL', dataPoint: MarketDataPoint): Trade | null {
    if (!this.orderBook.bids.length || !this.orderBook.asks.length) return null;
    
    const bestBid = this.orderBook.bids[0];
    const bestAsk = this.orderBook.asks[0];
    
    // Determine execution price with realistic slippage
    let executionPrice: number;
    let slippage: number = 0;
    
    if (signal === 'BUY') {
      executionPrice = bestAsk.price;
      // Add latency-based slippage
      if (this.parameters.useLatency) {
        const latency = this.simulateLatency();
        slippage = latency > 50 ? this.parameters.tickSize * 0.5 : 0;
        executionPrice += slippage;
      }
    } else {
      executionPrice = bestBid.price;
      if (this.parameters.useLatency) {
        const latency = this.simulateLatency();
        slippage = latency > 50 ? -this.parameters.tickSize * 0.5 : 0;
        executionPrice += slippage;
      }
    }
    
    const size = this.parameters.lotSize;
    const commission = this.parameters.fees;
    
    // Calculate PnL for this trade
    let pnl = 0;
    if (this.trades.length > 0) {
      const lastTrade = this.trades[this.trades.length - 1];
      if ((lastTrade.side === 'BUY' && signal === 'SELL') || 
          (lastTrade.side === 'SELL' && signal === 'BUY')) {
        // Closing trade - calculate realized PnL
        const priceDiff = signal === 'SELL' ? 
          (executionPrice - lastTrade.price) : 
          (lastTrade.price - executionPrice);
        pnl = (priceDiff * size * 20) - commission; // NQ multiplier is $20 per point
      }
    }
    
    return {
      timestamp: dataPoint.timestamp,
      side: signal,
      price: executionPrice,
      size,
      pnl,
      slippage: Math.abs(slippage),
      queueRank: this.simulateQueuePosition()
    };
  }

  private simulateLatency(): number {
    const { distribution, mean, stdDev } = this.parameters.latencyProfile;
    
    if (distribution === "Gaussian") {
      return Math.max(5, mean + stdDev * (Math.random() - 0.5) * 4);
    } else if (distribution === "Uniform") {
      return mean + (Math.random() - 0.5) * stdDev * 2;
    } else {
      // Exponential
      return mean + Math.random() * stdDev;
    }
  }

  private simulateQueuePosition(): number {
    return Math.floor(Math.random() * 50) + 1;
  }

  private calculateUnrealizedPnl(): number {
    if (this.position === 0 || !this.orderBook.bids.length || !this.orderBook.asks.length) {
      return 0;
    }
    
    const markPrice = (this.orderBook.bids[0].price + this.orderBook.asks[0].price) / 2;
    const avgEntryPrice = this.trades.length > 0 ? 
      this.trades.filter(t => (t.side === 'BUY') === (this.position > 0))
        .reduce((sum, t, _, arr) => sum + t.price / arr.length, 0) : markPrice;
    
    return (markPrice - avgEntryPrice) * this.position * 20; // NQ multiplier
  }

  private updateEquityCurve(): void {
    const currentEquity = this.capital + this.calculateUnrealizedPnl();
    this.peakEquity = Math.max(this.peakEquity, currentEquity);
    const drawdown = (this.peakEquity - currentEquity) / this.peakEquity;
    
    this.equityCurve.push({
      timestamp: new Date(this.currentTime),
      equity: currentEquity,
      drawdown
    });
  }

  private checkRiskLimits(): void {
    const unrealizedPnl = this.calculateUnrealizedPnl();
    const totalEquity = this.capital + unrealizedPnl;
    
    // Stop loss check
    if (Math.abs(unrealizedPnl) > this.parameters.stopLoss * 20 * Math.abs(this.position)) {
      // Force close position
      if (this.position !== 0) {
        const closePrice = this.orderBook.bids.length > 0 ? this.orderBook.bids[0].price : this.basePrice;
        const closeTrade: Trade = {
          timestamp: this.currentTime,
          side: this.position > 0 ? 'SELL' : 'BUY',
          price: closePrice,
          size: Math.abs(this.position),
          pnl: unrealizedPnl - this.parameters.fees,
          slippage: this.parameters.tickSize,
          queueRank: 1
        };
        
        this.trades.push(closeTrade);
        this.capital += closeTrade.pnl;
        this.position = 0;
      }
    }
  }

  private generateTrade(dataPoint: MarketDataPoint): Trade | null {
    if (!dataPoint.price) return null;

    const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
    const size = 1;
    const slippage = (Math.random() - 0.5) * 0.5; // Random slippage
    const price = dataPoint.price + slippage;
    const pnl = (Math.random() - 0.45) * 100; // Slightly positive bias

    return {
      timestamp: dataPoint.timestamp,
      side,
      price,
      size,
      pnl,
      slippage,
      queueRank: Math.floor(Math.random() * 200),
    };
  }

  private calculateResults(): BacktestResults {
    const winningTrades = this.trades.filter(t => t.pnl > 0);
    const losingTrades = this.trades.filter(t => t.pnl < 0);
    const totalPnl = this.trades.reduce((sum, t) => sum + t.pnl, 0);
    const startCapital = 100000;
    
    // Calculate max drawdown from equity curve
    let maxDrawdown = 0;
    let peak = startCapital;
    
    for (const point of this.equityCurve) {
      if (point.equity > peak) {
        peak = point.equity;
      }
      const drawdown = (peak - point.equity) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
    
    // Calculate Sharpe ratio
    const returns = this.equityCurve.map((point, i) => 
      i > 0 ? (point.equity - this.equityCurve[i-1].equity) / this.equityCurve[i-1].equity : 0
    ).slice(1);
    
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const returnStdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    );
    const sharpeRatio = returnStdDev > 0 ? (avgReturn / returnStdDev) * Math.sqrt(252) : 0;
    
    // Calculate profit factor
    const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0;

    return {
      startCapital,
      endCapital: this.capital,
      totalReturn: ((this.capital - startCapital) / startCapital) * 100,
      maxDrawdown: maxDrawdown * 100,
      hitRate: this.trades.length > 0 ? (winningTrades.length / this.trades.length) * 100 : 0,
      sharpeRatio: isFinite(sharpeRatio) ? sharpeRatio : 0,
      profitFactor: isFinite(profitFactor) ? profitFactor : 0,
      totalTrades: this.trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      avgWin: winningTrades.length > 0 ? grossProfit / winningTrades.length : 0,
      avgLoss: losingTrades.length > 0 ? grossLoss / losingTrades.length : 0,
      largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl)) : 0,
      largestLoss: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl)) : 0,
    };
  }

  stop(): void {
    this.isRunning = false;
  }
}
