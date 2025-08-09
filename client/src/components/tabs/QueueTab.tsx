export default function QueueTab() {
  return (
    <div className="flex flex-1">
      {/* Queue Analysis Charts */}
      <div className="flex-1 bg-card">
        <div className="p-3 border-b border-border bg-muted">
          <h4 className="font-semibold">Queue Position Analysis</h4>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Queue Rank vs Time */}
          <div>
            <h5 className="font-medium mb-2">Queue Rank vs Time</h5>
            <div className="h-64 bg-muted rounded flex items-center justify-center text-muted-foreground">
              Queue Rank Chart (Lower is Better)
            </div>
          </div>
          
          {/* Secondary Charts */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium mb-2">Size-Ahead Curve</h5>
              <div className="h-48 bg-muted rounded flex items-center justify-center text-muted-foreground">
                Size Ahead Analysis
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Fill Probability Projection</h5>
              <div className="h-48 bg-muted rounded flex items-center justify-center text-muted-foreground">
                Fill Probability Chart
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Statistics */}
      <div className="w-80 bg-card border-l border-border">
        <div className="p-3 border-b border-border bg-muted">
          <h4 className="font-semibold">Queue Statistics</h4>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Key Queue Metrics */}
          <div>
            <h5 className="font-medium mb-3">Key Metrics</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Rank on Join:</span>
                <span className="font-mono">128</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Rank Before Fill:</span>
                <span className="font-mono">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lost Priority on Modify:</span>
                <span className="font-mono">18%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fill Rate:</span>
                <span className="font-mono">79.6%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Time to Fill:</span>
                <span className="font-mono">342ms</span>
              </div>
            </div>
          </div>
          
          {/* Queue Position Distribution */}
          <div>
            <h5 className="font-medium mb-3">Position Distribution</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Top 10:</span>
                <span className="font-mono">15.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Top 50:</span>
                <span className="font-mono">48.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Top 100:</span>
                <span className="font-mono">71.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Beyond 100:</span>
                <span className="font-mono">28.7%</span>
              </div>
            </div>
          </div>
          
          {/* Queue Efficiency */}
          <div>
            <h5 className="font-medium mb-3">Queue Efficiency</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Improvement Rate:</span>
                <span className="font-mono">2.3 pos/sec</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cancel Impact:</span>
                <span className="font-mono">-15.6%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trade Through Rate:</span>
                <span className="font-mono">3.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}