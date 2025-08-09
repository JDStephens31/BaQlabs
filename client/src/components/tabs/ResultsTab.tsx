import { ScrollArea } from "@/components/ui/scroll-area";

export default function ResultsTab() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Backtest Results</h3>
          <p className="text-muted-foreground">
            Performance metrics, equity curve, and detailed analytics.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Performance Summary</h4>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Equity Curve Chart</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-4">
              <h4 className="font-medium">Returns</h4>
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Return Metrics</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Risk</h4>
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Risk Metrics</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Trade Analysis</h4>
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Trade Stats</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}