import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import MainContent from "./MainContent";
import RightInspector from "./RightInspector";
import ConsoleLog from "./ConsoleLog";
import DatasetUploadModal from "./DatasetUploadModal";

export type TabType = "STRATEGY" | "MBO_REPLAY" | "RESULTS" | "QUEUE" | "LATENCY_LAB" | "MODEL_LAB";

export default function BacktestingEngine() {
  const [activeTab, setActiveTab] = useState<TabType>("STRATEGY");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenDatasetUpload = () => {
      setUploadModalOpen(true);
    };

    window.addEventListener('openDatasetUpload', handleOpenDatasetUpload);
    return () => window.removeEventListener('openDatasetUpload', handleOpenDatasetUpload);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <MainContent activeTab={activeTab} onTabChange={setActiveTab} />
        <RightInspector />
      </div>
      
      <div className="h-32 border-t border-border">
        <ConsoleLog />
      </div>
      
      <DatasetUploadModal 
        open={uploadModalOpen} 
        onOpenChange={setUploadModalOpen}
      />
    </div>
  );
}
