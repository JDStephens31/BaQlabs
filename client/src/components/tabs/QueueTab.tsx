import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Clock, TrendingUp, AlertCircle, CheckCircle, XCircle, Target } from "lucide-react";

export default function QueueTab() {
  const [selectedOrder, setSelectedOrder] = useState("order-001");

  // Queue position data
  const queueData = [
    { 
      orderId: "order-001", 
      side: "BUY", 
      price: 4152.25, 
      originalSize: 100, 
      remainingSize: 75,
      queuePosition: 3,
      totalAhead: 145,
      estimatedFillTime: "2.3s",
      status: "PENDING",
      submittedAt: "09:30:15.234"
    },
    { 
      orderId: "order-002", 
      side: "SELL", 
      price: 4153.00, 
      originalSize: 50, 
      remainingSize: 0,
      queuePosition: 0,
      totalAhead: 0,
      estimatedFillTime: "FILLED",
      status: "FILLED",
      submittedAt: "09:30:12.156"
    },
    { 
      orderId: "order-003", 
      side: "BUY", 
      price: 4151.75, 
      originalSize: 200, 
      remainingSize: 150,
      queuePosition: 8,
      totalAhead: 567,
      estimatedFillTime: "12.7s",
      status: "PENDING",
      submittedAt: "09:30:08.987"
    },
    { 
      orderId: "order-004", 
      side: "SELL", 
      price: 4154.50, 
      originalSize: 75, 
      remainingSize: 75,
      queuePosition: 15,
      totalAhead: 234,
      estimatedFillTime: "45.2s",
      status: "PENDING",
      submittedAt: "09:29:58.432"
    },
    { 
      orderId: "order-005", 
      side: "BUY", 
      price: 4150.00, 
      originalSize: 300, 
      remainingSize: 0,
      queuePosition: 0,
      totalAhead: 0,
      estimatedFillTime: "CANCELLED",
      status: "CANCELLED",
      submittedAt: "09:29:45.678"
    }
  ];

  // Queue statistics
  const queueStats = {
    totalOrders: 42,
    pendingOrders: 28,
    filledOrders: 12,
    cancelledOrders: 2,
    averageQueueTime: 8.4,
    fillRate: 85.7,
    averageSlippage: 0.025
  };

  // Queue position visualization data
  const generateQueueVisualization = (order: any) => {
    const positions = [];
    for (let i = 0; i <= order.queuePosition + 5; i++) {
      positions.push({
        position: i,
        size: Math.floor(Math.random() * 100) + 20,
        isOurOrder: i === order.queuePosition,
        isFilled: i < Math.max(0, order.queuePosition - 2)
      });
    }
    return positions;
  };

  const selectedOrderData = queueData.find(order => order.orderId === selectedOrder);
  const queueVisualization = selectedOrderData ? generateQueueVisualization(selectedOrderData) : [];

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Queue Position Tracking</h3>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">Export Queue Data</Button>
            <Button size="sm" variant="outline">Queue Analytics</Button>
            <Button size="sm">Optimize Orders</Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="positions" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="positions">Queue Positions</TabsTrigger>
              <TabsTrigger value="visualization">Queue Visualization</TabsTrigger>
              <TabsTrigger value="analytics">Fill Analytics</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
            </TabsList>

            <TabsContent value="positions" className="space-y-4">
              {/* Queue Statistics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{queueStats.totalOrders}</div>
                    <p className="text-xs text-muted-foreground">Active session</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fill Rate</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{queueStats.fillRate}%</div>
                    <p className="text-xs text-muted-foreground">vs target 90%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Queue Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{queueStats.averageQueueTime}s</div>
                    <p className="text-xs text-muted-foreground">Until fill</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Slippage</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{queueStats.averageSlippage}%</div>
                    <p className="text-xs text-muted-foreground">From expected</p>
                  </CardContent>
                </Card>
              </div>

              {/* Active Orders Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Orders & Queue Positions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-8 text-xs font-medium text-muted-foreground border-b pb-2">
                      <span>ORDER ID</span>
                      <span>SIDE</span>
                      <span className="text-right">PRICE</span>
                      <span className="text-right">SIZE</span>
                      <span className="text-center">QUEUE POS</span>
                      <span className="text-right">AHEAD</span>
                      <span className="text-center">EST. FILL</span>
                      <span className="text-center">STATUS</span>
                    </div>
                    {queueData.map((order) => (
                      <div 
                        key={order.orderId} 
                        className={`grid grid-cols-8 text-sm py-2 hover:bg-muted/50 rounded cursor-pointer ${
                          selectedOrder === order.orderId ? 'bg-accent' : ''
                        }`}
                        onClick={() => setSelectedOrder(order.orderId)}
                      >
                        <span className="font-mono text-xs">{order.orderId}</span>
                        <span className={`font-medium ${order.side === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                          {order.side}
                        </span>
                        <span className="font-mono text-right">{order.price.toFixed(2)}</span>
                        <span className="font-mono text-right">
                          {order.remainingSize}/{order.originalSize}
                        </span>
                        <span className="font-mono text-center">
                          {order.status === 'PENDING' ? `#${order.queuePosition}` : '-'}
                        </span>
                        <span className="font-mono text-right">
                          {order.status === 'PENDING' ? order.totalAhead.toLocaleString() : '-'}
                        </span>
                        <span className="font-mono text-center text-xs">
                          {order.estimatedFillTime}
                        </span>
                        <div className="flex justify-center">
                          <Badge 
                            variant={
                              order.status === 'FILLED' ? 'default' : 
                              order.status === 'PENDING' ? 'secondary' : 
                              'destructive'
                            }
                            className="text-xs"
                          >
                            {order.status === 'FILLED' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {order.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                            {order.status === 'CANCELLED' && <XCircle className="w-3 h-3 mr-1" />}
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visualization" className="space-y-4">
              {/* Order Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Queue Position Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {queueData.filter(order => order.status === 'PENDING').map((order) => (
                          <SelectItem key={order.orderId} value={order.orderId}>
                            {order.orderId} - {order.side} {order.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedOrderData && selectedOrderData.status === 'PENDING' && (
                    <div className="space-y-4">
                      {/* Queue Position Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Queue Progress</span>
                          <span className="font-mono">
                            Position #{selectedOrderData.queuePosition} of {selectedOrderData.queuePosition + selectedOrderData.totalAhead}
                          </span>
                        </div>
                        <Progress 
                          value={((selectedOrderData.totalAhead - selectedOrderData.queuePosition) / selectedOrderData.totalAhead) * 100} 
                          className="h-3"
                        />
                      </div>

                      {/* Visual Queue Representation */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Order Queue Visualization</h4>
                        <div className="flex space-x-1 overflow-x-auto pb-2">
                          {queueVisualization.map((item) => (
                            <div key={item.position} className="flex flex-col items-center min-w-0">
                              <div 
                                className={`w-8 h-12 rounded border-2 flex items-center justify-center text-xs font-mono ${
                                  item.isOurOrder 
                                    ? 'bg-blue-500 border-blue-600 text-white' 
                                    : item.isFilled 
                                      ? 'bg-green-100 border-green-300 text-green-700' 
                                      : 'bg-gray-100 border-gray-300 text-gray-600'
                                }`}
                              >
                                {item.size}
                              </div>
                              <span className="text-xs mt-1">
                                {item.isOurOrder ? 'YOU' : `#${item.position}`}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Each block represents an order in the queue. Your order is highlighted in blue.
                        </p>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Order Details</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Submitted:</span>
                              <span className="font-mono">{selectedOrderData.submittedAt}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Original Size:</span>
                              <span className="font-mono">{selectedOrderData.originalSize}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Remaining:</span>
                              <span className="font-mono">{selectedOrderData.remainingSize}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Queue Status</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Position:</span>
                              <span className="font-mono">#{selectedOrderData.queuePosition}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Ahead:</span>
                              <span className="font-mono">{selectedOrderData.totalAhead}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Est. Fill:</span>
                              <span className="font-mono">{selectedOrderData.estimatedFillTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedOrderData && selectedOrderData.status !== 'PENDING' && (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      <div className="text-center">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                        <p>Selected order is not in queue</p>
                        <p className="text-sm">Status: {selectedOrderData.status}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {/* Fill Rate Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Fill Rate Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 w-full bg-muted rounded-lg relative overflow-hidden">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      {/* Grid lines */}
                      {[0, 1, 2, 3].map(i => (
                        <line key={`h-${i}`} x1="0" y1={i * 48} x2="100%" y2={i * 48} stroke="#374151" strokeWidth="0.5" opacity="0.3" />
                      ))}

                      {/* Fill rate over time */}
                      <path
                        d={`M 0 100 ${Array.from({ length: 50 }, (_, i) => {
                          const x = (i / 50) * 800;
                          const y = 100 - (Math.random() * 20 + 70); // 70-90% fill rate
                          return `L ${x} ${y}`;
                        }).join(' ')}`}
                        stroke="#10b981"
                        strokeWidth="2"
                        fill="none"
                      />

                      {/* Target line */}
                      <line x1="0" y1="48" x2="100%" y2="48" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" />
                      <text x="10" y="45" className="text-xs fill-red-600">Target 90%</text>
                    </svg>
                  </div>
                </CardContent>
              </Card>

              {/* Queue Performance Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Queue Time Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { range: "0-5s", count: 18, percentage: 45 },
                        { range: "5-15s", count: 12, percentage: 30 },
                        { range: "15-30s", count: 6, percentage: 15 },
                        { range: "30s+", count: 4, percentage: 10 }
                      ].map((item) => (
                        <div key={item.range} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{item.range}</span>
                            <span className="font-mono">{item.count} orders ({item.percentage}%)</span>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Fill Quality Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Immediate Fills</span>
                      <span className="font-mono text-sm">23%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Partial Fills</span>
                      <span className="font-mono text-sm">31%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Queue Jumps</span>
                      <span className="font-mono text-sm">8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Price Improvements</span>
                      <span className="font-mono text-sm text-green-600">12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Slippage</span>
                      <span className="font-mono text-sm">0.025%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Timeout Rate</span>
                      <span className="font-mono text-sm text-red-600">4.8%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-4">
              {/* Queue Optimization Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Queue Optimization Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">Optimal Price Level Strategy</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Place orders at price levels with highest fill probability. Current success rate: 89%
                        </div>
                        <div className="text-xs text-green-600 mt-1">+12% fill rate improvement</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">Order Size Optimization</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Break large orders into smaller chunks to improve queue position and reduce market impact
                        </div>
                        <div className="text-xs text-blue-600 mt-1">Recommended max size: 75 contracts</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">Timing Optimization</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Avoid high-activity periods (first 10 minutes) for better queue positions
                        </div>
                        <div className="text-xs text-yellow-600 mt-1">-25% average queue time</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <Target className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">Smart Order Routing</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Route orders to venues with shorter queue times and better fill rates
                        </div>
                        <div className="text-xs text-purple-600 mt-1">Consider dark pools for large orders</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Queue Position Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle>Queue Position Prediction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* AI Prediction Chart */}
                    <div className="h-64 w-full bg-white rounded border">
                      <svg width="100%" height="256" className="overflow-visible">
                        <defs>
                          <linearGradient id="predictionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
                          </linearGradient>
                          <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05"/>
                          </linearGradient>
                        </defs>
                        
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4, 5].map(i => (
                          <g key={i}>
                            <line 
                              x1="60" 
                              y1={40 + i * 35} 
                              x2="500" 
                              y2={40 + i * 35} 
                              stroke="#e5e7eb" 
                              strokeWidth="1"
                            />
                            <text x="45" y={45 + i * 35} fontSize="10" fill="#6b7280" textAnchor="end">
                              {Math.round((5 - i) * 20)}
                            </text>
                          </g>
                        ))}
                        
                        {/* Time axis */}
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                          <g key={i}>
                            <line 
                              x1={60 + i * 55} 
                              y1="40" 
                              x2={60 + i * 55} 
                              y2="215" 
                              stroke="#e5e7eb" 
                              strokeWidth="1"
                            />
                            <text x={60 + i * 55} y="235" fontSize="10" fill="#6b7280" textAnchor="middle">
                              {i * 5}s
                            </text>
                          </g>
                        ))}
                        
                        {/* Confidence band */}
                        <path 
                          d="M60,120 Q115,115 170,110 T280,105 Q335,108 390,112 T500,120 L500,140 Q445,138 390,135 T280,130 Q225,132 170,135 T60,140 Z" 
                          fill="url(#confidenceGradient)" 
                          stroke="none"
                        />
                        
                        {/* Historical data line */}
                        <path 
                          d="M60,130 Q80,125 100,128 Q120,132 140,128 Q160,125 180,130 Q200,135 220,132 Q240,128 260,130" 
                          fill="none" 
                          stroke="#6b7280" 
                          strokeWidth="2"
                          strokeDasharray="3,3"
                        />
                        
                        {/* AI prediction line */}
                        <path 
                          d="M260,130 Q280,125 300,118 Q320,110 340,108 Q360,106 380,109 Q400,112 420,115 Q440,118 460,120 Q480,122 500,125" 
                          fill="none" 
                          stroke="#3b82f6" 
                          strokeWidth="3"
                        />
                        
                        {/* Current position marker */}
                        <circle cx="260" cy="130" r="4" fill="#ef4444" stroke="white" strokeWidth="2"/>
                        <text x="260" y="150" fontSize="10" fill="#ef4444" textAnchor="middle" fontWeight="bold">
                          Current: #47
                        </text>
                        
                        {/* Prediction points */}
                        {[
                          { x: 340, y: 108, label: "#25", time: "10s" },
                          { x: 420, y: 115, label: "#18", time: "25s" },
                          { x: 500, y: 125, label: "#12", time: "40s" }
                        ].map((point, i) => (
                          <g key={i}>
                            <circle cx={point.x} cy={point.y} r="3" fill="#3b82f6" stroke="white" strokeWidth="1"/>
                            <text x={point.x} y={point.y - 8} fontSize="9" fill="#3b82f6" textAnchor="middle" fontWeight="bold">
                              {point.label}
                            </text>
                          </g>
                        ))}
                        
                        {/* Labels */}
                        <text x="60" y="25" fontSize="12" fill="#374151" fontWeight="bold">Queue Position</text>
                        <text x="280" y="255" fontSize="12" fill="#374151" fontWeight="bold">Time Horizon</text>
                        
                        {/* Legend */}
                        <g transform="translate(350, 50)">
                          <rect x="0" y="0" width="140" height="80" fill="white" stroke="#e5e7eb" rx="4"/>
                          <line x1="10" y1="15" x2="25" y2="15" stroke="#6b7280" strokeWidth="2" strokeDasharray="3,3"/>
                          <text x="30" y="18" fontSize="9" fill="#374151">Historical</text>
                          <line x1="10" y1="30" x2="25" y2="30" stroke="#3b82f6" strokeWidth="3"/>
                          <text x="30" y="33" fontSize="9" fill="#374151">AI Prediction</text>
                          <rect x="10" y="40" width="15" height="8" fill="url(#confidenceGradient)"/>
                          <text x="30" y="47" fontSize="9" fill="#374151">95% Confidence</text>
                          <circle cx="17" cy="60" r="3" fill="#ef4444"/>
                          <text x="30" y="63" fontSize="9" fill="#374151">Current Position</text>
                        </g>
                      </svg>
                    </div>

                    {/* AI Model Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-lg font-bold text-blue-700">94.2%</div>
                        <div className="text-xs text-blue-600">Prediction Accuracy</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-lg font-bold text-green-700">2.3s</div>
                        <div className="text-xs text-green-600">Avg Prediction Time</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-lg font-bold text-purple-700">87.1%</div>
                        <div className="text-xs text-purple-600">Model Confidence</div>
                      </div>
                    </div>

                    {/* Feature Importance */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Key Prediction Features</h4>
                      {[
                        { name: "Order Book Imbalance", value: 0.28, color: "#3b82f6" },
                        { name: "Recent Fill Rate", value: 0.24, color: "#10b981" },
                        { name: "Time in Queue", value: 0.19, color: "#f59e0b" },
                        { name: "Spread Dynamics", value: 0.16, color: "#ef4444" },
                        { name: "Volume Profile", value: 0.13, color: "#8b5cf6" }
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <div className="w-20 text-xs text-gray-600 truncate">{feature.name}</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${feature.value * 100}%`, 
                                backgroundColor: feature.color 
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 w-8 text-right">
                            {Math.round(feature.value * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Real-time Alerts */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">AI Alerts</h4>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 p-2 bg-green-50 rounded border border-green-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-800">High probability of advancement in next 15s</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-xs text-yellow-800">Unusual order book pattern detected</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded border border-blue-200">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-xs text-blue-800">Model confidence above 85% threshold</span>
                        </div>
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