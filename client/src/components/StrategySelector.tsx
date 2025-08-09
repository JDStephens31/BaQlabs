import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Code, Play, Settings } from "lucide-react";

interface Strategy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'ready' | 'error';
}

const strategies: Strategy[] = [
  { id: "maker-queue-aware", name: "Maker Queue Aware", description: "Queue position optimization", status: "active" },
  { id: "mean-reversion-v3", name: "Mean Reversion v3", description: "Statistical arbitrage", status: "ready" },
  { id: "momentum-breakout", name: "Momentum Breakout", description: "Trend following", status: "ready" },
  { id: "pairs-trading", name: "Pairs Trading", description: "Market neutral strategy", status: "ready" },
  { id: "market-making", name: "Market Making", description: "Liquidity provision", status: "ready" }
];

export default function StrategySelector() {
  const [selectedStrategy, setSelectedStrategy] = useState("maker-queue-aware");
  const [currentStrategy, setCurrentStrategy] = useState(strategies[0]);

  useEffect(() => {
    const strategy = strategies.find(s => s.id === selectedStrategy);
    if (strategy) {
      setCurrentStrategy(strategy);
    }
  }, [selectedStrategy]);

  const handleStrategyChange = (strategyId: string) => {
    setSelectedStrategy(strategyId);
    const strategy = strategies.find(s => s.id === strategyId);
    if (strategy) {
      // Dispatch event to update other components
      const event = new CustomEvent('itemSelected', { 
        detail: { 
          section: 'strategies',
          itemId: strategyId,
          item: strategy
        }
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="border-b border-border p-4 bg-muted/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Code className="w-5 h-5" />
          <div className="flex-1">
            <Select value={selectedStrategy} onValueChange={handleStrategyChange}>
              <SelectTrigger className="w-64">
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      currentStrategy.status === 'active' ? 'bg-green-500' :
                      currentStrategy.status === 'ready' ? 'bg-blue-500' :
                      'bg-red-500'
                    }`} />
                    <span>{currentStrategy.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {strategies.map((strategy) => (
                  <SelectItem key={strategy.id} value={strategy.id}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        strategy.status === 'active' ? 'bg-green-500' :
                        strategy.status === 'ready' ? 'bg-blue-500' :
                        'bg-red-500'
                      }`} />
                      <div>
                        <div className="font-medium">{strategy.name}</div>
                        <div className="text-xs text-muted-foreground">{strategy.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            <Settings className="w-4 h-4 mr-1" />
            Configure
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Play className="w-4 h-4 mr-1" />
            Run Backtest
          </Button>
        </div>
      </div>
      
      <div className="mt-2 text-sm text-muted-foreground">
        {currentStrategy.description}
      </div>
    </div>
  );
}