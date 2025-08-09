import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function LatencyLabTab() {
  return (
    <div className="flex flex-1">
      {/* Configuration Panel */}
      <div className="w-80 bg-card border-r border-border">
        <div className="p-3 border-b border-border bg-muted">
          <h4 className="font-semibold">Latency Configuration</h4>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Profile Selection */}
          <div>
            <Label className="font-medium">Latency Profile</Label>
            <Select defaultValue="gaussian">
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gaussian">Gaussian</SelectItem>
                <SelectItem value="uniform">Uniform</SelectItem>
                <SelectItem value="exponential">Exponential</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Mean Latency */}
          <div>
            <Label className="font-medium">Mean Latency</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input type="number" defaultValue="10" className="flex-1" />
              <span className="text-sm">ms</span>
            </div>
          </div>
          
          {/* Standard Deviation */}
          <div>
            <Label className="font-medium">Standard Deviation</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input type="number" defaultValue="3" className="flex-1" />
              <span className="text-sm">ms</span>
            </div>
          </div>
          
          {/* Burst Events */}
          <div>
            <Label className="font-medium">Burst Events</Label>
            <div className="space-y-2 mt-1">
              <div>
                <Label className="text-xs text-muted-foreground">Probability</Label>
                <div className="flex items-center space-x-2">
                  <Slider defaultValue={[5]} max={20} step={1} className="flex-1" />
                  <span className="text-sm font-mono w-8">5%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Min</Label>
                  <div className="flex items-center space-x-1">
                    <Input type="number" defaultValue="30" className="flex-1" />
                    <span className="text-xs">ms</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Max</Label>
                  <div className="flex items-center space-x-1">
                    <Input type="number" defaultValue="80" className="flex-1" />
                    <span className="text-xs">ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Network Conditions */}
          <div>
            <Label className="font-medium">Network Conditions</Label>
            <Select defaultValue="normal">
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="congested">Congested</SelectItem>
                <SelectItem value="unstable">Unstable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Analysis Charts */}
      <div className="flex-1 bg-card">
        <div className="p-3 border-b border-border bg-muted">
          <h4 className="font-semibold">Latency Impact Analysis</h4>
        </div>
        
        <div className="p-4 space-y-6">
          {/* PnL vs Latency */}
          <div>
            <h5 className="font-medium mb-2">PnL vs Latency Curve</h5>
            <div className="h-64 bg-muted rounded flex items-center justify-center text-muted-foreground">
              PnL vs Latency Chart
            </div>
          </div>
          
          {/* Secondary Charts */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium mb-2">Fill Ratio vs Latency</h5>
              <div className="h-48 bg-muted rounded flex items-center justify-center text-muted-foreground">
                Fill Ratio Chart
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Queue Degradation</h5>
              <div className="h-48 bg-muted rounded flex items-center justify-center text-muted-foreground">
                Queue Impact Chart
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="w-72 bg-card border-l border-border">
        <div className="p-3 border-b border-border bg-muted">
          <h4 className="font-semibold">Impact Summary</h4>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Current Configuration Impact */}
          <div>
            <h5 className="font-medium mb-3">Current Configuration</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected Latency:</span>
                <span className="font-mono">10±3 ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">PnL Impact:</span>
                <span className="font-mono text-red-600">-$456.20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fill Rate Impact:</span>
                <span className="font-mono">-8.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Queue Position Impact:</span>
                <span className="font-mono">+12.7 avg</span>
              </div>
            </div>
          </div>
          
          {/* Sensitivity Analysis */}
          <div>
            <h5 className="font-medium mb-3">Sensitivity Analysis</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">1ms increase:</span>
                <span className="font-mono">-$45.60</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">5ms increase:</span>
                <span className="font-mono">-$234.80</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">10ms increase:</span>
                <span className="font-mono">-$512.30</span>
              </div>
            </div>
          </div>
          
          {/* Optimization Suggestions */}
          <div>
            <h5 className="font-medium mb-3">Optimizations</h5>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-muted rounded">
                <div className="font-medium">Reduce Mean by 2ms</div>
                <div className="text-muted-foreground">Expected gain: +$156.40</div>
              </div>
              <div className="p-2 bg-muted rounded">
                <div className="font-medium">Reduce Burst Events</div>
                <div className="text-muted-foreground">Expected gain: +$89.20</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}