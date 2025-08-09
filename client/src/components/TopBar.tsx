import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw, Settings } from "lucide-react";
import SettingsModal from "@/components/SettingsModal";

export default function TopBar() {
  const [currentStrategy, setCurrentStrategy] = useState("Maker Queue Aware");
  const [currentDataset, setCurrentDataset] = useState("NQ 2025-08 (5 days)");

  useEffect(() => {
    const handleItemSelected = (event: any) => {
      const { section, item } = event.detail;
      if (section === 'strategies') {
        setCurrentStrategy(item.name);
      } else if (section === 'datasets') {
        setCurrentDataset(item.name);
      }
    };

    window.addEventListener('itemSelected', handleItemSelected);
    return () => window.removeEventListener('itemSelected', handleItemSelected);
  }, []);
  return (
    <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left: Logo/Title */}
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-extrabold bg-[#00c3ff00] text-[#bd1c00]">Qbacktest</h1>
        <div className="text-sm text-muted-foreground">
          Strategy: {currentStrategy}
        </div>
        <div className="text-sm text-muted-foreground">
          Dataset: {currentDataset}
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
        <SettingsModal>
          <Button size="sm" variant="ghost">
            <Settings className="w-4 h-4" />
          </Button>
        </SettingsModal>
      </div>
    </div>
  );
}