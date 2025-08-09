import { ScrollArea } from "@/components/ui/scroll-area";

export default function LatencyLabTab() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Latency Simulation Lab</h3>
          <p className="text-muted-foreground">
            Model and test different latency profiles and their impact on strategy performance.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Latency Distribution</h4>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Latency Histogram</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="font-medium">Impact Analysis</h4>
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Performance vs Latency</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Sensitivity</h4>
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Latency Sensitivity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}