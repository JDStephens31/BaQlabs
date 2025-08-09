import { ScrollArea } from "@/components/ui/scroll-area";

export default function QueueTab() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Queue Position Analysis</h3>
          <p className="text-muted-foreground">
            Track order queue positions and fill probabilities in real-time.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Queue Position Tracking</h4>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Queue Position Visualization</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="font-medium">Fill Rate Analysis</h4>
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Fill Rate Chart</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Queue Depth</h4>
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Queue Depth Metrics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}