import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, SkipForward, SkipBack, Clock, BarChart3, TrendingUp, Eye } from "lucide-react";

export default function MBOReplayTab() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState([1]);
  const [currentTime, setCurrentTime] = useState("09:30:00.000");
  const [progress, setProgress] = useState(25);

  // Market data simulation
  const orderBookData = {
    bids: [
      { price: 4152.25, size: 45, count: 3 },
      { price: 4152.00, size: 78, count: 5 },
      { price: 4151.75, size: 32, count: 2 },
      { price: 4151.50, size: 156, count: 8 },
      { price: 4151.25, size: 89, count: 4 },
      { price: 4151.00, size: 234, count: 12 },
      { price: 4150.75, size: 67, count: 3 },
      { price: 4150.50, size: 123, count: 7 },
      { price: 4150.25, size: 45, count: 2 },
      { price: 4150.00, size: 178, count: 9 }
    ],
    asks: [
      { price: 4152.50, size: 56, count: 4 },
      { price: 4152.75, size: 43, count: 2 },
      { price: 4153.00, size: 89, count: 6 },
      { price: 4153.25, size: 67, count: 3 },
      { price: 4153.50, size: 145, count: 8 },
      { price: 4153.75, size: 78, count: 4 },
      { price: 4154.00, size: 234, count: 11 },
      { price: 4154.25, size: 56, count: 3 },
      { price: 4154.50, size: 98, count: 5 },
      { price: 4154.75, size: 167, count: 7 }
    ]
  };

  // Recent trades data
  const recentTrades = [
    { time: "09:30:15.234", price: 4152.25, size: 25, side: "BUY", aggressor: true },
    { time: "09:30:15.156", price: 4152.00, size: 50, side: "SELL", aggressor: false },
    { time: "09:30:14.987", price: 4152.25, size: 15, side: "BUY", aggressor: true },
    { time: "09:30:14.823", price: 4152.00, size: 30, side: "SELL", aggressor: true },
    { time: "09:30:14.675", price: 4152.25, size: 40, side: "BUY", aggressor: false },
    { time: "09:30:14.432", price: 4151.75, size: 20, side: "SELL", aggressor: true },
    { time: "09:30:14.298", price: 4152.00, size: 35, side: "BUY", aggressor: false },
    { time: "09:30:14.156", price: 4151.75, size: 45, side: "SELL", aggressor: true },
    { time: "09:30:13.998", price: 4152.00, size: 25, side: "BUY", aggressor: true },
    { time: "09:30:13.834", price: 4151.50, size: 60, side: "SELL", aggressor: false }
  ];

  // Market statistics
  const marketStats = {
    totalVolume: 1247863,
    tradeCount: 2847,
    vwap: 4151.87,
    spread: 0.25,
    bidVolume: 623450,
    askVolume: 624413,
    imbalance: -0.08
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Market By Order (MBO) Replay</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Speed:</span>
            <div className="w-32">
              <Slider
                value={replaySpeed}
                onValueChange={setReplaySpeed}
                max={10}
                min={0.1}
                step={0.1}
                className="h-6"
              />
            </div>
            <span className="text-sm font-mono w-12">{replaySpeed[0]}x</span>
            <Button size="sm" variant="outline">
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={togglePlayback}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button size="sm" variant="outline">
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Square className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Replay Progress</span>
            <span className="font-mono">{currentTime}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="orderbook" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="orderbook">Order Book</TabsTrigger>
              <TabsTrigger value="trades">Trade Feed</TabsTrigger>
              <TabsTrigger value="charts">Price Charts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="orderbook" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Book Visualization */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Live Order Book</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Bids */}
                        <div>
                          <h4 className="font-medium text-green-600 mb-3 text-center">BIDS</h4>
                          <div className="space-y-1">
                            <div className="grid grid-cols-3 text-xs font-medium text-muted-foreground border-b pb-1">
                              <span>PRICE</span>
                              <span className="text-right">SIZE</span>
                              <span className="text-right">COUNT</span>
                            </div>
                            {orderBookData.bids.map((bid, index) => (
                              <div key={index} className="grid grid-cols-3 text-sm py-1 relative">
                                {/* Volume bar background */}
                                <div 
                                  className="absolute inset-0 bg-green-500/10 rounded"
                                  style={{ width: `${(bid.size / 250) * 100}%` }}
                                />
                                <span className="font-mono text-green-600 relative z-10">{bid.price.toFixed(2)}</span>
                                <span className="font-mono text-right relative z-10">{bid.size}</span>
                                <span className="font-mono text-right relative z-10">{bid.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Asks */}
                        <div>
                          <h4 className="font-medium text-red-600 mb-3 text-center">ASKS</h4>
                          <div className="space-y-1">
                            <div className="grid grid-cols-3 text-xs font-medium text-muted-foreground border-b pb-1">
                              <span>PRICE</span>
                              <span className="text-right">SIZE</span>
                              <span className="text-right">COUNT</span>
                            </div>
                            {orderBookData.asks.map((ask, index) => (
                              <div key={index} className="grid grid-cols-3 text-sm py-1 relative">
                                {/* Volume bar background */}
                                <div 
                                  className="absolute inset-0 bg-red-500/10 rounded"
                                  style={{ width: `${(ask.size / 250) * 100}%` }}
                                />
                                <span className="font-mono text-red-600 relative z-10">{ask.price.toFixed(2)}</span>
                                <span className="font-mono text-right relative z-10">{ask.size}</span>
                                <span className="font-mono text-right relative z-10">{ask.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Market Statistics */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Market Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Volume</span>
                        <span className="font-mono text-sm">{marketStats.totalVolume.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Trade Count</span>
                        <span className="font-mono text-sm">{marketStats.tradeCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">VWAP</span>
                        <span className="font-mono text-sm">{marketStats.vwap.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Spread</span>
                        <span className="font-mono text-sm">{marketStats.spread.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Bid Volume</span>
                        <span className="font-mono text-sm text-green-600">{marketStats.bidVolume.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Ask Volume</span>
                        <span className="font-mono text-sm text-red-600">{marketStats.askVolume.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Imbalance</span>
                        <span className={`font-mono text-sm ${marketStats.imbalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {marketStats.imbalance >= 0 ? '+' : ''}{(marketStats.imbalance * 100).toFixed(1)}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Replay Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm">Jump to Time</Label>
                        <Input type="time" defaultValue="09:30" step="1" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-sm">Data Source</Label>
                        <Select defaultValue="live">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="live">Live Market Data</SelectItem>
                            <SelectItem value="historical">Historical Data</SelectItem>
                            <SelectItem value="simulation">Simulation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Snapshot View
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trades" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Live Trade Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-5 text-xs font-medium text-muted-foreground border-b pb-2">
                      <span>TIME</span>
                      <span className="text-right">PRICE</span>
                      <span className="text-right">SIZE</span>
                      <span className="text-center">SIDE</span>
                      <span className="text-center">AGG</span>
                    </div>
                    {recentTrades.map((trade, index) => (
                      <div key={index} className="grid grid-cols-5 text-sm py-1 hover:bg-muted/50 rounded">
                        <span className="font-mono text-xs">{trade.time}</span>
                        <span className={`font-mono text-right ${trade.side === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.price.toFixed(2)}
                        </span>
                        <span className="font-mono text-right">{trade.size}</span>
                        <span className={`text-center text-xs font-medium ${trade.side === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.side}
                        </span>
                        <span className="text-center">
                          {trade.aggressor && <span className="text-orange-500 text-xs">●</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="charts" className="space-y-4">
              {/* Price Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Price Movement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full bg-muted rounded-lg relative overflow-hidden">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map(i => (
                        <line key={`h-${i}`} x1="0" y1={i * 50} x2="100%" y2={i * 50} stroke="#374151" strokeWidth="0.5" opacity="0.3" />
                      ))}

                      {/* Price line */}
                      <path
                        d={`M 0 150 ${Array.from({ length: 100 }, (_, i) => {
                          const x = (i / 100) * 800;
                          const y = 150 + Math.sin(i * 0.1) * 30 + Math.random() * 20 - 10;
                          return `L ${x} ${y}`;
                        }).join(' ')}`}
                        stroke="#3b82f6"
                        strokeWidth="2"
                        fill="none"
                      />

                      {/* Volume bars */}
                      {Array.from({ length: 20 }, (_, i) => {
                        const x = (i / 20) * 800;
                        const height = Math.random() * 40 + 10;
                        return (
                          <rect 
                            key={i}
                            x={x - 5} 
                            y={250 - height} 
                            width="10" 
                            height={height}
                            fill="#10b981"
                            opacity="0.6"
                          />
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
                  <div className="h-48 w-full bg-muted rounded-lg relative overflow-hidden">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      {/* Volume profile bars */}
                      {Array.from({ length: 20 }, (_, i) => {
                        const y = (i / 20) * 200;
                        const width = Math.random() * 150 + 50;
                        return (
                          <rect 
                            key={i}
                            x="0" 
                            y={y} 
                            width={width} 
                            height="8"
                            fill="#8b5cf6"
                            opacity="0.7"
                          />
                        );
                      })}
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {/* Market Microstructure Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Effective Spread</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0.08%</div>
                    <p className="text-xs text-muted-foreground">Realized cost</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Price Impact</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0.05%</div>
                    <p className="text-xs text-muted-foreground">Per $100k</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tick Frequency</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">247</div>
                    <p className="text-xs text-muted-foreground">Updates/min</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Book Depth</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8.7M</div>
                    <p className="text-xs text-muted-foreground">Total liquidity</p>
                  </CardContent>
                </Card>
              </div>

              {/* Order Flow Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Flow Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 w-full bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-muted-foreground">Order flow intensity heatmap</div>
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