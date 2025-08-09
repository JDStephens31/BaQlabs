import { ChevronDown, ChevronRight, Database, Code, Brain, FlaskConical, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        </div>
      </ScrollArea>
    </div>
  );
}