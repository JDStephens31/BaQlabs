import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RightInspector() {
  return (
    <div className="w-72 bg-card border-l border-border flex flex-col">
      <div className="p-3 border-b border-border bg-muted">
        <h4 className="font-semibold">Inspector</h4>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Current Context */}
          <div>
            <h5 className="font-medium mb-3">Current Context</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mode:</span>
                <span className="font-mono">BACKTESTING</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-mono text-green-600">READY</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Quality:</span>
                <span className="font-mono">98.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Compile Status:</span>
                <span className="font-mono text-green-600">✓ VALID</span>
              </div>
            </div>
          </div>

          {/* Last Trade Details */}
          <div>
            <h5 className="font-medium mb-3">Last Trade Details</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Side:</span>
                <span className="font-mono">BUY</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-mono">20004.75</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size:</span>
                <span className="font-mono">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fill Time:</span>
                <span className="font-mono">09:31:12.490</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Queue Rank:</span>
                <span className="font-mono">34 → 0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slippage:</span>
                <span className="font-mono">-0.25</span>
              </div>
            </div>
          </div>

          {/* Risk Metrics */}
          <div>
            <h5 className="font-medium mb-3">Risk Metrics</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current PnL:</span>
                <span className="font-mono text-green-600">+$2,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Drawdown:</span>
                <span className="font-mono">-$1,240</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position:</span>
                <span className="font-mono">+3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Win Rate:</span>
                <span className="font-mono">54.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit Factor:</span>
                <span className="font-mono">1.62</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sharpe Ratio:</span>
                <span className="font-mono">2.1</span>
              </div>
            </div>
          </div>

          {/* Order Parameters */}
          <div>
            <h5 className="font-medium mb-3">Order Parameters</h5>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Order Type</Label>
                <Select defaultValue="limit">
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="limit">LIMIT</SelectItem>
                    <SelectItem value="market">MARKET</SelectItem>
                    <SelectItem value="stop">STOP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Time in Force</Label>
                <Select defaultValue="ioc">
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ioc">IOC</SelectItem>
                    <SelectItem value="fok">FOK</SelectItem>
                    <SelectItem value="day">DAY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Min Fill Size</Label>
                <Input type="number" defaultValue="1" className="mt-1" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h5 className="font-medium mb-3">Quick Actions</h5>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Export Results
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Save Strategy
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Clone Experiment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                View Full Report
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
