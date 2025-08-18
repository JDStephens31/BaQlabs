import { useState, useEffect } from "react";
import CodeEditor from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StrategySelector from "@/components/StrategySelector";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function StrategyTab() {
  const { toast } = useToast();
  const [strategyCode, setStrategyCode] = useState("");
  const [strategyName, setStrategyName] = useState("Queue Aware NQ Strategy");
  const [selectedStrategyId, setSelectedStrategyId] = useState("maker-queue-aware");
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationStatus, setCompilationStatus] = useState<'valid' | 'invalid' | 'compiling' | null>(null);
  const [compilationErrors, setCompilationErrors] = useState<string[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Strategy parameters with queue-aware defaults
  const [parameters, setParameters] = useState({
    signalThreshold: 0.002,
    maxPositionSize: 10,
    riskLimit: 2.0,
    lookbackWindow: 50,
    queueThreshold: 5, // Queue position threshold
    priceImprovement: 0.25, // NQ tick size
    maxQueueTime: 30000, // 30 seconds max queue time
    imbalanceThreshold: 0.4, // Order book imbalance threshold
    enableQueueTracking: true
  });

  // Initialize with enhanced strategy and listen for strategy selection
  useEffect(() => {
    if (!strategyCode) {
      setStrategyCode(enhancedStrategy);
    }

    const handleStrategySelected = (event: any) => {
      const { strategy, strategyId } = event.detail;
      setSelectedStrategyId(strategyId);
      setStrategyName(strategy.name);
      if (strategy.code) {
        setStrategyCode(strategy.code);
      }
      if (strategy.parameters) {
        setParameters(strategy.parameters);
      }
    };

    window.addEventListener('strategySelected', handleStrategySelected);
    return () => window.removeEventListener('strategySelected', handleStrategySelected);
  }, [strategyCode]);

  const validateStrategy = async () => {
    setIsCompiling(true);
    setCompilationStatus('compiling');
    
    try {
      // Basic syntax validation
      new Function(strategyCode || enhancedStrategy);
      
      // Check for required functions
      const requiredFunctions = ['onMarketData', 'calculateImbalance'];
      const errors: string[] = [];
      
      requiredFunctions.forEach(fn => {
        if (!(strategyCode || enhancedStrategy).includes(`function ${fn}`)) {
          errors.push(`Missing required function: ${fn}`);
        }
      });
      
      if (errors.length > 0) {
        setCompilationErrors(errors);
        setCompilationStatus('invalid');
        toast({
          title: "Validation Failed",
          description: `${errors.length} errors found`,
          variant: "destructive"
        });
      } else {
        setCompilationErrors([]);
        setCompilationStatus('valid');
        
        // Dispatch compilation status event for inspector
        const statusEvent = new CustomEvent('compilationStatusChanged', {
          detail: { status: 'valid', timestamp: new Date().toISOString() }
        });
        window.dispatchEvent(statusEvent);
        
        toast({
          title: "Validation Successful",
          description: "Strategy code is valid and ready for backtesting"
        });
      }
    } catch (error: any) {
      setCompilationErrors([error.message || 'Unknown syntax error']);
      setCompilationStatus('invalid');
      
      // Dispatch compilation status event for inspector
      const statusEvent = new CustomEvent('compilationStatusChanged', {
        detail: { status: 'invalid', timestamp: new Date().toISOString() }
      });
      window.dispatchEvent(statusEvent);
      
      toast({
        title: "Syntax Error",
        description: error.message || 'Unknown syntax error',
        variant: "destructive"
      });
    }
    
    setIsCompiling(false);
  };

  const saveStrategy = async () => {
    try {
      const response = await apiRequest(`/api/strategies/${selectedStrategyId}`, 'PUT', {
        name: strategyName,
        code: strategyCode || enhancedStrategy,
        parameters
      });
      
      const newSaveTime = new Date();
      setLastSaved(newSaveTime);
      
      // Dispatch save event for inspector
      const saveEvent = new CustomEvent('strategySaved', {
        detail: { timestamp: newSaveTime.toISOString() }
      });
      window.dispatchEvent(saveEvent);
      
      toast({
        title: "Strategy Saved",
        description: "Strategy has been successfully saved"
      });
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save strategy",
        variant: "destructive"
      });
    }
  };

  const compileStrategy = async () => {
    await validateStrategy();
    if (compilationStatus === 'valid') {
      toast({
        title: "Strategy Compiled",
        description: "Ready for backtesting with queue tracking"
      });
    }
  };

  const updateParameter = (key: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const enhancedStrategy = `// Queue-Aware NQ Trading Strategy
// Enhanced with Real Queue Position Tracking
// Price Range: 23770-23800 (NQ Futures)
// Last Modified: ${new Date().toLocaleString()}

let position = 0;
let activeOrders = new Map();
let queuePositions = new Map();

function onMarketData(book, trades, marketData) {
  // Get current market state
  const bestBid = book.bids[0];
  const bestAsk = book.asks[0];
  const spread = bestAsk.price - bestBid.price;
  const midPrice = (bestBid.price + bestAsk.price) / 2;
  
  // Calculate order book imbalance
  const imbalance = calculateImbalance(book);
  
  // Track our queue positions
  updateQueuePositions(book, trades);
  
  // Strategy logic with queue awareness
  if (shouldEnterLong(imbalance, midPrice, book)) {
    const targetPrice = bestBid.price; // Join the bid
    const queueRank = getEstimatedQueuePosition(targetPrice, 'BID', book);
    
    if (queueRank <= parameters.queueThreshold) {
      placeLimitOrder('BUY', targetPrice, 1);
      log(\`Joining bid queue at \${targetPrice}, estimated position: \${queueRank}\`);
    }
  } else if (shouldEnterShort(imbalance, midPrice, book)) {
    const targetPrice = bestAsk.price; // Join the ask
    const queueRank = getEstimatedQueuePosition(targetPrice, 'ASK', book);
    
    if (queueRank <= parameters.queueThreshold) {
      placeLimitOrder('SELL', targetPrice, 1);
      log(\`Joining ask queue at \${targetPrice}, estimated position: \${queueRank}\`);
    }
  }
  
  // Queue management - cancel stale orders
  manageQueueOrders(book);
  
  // Risk management
  if (Math.abs(position) > parameters.maxPositionSize) {
    closePosition();
  }
}

function shouldEnterLong(imbalance, midPrice, book) {
  // Enter long when there's strong bid imbalance and we're in price range
  return imbalance > parameters.imbalanceThreshold && 
         midPrice >= 23770 && midPrice <= 23800 &&
         Math.abs(position) < parameters.maxPositionSize;
}

function shouldEnterShort(imbalance, midPrice, book) {
  // Enter short when there's strong ask imbalance and we're in price range
  return imbalance < -parameters.imbalanceThreshold && 
         midPrice >= 23770 && midPrice <= 23800 &&
         Math.abs(position) < parameters.maxPositionSize;
}

function calculateImbalance(book) {
  // Calculate weighted imbalance considering top 5 levels
  let bidSize = 0, askSize = 0;
  
  for (let i = 0; i < Math.min(5, book.bids.length); i++) {
    const weight = 1 / (i + 1); // Weight decreases with depth
    bidSize += book.bids[i].size * weight;
  }
  
  for (let i = 0; i < Math.min(5, book.asks.length); i++) {
    const weight = 1 / (i + 1);
    askSize += book.asks[i].size * weight;
  }
  
  return (bidSize - askSize) / (bidSize + askSize);
}

function getEstimatedQueuePosition(price, side, book) {
  // Estimate our position in the queue based on current book
  const levels = side === 'BID' ? book.bids : book.asks;
  const level = levels.find(l => l.price === price);
  
  if (!level) return 999; // Price not in book
  
  // Simple estimation: assume we're at the back of existing size
  return Math.min(level.size + 1, 50); // Cap at 50 for estimation
}

function updateQueuePositions(book, trades) {
  // Update our queue positions based on trades and book changes
  for (let [orderId, order] of activeOrders) {
    if (order.status === 'PENDING') {
      const currentRank = calculateQueueRank(order, book, trades);
      queuePositions.set(orderId, {
        ...queuePositions.get(orderId),
        currentRank,
        timestamp: Date.now()
      });
    }
  }
}

function manageQueueOrders(book) {
  // Cancel orders that have been in queue too long or moved too far back
  for (let [orderId, queueInfo] of queuePositions) {
    const order = activeOrders.get(orderId);
    if (!order) continue;
    
    const timeInQueue = Date.now() - queueInfo.timestamp;
    
    if (timeInQueue > parameters.maxQueueTime || 
        queueInfo.currentRank > parameters.queueThreshold * 2) {
      cancelOrder(orderId);
      log(\`Cancelled stale order \${orderId}, queue time: \${timeInQueue}ms, rank: \${queueInfo.currentRank}\`);
    }
  }
}

// Trading API functions (implemented by backtesting engine)
function placeLimitOrder(side, price, size) {
  // Implementation provided by backtesting framework
}

function cancelOrder(orderId) {
  // Implementation provided by backtesting framework
}

function closePosition() {
  // Implementation provided by backtesting framework
}

function log(message) {
  // Implementation provided by backtesting framework
  console.log(\`[\${new Date().toISOString()}] \${message}\`);
}`;

  return (
    <div className="flex flex-1 flex-col">
      <StrategySelector />
      
      <div className="flex flex-1">
        {/* Code Editor */}
        <div className="flex-1 bg-card border-r border-border">
        <div className="p-3 border-b border-border bg-muted flex justify-between items-center">
          <h4 className="font-semibold">Strategy Code</h4>
          <div className="flex items-center space-x-2">
            {compilationStatus && (
              <Badge variant={compilationStatus === 'valid' ? 'default' : 'destructive'}>
                {compilationStatus === 'valid' ? '✓ Valid' : 
                 compilationStatus === 'invalid' ? '✗ Error' : 
                 '⏳ Compiling'}
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={validateStrategy}
              disabled={isCompiling}
            >
              Validate
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={saveStrategy}
              disabled={isCompiling}
            >
              Save
            </Button>
            <Button 
              size="sm"
              onClick={compileStrategy}
              disabled={isCompiling}
            >
              {isCompiling ? 'Compiling...' : 'Compile'}
            </Button>
          </div>
        </div>
        
        <div className="flex-1 min-h-0">
          <CodeEditor 
            value={strategyCode || enhancedStrategy} 
            onChange={setStrategyCode}
          />
        </div>
      </div>

      {/* Strategy Configuration */}
      <div className="w-80 bg-card flex flex-col">
        <div className="p-3 border-b border-border bg-muted">
          <h4 className="font-semibold">Strategy Configuration</h4>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
          {/* Strategy Metadata */}
          <div>
            <h5 className="font-medium mb-3">Strategy Metadata</h5>
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Strategy Name</Label>
                <Input 
                  value={strategyName} 
                  onChange={(e) => setStrategyName(e.target.value)}
                  className="mt-1" 
                />
              </div>
              <div>
                <Label className="text-sm">Author</Label>
                <Input defaultValue="Trading Team" className="mt-1" />
              </div>
              <div>
                <Label className="text-sm">Version</Label>
                <Input defaultValue="2.0.0" className="mt-1" />
              </div>
            </div>
          </div>
          
          {/* Strategy Parameters */}
          <div>
            <h5 className="font-medium mb-3">Queue-Aware Parameters</h5>
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Imbalance Threshold</Label>
                <Input 
                  type="number" 
                  value={parameters.imbalanceThreshold} 
                  onChange={(e) => updateParameter('imbalanceThreshold', parseFloat(e.target.value))}
                  step="0.01" 
                  className="mt-1" 
                />
              </div>
              <div>
                <Label className="text-sm">Max Position Size</Label>
                <Input 
                  type="number" 
                  value={parameters.maxPositionSize} 
                  onChange={(e) => updateParameter('maxPositionSize', parseInt(e.target.value))}
                  className="mt-1" 
                />
              </div>
              <div>
                <Label className="text-sm">Queue Threshold</Label>
                <Input 
                  type="number" 
                  value={parameters.queueThreshold} 
                  onChange={(e) => updateParameter('queueThreshold', parseInt(e.target.value))}
                  className="mt-1" 
                />
                <p className="text-xs text-muted-foreground mt-1">Max queue position to enter</p>
              </div>
              <div>
                <Label className="text-sm">Max Queue Time (ms)</Label>
                <Input 
                  type="number" 
                  value={parameters.maxQueueTime} 
                  onChange={(e) => updateParameter('maxQueueTime', parseInt(e.target.value))}
                  className="mt-1" 
                />
              </div>
              <div>
                <Label className="text-sm">Risk Limit (%)</Label>
                <Input 
                  type="number" 
                  value={parameters.riskLimit} 
                  onChange={(e) => updateParameter('riskLimit', parseFloat(e.target.value))}
                  step="0.1" 
                  className="mt-1" 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="queueTracking"
                  checked={parameters.enableQueueTracking}
                  onCheckedChange={(checked) => updateParameter('enableQueueTracking', checked)}
                />
                <Label htmlFor="queueTracking" className="text-sm">Enable Queue Tracking</Label>
              </div>
            </div>
          </div>
          
          {/* Compilation Status */}
          <div>
            <h5 className="font-medium mb-3">Compilation Status</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={compilationStatus === 'valid' ? 'default' : compilationStatus === 'invalid' ? 'destructive' : 'secondary'}>
                  {compilationStatus === 'valid' ? '✓ Valid' : 
                   compilationStatus === 'invalid' ? '✗ Invalid' : 
                   compilationStatus === 'compiling' ? '⏳ Compiling' : 'Not Compiled'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Saved:</span>
                <span className="font-mono">{lastSaved ? lastSaved.toLocaleTimeString() : 'Never'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">NQ Price Range:</span>
                <span className="font-mono text-green-600">23770-23800</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Queue Tracking:</span>
                <span className="font-mono">{parameters.enableQueueTracking ? '✓ Enabled' : '✗ Disabled'}</span>
              </div>
            </div>

            {/* Compilation Errors */}
            {compilationErrors.length > 0 && (
              <Alert className="mt-3" variant="destructive">
                <AlertDescription>
                  <div className="text-sm">
                    <strong>Compilation Errors:</strong>
                    <ul className="mt-1 ml-4 list-disc">
                      {compilationErrors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Performance Hints */}
          <div>
            <h5 className="font-medium mb-3">Performance Hints</h5>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-muted rounded">
                <div className="font-medium">✓ Good</div>
                <div className="text-muted-foreground">Queue tracking optimized for NQ range</div>
              </div>
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                <div className="font-medium">⚠ Warning</div>
                <div className="text-muted-foreground">Consider limiting console.log calls</div>
              </div>
            </div>
          </div>
          </div>
        </ScrollArea>
      </div>
      </div>
    </div>
  );
}