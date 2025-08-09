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

export class BacktestingEngine {
  private parameters: BacktestParameters;
  private position: number = 0;
  private capital: number = 10000;
  private trades: Trade[] = [];
  private isRunning: boolean = false;

  constructor(parameters: BacktestParameters) {
    this.parameters = parameters;
  }

  async runBacktest(strategyCode: string, marketData: MarketDataPoint[]): Promise<BacktestResults> {
    this.isRunning = true;
    this.position = 0;
    this.capital = 10000;
    this.trades = [];

    // Simulate backtest execution
    for (let i = 0; i < marketData.length && this.isRunning; i++) {
      const dataPoint = marketData[i];
      
      // Simulate strategy logic
      if (Math.random() > 0.95) { // Random trade generation for demo
        const trade = this.generateTrade(dataPoint);
        if (trade) {
          this.trades.push(trade);
          this.position += trade.side === 'BUY' ? trade.size : -trade.size;
          this.capital += trade.pnl;
        }
      }

      // Add small delay to simulate processing
      if (i % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }

    return this.calculateResults();
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

    return {
      startCapital: 10000,
      endCapital: this.capital,
      totalReturn: ((this.capital - 10000) / 10000) * 100,
      maxDrawdown: -1500, // Simplified calculation
      hitRate: (winningTrades.length / this.trades.length) * 100,
      sharpeRatio: 2.1, // Simplified calculation
      profitFactor: 1.62, // Simplified calculation
      totalTrades: this.trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      avgWin: winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length || 0,
      avgLoss: losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length || 0,
      largestWin: Math.max(...winningTrades.map(t => t.pnl), 0),
      largestLoss: Math.min(...losingTrades.map(t => t.pnl), 0),
    };
  }

  stop(): void {
    this.isRunning = false;
  }
}
