import { Button } from "@/components/ui/button";
import StrategyTab from "./tabs/StrategyTab";
import MBOReplayTab from "./tabs/MBOReplayTab";
import ResultsTab from "./tabs/ResultsTab";
import QueueTab from "./tabs/QueueTab";
import LatencyLabTab from "./tabs/LatencyLabTab";
import ModelLabTab from "./tabs/ModelLabTab";
import type { TabType } from "./BacktestingEngine";

interface MainContentProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: "STRATEGY", label: "STRATEGY" },
  { id: "MBO_REPLAY", label: "MBO REPLAY" },
  { id: "RESULTS", label: "RESULTS" },
  { id: "QUEUE", label: "QUEUE" },
  { id: "LATENCY_LAB", label: "LATENCY LAB" },
  { id: "MODEL_LAB", label: "MODEL LAB" },
];

export default function MainContent({ activeTab, onTabChange }: MainContentProps) {
  const renderTabContent = () => {
    switch (activeTab) {
      case "STRATEGY":
        return <StrategyTab />;
      case "MBO_REPLAY":
        return <MBOReplayTab />;
      case "RESULTS":
        return <ResultsTab />;
      case "QUEUE":
        return <QueueTab />;
      case "LATENCY_LAB":
        return <LatencyLabTab />;
      case "MODEL_LAB":
        return <ModelLabTab />;
      default:
        return <StrategyTab />;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Tab Navigation */}
      <div className="bg-card border-b border-border flex">
        {tabs.map((tab, index) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={`px-4 py-2 rounded-none font-medium text-sm border-r border-border ${
              activeTab === tab.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            } ${index === tabs.length - 1 ? "border-r-0" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
}
