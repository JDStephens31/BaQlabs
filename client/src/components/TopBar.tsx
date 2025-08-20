import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw, Settings } from "lucide-react";
import SettingsModal from "@/components/SettingsModal";
import UserSettingsDropdown from "@/components/UserSettingsDropdown";


export default function TopBar() {
  const [currentStrategy, setCurrentStrategy] = useState("Maker Queue Aware");
  const [currentDataset, setCurrentDataset] = useState("NQ 2025-08 (5 days)");
  const [selectedStrategyId, setSelectedStrategyId] = useState("maker-queue-aware");
  const [selectedDatasetId, setSelectedDatasetId] = useState("nq-2025-08");
  const [isBacktestRunning, setIsBacktestRunning] = useState(false);
  const [backtestProgress, setBacktestProgress] = useState(0);
  const [status, setStatus] = useState<'Ready' | 'Running' | 'Completed' | 'Error'>('Ready');

  // Simulated backtest progress for demo
  const simulateBacktest = () => {
    setIsBacktestRunning(true);
    setBacktestProgress(0);
    setStatus('Running');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        setStatus('Completed');
        setIsBacktestRunning(false);
        clearInterval(interval);
      } else {
        setBacktestProgress(Math.round(progress));
      }
    }, 500);
  };

  useEffect(() => {
    const handleItemSelected = (event: any) => {
      const { section, item, itemId } = event.detail;
      if (section === 'strategies') {
        setCurrentStrategy(item.name);
        setSelectedStrategyId(itemId);
      } else if (section === 'datasets') {
        setCurrentDataset(item.name);
        setSelectedDatasetId(itemId);
      }
    };

    window.addEventListener('itemSelected', handleItemSelected);
    return () => window.removeEventListener('itemSelected', handleItemSelected);
  }, []);

  const startBacktest = () => {
    simulateBacktest();
  };

  const stopBacktest = () => {
    setIsBacktestRunning(false);
    setStatus('Ready');
  };

  const resetBacktest = () => {
    setIsBacktestRunning(false);
    setBacktestProgress(0);
    setStatus('Ready');
  };
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
        <Button 
          size="sm" 
          className="bg-green-600 hover:bg-green-700"
          onClick={startBacktest}
          disabled={isBacktestRunning}
        >
          <Play className="w-4 h-4 mr-1" />
          {isBacktestRunning ? `Running ${backtestProgress}%` : 'Start'}
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={stopBacktest}
          disabled={!isBacktestRunning}
        >
          <Square className="w-4 h-4 mr-1" />
          Stop
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={resetBacktest}
          disabled={isBacktestRunning}
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>
      {/* Right: Status & Settings */}
      <div className="flex items-center space-x-4">
        <div className="text-sm">
          <span className="text-muted-foreground">Status:</span>
          <span className={`ml-1 font-medium ${
            status === 'Ready' ? 'text-green-600' :
            status === 'Running' ? 'text-blue-600' :
            status === 'Completed' ? 'text-green-600' :
            'text-red-600'
          }`}>{status}</span>
        </div>

        <SettingsModal>
          <Button size="sm" variant="ghost">
            <Settings className="w-4 h-4" />
          </Button>
        </SettingsModal>
        <UserSettingsDropdown user={{
          id: 'demo-user',
          email: 'trader@baqlabs.com',
          firstName: 'BAQ',
          lastName: 'Trader',
          profileImageUrl: undefined
        }} />
      </div>
    </div>
  );
}