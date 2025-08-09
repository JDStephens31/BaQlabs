import { ChevronDown, ChevronRight, Database, Code, Brain, FlaskConical, FileText } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarSection {
  title: string;
  icon: React.ReactNode;
  items: string[];
  expanded: boolean;
}

export default function LeftSidebar() {
  const [sections, setSections] = useState<SidebarSection[]>([
    {
      title: "Datasets",
      icon: <Database className="w-4 h-4" />,
      items: ["NQ 2025-08 (5 days)", "ES 2025-07 (10 days)", "RTY 2025-06 (3 days)"],
      expanded: true
    },
    {
      title: "Strategies", 
      icon: <Code className="w-4 h-4" />,
      items: ["Maker Queue Aware", "Mean Reversion v3", "Momentum Breakout"],
      expanded: true
    },
    {
      title: "Models",
      icon: <Brain className="w-4 h-4" />,
      items: ["XGBoost Classifier", "LSTM Predictor"],
      expanded: true
    },
    {
      title: "Experiments",
      icon: <FlaskConical className="w-4 h-4" />,
      items: ["Run_2025_01_15_14:23", "Run_2025_01_15_09:45"],
      expanded: true
    },
    {
      title: "Reports",
      icon: <FileText className="w-4 h-4" />,
      items: ["Performance Summary", "Risk Attribution"],
      expanded: false
    }
  ]);

  const toggleSection = (index: number) => {
    setSections(prev => prev.map((section, i) => 
      i === index ? { ...section, expanded: !section.expanded } : section
    ));
  };

  return (
    <div className="w-64 bg-card border-r border-border">
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold text-sm">Navigator</h3>
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
                      key={itemIndex}
                      className="w-full text-left p-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-sm"
                    >
                      {item}
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