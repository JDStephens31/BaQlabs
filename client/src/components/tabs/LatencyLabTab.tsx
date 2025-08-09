import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Clock, Zap, Target, TrendingUp, AlertTriangle } from "lucide-react";

export default function LatencyLabTab() {
  const [latencyProfile, setLatencyProfile] = useState("gaussian");
  const [meanLatency, setMeanLatency] = useState([150]);
  const [latencyStdDev, setLatencyStdDev] = useState([25]);
  const [networkJitter, setNetworkJitter] = useState([10]);
  const [simulationRuns, setSimulationRuns] = useState(1000);

  // Latency distribution data for visualization
  const generateLatencyDistribution = () => {
    const data = [];
    const mean = meanLatency[0];
    const stdDev = latencyStdDev[0];
    
    for (let i = 0; i < 200; i++) {
      const x = i * 2; // 0 to 400 microseconds
      let y;
      
      if (latencyProfile === "gaussian") {
        y = Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)) / (stdDev * Math.sqrt(2 * Math.PI));
      } else if (latencyProfile === "exponential") {
        const lambda = 1 / mean;
        y = lambda * Math.exp(-lambda * x);
      } else {
        // Uniform distribution
        y = x >= (mean - stdDev) && x <= (mean + stdDev) ? 1 / (2 * stdDev) : 0;
      }
      
      data.push({ x, y: y * 1000 }); // Scale for visibility
    }
    return data;
  };

  const latencyData = generateLatencyDistribution();

  // Percentile data
  const latencyPercentiles = [
    { percentile: "P50", value: meanLatency[0] },
    { percentile: "P75", value: meanLatency[0] + latencyStdDev[0] * 0.67 },
    { percentile: "P90", value: meanLatency[0] + latencyStdDev[0] * 1.28 },
    { percentile: "P95", value: meanLatency[0] + latencyStdDev[0] * 1.64 },
    { percentile: "P99", value: meanLatency[0] + latencyStdDev[0] * 2.33 },
    { percentile: "P99.9", value: meanLatency[0] + latencyStdDev[0] * 3.09 }
  ];

  // Execution quality metrics
  const executionMetrics = {
    fillRate: 94.2,
    averageSlippage: 0.12,
    marketImpact: 0.08,
    timingRisk: 2.3,
    implementationShortfall: 1.7
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Latency Modeling & Analysis</h3>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">Import Profile</Button>
            <Button size="sm" variant="outline">Export Settings</Button>
            <Button size="sm">Run Simulation</Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="distribution" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="network">Network Model</TabsTrigger>
              <TabsTrigger value="execution">Execution Impact</TabsTrigger>
              <TabsTrigger value="calibration">Calibration</TabsTrigger>
            </TabsList>

            <TabsContent value="distribution" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Latency Configuration */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Latency Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm">Distribution Type</Label>
                        <Select value={latencyProfile} onValueChange={setLatencyProfile}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gaussian">Gaussian (Normal)</SelectItem>
                            <SelectItem value="exponential">Exponential</SelectItem>
                            <SelectItem value="uniform">Uniform</SelectItem>
                            <SelectItem value="weibull">Weibull</SelectItem>
                            <SelectItem value="lognormal">Log-Normal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm">Mean Latency: {meanLatency[0]}μs</Label>
                        <Slider
                          value={meanLatency}
                          onValueChange={setMeanLatency}
                          max={500}
                          min={50}
                          step={5}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-sm">Std Deviation: {latencyStdDev[0]}μs</Label>
                        <Slider
                          value={latencyStdDev}
                          onValueChange={setLatencyStdDev}
                          max={100}
                          min={5}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-sm">Network Jitter: {networkJitter[0]}μs</Label>
                        <Slider
                          value={networkJitter}
                          onValueChange={setNetworkJitter}
                          max={50}
                          min={0}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="queue-delays" />
                          <Label htmlFor="queue-delays" className="text-sm">Model queue delays</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="processing-delays" />
                          <Label htmlFor="processing-delays" className="text-sm">Include processing delays</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="market-hours" />
                          <Label htmlFor="market-hours" className="text-sm">Market hours variations</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Latency Percentiles */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Latency Percentiles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {latencyPercentiles.map((item) => (
                          <div key={item.percentile} className="flex justify-between items-center">
                            <span className="text-sm font-medium">{item.percentile}</span>
                            <span className="font-mono text-sm">{item.value.toFixed(1)}μs</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Latency Distribution Visualization */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Latency Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 w-full bg-muted rounded-lg relative overflow-hidden">
                        <svg width="100%" height="100%" className="absolute inset-0">
                          <defs>
                            <linearGradient id="latencyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.6 }} />
                              <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.1 }} />
                            </linearGradient>
                          </defs>

                          {/* Grid lines */}
                          {[0, 1, 2, 3, 4].map(i => (
                            <line key={`h-${i}`} x1="0" y1={i * 60} x2="100%" y2={i * 60} stroke="#374151" strokeWidth="0.5" opacity="0.3" />
                          ))}
                          {[0, 1, 2, 3, 4, 5].map(i => (
                            <line key={`v-${i}`} x1={`${i * 20}%`} y1="0" x2={`${i * 20}%`} y2="100%" stroke="#374151" strokeWidth="0.5" opacity="0.3" />
                          ))}

                          {/* Distribution curve */}
                          <path
                            d={`M 0 ${300 - latencyData[0].y} ${latencyData.map((point, i) => 
                              `L ${(point.x / 400) * 800} ${300 - point.y * 50}`
                            ).join(' ')}`}
                            stroke="#3b82f6"
                            strokeWidth="2"
                            fill="none"
                          />

                          {/* Fill under curve */}
                          <path
                            d={`M 0 300 ${latencyData.map((point, i) => 
                              `L ${(point.x / 400) * 800} ${300 - point.y * 50}`
                            ).join(' ')} L 800 300 Z`}
                            fill="url(#latencyGradient)"
                          />

                          {/* Percentile markers */}
                          {[50, 95, 99].map(p => {
                            const percentile = latencyPercentiles.find(item => item.percentile === `P${p}`);
                            if (percentile) {
                              const x = (percentile.value / 400) * 800;
                              return (
                                <g key={p}>
                                  <line x1={x} y1="0" x2={x} y2="300" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" />
                                  <text x={x + 5} y="20" className="text-xs fill-red-600">P{p}</text>
                                </g>
                              );
                            }
                            return null;
                          })}

                          {/* Axis labels */}
                          <text x="10" y="20" className="text-xs fill-current">Probability Density</text>
                          <text x="750" y="290" className="text-xs fill-current">Latency (μs)</text>
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="network" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Network Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle>Network Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Venue Latency</Label>
                        <Input type="number" defaultValue="85" className="mt-1" />
                        <p className="text-xs text-muted-foreground mt-1">Microseconds to exchange</p>
                      </div>
                      <div>
                        <Label className="text-sm">Co-location Latency</Label>
                        <Input type="number" defaultValue="12" className="mt-1" />
                        <p className="text-xs text-muted-foreground mt-1">Rack-to-rack latency</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Processing Time</Label>
                        <Input type="number" defaultValue="35" className="mt-1" />
                        <p className="text-xs text-muted-foreground mt-1">Order processing delay</p>
                      </div>
                      <div>
                        <Label className="text-sm">Serialization</Label>
                        <Input type="number" defaultValue="8" className="mt-1" />
                        <p className="text-xs text-muted-foreground mt-1">Message encoding time</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">Network Provider</Label>
                      <Select defaultValue="premium">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="premium">Premium (Microwave)</SelectItem>
                          <SelectItem value="fiber">Fiber Optic</SelectItem>
                          <SelectItem value="satellite">Satellite</SelectItem>
                          <SelectItem value="internet">Internet VPN</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="burst-traffic" defaultChecked />
                        <Label htmlFor="burst-traffic" className="text-sm">Model burst traffic</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="congestion" defaultChecked />
                        <Label htmlFor="congestion" className="text-sm">Network congestion effects</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="packet-loss" />
                        <Label htmlFor="packet-loss" className="text-sm">Packet loss simulation</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Real-time Monitoring */}
                <Card>
                  <CardHeader>
                    <CardTitle>Real-time Latency Monitor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Current Latency</span>
                        <span className="font-mono text-lg text-green-600">147μs</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Last 1min avg</span>
                          <span className="font-mono">152μs</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last 5min avg</span>
                          <span className="font-mono">148μs</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last 1hr avg</span>
                          <span className="font-mono">151μs</span>
                        </div>
                      </div>

                      <div className="h-32 w-full bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-muted-foreground text-sm">Real-time latency chart</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Optimal (&lt;150μs)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Warning (150-200μs)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Critical (&gt;200μs)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          <span>Timeout (&gt;1ms)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="execution" className="space-y-4">
              {/* Execution Quality Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fill Rate</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{executionMetrics.fillRate}%</div>
                    <Progress value={executionMetrics.fillRate} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Slippage</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{executionMetrics.averageSlippage} bps</div>
                    <p className="text-xs text-muted-foreground">vs benchmark 0.15 bps</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Market Impact</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{executionMetrics.marketImpact} bps</div>
                    <p className="text-xs text-muted-foreground">Linear + sqrt impact</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Timing Risk</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{executionMetrics.timingRisk} bps</div>
                    <p className="text-xs text-muted-foreground">Due to latency variance</p>
                  </CardContent>
                </Card>
              </div>

              {/* Latency Impact Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Latency Impact on Execution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Latency vs Fill Rate</h4>
                      <div className="h-48 w-full bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-muted-foreground text-sm">Latency impact on fill rates</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Latency vs Slippage</h4>
                      <div className="h-48 w-full bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-muted-foreground text-sm">Latency impact on slippage</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Optimization Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Optimization Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium text-sm">Upgrade to premium network</div>
                        <div className="text-xs text-muted-foreground">Expected 20% latency reduction, +2.1% fill rate improvement</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium text-sm">Optimize order batching</div>
                        <div className="text-xs text-muted-foreground">Reduce processing overhead by 15-25 microseconds</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium text-sm">Review venue selection</div>
                        <div className="text-xs text-muted-foreground">Consider dark pools for large orders during high volatility</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calibration" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Historical Calibration */}
                <Card>
                  <CardHeader>
                    <CardTitle>Model Calibration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm">Calibration Dataset</Label>
                      <Select defaultValue="last-week">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last-week">Last 7 days</SelectItem>
                          <SelectItem value="last-month">Last 30 days</SelectItem>
                          <SelectItem value="custom">Custom range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm">Simulation Runs</Label>
                      <Input 
                        type="number" 
                        value={simulationRuns}
                        onChange={(e) => setSimulationRuns(parseInt(e.target.value))}
                        className="mt-1" 
                      />
                      <p className="text-xs text-muted-foreground mt-1">Higher runs = better accuracy</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="market-regime" defaultChecked />
                        <Label htmlFor="market-regime" className="text-sm">Market regime detection</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="intraday-patterns" defaultChecked />
                        <Label htmlFor="intraday-patterns" className="text-sm">Intraday patterns</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="volatility-clustering" />
                        <Label htmlFor="volatility-clustering" className="text-sm">Volatility clustering</Label>
                      </div>
                    </div>

                    <Button className="w-full">Run Calibration</Button>
                  </CardContent>
                </Card>

                {/* Calibration Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Calibration Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Model Fit (R²)</span>
                        <span className="font-mono font-bold">0.847</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Calibration RMSE</span>
                        <span className="font-mono">12.3μs</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Kolmogorov-Smirnov</span>
                        <span className="font-mono">0.032</span>
                      </div>

                      <div className="pt-2 border-t">
                        <h4 className="font-medium text-sm mb-2">Parameter Estimates</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Mean (μ)</span>
                            <span className="font-mono">148.7μs</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Std Dev (σ)</span>
                            <span className="font-mono">23.1μs</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Skewness</span>
                            <span className="font-mono">0.42</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Kurtosis</span>
                            <span className="font-mono">3.18</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <h4 className="font-medium text-sm mb-2">Confidence Intervals</h4>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Mean (95% CI)</span>
                            <span className="font-mono">[146.2, 151.2]μs</span>
                          </div>
                          <div className="flex justify-between">
                            <span>P95 (95% CI)</span>
                            <span className="font-mono">[185.3, 192.7]μs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}