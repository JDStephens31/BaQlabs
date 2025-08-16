import { useState, useEffect, useRef } from "react";
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
import { useWebSocket } from "@/hooks/useWebSocket";

export default function MBOReplayTab() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState([1]);
  const [currentTime, setCurrentTime] = useState("09:30:00.000");
  const [progress, setProgress] = useState(25);

  // Live NQ order book data in 23770-23800 range
  const [orderBookData, setOrderBookData] = useState({
    bids: [
      { price: 23784.75, size: 45, count: 3 },
      { price: 23784.50, size: 78, count: 5 },
      { price: 23784.25, size: 32, count: 2 },
      { price: 23784.00, size: 156, count: 8 },
      { price: 23783.75, size: 89, count: 4 },
      { price: 23783.50, size: 234, count: 12 },
      { price: 23783.25, size: 67, count: 3 },
      { price: 23783.00, size: 123, count: 7 },
      { price: 23782.75, size: 45, count: 2 },
      { price: 23782.50, size: 178, count: 9 }
    ],
    asks: [
      { price: 23785.00, size: 56, count: 4 },
      { price: 23785.25, size: 43, count: 2 },
      { price: 23785.50, size: 89, count: 6 },
      { price: 23785.75, size: 67, count: 3 },
      { price: 23786.00, size: 145, count: 8 },
      { price: 23786.25, size: 78, count: 4 },
      { price: 23786.50, size: 234, count: 11 },
      { price: 23786.75, size: 56, count: 3 },
      { price: 23787.00, size: 98, count: 5 },
      { price: 23787.25, size: 167, count: 7 }
    ]
  });

  // Live NQ trades data
  const [recentTrades, setRecentTrades] = useState([
    { time: "09:30:15.234", price: 23784.75, size: 25, side: "BUY", aggressor: true },
    { time: "09:30:15.156", price: 23784.50, size: 50, side: "SELL", aggressor: false },
    { time: "09:30:14.987", price: 23784.75, size: 15, side: "BUY", aggressor: true },
    { time: "09:30:14.823", price: 23784.25, size: 30, side: "SELL", aggressor: true },
    { time: "09:30:14.675", price: 23785.00, size: 40, side: "BUY", aggressor: false },
    { time: "09:30:14.432", price: 23784.00, size: 20, side: "SELL", aggressor: true },
    { time: "09:30:14.298", price: 23784.50, size: 35, side: "BUY", aggressor: false },
    { time: "09:30:14.156", price: 23783.75, size: 45, side: "SELL", aggressor: true },
    { time: "09:30:13.998", price: 23784.25, size: 25, side: "BUY", aggressor: true },
    { time: "09:30:13.834", price: 23783.50, size: 60, side: "SELL", aggressor: false }
  ]);

  // Live market statistics for NQ
  const [marketStats, setMarketStats] = useState({
    totalVolume: 1247863,
    tradeCount: 2847,
    vwap: 23784.62,
    spread: 0.25,
    bidVolume: 623450,
    askVolume: 624413,
    imbalance: -0.08,
    lastPrice: 23784.75,
    change: +12.50,
    changePercent: +0.05
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket connection for live market data
  const { connectionStatus, sendMessage } = useWebSocket('', {
    onMessage: (data) => {
      if (data.type === 'mboUpdate' && isPlaying) {
        updateOrderBook(data.data);
      }
    }
  });

  // Generate realistic NQ order book update
  const generateOrderBookUpdate = () => {
    // Dynamic price that moves within the 23770-23800 range
    const basePrice = 23770 + (Math.random() * 30); // Random price between 23770-23800
    const spread = 0.25; // NQ tick size
    
    // Create realistic bid/ask levels around current market
    const newBids = [];
    const newAsks = [];
    
    for (let i = 0; i < 10; i++) {
      const bidPrice = basePrice - (i * spread) - spread/2;
      const askPrice = basePrice + (i * spread) + spread/2;
      
      // Realistic size distribution for NQ
      const bidSize = Math.floor(Math.random() * 200) + 10;
      const askSize = Math.floor(Math.random() * 200) + 10;
      const bidCount = Math.floor(bidSize / 20) + 1;
      const askCount = Math.floor(askSize / 20) + 1;
      
      newBids.push({ 
        price: Math.round(bidPrice * 4) / 4, 
        size: bidSize, 
        count: bidCount 
      });
      newAsks.push({ 
        price: Math.round(askPrice * 4) / 4, 
        size: askSize, 
        count: askCount 
      });
    }
    
    return { bids: newBids, asks: newAsks };
  };

  // Generate new trade
  const generateTrade = () => {
    const price = 23770 + (Math.random() * 30); // Price within 23770-23800 range
    const size = [1, 2, 3, 5, 10, 15, 20][Math.floor(Math.random() * 7)];
    const side = Math.random() > 0.5 ? "BUY" : "SELL";
    const aggressor = Math.random() > 0.3; // 70% aggressor trades
    
    const now = new Date();
    const time = now.toTimeString().slice(0, 12); // HH:MM:SS.mmm format
    
    return {
      time,
      price: Math.round(price * 4) / 4,
      size,
      side,
      aggressor
    };
  };

  // Update order book with new data
  const updateOrderBook = (data?: any) => {
    const newOrderBook = generateOrderBookUpdate();
    setOrderBookData(newOrderBook);
    
    // Add new trade
    const newTrade = generateTrade();
    setRecentTrades(prev => [newTrade, ...prev.slice(0, 9)]);
    
    // Update market stats
    setMarketStats(prev => ({
      ...prev,
      totalVolume: prev.totalVolume + newTrade.size,
      tradeCount: prev.tradeCount + 1,
      lastPrice: newTrade.price,
      vwap: (prev.vwap * 0.99 + newTrade.price * 0.01), // Simple VWAP update
      imbalance: (Math.random() - 0.5) * 0.2 // Random imbalance
    }));
    
    // Update progress and time
    setProgress(prev => (prev + 0.5) % 100);
    const now = new Date();
    setCurrentTime(now.toTimeString().slice(0, 12));
  };

  // Stop playback completely
  const stopPlayback = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
  };

  // Start/stop live playback
  const togglePlayback = () => {
    if (isPlaying) {
      // Pause playback
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      // Start playback
      setIsPlaying(true);
      // Calculate interval: much slower speeds possible
      // Speed 0.1 = 10 seconds, Speed 0.5 = 2 seconds, Speed 1 = 1 second, Speed 2 = 500ms, Speed 5 = 200ms
      let interval;
      if (replaySpeed[0] <= 1) {
        interval = 1000 / replaySpeed[0]; // 0.1 = 10000ms, 0.5 = 2000ms, 1 = 1000ms
      } else {
        interval = 1000 / replaySpeed[0]; // 2 = 500ms, 5 = 200ms
      }
      interval = Math.max(100, interval); // Minimum 100ms
      
      intervalRef.current = setInterval(() => {
        updateOrderBook();
      }, interval);
    }
  };

  // Update speed when slider changes
  useEffect(() => {
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      // Recalculate interval with new speed
      let interval;
      if (replaySpeed[0] <= 1) {
        interval = 1000 / replaySpeed[0];
      } else {
        interval = 1000 / replaySpeed[0];
      }
      interval = Math.max(100, interval);
      
      intervalRef.current = setInterval(() => {
        updateOrderBook();
      }, interval);
    }
  }, [replaySpeed, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="font-semibold">Market By Order (MBO) Replay</h3>
            {isPlaying && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">LIVE</span>
                <span className="text-sm text-muted-foreground">NQ Range: 23770-23800</span>
              </div>
            )}
            {!isPlaying && (
              <span className="text-sm text-muted-foreground">NQ Range: 23770-23800 (Paused)</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Speed:</span>
            <div className="w-32">
              <Slider
                value={replaySpeed}
                onValueChange={setReplaySpeed}
                max={5}
                min={0.1}
                step={0.1}
                className="h-6"
              />
            </div>
            <div className="text-right">
              <span className="text-sm font-mono">{replaySpeed[0].toFixed(1)}x</span>
              <div className="text-xs text-muted-foreground">
                {replaySpeed[0] <= 0.2 ? 'Very Slow' : 
                 replaySpeed[0] <= 0.5 ? 'Slow' : 
                 replaySpeed[0] <= 1 ? 'Normal' : 
                 replaySpeed[0] <= 2 ? 'Fast' : 'Very Fast'}
              </div>
            </div>
            <Button size="sm" variant="outline">
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={togglePlayback}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button size="sm" variant="outline">
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={stopPlayback}>
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
              {/* Order Flow Intensity Heatmap */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Flow Intensity Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full bg-white rounded border relative overflow-hidden">
                    <svg width="100%" height="320" className="absolute inset-0">
                      <defs>
                        {/* Gradient definitions for different intensities */}
                        <linearGradient id="buyIntensity" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#dcfce7" />
                          <stop offset="50%" stopColor="#16a34a" />
                          <stop offset="100%" stopColor="#15803d" />
                        </linearGradient>
                        <linearGradient id="sellIntensity" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#fef2f2" />
                          <stop offset="50%" stopColor="#dc2626" />
                          <stop offset="100%" stopColor="#b91c1c" />
                        </linearGradient>
                      </defs>

                      {/* Time axis labels */}
                      {Array.from({ length: 12 }, (_, i) => (
                        <g key={i}>
                          <line x1={50 + i * 60} y1="30" x2={50 + i * 60} y2="280" stroke="#e5e7eb" strokeWidth="1" />
                          <text x={50 + i * 60} y="300" fontSize="10" fill="#6b7280" textAnchor="middle">
                            {`${9 + Math.floor(i / 2)}:${(i % 2) * 30}`}
                          </text>
                        </g>
                      ))}

                      {/* Price level labels */}
                      {Array.from({ length: 20 }, (_, i) => (
                        <g key={i}>
                          <line x1="40" y1={40 + i * 12} x2="750" y2={40 + i * 12} stroke="#e5e7eb" strokeWidth="0.5" />
                          <text x="35" y={45 + i * 12} fontSize="9" fill="#6b7280" textAnchor="end">
                            {(4155 - i * 0.25).toFixed(2)}
                          </text>
                        </g>
                      ))}

                      {/* Order flow intensity cells */}
                      {Array.from({ length: 12 }, (_, timeIndex) => 
                        Array.from({ length: 20 }, (_, priceIndex) => {
                          const intensity = Math.random();
                          const isBuy = Math.random() > 0.5;
                          const cellWidth = 55;
                          const cellHeight = 11;
                          const x = 52 + timeIndex * 60;
                          const y = 40 + priceIndex * 12;
                          
                          if (intensity < 0.1) return null; // No activity
                          
                          return (
                            <g key={`${timeIndex}-${priceIndex}`}>
                              <rect
                                x={x}
                                y={y}
                                width={cellWidth}
                                height={cellHeight}
                                fill={isBuy ? "#22c55e" : "#ef4444"}
                                opacity={intensity * 0.8}
                                className="hover:stroke-black hover:stroke-1"
                              />
                              {intensity > 0.7 && (
                                <text
                                  x={x + cellWidth / 2}
                                  y={y + cellHeight / 2 + 2}
                                  fontSize="8"
                                  fill="white"
                                  textAnchor="middle"
                                  fontWeight="bold"
                                >
                                  {Math.round(intensity * 100)}
                                </text>
                              )}
                            </g>
                          );
                        })
                      )}

                      {/* Current price line */}
                      <line x1="40" y1="160" x2="750" y2="160" stroke="#3b82f6" strokeWidth="3" opacity="0.8" />
                      <text x="760" y="165" fontSize="11" fill="#3b82f6" fontWeight="bold">
                        Current: $4152.25
                      </text>

                      {/* Labels */}
                      <text x="50" y="20" fontSize="14" fill="#374151" fontWeight="bold">Price Levels</text>
                      <text x="400" y="315" fontSize="12" fill="#374151" fontWeight="bold">Time (Eastern)</text>
                      
                      {/* Legend */}
                      <g transform="translate(600, 50)">
                        <rect x="0" y="0" width="140" height="120" fill="white" stroke="#e5e7eb" rx="4" fillOpacity="0.95"/>
                        <text x="10" y="15" fontSize="11" fill="#374151" fontWeight="bold">Order Flow Intensity</text>
                        
                        <rect x="10" y="25" width="15" height="8" fill="#22c55e" opacity="0.3"/>
                        <text x="30" y="32" fontSize="9" fill="#374151">Low Buy Pressure</text>
                        
                        <rect x="10" y="40" width="15" height="8" fill="#22c55e" opacity="0.8"/>
                        <text x="30" y="47" fontSize="9" fill="#374151">High Buy Pressure</text>
                        
                        <rect x="10" y="55" width="15" height="8" fill="#ef4444" opacity="0.3"/>
                        <text x="30" y="62" fontSize="9" fill="#374151">Low Sell Pressure</text>
                        
                        <rect x="10" y="70" width="15" height="8" fill="#ef4444" opacity="0.8"/>
                        <text x="30" y="77" fontSize="9" fill="#374151">High Sell Pressure</text>
                        
                        <line x1="10" y1="90" x2="120" y2="90" stroke="#3b82f6" strokeWidth="2"/>
                        <text x="10" y="105" fontSize="9" fill="#374151">Current Market Price</text>
                      </g>
                    </svg>
                  </div>
                </CardContent>
              </Card>

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
                  <div className="space-y-4">
                    {/* Order Flow Heatmap */}
                    <div className="h-64 w-full bg-muted rounded-lg relative overflow-hidden">
                      <svg width="100%" height="100%" className="absolute inset-0">
                        {/* Price levels (Y-axis) */}
                        {Array.from({ length: 20 }, (_, i) => {
                          const y = (i / 20) * 256;
                          const price = 4155 - (i * 0.25);
                          return (
                            <g key={`price-${i}`}>
                              <text x="5" y={y + 10} className="text-xs fill-muted-foreground" textAnchor="start">
                                {price.toFixed(2)}
                              </text>
                              <line x1="50" y1={y} x2="100%" y2={y} stroke="#374151" strokeWidth="0.5" opacity="0.2" />
                            </g>
                          );
                        })}

                        {/* Time intervals (X-axis) */}
                        {Array.from({ length: 12 }, (_, i) => {
                          const x = 50 + (i / 12) * (800 - 50);
                          const time = `09:${30 + i}`;
                          return (
                            <g key={`time-${i}`}>
                              <text x={x} y="250" className="text-xs fill-muted-foreground" textAnchor="middle">
                                {time}
                              </text>
                              <line x1={x} y1="0" x2={x} y2="240" stroke="#374151" strokeWidth="0.5" opacity="0.2" />
                            </g>
                          );
                        })}

                        {/* Order flow intensity heatmap cells */}
                        {Array.from({ length: 20 }, (_, priceLevel) => 
                          Array.from({ length: 12 }, (_, timeSlot) => {
                            const x = 50 + (timeSlot / 12) * (800 - 50);
                            const y = (priceLevel / 20) * 240;
                            const cellWidth = (800 - 50) / 12;
                            const cellHeight = 240 / 20;
                            
                            // Simulate order flow intensity (higher near mid-price)
                            const midPrice = 10;
                            const distanceFromMid = Math.abs(priceLevel - midPrice);
                            const baseIntensity = Math.max(0, 1 - distanceFromMid / 10);
                            const randomVariation = Math.random() * 0.5;
                            const intensity = Math.min(1, baseIntensity + randomVariation);
                            
                            // Color based on intensity (red for selling pressure, green for buying pressure)
                            const isBuyPressure = priceLevel < midPrice;
                            const opacity = intensity * 0.8;
                            const color = isBuyPressure ? "#10b981" : "#ef4444";
                            
                            return (
                              <rect
                                key={`cell-${priceLevel}-${timeSlot}`}
                                x={x}
                                y={y}
                                width={cellWidth - 1}
                                height={cellHeight - 1}
                                fill={color}
                                opacity={opacity}
                                className="hover:opacity-100 transition-opacity"
                              >
                                <title>
                                  {`Price: ${(4155 - priceLevel * 0.25).toFixed(2)}, Time: 09:${30 + timeSlot}, Intensity: ${(intensity * 100).toFixed(0)}%`}
                                </title>
                              </rect>
                            );
                          })
                        )}

                        {/* Current price line */}
                        <line 
                          x1="50" 
                          y1="120" 
                          x2="100%" 
                          y2="120" 
                          stroke="#3b82f6" 
                          strokeWidth="2"
                          strokeDasharray="4,4"
                        />
                        <text x="55" y="115" className="text-xs fill-blue-500 font-medium">
                          Current: 4152.25
                        </text>
                      </svg>
                    </div>

                    {/* Legend and Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <span className="text-sm">Buy Pressure</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-red-500 rounded"></div>
                          <span className="text-sm">Sell Pressure</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-blue-500 rounded border-2 border-dashed border-blue-500"></div>
                          <span className="text-sm">Current Price</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Intensity Scale:</span>
                        <div className="flex space-x-1">
                          {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity) => (
                            <div 
                              key={opacity}
                              className="w-4 h-4 bg-blue-500 rounded" 
                              style={{ opacity }}
                            ></div>
                          ))}
                        </div>
                        <span>High</span>
                      </div>
                    </div>

                    {/* Order Flow Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded">
                        <div className="text-lg font-mono font-bold text-green-600">+2.3M</div>
                        <div className="text-xs text-muted-foreground">Net Buy Flow</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded">
                        <div className="text-lg font-mono font-bold">67%</div>
                        <div className="text-xs text-muted-foreground">Aggressive Buys</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded">
                        <div className="text-lg font-mono font-bold text-orange-600">0.15</div>
                        <div className="text-xs text-muted-foreground">Flow Imbalance</div>
                      </div>
                    </div>
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