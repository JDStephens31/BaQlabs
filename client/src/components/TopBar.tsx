import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw, Settings } from "lucide-react";

export default function TopBar() {
  return (
    <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left: Logo/Title */}
      <div className="flex items-center space-x-4">
        <h1 className="font-bold text-lg">AlgoBacktest Pro</h1>
        <div className="text-sm text-muted-foreground">
          Strategy: Momentum Scalper v1.2
        </div>
      </div>

      {/* Center: Backtest Controls */}
      <div className="flex items-center space-x-2">
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <Play className="w-4 h-4 mr-1" />
          Start
        </Button>
        <Button size="sm" variant="outline">
          <Square className="w-4 h-4 mr-1" />
          Stop
        </Button>
        <Button size="sm" variant="outline">
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Right: Status & Settings */}
      <div className="flex items-center space-x-4">
        <div className="text-sm">
          <span className="text-muted-foreground">Status:</span>
          <span className="ml-1 text-green-600 font-medium">Ready</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">WS:</span>
          <span className="ml-1 text-green-600 font-medium">Connected</span>
        </div>
        <Button size="sm" variant="ghost">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}