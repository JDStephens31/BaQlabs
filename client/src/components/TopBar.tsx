import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Square } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Project:</span>
          <Select defaultValue="momentum-v2">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="momentum-v2">Momentum Strategy v2.1</SelectItem>
              <SelectItem value="mean-reversion">Mean Reversion v3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="font-medium">Dataset:</span>
          <Select defaultValue="nq-2025-08">
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nq-2025-08">NQ 2025-08 (5 days)</SelectItem>
              <SelectItem value="es-2025-07">ES 2025-07 (10 days)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="font-medium">Symbol:</span>
          <span className="font-mono font-semibold">NQH25</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="font-medium">Session:</span>
          <span className="font-mono">06:00-15:30 PST</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          1-Day Smoke Test
        </Button>
        <Button size="sm" className="bg-primary text-primary-foreground">
          Run Full Backtest
        </Button>
        <Button variant="outline" size="sm">
          <Pause className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Square className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
