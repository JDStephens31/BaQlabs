import PerformanceChart from "../PerformanceChart";

export default function ResultsTab() {
  return (
    <div className="flex flex-1">
      {/* Main Chart Area */}
      <div className="flex-1 bg-card">
        <div className="p-3 border-b border-border bg-muted">
          <h4 className="font-semibold">Performance Analytics</h4>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Equity Curve */}
          <div>
            <h5 className="font-medium mb-2">Equity Curve</h5>
            <PerformanceChart />
          </div>
          
          {/* Secondary Charts Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium mb-2">Trade PnL Histogram</h5>
              <div className="h-48 bg-muted rounded flex items-center justify-center text-muted-foreground">
                PnL Distribution Chart
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Holding Time Distribution</h5>
              <div className="h-48 bg-muted rounded flex items-center justify-center text-muted-foreground">
                Holding Time Chart
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Panel */}
      <div className="w-80 bg-card border-l border-border">
        <div className="p-3 border-b border-border bg-muted">
          <h4 className="font-semibold">Performance Summary</h4>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Key Metrics */}
          <div>
            <h5 className="font-medium mb-3">Key Metrics</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Capital:</span>
                <span className="font-mono">$10,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End Capital:</span>
                <span className="font-mono">$28,420</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Return:</span>
                <span className="font-mono text-green-600">+184.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Drawdown:</span>
                <span className="font-mono text-red-600">-$3,900</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hit Rate:</span>
                <span className="font-mono">54.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sharpe Ratio:</span>
                <span className="font-mono">2.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit Factor:</span>
                <span className="font-mono">1.62</span>
              </div>
            </div>
          </div>
          
          {/* Trade Statistics */}
          <div>
            <h5 className="font-medium mb-3">Trade Statistics</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Trades:</span>
                <span className="font-mono">487</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Winning Trades:</span>
                <span className="font-mono">267</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Losing Trades:</span>
                <span className="font-mono">220</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Win:</span>
                <span className="font-mono">$145.20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Loss:</span>
                <span className="font-mono">-$89.60</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Largest Win:</span>
                <span className="font-mono">$892.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Largest Loss:</span>
                <span className="font-mono">-$456.75</span>
              </div>
            </div>
          </div>
          
          {/* Execution Attribution */}
          <div>
            <h5 className="font-medium mb-3">Execution Attribution</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slippage Impact:</span>
                <span className="font-mono">-$235.60</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Latency Impact:</span>
                <span className="font-mono">-$127.40</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Commission:</span>
                <span className="font-mono">-$219.15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model Alpha:</span>
                <span className="font-mono">+$19,002.15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}