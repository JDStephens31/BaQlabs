import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RightInspector() {
  return (
    <div className="w-80 bg-card border-l border-border">
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold text-sm">Inspector</h3>
      </div>
      
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {/* Current Context */}
          <div>
            <h4 className="font-medium text-sm mb-3">Current Context</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Project:</span>
                <span className="font-mono">BACKTESTING</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-600 font-mono">READY</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Quality:</span>
                <span className="font-mono">98.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Compile Status:</span>
                <span className="text-green-600 font-mono">✓ VALID</span>
              </div>
            </div>
          </div>

          {/* Last Trade Details */}
          <div>
            <h4 className="font-medium text-sm mb-3">Last Trade Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Side:</span>
                <span className="text-blue-600 font-mono">BUY</span>
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
            <h4 className="font-medium text-sm mb-3">Risk Metrics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current PnL:</span>
                <span className="text-green-600 font-mono">+$2,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Drawdown:</span>
                <span className="text-red-600 font-mono">-$1,240</span>
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
            <h4 className="font-medium text-sm mb-3">Order Parameters</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Order Type</label>
                <Select defaultValue="limit">
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="limit">LIMIT</SelectItem>
                    <SelectItem value="market">MARKET</SelectItem>
                    <SelectItem value="stop">STOP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Position:</span>
                  <span className="font-mono">±10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Limit:</span>
                  <span className="font-mono">$5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commission:</span>
                  <span className="font-mono">$0.25/side</span>
                </div>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div>
            <h4 className="font-medium text-sm mb-3">Session Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Time:</span>
                <span className="font-mono">06:00 AM PST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End Time:</span>
                <span className="font-mono">03:30 PM PST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timezone:</span>
                <span className="font-mono">PST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Events:</span>
                <span className="font-mono">2.4M</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}