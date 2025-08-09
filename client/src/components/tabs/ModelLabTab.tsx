import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export default function ModelLabTab() {
  return (
    <div className="flex flex-1">
      {/* Model Configuration */}
      <div className="w-80 bg-card border-r border-border">
        <div className="p-3 border-b border-border bg-muted">
          <h4 className="font-semibold">Model Configuration</h4>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Dataset Window */}
          <div>
            <h5 className="font-medium mb-2">Dataset Window</h5>
            <div className="h-32 bg-muted rounded flex items-center justify-center text-muted-foreground">
              Dataset Preview
            </div>
          </div>
          
          {/* Model Type */}
          <div>
            <h5 className="font-medium mb-2">Model Type</h5>
            <Select defaultValue="xgboost">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xgboost">XGBoost Classifier</SelectItem>
                <SelectItem value="lstm">LSTM Predictor</SelectItem>
                <SelectItem value="linear">Linear Regression</SelectItem>
                <SelectItem value="rf">Random Forest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Training Controls */}
          <div>
            <h5 className="font-medium mb-2">Training Controls</h5>
            <div className="space-y-3">
              <Button className="w-full">Start Training</Button>
              <Button variant="outline" className="w-full">Validate Model</Button>
              <Button variant="outline" className="w-full">Export Model</Button>
            </div>
          </div>
          
          {/* Training Progress */}
          <div>
            <h5 className="font-medium mb-2">Training Progress</h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Epoch 45/100</span>
                <span>45%</span>
              </div>
              <Progress value={45} />
              <div className="text-xs text-muted-foreground">
                Estimated time remaining: 3m 24s
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Analysis */}
      <div className="flex-1 bg-card">
        <div className="p-3 border-b border-border bg-muted">
          <h4 className="font-semibold">Model Analysis</h4>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Calibration Curve */}
          <div>
            <h5 className="font-medium mb-2">Calibration Curve</h5>
            <div className="h-64 bg-muted rounded flex items-center justify-center text-muted-foreground">
              Calibration Analysis Chart
            </div>
          </div>
          
          {/* Feature Importance & ROC */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium mb-2">Feature Importance</h5>
              <div className="h-48 bg-muted rounded flex items-center justify-center text-muted-foreground">
                Feature Importance Chart
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">ROC Curve</h5>
              <div className="h-48 bg-muted rounded flex items-center justify-center text-muted-foreground">
                ROC Analysis Chart
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Metrics */}
      <div className="w-72 bg-card border-l border-border">
        <div className="p-3 border-b border-border bg-muted">
          <h4 className="font-semibold">Model Metrics</h4>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Performance Metrics */}
          <div>
            <h5 className="font-medium mb-3">Performance Metrics</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">AUC/PR:</span>
                <span className="font-mono">0.72</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Brier Score:</span>
                <span className="font-mono">0.118</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ECE:</span>
                <span className="font-mono">1.9%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Accuracy:</span>
                <span className="font-mono">68.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precision:</span>
                <span className="font-mono">71.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recall:</span>
                <span className="font-mono">65.8%</span>
              </div>
            </div>
          </div>
          
          {/* Model Validation */}
          <div>
            <h5 className="font-medium mb-3">Cross-Validation</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">CV Score:</span>
                <span className="font-mono">0.694 ± 0.023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Train Score:</span>
                <span className="font-mono">0.718</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Test Score:</span>
                <span className="font-mono">0.672</span>
              </div>
            </div>
          </div>
          
          {/* Feature Statistics */}
          <div>
            <h5 className="font-medium mb-3">Feature Statistics</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Features:</span>
                <span className="font-mono">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Selected Features:</span>
                <span className="font-mono">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Top Feature:</span>
                <span className="font-mono text-xs">order_imbalance</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Importance:</span>
                <span className="font-mono">0.284</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}