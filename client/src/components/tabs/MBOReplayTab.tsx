import OrderBook from "../OrderBook";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EventTapeEntry {
  timestamp: string;
  type: 'ADD' | 'CANCEL' | 'TRADE';
  side: 'BID' | 'ASK';
  size: number;
  price: number;
}

export default function MBOReplayTab() {
  const events: EventTapeEntry[] = [
    { timestamp: "09:31:12.482", type: "ADD", side: "BID", size: 4, price: 20004.75 },
    { timestamp: "09:31:12.486", type: "CANCEL", side: "BID", size: 2, price: 20004.75 },
    { timestamp: "09:31:12.490", type: "TRADE", side: "ASK", size: 3, price: 20005.00 },
    { timestamp: "09:31:15.123", type: "ADD", side: "ASK", size: 5, price: 20005.25 },
    { timestamp: "09:31:18.567", type: "TRADE", side: "BID", size: 2, price: 20004.75 },
  ];

  const getEventIcon = (type: EventTapeEntry['type']) => {
    switch (type) {
      case 'ADD': return '•';
      case 'CANCEL': return '×';
      case 'TRADE': return '■';
    }
  };

  const getEventColor = (type: EventTapeEntry['type']) => {
    switch (type) {
      case 'ADD': return 'text-blue-400';
      case 'CANCEL': return 'text-red-400';
      case 'TRADE': return 'text-green-400';
    }
  };

  return (
    <div className="flex flex-1">
      {/* DOM Ladder */}
      <div className="w-64 bg-card border-r border-border">
        <div className="p-3 border-b border-border bg-muted">
          <h4 className="font-semibold">Order Book</h4>
        </div>
        <OrderBook />
      </div>

      {/* Event Tape */}
      <div className="flex-1 bg-card border-r border-border">
        <div className="p-3 border-b border-border bg-muted">
          <h4 className="font-semibold">Event Tape</h4>
        </div>
        
        <ScrollArea className="h-full">
          <div className="p-4 font-mono text-sm space-y-1">
            {events.map((event, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-muted-foreground">{event.timestamp}</span>
                <span className={getEventColor(event.type)}>{getEventIcon(event.type)}</span>
                <span className={getEventColor(event.type)}>
                  {event.type} {event.side} {event.size}@{event.price}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Selected Order Trace */}
      <div className="w-80 bg-card">
        <div className="p-3 border-b border-border bg-muted">
          <h4 className="font-semibold">Selected Order Trace</h4>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Join Time:</span>
              <span className="font-mono">09:31:12.482</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Queue Rank:</span>
              <span className="font-mono">128 → 34 → 0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Size Ahead:</span>
              <span className="font-mono">142 → 68 → 0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ETA to Fill:</span>
              <span className="font-mono">~ 220ms</span>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium mb-2">Queue Position Analysis</h5>
            <div className="h-32 bg-muted rounded flex items-center justify-center text-muted-foreground">
              Queue Position Chart
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}