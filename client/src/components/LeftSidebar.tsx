import { ChevronDown, ChevronRight, Database, Code, Brain, FlaskConical, FileText, Plus, List, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import EventLogModal from "./EventLogModal";
import { useWebSocket } from "@/hooks/useWebSocket";

interface SidebarItem {
  id: string;
  name: string;
  description?: string;
  status?: 'active' | 'ready' | 'error';
}

interface SidebarSection {
  title: string;
  icon: React.ReactNode;
  items: SidebarItem[];
  expanded: boolean;
  selectedItem?: string;
}

export default function LeftSidebar() {
  const [eventLogOpen, setEventLogOpen] = useState(false);
  const [isStrategyRunning, setIsStrategyRunning] = useState(false);
  const [backtestProgress, setBacktestProgress] = useState(0);
  const [backtestStatus, setBacktestStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  interface EventLogEntry {
    id: string;
    timestamp: string;
    level: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
    category: string;
    message: string;
    details?: string;
  }

  const [eventLog, setEventLog] = useState<EventLogEntry[]>([
    {
      id: "1",
      timestamp: "14:23:45.123",
      level: "INFO" as const,
      category: "Strategy",
      message: "Strategy initialized successfully",
      details: "Maker Queue Aware strategy loaded with parameters"
    },
    {
      id: "2", 
      timestamp: "14:23:46.234",
      level: "SUCCESS" as const,
      category: "Data",
      message: "Market data connection established",
      details: "Connected to NQ 2025-08 dataset"
    }
  ]);

  // WebSocket connection for real-time backtest execution
  const { connectionStatus, sendMessage } = useWebSocket('', {
    onMessage: (data) => {
      switch (data.type) {
        case 'backtestProgress':
          setBacktestProgress(data.data.progress);
          setBacktestStatus(data.data.status === 'completed' ? 'completed' : 'running');
          addEventLogEntry("INFO", "Backtest", `Progress: ${data.data.progress}%`, 
            `Current Price: $${data.data.currentPrice?.toFixed(2)} | Trades: ${data.data.tradesExecuted} | Capital: $${data.data.currentCapital}`);
          
          if (data.data.status === 'completed') {
            setIsStrategyRunning(false);
            addEventLogEntry("SUCCESS", "Backtest", "Backtest completed successfully", 
              `Final results calculated and available in Results tab`);
          }
          break;
          
        case 'backtestCompleted':
          setBacktestStatus('completed');
          setIsStrategyRunning(false);
          addEventLogEntry("SUCCESS", "Backtest", "Backtest execution finished", 
            `Total Return: ${data.data.results?.totalReturn?.toFixed(2)}% | Trades: ${data.data.results?.totalTrades}`);
          break;
          
        case 'backtestError':
          setBacktestStatus('error');
          setIsStrategyRunning(false);
          addEventLogEntry("ERROR", "Backtest", "Backtest execution failed", data.data.message);
          break;
          
        case 'marketData':
          // Real-time market data updates during backtest
          if (isStrategyRunning) {
            addEventLogEntry("INFO", "Market", `Market update: ${data.data.side} ${data.data.size} @ $${data.data.price?.toFixed(2)}`);
          }
          break;
      }
    },
    onConnect: () => {
      addEventLogEntry("SUCCESS", "Connection", "WebSocket connected", "Real-time data connection established");
    },
    onDisconnect: () => {
      addEventLogEntry("WARNING", "Connection", "WebSocket disconnected", "Attempting to reconnect...");
    }
  });

  const [sections, setSections] = useState<SidebarSection[]>([
    {
      title: "Datasets",
      icon: <Database className="w-4 h-4" />,
      items: [
        { id: "nq-2025-08", name: "NQ 2025-08 (5 days)", description: "CME E-mini NASDAQ", status: "active" },
        { id: "es-2025-07", name: "ES 2025-07 (10 days)", description: "CME E-mini S&P 500", status: "ready" },
        { id: "rty-2025-06", name: "RTY 2025-06 (3 days)", description: "CME E-mini Russell 2000", status: "ready" }
      ],
      expanded: true,
      selectedItem: "nq-2025-08"
    },
    {
      title: "Strategies", 
      icon: <Code className="w-4 h-4" />,
      items: [
        { id: "maker-queue-aware", name: "Maker Queue Aware", description: "Queue position optimization", status: "active" },
        { id: "mean-reversion-v3", name: "Mean Reversion v3", description: "Statistical arbitrage", status: "ready" },
        { id: "momentum-breakout", name: "Momentum Breakout", description: "Trend following", status: "ready" },
        { id: "pairs-trading", name: "Pairs Trading", description: "Market neutral strategy", status: "ready" },
        { id: "market-making", name: "Market Making", description: "Liquidity provision", status: "ready" }
      ],
      expanded: true,
      selectedItem: "maker-queue-aware"
    },
    {
      title: "Models",
      icon: <Brain className="w-4 h-4" />,
      items: [
        { id: "xgboost-classifier", name: "XGBoost Classifier", description: "Direction prediction", status: "ready" },
        { id: "lstm-predictor", name: "LSTM Predictor", description: "Price forecasting", status: "ready" },
        { id: "transformer-model", name: "Transformer Model", description: "Sequence modeling", status: "ready" }
      ],
      expanded: true,
      selectedItem: "xgboost-classifier"
    },
    {
      title: "Experiments",
      icon: <FlaskConical className="w-4 h-4" />,
      items: [
        { id: "run-14-23", name: "Run_2025_01_15_14:23", description: "Latest backtest", status: "active" },
        { id: "run-09-45", name: "Run_2025_01_15_09:45", description: "Parameter sweep", status: "ready" },
        { id: "run-08-30", name: "Run_2025_01_14_08:30", description: "Model comparison", status: "ready" }
      ],
      expanded: true,
      selectedItem: "run-14-23"
    },
    {
      title: "Reports",
      icon: <FileText className="w-4 h-4" />,
      items: [
        { id: "perf-summary", name: "Performance Summary", description: "Overall metrics", status: "ready" },
        { id: "risk-attribution", name: "Risk Attribution", description: "Risk breakdown", status: "ready" },
        { id: "trade-analysis", name: "Trade Analysis", description: "Execution quality", status: "ready" }
      ],
      expanded: false
    }
  ]);

  const toggleSection = (index: number) => {
    setSections(prev => prev.map((section, i) => 
      i === index ? { ...section, expanded: !section.expanded } : section
    ));
  };

  const selectItem = (sectionIndex: number, itemId: string) => {
    setSections(prev => prev.map((section, i) => 
      i === sectionIndex ? { ...section, selectedItem: itemId } : section
    ));
    
    // Dispatch custom event to notify other components of selection
    const event = new CustomEvent('itemSelected', { 
      detail: { 
        section: sections[sectionIndex].title.toLowerCase(),
        itemId,
        item: sections[sectionIndex].items.find(item => item.id === itemId)
      }
    });
    window.dispatchEvent(event);
  };

  const addEventLogEntry = (level: "INFO" | "SUCCESS" | "WARNING" | "ERROR", category: string, message: string, details?: string) => {
    const newEntry: EventLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 }),
      level,
      category,
      message,
      details
    };
    setEventLog(prev => [newEntry, ...prev]);
  };

  const startStrategy = () => {
    // Get selected strategy and dataset
    const selectedStrategy = sections.find(s => s.title === "Strategies")?.selectedItem;
    const selectedDataset = sections.find(s => s.title === "Datasets")?.selectedItem;
    
    if (!selectedStrategy || !selectedDataset) {
      addEventLogEntry("ERROR", "Strategy", "Cannot start backtest", "Please select both a strategy and dataset");
      return;
    }
    
    setIsStrategyRunning(true);
    setBacktestProgress(0);
    setBacktestStatus('running');
    
    addEventLogEntry("INFO", "Strategy", "Starting backtest execution...", 
      `Strategy: ${selectedStrategy} | Dataset: ${selectedDataset} | NQ Starting Price: $23713`);
    
    // Send backtest start command via WebSocket
    sendMessage({
      type: 'startBacktest',
      data: {
        strategyId: selectedStrategy,
        datasetId: selectedDataset
      }
    });
  };

  const stopStrategy = () => {
    setIsStrategyRunning(false);
    setBacktestStatus('idle');
    addEventLogEntry("WARNING", "Strategy", "Stopping backtest execution...");
    
    // Send stop command via WebSocket
    sendMessage({
      type: 'stopBacktest'
    });
  };

  return (
    <div className="w-64 bg-card border-r border-border">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-sm">Navigator</h3>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-6 w-6 p-0"
          onClick={() => {
            // This will trigger the dataset upload modal
            const event = new CustomEvent('openDatasetUpload');
            window.dispatchEvent(event);
          }}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-full">
        <div className="p-2">
          {sections.map((section, index) => (
            <div key={section.title} className="mb-1">
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex items-center space-x-2 p-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
              >
                {section.expanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                {section.icon}
                <span className="font-medium">{section.title}</span>
              </button>
              
              {section.expanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <button
                      key={item.id}
                      onClick={() => selectItem(index, item.id)}
                      className={`w-full text-left p-2 text-sm rounded-sm transition-colors ${
                        section.selectedItem === item.id
                          ? "bg-accent text-accent-foreground border border-border"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </div>
                          )}
                        </div>
                        {item.status && (
                          <div className={`w-2 h-2 rounded-full ml-2 flex-shrink-0 ${
                            item.status === 'active' ? 'bg-green-500' :
                            item.status === 'ready' ? 'bg-blue-500' :
                            'bg-red-500'
                          }`} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Strategy Controls */}
          <div className="mt-4 p-3 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Backtest Control</span>
              {isStrategyRunning && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">Running {backtestProgress}%</span>
                </div>
              )}
              {connectionStatus === 'Disconnected' && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-red-600">Offline</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Button
                size="sm"
                className="w-full"
                onClick={startStrategy}
                disabled={isStrategyRunning || connectionStatus !== 'Connected'}
              >
                <Play className="w-4 h-4 mr-1" />
                Run Backtest
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={stopStrategy}
                disabled={!isStrategyRunning}
              >
                <Square className="w-4 h-4 mr-1" />
                Stop Backtest
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="w-full"
                onClick={() => setEventLogOpen(true)}
              >
                <List className="w-4 h-4 mr-1" />
                Event Log ({eventLog.length})
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Event Log Modal */}
      <EventLogModal
        open={eventLogOpen}
        onOpenChange={setEventLogOpen}
        events={eventLog}
        isStrategyRunning={isStrategyRunning}
      />
    </div>
  );
}