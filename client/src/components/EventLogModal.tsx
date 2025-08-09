import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle, Info, XCircle, Search, Filter, Download } from "lucide-react";

interface EventLogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
  category: string;
  message: string;
  details?: string;
}

interface EventLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: EventLogEntry[];
  isStrategyRunning: boolean;
}

export default function EventLogModal({ open, onOpenChange, events, isStrategyRunning }: EventLogModalProps) {
  const [filteredEvents, setFilteredEvents] = useState<EventLogEntry[]>(events);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (levelFilter !== "ALL") {
      filtered = filtered.filter(event => event.level === levelFilter);
    }

    if (categoryFilter !== "ALL") {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, levelFilter, categoryFilter]);

  const getEventIcon = (level: string) => {
    switch (level) {
      case "SUCCESS":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "WARNING":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "ERROR":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getEventBadgeVariant = (level: string) => {
    switch (level) {
      case "SUCCESS":
        return "default";
      case "WARNING":
        return "secondary";
      case "ERROR":
        return "destructive";
      default:
        return "outline";
    }
  };

  const categories = Array.from(new Set(events.map(e => e.category)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Event Log</span>
            <div className="flex items-center space-x-2">
              {isStrategyRunning && (
                <Badge variant="secondary" className="animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Live
                </Badge>
              )}
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex items-center space-x-4 pb-4 border-b">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Levels</SelectItem>
              <SelectItem value="INFO">Info</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="WARNING">Warning</SelectItem>
              <SelectItem value="ERROR">Error</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Event Log */}
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No events match your filters
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded border">
                  <div className="flex-shrink-0 mt-0.5">
                    {getEventIcon(event.level)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          {event.timestamp}
                        </span>
                        <Badge variant={getEventBadgeVariant(event.level)} className="text-xs">
                          {event.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm">{event.message}</p>
                      {event.details && (
                        <p className="text-xs text-muted-foreground mt-1 font-mono">
                          {event.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Status Bar */}
        <div className="border-t pt-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {filteredEvents.length} of {events.length} events
          </span>
          <span>
            Errors: {events.filter(e => e.level === "ERROR").length} | 
            Warnings: {events.filter(e => e.level === "WARNING").length} | 
            Success: {events.filter(e => e.level === "SUCCESS").length}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}