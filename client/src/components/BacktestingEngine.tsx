import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import MainContent from "./MainContent";
import RightInspector from "./RightInspector";
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
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 text-center font-medium shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-lg font-semibold">🚀 DEMO VERSION</span>
          <span className="text-sm opacity-90">Experience the full BaQ LABS platform capabilities</span>
        </div>
      </div>
      
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <MainContent activeTab={activeTab} onTabChange={setActiveTab} />
        <RightInspector />
      </div>
      
      <DatasetUploadModal 
        open={uploadModalOpen} 
        onOpenChange={setUploadModalOpen}
      />
    </div>
  );
}
