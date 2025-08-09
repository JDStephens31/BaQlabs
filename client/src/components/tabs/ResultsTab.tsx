import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Target, Activity, BarChart3 } from "lucide-react";

export default function ResultsTab() {
  // Performance metrics data
  const performanceMetrics = {
    totalReturn: 15.4,
    sharpeRatio: 1.82,
    maxDrawdown: -3.2,
    winRate: 67.3,
    profitFactor: 1.45,
    averageWin: 125.50,
    averageLoss: -85.20,
    totalTrades: 847,
    winningTrades: 570,
    losingTrades: 277
  };

  // Equity curve data points
  const equityCurveData = Array.from({ length: 100 }, (_, i) => ({
    x: i,
    equity: 100000 + (i * 150) + Math.sin(i * 0.1) * 1000 + Math.random() * 500 - 250,
    drawdown: Math.max(-5, Math.sin(i * 0.15) * 3 + Math.random() * 1 - 0.5)
  }));

  // Monthly returns data
  const monthlyReturns = [
    { month: "Jan", return: 2.3 },
    { month: "Feb", return: -0.8 },
    { month: "Mar", return: 4.1 },
    { month: "Apr", return: 1.7 },
    { month: "May", return: 3.2 },
    { month: "Jun", return: -1.2 },
    { month: "Jul", return: 2.8 },
    { month: "Aug", return: 5.1 },
    { month: "Sep", return: -0.5 },
    { month: "Oct", return: 3.6 },
    { month: "Nov", return: 2.1 },
    { month: "Dec", return: 1.8 }
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Performance Analytics</h3>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">Export PDF</Button>
            <Button size="sm" variant="outline">Export CSV</Button>
            <Button size="sm">Generate Report</Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="trades">Trade Analysis</TabsTrigger>
              <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Key Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Return</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">+{performanceMetrics.totalReturn}%</div>
                    <p className="text-xs text-muted-foreground">vs benchmark +8.2%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{performanceMetrics.sharpeRatio}</div>
                    <p className="text-xs text-muted-foreground">Risk-adjusted return</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{performanceMetrics.maxDrawdown}%</div>
                    <p className="text-xs text-muted-foreground">Peak to trough</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{performanceMetrics.winRate}%</div>
                    <p className="text-xs text-muted-foreground">{performanceMetrics.winningTrades}/{performanceMetrics.totalTrades} trades</p>
                  </CardContent>
                </Card>
              </div>

              {/* Equity Curve Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle>Equity Curve</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      <defs>
                        <linearGradient id="equityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.3 }} />
                          <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0 }} />
                        </linearGradient>
                      </defs>
                      
                      {/* Equity curve path */}
                      <path
                        d={`M 0 ${200 - (equityCurveData[0].equity - 100000) / 1000} ${equityCurveData.map((point, i) => 
                          `L ${(i / equityCurveData.length) * 800} ${200 - (point.equity - 100000) / 1000}`
                        ).join(' ')}`}
                        stroke="#10b981"
                        strokeWidth="2"
                        fill="none"
                      />
                      
                      {/* Fill area under curve */}
                      <path
                        d={`M 0 ${200 - (equityCurveData[0].equity - 100000) / 1000} ${equityCurveData.map((point, i) => 
                          `L ${(i / equityCurveData.length) * 800} ${200 - (point.equity - 100000) / 1000}`
                        ).join(' ')} L 800 200 L 0 200 Z`}
                        fill="url(#equityGradient)"
                      />

                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map(i => (
                        <line key={i} x1="0" y1={i * 50} x2="800" y2={i * 50} stroke="#374151" strokeWidth="0.5" opacity="0.3" />
                      ))}
                    </svg>
                    <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
                      Portfolio Value: $115,400 (+15.4%)
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Returns */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {monthlyReturns.map((month) => (
                      <div key={month.month} className="flex items-center justify-between">
                        <span className="text-sm font-medium w-12">{month.month}</span>
                        <div className="flex-1 mx-3">
                          <Progress 
                            value={Math.abs(month.return) * 10} 
                            className="h-2"
                          />
                        </div>
                        <span className={`text-sm font-mono w-16 text-right ${
                          month.return >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {month.return >= 0 ? '+' : ''}{month.return}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="charts" className="space-y-4">
              {/* Price & Signal Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Price Action & Signals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      {/* Candlestick chart simulation */}
                      {Array.from({ length: 50 }, (_, i) => {
                        const open = 4150 + Math.sin(i * 0.1) * 50 + Math.random() * 20;
                        const close = open + (Math.random() - 0.5) * 30;
                        const high = Math.max(open, close) + Math.random() * 15;
                        const low = Math.min(open, close) - Math.random() * 15;
                        const x = (i / 50) * 800;
                        const isGreen = close > open;
                        
                        return (
                          <g key={i}>
                            {/* High-Low line */}
                            <line 
                              x1={x} y1={(4200 - high) / 200 * 300} 
                              x2={x} y2={(4200 - low) / 200 * 300}
                              stroke={isGreen ? "#10b981" : "#ef4444"} 
                              strokeWidth="1"
                            />
                            {/* Body */}
                            <rect 
                              x={x - 3} 
                              y={(4200 - Math.max(open, close)) / 200 * 300}
                              width="6" 
                              height={Math.abs(close - open) / 200 * 300}
                              fill={isGreen ? "#10b981" : "#ef4444"}
                            />
                            {/* Buy/Sell signals */}
                            {Math.random() > 0.9 && (
                              <circle 
                                cx={x} 
                                cy={(4200 - low) / 200 * 300 + 10}
                                r="3" 
                                fill={Math.random() > 0.5 ? "#10b981" : "#ef4444"}
                              />
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </CardContent>
              </Card>

              {/* Volume Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>Volume Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 w-full bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-muted-foreground">Volume distribution by price level</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trades" className="space-y-4">
              {/* Trade Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Average Win</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-green-600">
                      ${performanceMetrics.averageWin}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Average Loss</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-red-600">
                      ${performanceMetrics.averageLoss}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Profit Factor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">
                      {performanceMetrics.profitFactor}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Trades Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-6 text-xs font-medium text-muted-foreground border-b pb-2">
                      <span>Time</span>
                      <span>Side</span>
                      <span>Price</span>
                      <span>Quantity</span>
                      <span>PnL</span>
                      <span>Queue Pos</span>
                    </div>
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className="grid grid-cols-6 text-xs py-1 border-b border-border">
                        <span className="font-mono">14:23:{String(45 - i).padStart(2, '0')}</span>
                        <span className={i % 3 === 0 ? "text-red-600" : "text-green-600"}>
                          {i % 3 === 0 ? "SELL" : "BUY"}
                        </span>
                        <span className="font-mono">4,{150 + i * 2}.{25 + i % 4 * 25}</span>
                        <span>{50 + i * 10}</span>
                        <span className={`font-mono ${i % 2 === 0 ? "text-green-600" : "text-red-600"}`}>
                          {i % 2 === 0 ? "+" : "-"}${(Math.random() * 200 + 50).toFixed(2)}
                        </span>
                        <span className="font-mono">{Math.floor(Math.random() * 5) + 1}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              {/* Risk Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Value at Risk (VaR)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">1-day VaR (95%)</span>
                        <span className="font-mono text-red-600">-$2,450</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">1-day VaR (99%)</span>
                        <span className="font-mono text-red-600">-$3,820</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Expected Shortfall</span>
                        <span className="font-mono text-red-600">-$4,150</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Attribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Market Risk</span>
                        <span className="font-mono">68.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Model Risk</span>
                        <span className="font-mono">18.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Execution Risk</span>
                        <span className="font-mono">13.0%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Drawdown Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Drawdown Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 w-full bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      <path
                        d={`M 0 20 ${equityCurveData.map((point, i) => 
                          `L ${(i / equityCurveData.length) * 800} ${20 - point.drawdown * 30}`
                        ).join(' ')}`}
                        stroke="#ef4444"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d={`M 0 20 ${equityCurveData.map((point, i) => 
                          `L ${(i / equityCurveData.length) * 800} ${20 - point.drawdown * 30}`
                        ).join(' ')} L 800 20 L 0 20 Z`}
                        fill="rgba(239, 68, 68, 0.2)"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}