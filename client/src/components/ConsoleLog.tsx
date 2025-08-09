import { ScrollArea } from "@/components/ui/scroll-area";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  source?: string;
}

export default function ConsoleLog() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: "09:31:12.482", level: "INFO", message: "Strategy initialized successfully", source: "Strategy" },
    { timestamp: "09:31:12.501", level: "INFO", message: "Market data connection established", source: "MBO" },
    { timestamp: "09:31:15.234", level: "INFO", message: "Signal detected: BUY at 20004.75", source: "Strategy" },
    { timestamp: "09:31:15.267", level: "INFO", message: "Order placed: BUY 100@20004.75", source: "OrderManager" },
    { timestamp: "09:31:15.298", level: "INFO", message: "Order filled: BUY 100@20004.75", source: "Trade" },
    { timestamp: "09:31:18.567", level: "WARN", message: "Queue position degraded: rank 45 → 67", source: "Queue" },
    { timestamp: "09:31:22.103", level: "INFO", message: "Signal detected: SELL at 20005.25", source: "Strategy" },
    { timestamp: "09:31:22.115", level: "ERROR", message: "Order rejected: insufficient buying power", source: "RiskManager" },
  ]);

  const { lastMessage } = useWebSocket('/ws', {
    onMessage: (data) => {
      if (data.type === 'log') {
        setLogs(prev => [...prev, data.log]);
      }
    }
  });

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'INFO': return 'text-blue-600';
      case 'WARN': return 'text-yellow-600';
      case 'ERROR': return 'text-red-600';
      case 'DEBUG': return 'text-gray-500';
    }
  };

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'INFO': return 'ℹ';
      case 'WARN': return '⚠';
      case 'ERROR': return '✕';
      case 'DEBUG': return '◦';
    }
  };

  return (
    <div className="h-full bg-card">
      <div className="p-3 border-b border-border bg-muted">
        <h4 className="font-semibold">Event Log</h4>
      </div>
      
      <ScrollArea className="h-full">
        <div className="p-4 font-mono text-xs space-y-1">
          {logs.map((log, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="text-muted-foreground shrink-0">{log.timestamp}</span>
              <span className={`shrink-0 ${getLevelColor(log.level)}`}>
                {getLevelIcon(log.level)}
              </span>
              <span className="text-muted-foreground shrink-0 min-w-16">
                [{log.source || 'System'}]
              </span>
              <span className="flex-1">{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}