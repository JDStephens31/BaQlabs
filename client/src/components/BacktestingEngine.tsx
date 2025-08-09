import { useState } from "react";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import MainContent from "./MainContent";
import RightInspector from "./RightInspector";
import ConsoleLog from "./ConsoleLog";

export type TabType = "STRATEGY" | "MBO_REPLAY" | "RESULTS" | "QUEUE" | "LATENCY_LAB" | "MODEL_LAB";

export default function BacktestingEngine() {
  const [activeTab, setActiveTab] = useState<TabType>("STRATEGY");

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <MainContent activeTab={activeTab} onTabChange={setActiveTab} />
        <RightInspector />
      </div>
      
      <ConsoleLog />
    </div>
  );
}
