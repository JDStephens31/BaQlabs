import { ScrollArea } from "@/components/ui/scroll-area";

export default function MBOReplayTab() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Market By Order Replay</h3>
          <p className="text-muted-foreground">
            This tab will show detailed order book reconstruction and market microstructure visualization.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Order Book Depth</h4>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Order Book Visualization</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Trade Flow</h4>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Trade Flow Chart</span>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}