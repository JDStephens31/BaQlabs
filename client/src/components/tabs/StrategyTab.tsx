import CodeEditor from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StrategyTab() {
  const sampleStrategy = `// Strategy: Maker Queue Aware
// Author: Trading Team
// Last Modified: 2025-01-15 14:25 PST

function onMarketData(book, trades) {
  const imbalance = calculateImbalance(book);
  const churnRising = isChurnRising(trades);
  
  if (imbalance > 0.6 && churnRising) {
    joinBid(book.bestBid, 1);
  } else if (imbalance < -0.6 && churnRising) {
    joinAsk(book.bestAsk, 1);
  }
  
  // Risk management
  if (getPosition() > maxPosition) {
    reducePosition();
  }
}

function calculateImbalance(book) {
  const bidSize = book.bids.reduce((sum, level) => sum + 
    level.size, 0);
  const askSize = book.asks.reduce((sum, level) => sum + 
    level.size, 0);
  
  return (bidSize - askSize) / (bidSize + askSize);
}`;

  return (
    <div className="flex flex-1">
      {/* Code Editor */}
      <div className="flex-1 bg-card border-r border-border">
        <div className="p-3 border-b border-border bg-muted flex justify-between items-center">
          <h4 className="font-semibold">Strategy Code</h4>
          <div className="space-x-2">
            <Button variant="outline" size="sm">Validate</Button>
            <Button variant="outline" size="sm">Save</Button>
            <Button size="sm">Compile</Button>
          </div>
        </div>
        
        <CodeEditor value={sampleStrategy} />
      </div>

      {/* Strategy Configuration */}
      <div className="w-80 bg-card flex flex-col">
        <div className="p-3 border-b border-border bg-muted">
          <h4 className="font-semibold">Strategy Configuration</h4>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
          {/* Strategy Metadata */}
          <div>
            <h5 className="font-medium mb-3">Strategy Metadata</h5>
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Strategy Name</Label>
                <Input defaultValue="Maker Queue Aware" className="mt-1" />
              </div>
              <div>
                <Label className="text-sm">Author</Label>
                <Input defaultValue="Trading Team" className="mt-1" />
              </div>
              <div>
                <Label className="text-sm">Version</Label>
                <Input defaultValue="1.2.0" className="mt-1" />
              </div>
            </div>
          </div>
          
          {/* Strategy Parameters */}
          <div>
            <h5 className="font-medium mb-3">Strategy Parameters</h5>
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Signal Threshold</Label>
                <Input type="number" defaultValue="0.001" step="0.0001" className="mt-1" />
              </div>
              <div>
                <Label className="text-sm">Max Position Size</Label>
                <Input type="number" defaultValue="1000" className="mt-1" />
              </div>
              <div>
                <Label className="text-sm">Risk Limit (%)</Label>
                <Input type="number" defaultValue="2.0" step="0.1" className="mt-1" />
              </div>
              <div>
                <Label className="text-sm">Lookback Window</Label>
                <Input type="number" defaultValue="50" className="mt-1" />
              </div>
            </div>
          </div>
          
          {/* Compilation Status */}
          <div>
            <h5 className="font-medium mb-3">Compilation Status</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-600 font-mono">✓ Valid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Compiled:</span>
                <span className="font-mono">2 min ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Functions Found:</span>
                <span className="font-mono">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Memory:</span>
                <span className="font-mono">1.2 MB</span>
              </div>
            </div>
          </div>
          
          {/* Performance Hints */}
          <div>
            <h5 className="font-medium mb-3">Performance Hints</h5>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-muted rounded">
                <div className="font-medium">✓ Good</div>
                <div className="text-muted-foreground">Efficient market data handling</div>
              </div>
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                <div className="font-medium">⚠ Warning</div>
                <div className="text-muted-foreground">Consider limiting console.log calls</div>
              </div>
            </div>
          </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}