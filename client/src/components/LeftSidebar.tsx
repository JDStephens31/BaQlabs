import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface TreeSection {
  id: string;
  title: string;
  expanded: boolean;
  items: { id: string; name: string; active?: boolean }[];
}

export default function LeftSidebar() {
  const [sections, setSections] = useState<TreeSection[]>([
    {
      id: "datasets",
      title: "Datasets",
      expanded: true,
      items: [
        { id: "nq-2025-08", name: "NQ 2025-08 (5 days)", active: true },
        { id: "es-2025-07", name: "ES 2025-07 (10 days)" },
        { id: "rty-2025-06", name: "RTY 2025-06 (3 days)" },
      ],
    },
    {
      id: "strategies",
      title: "Strategies",
      expanded: true,
      items: [
        { id: "maker-queue", name: "Maker Queue Aware", active: true },
        { id: "mean-reversion", name: "Mean Reversion v3" },
        { id: "momentum", name: "Momentum Breakout" },
      ],
    },
    {
      id: "models",
      title: "Models",
      expanded: true,
      items: [
        { id: "xgboost", name: "XGBoost Classifier", active: true },
        { id: "lstm", name: "LSTM Predictor" },
      ],
    },
    {
      id: "experiments",
      title: "Experiments",
      expanded: true,
      items: [
        { id: "run-1", name: "Run_2025_01_15_14:23", active: true },
        { id: "run-2", name: "Run_2025_01_15_09:45" },
      ],
    },
    {
      id: "reports",
      title: "Reports",
      expanded: false,
      items: [
        { id: "performance", name: "Performance Summary" },
        { id: "risk", name: "Risk Attribution" },
      ],
    },
  ]);

  const toggleSection = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, expanded: !section.expanded }
        : section
    ));
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold text-foreground">Navigator</h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sections.map((section) => (
            <div key={section.id} className="mb-4">
              <Button
                variant="ghost"
                className="w-full justify-start p-0 h-auto font-medium text-foreground hover:bg-accent"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center">
                  {section.expanded ? (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1" />
                  )}
                  {section.title}
                </div>
              </Button>
              
              {section.expanded && (
                <div className="ml-4 mt-2 space-y-1">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className={`py-1 px-2 rounded cursor-pointer text-sm transition-colors ${
                        item.active
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {item.name}
                    </div>
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
