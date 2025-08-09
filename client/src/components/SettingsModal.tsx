import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Settings, DollarSign, Clock, Shield, Zap } from "lucide-react";

interface SettingsModalProps {
  children: React.ReactNode;
}

export default function SettingsModal({ children }: SettingsModalProps) {
  const [takeProfitPercent, setTakeProfitPercent] = useState([2.5]);
  const [stopLossPercent, setStopLossPercent] = useState([1.5]);
  const [maxPositionSize, setMaxPositionSize] = useState([100000]);
  const [riskPerTrade, setRiskPerTrade] = useState([1.0]);
  const [timeoutSeconds, setTimeoutSeconds] = useState([30]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Trading Settings</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="risk" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="risk">Risk Management</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
            <TabsTrigger value="position">Position Sizing</TabsTrigger>
            <TabsTrigger value="timing">Timing</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto max-h-[60vh] pr-2">
            <TabsContent value="risk" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Risk Parameters</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Take Profit */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Take Profit</Label>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono">{takeProfitPercent[0]}%</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    <Slider
                      value={takeProfitPercent}
                      onValueChange={setTakeProfitPercent}
                      max={10}
                      min={0.1}
                      step={0.1}
                      className="mt-2"
                    />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs">Fixed Amount ($)</Label>
                        <Input type="number" placeholder="500" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Trailing Stop</Label>
                        <Select defaultValue="disabled">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="disabled">Disabled</SelectItem>
                            <SelectItem value="0.5">0.5% Trail</SelectItem>
                            <SelectItem value="1.0">1.0% Trail</SelectItem>
                            <SelectItem value="1.5">1.5% Trail</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Stop Loss */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Stop Loss</Label>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono">{stopLossPercent[0]}%</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    <Slider
                      value={stopLossPercent}
                      onValueChange={setStopLossPercent}
                      max={5}
                      min={0.1}
                      step={0.1}
                      className="mt-2"
                    />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs">Fixed Amount ($)</Label>
                        <Input type="number" placeholder="300" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Stop Type</Label>
                        <Select defaultValue="market">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="market">Market Stop</SelectItem>
                            <SelectItem value="limit">Stop Limit</SelectItem>
                            <SelectItem value="trailing">Trailing Stop</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Risk Per Trade */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Risk Per Trade</Label>
                      <span className="text-sm font-mono">{riskPerTrade[0]}% of account</span>
                    </div>
                    <Slider
                      value={riskPerTrade}
                      onValueChange={setRiskPerTrade}
                      max={5}
                      min={0.1}
                      step={0.1}
                      className="mt-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      Maximum percentage of account balance risked per trade
                    </div>
                  </div>

                  {/* Additional Risk Controls */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Additional Controls</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="max-daily-loss" className="text-sm">Max Daily Loss Limit</Label>
                        <div className="flex items-center space-x-2">
                          <Input type="number" placeholder="2000" className="w-20 h-8" />
                          <Switch id="max-daily-loss" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="max-drawdown" className="text-sm">Max Drawdown Limit</Label>
                        <div className="flex items-center space-x-2">
                          <Input type="number" placeholder="5" className="w-20 h-8" />
                          <span className="text-xs">%</span>
                          <Switch id="max-drawdown" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="correlation-limit" className="text-sm">Position Correlation Limit</Label>
                        <div className="flex items-center space-x-2">
                          <Input type="number" placeholder="0.7" className="w-20 h-8" />
                          <Switch id="correlation-limit" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="execution" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Execution Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Types */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Default Order Types</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Entry Orders</Label>
                        <Select defaultValue="limit">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="market">Market Order</SelectItem>
                            <SelectItem value="limit">Limit Order</SelectItem>
                            <SelectItem value="stop-limit">Stop Limit</SelectItem>
                            <SelectItem value="iceberg">Iceberg Order</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Exit Orders</Label>
                        <Select defaultValue="market">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="market">Market Order</SelectItem>
                            <SelectItem value="limit">Limit Order</SelectItem>
                            <SelectItem value="stop-limit">Stop Limit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Slippage Settings */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Slippage Modeling</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Market Impact (%)</Label>
                        <Input type="number" defaultValue="0.02" step="0.01" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Bid-Ask Spread (%)</Label>
                        <Input type="number" defaultValue="0.01" step="0.01" className="mt-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dynamic-slippage" defaultChecked />
                        <Label htmlFor="dynamic-slippage" className="text-sm">Dynamic slippage based on volatility</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="liquidity-impact" defaultChecked />
                        <Label htmlFor="liquidity-impact" className="text-sm">Model liquidity impact</Label>
                      </div>
                    </div>
                  </div>

                  {/* Fill Probability */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Fill Probability</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs">Aggressive (%)</Label>
                        <Input type="number" defaultValue="95" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Passive (%)</Label>
                        <Input type="number" defaultValue="70" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Hidden (%)</Label>
                        <Input type="number" defaultValue="85" className="mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* Venue Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Venue Preferences</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Primary Exchange</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Dark Pools</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">ECNs</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="position" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Position Sizing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Maximum Position Size */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Maximum Position Size</Label>
                      <span className="text-sm font-mono">${maxPositionSize[0].toLocaleString()}</span>
                    </div>
                    <Slider
                      value={maxPositionSize}
                      onValueChange={setMaxPositionSize}
                      max={1000000}
                      min={1000}
                      step={1000}
                      className="mt-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      Maximum dollar value for a single position
                    </div>
                  </div>

                  {/* Position Sizing Method */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Sizing Method</Label>
                    <Select defaultValue="fixed-risk">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed-risk">Fixed Risk %</SelectItem>
                        <SelectItem value="fixed-dollar">Fixed Dollar Amount</SelectItem>
                        <SelectItem value="kelly">Kelly Criterion</SelectItem>
                        <SelectItem value="volatility-adjusted">Volatility Adjusted</SelectItem>
                        <SelectItem value="equal-weight">Equal Weight</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Kelly Criterion Settings */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Kelly Criterion (when enabled)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Win Rate (%)</Label>
                        <Input type="number" defaultValue="65" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Risk/Reward Ratio</Label>
                        <Input type="number" defaultValue="1.5" step="0.1" className="mt-1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Kelly Fraction</Label>
                        <Input type="number" defaultValue="0.25" step="0.05" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Max Kelly %</Label>
                        <Input type="number" defaultValue="25" className="mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Constraints */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Portfolio Constraints</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Max Positions</Label>
                        <Input type="number" defaultValue="10" className="w-20" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Sector Concentration Limit (%)</Label>
                        <Input type="number" defaultValue="30" className="w-20" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Single Asset Limit (%)</Label>
                        <Input type="number" defaultValue="10" className="w-20" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timing" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Timing Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Timeouts */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Order Timeout</Label>
                      <span className="text-sm font-mono">{timeoutSeconds[0]} seconds</span>
                    </div>
                    <Slider
                      value={timeoutSeconds}
                      onValueChange={setTimeoutSeconds}
                      max={300}
                      min={5}
                      step={5}
                      className="mt-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      Automatically cancel unfilled orders after this time
                    </div>
                  </div>

                  {/* Trading Session */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Trading Session</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Start Time</Label>
                        <Input type="time" defaultValue="09:30" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">End Time</Label>
                        <Input type="time" defaultValue="16:00" className="mt-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="premarket" />
                        <Label htmlFor="premarket" className="text-sm">Trade in pre-market (04:00-09:30)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="afterhours" />
                        <Label htmlFor="afterhours" className="text-sm">Trade after hours (16:00-20:00)</Label>
                      </div>
                    </div>
                  </div>

                  {/* Cool-down Periods */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Cool-down Periods</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">After Loss (minutes)</Label>
                        <Input type="number" defaultValue="5" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">After Win (minutes)</Label>
                        <Input type="number" defaultValue="2" className="mt-1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Daily Limit Hit (hours)</Label>
                        <Input type="number" defaultValue="24" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Between Same Asset (seconds)</Label>
                        <Input type="number" defaultValue="30" className="mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* Market Conditions */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Market Condition Filters</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">High Volatility Threshold</Label>
                        <div className="flex items-center space-x-2">
                          <Input type="number" defaultValue="2.5" className="w-20" />
                          <span className="text-xs">σ</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="halt-high-vol" defaultChecked />
                        <Label htmlFor="halt-high-vol" className="text-sm">Halt trading during high volatility</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="halt-low-liquidity" defaultChecked />
                        <Label htmlFor="halt-low-liquidity" className="text-sm">Halt during low liquidity periods</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Advanced Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Algorithm Parameters */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Algorithm Parameters</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Signal Confidence Threshold</Label>
                        <Input type="number" defaultValue="0.75" step="0.05" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Noise Filter Level</Label>
                        <Input type="number" defaultValue="0.1" step="0.01" className="mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* Data Sources */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Data Sources</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Level II Market Data</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">News Sentiment</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Options Flow</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Social Media Sentiment</Label>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  {/* Performance Optimization */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Performance</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">CPU Threads</Label>
                        <Input type="number" defaultValue="4" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Memory Buffer (MB)</Label>
                        <Input type="number" defaultValue="512" className="mt-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="gpu-acceleration" />
                        <Label htmlFor="gpu-acceleration" className="text-sm">GPU acceleration (if available)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="cache-optimization" defaultChecked />
                        <Label htmlFor="cache-optimization" className="text-sm">Cache optimization</Label>
                      </div>
                    </div>
                  </div>

                  {/* Logging & Debugging */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Logging</Label>
                    <div>
                      <Label className="text-xs">Log Level</Label>
                      <Select defaultValue="info">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debug">Debug</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="trade-logging" defaultChecked />
                        <Label htmlFor="trade-logging" className="text-sm">Log all trades</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="signal-logging" />
                        <Label htmlFor="signal-logging" className="text-sm">Log trading signals</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="performance-metrics" defaultChecked />
                        <Label htmlFor="performance-metrics" className="text-sm">Performance metrics</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline">Reset to Defaults</Button>
            <Button variant="outline">Save Profile</Button>
            <Button>Apply Settings</Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}