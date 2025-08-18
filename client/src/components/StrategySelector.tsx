import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Code, Play, Settings, Plus, Save, Copy, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Strategy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'ready' | 'error';
  code?: string;
  parameters?: any;
}

export default function StrategySelector() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStrategy, setSelectedStrategy] = useState("maker-queue-aware");
  const [currentStrategy, setCurrentStrategy] = useState<Strategy | null>(null);
  const [newStrategyName, setNewStrategyName] = useState("");
  const [newStrategyDescription, setNewStrategyDescription] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Fetch strategies from backend
  const { data: strategies = [], isLoading } = useQuery({
    queryKey: ['/api/strategies'],
    queryFn: () => fetch('/api/strategies').then(res => res.json()).catch(() => [
      { id: "maker-queue-aware", name: "Maker Queue Aware", description: "Queue position optimization", status: "active" },
      { id: "mean-reversion-v3", name: "Mean Reversion v3", description: "Statistical arbitrage", status: "ready" },
      { id: "momentum-breakout", name: "Momentum Breakout", description: "Trend following", status: "ready" },
      { id: "pairs-trading", name: "Pairs Trading", description: "Market neutral strategy", status: "ready" },
      { id: "market-making", name: "Market Making", description: "Liquidity provision", status: "ready" }
    ])
  });

  // Create new strategy mutation
  const createStrategyMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const strategyCode = `// New Strategy: ${data.name}
// Description: ${data.description}
// Created: ${new Date().toISOString()}

let position = 0;
let activeOrders = new Map();

function onMarketData(book, trades, marketData) {
  // Get current market state
  const bestBid = book.bids[0];
  const bestAsk = book.asks[0];
  const midPrice = (bestBid.price + bestAsk.price) / 2;
  
  // Strategy logic goes here
  log(\`Market data received - Mid: \${midPrice}\`);
}

function calculateImbalance(book) {
  let bidSize = 0, askSize = 0;
  
  for (let i = 0; i < Math.min(5, book.bids.length); i++) {
    bidSize += book.bids[i].size;
  }
  
  for (let i = 0; i < Math.min(5, book.asks.length); i++) {
    askSize += book.asks[i].size;
  }
  
  return (bidSize - askSize) / (bidSize + askSize);
}

function log(message) {
  console.log(\`[\${new Date().toISOString()}] \${message}\`);
}`;

      return apiRequest('/api/strategies', 'POST', {
        name: data.name,
        code: strategyCode,
        parameters: {
          maxPositionSize: 10,
          riskLimit: 2.0,
          signalThreshold: 0.002
        }
      });
    },
    onSuccess: (newStrategy) => {
      queryClient.invalidateQueries({ queryKey: ['/api/strategies'] });
      setSelectedStrategy(newStrategy.id);
      setCreateDialogOpen(false);
      setNewStrategyName("");
      setNewStrategyDescription("");
      toast({
        title: "Strategy Created",
        description: `${newStrategy.name} has been created successfully`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create strategy",
        variant: "destructive"
      });
    }
  });

  // Duplicate strategy mutation
  const duplicateStrategyMutation = useMutation({
    mutationFn: async (strategy: Strategy) => {
      const duplicatedName = `${strategy.name} (Copy)`;
      return apiRequest('/api/strategies', 'POST', {
        name: duplicatedName,
        code: strategy.code || '',
        parameters: strategy.parameters || {}
      });
    },
    onSuccess: (newStrategy) => {
      queryClient.invalidateQueries({ queryKey: ['/api/strategies'] });
      setSelectedStrategy(newStrategy.id);
      toast({
        title: "Strategy Duplicated",
        description: `${newStrategy.name} has been created`
      });
    }
  });

  // Delete strategy mutation
  const deleteStrategyMutation = useMutation({
    mutationFn: async (strategyId: string) => {
      return apiRequest(`/api/strategies/${strategyId}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/strategies'] });
      const remainingStrategies = strategies.filter((s: Strategy) => s.id !== selectedStrategy);
      if (remainingStrategies.length > 0) {
        setSelectedStrategy(remainingStrategies[0].id);
      }
      toast({
        title: "Strategy Deleted",
        description: "Strategy has been removed"
      });
    }
  });

  useEffect(() => {
    const strategy = strategies.find((s: Strategy) => s.id === selectedStrategy);
    if (strategy) {
      setCurrentStrategy(strategy);
    }
  }, [selectedStrategy, strategies]);

  const handleStrategyChange = (strategyId: string) => {
    setSelectedStrategy(strategyId);
    const strategy = strategies.find((s: Strategy) => s.id === strategyId);
    if (strategy) {
      // Dispatch event to update other components
      const event = new CustomEvent('strategySelected', { 
        detail: { 
          strategy,
          strategyId
        }
      });
      window.dispatchEvent(event);
      
      // Also dispatch the existing event for backward compatibility
      const legacyEvent = new CustomEvent('itemSelected', { 
        detail: { 
          section: 'strategies',
          itemId: strategyId,
          item: strategy
        }
      });
      window.dispatchEvent(legacyEvent);
    }
  };

  const handleCreateStrategy = () => {
    if (newStrategyName.trim()) {
      createStrategyMutation.mutate({
        name: newStrategyName.trim(),
        description: newStrategyDescription.trim() || "Custom trading strategy"
      });
    }
  };

  const handleDuplicateStrategy = () => {
    if (currentStrategy) {
      duplicateStrategyMutation.mutate(currentStrategy);
    }
  };

  const handleDeleteStrategy = () => {
    if (currentStrategy && strategies.length > 1) {
      deleteStrategyMutation.mutate(currentStrategy.id);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading strategies...</div>;
  }

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
                      currentStrategy?.status === 'active' ? 'bg-green-500' :
                      currentStrategy?.status === 'ready' ? 'bg-blue-500' :
                      'bg-red-500'
                    }`} />
                    <span>{currentStrategy?.name || 'Select Strategy'}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {strategies.map((strategy: Strategy) => (
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
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Strategy</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Strategy Name</label>
                  <Input
                    value={newStrategyName}
                    onChange={(e) => setNewStrategyName(e.target.value)}
                    placeholder="Enter strategy name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={newStrategyDescription}
                    onChange={(e) => setNewStrategyDescription(e.target.value)}
                    placeholder="Enter strategy description"
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateStrategy}
                    disabled={!newStrategyName.trim() || createStrategyMutation.isPending}
                  >
                    {createStrategyMutation.isPending ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleDuplicateStrategy}
            disabled={!currentStrategy || duplicateStrategyMutation.isPending}
          >
            <Copy className="w-4 h-4 mr-1" />
            Duplicate
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleDeleteStrategy}
            disabled={!currentStrategy || strategies.length <= 1 || deleteStrategyMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
          
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
        {currentStrategy?.description || 'No strategy selected'}
      </div>
    </div>
  );
}