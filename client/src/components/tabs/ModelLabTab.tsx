import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Target, TrendingUp, Settings, Play, Square, Download } from "lucide-react";

export default function ModelLabTab() {
  const [selectedModel, setSelectedModel] = useState("xgboost");
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [epochs, setEpochs] = useState([100]);
  const [learningRate, setLearningRate] = useState([0.01]);
  const [batchSize, setBatchSize] = useState([256]);

  // Model configurations
  const models = {
    xgboost: {
      name: "XGBoost Classifier",
      type: "Tree-based",
      status: "ready",
      accuracy: 0.847,
      features: ["Price Action", "Volume", "Order Book", "Technical Indicators"],
      hyperparameters: {
        n_estimators: 500,
        max_depth: 6,
        learning_rate: 0.1,
        subsample: 0.8
      }
    },
    lstm: {
      name: "LSTM Predictor",
      type: "Neural Network",
      status: "training",
      accuracy: 0.762,
      features: ["Price Sequences", "Volume Patterns", "Market Microstructure"],
      hyperparameters: {
        hidden_units: 128,
        layers: 3,
        dropout: 0.2,
        sequence_length: 50
      }
    },
    transformer: {
      name: "Transformer Model",
      type: "Attention-based",
      status: "ready",
      accuracy: 0.891,
      features: ["Multi-asset Signals", "Cross-venue Data", "News Sentiment"],
      hyperparameters: {
        d_model: 512,
        n_heads: 8,
        n_layers: 6,
        attention_dropout: 0.1
      }
    }
  };

  const currentModel = models[selectedModel as keyof typeof models];

  // Training metrics over time
  const trainingMetrics = [
    { epoch: 1, train_loss: 0.693, val_loss: 0.698, train_acc: 0.512, val_acc: 0.508 },
    { epoch: 10, train_loss: 0.542, val_loss: 0.587, train_acc: 0.698, val_acc: 0.672 },
    { epoch: 20, train_loss: 0.421, val_loss: 0.465, train_acc: 0.762, val_acc: 0.741 },
    { epoch: 30, train_loss: 0.387, val_loss: 0.412, train_acc: 0.798, val_acc: 0.773 },
    { epoch: 40, train_loss: 0.356, val_loss: 0.398, train_acc: 0.821, val_acc: 0.791 },
    { epoch: 50, train_loss: 0.342, val_loss: 0.389, train_acc: 0.834, val_acc: 0.803 }
  ];

  // Feature importance data
  const featureImportance = [
    { feature: "Bid-Ask Spread", importance: 0.284 },
    { feature: "Volume Imbalance", importance: 0.192 },
    { feature: "Price Momentum", importance: 0.156 },
    { feature: "Order Book Depth", importance: 0.134 },
    { feature: "VWAP Deviation", importance: 0.098 },
    { feature: "Time of Day", importance: 0.087 },
    { feature: "Volatility", importance: 0.049 }
  ];

  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return prev + Math.random() * 3;
      });
    }, 500);
  };

  const stopTraining = () => {
    setIsTraining(false);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Machine Learning Model Lab</h3>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-1" />
              Export Model
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4 mr-1" />
              Auto-tune
            </Button>
            {isTraining ? (
              <Button size="sm" variant="destructive" onClick={stopTraining}>
                <Square className="w-4 h-4 mr-1" />
                Stop Training
              </Button>
            ) : (
              <Button size="sm" onClick={startTraining}>
                <Play className="w-4 h-4 mr-1" />
                Start Training
              </Button>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="models" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
            </TabsList>

            <TabsContent value="models" className="space-y-4">
              {/* Model Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {Object.entries(models).map(([key, model]) => (
                  <Card 
                    key={key} 
                    className={`cursor-pointer transition-colors ${
                      selectedModel === key ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedModel(key)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{model.name}</CardTitle>
                        <Badge variant={model.status === 'ready' ? 'default' : model.status === 'training' ? 'secondary' : 'outline'}>
                          {model.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Type:</span>
                          <span className="font-medium">{model.type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Accuracy:</span>
                          <span className="font-mono font-bold text-green-600">
                            {(model.accuracy * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Features: {model.features.slice(0, 2).join(", ")}
                          {model.features.length > 2 && ` +${model.features.length - 2} more`}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Model Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Model Configuration: {currentModel.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Hyperparameters</h4>
                      <div className="space-y-2">
                        {Object.entries(currentModel.hyperparameters).map(([param, value]) => (
                          <div key={param} className="flex justify-between text-sm">
                            <span className="capitalize">{param.replace('_', ' ')}:</span>
                            <span className="font-mono">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Input Features</h4>
                      <div className="space-y-1">
                        {currentModel.features.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{feature}</span>
                            <Badge variant="outline" className="text-xs">
                              {Math.floor(Math.random() * 50 + 10)} dims
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="training" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Training Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle>Training Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm">Model Architecture</Label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xgboost">XGBoost Classifier</SelectItem>
                          <SelectItem value="lstm">LSTM Predictor</SelectItem>
                          <SelectItem value="transformer">Transformer Model</SelectItem>
                          <SelectItem value="random-forest">Random Forest</SelectItem>
                          <SelectItem value="svm">Support Vector Machine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm">Epochs: {epochs[0]}</Label>
                      <Slider
                        value={epochs}
                        onValueChange={setEpochs}
                        max={1000}
                        min={10}
                        step={10}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm">Learning Rate: {learningRate[0]}</Label>
                      <Slider
                        value={learningRate}
                        onValueChange={setLearningRate}
                        max={0.1}
                        min={0.001}
                        step={0.001}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm">Batch Size: {batchSize[0]}</Label>
                      <Slider
                        value={batchSize}
                        onValueChange={setBatchSize}
                        max={1024}
                        min={32}
                        step={32}
                        className="mt-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="early-stopping" defaultChecked />
                        <Label htmlFor="early-stopping" className="text-sm">Early stopping</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="data-augmentation" />
                        <Label htmlFor="data-augmentation" className="text-sm">Data augmentation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="cross-validation" defaultChecked />
                        <Label htmlFor="cross-validation" className="text-sm">Cross validation</Label>
                      </div>
                    </div>

                    {isTraining && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Training Progress</span>
                          <span>{trainingProgress.toFixed(1)}%</span>
                        </div>
                        <Progress value={trainingProgress} />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Training Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Training Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 w-full bg-muted rounded-lg relative overflow-hidden">
                      <svg width="100%" height="100%" className="absolute inset-0">
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map(i => (
                          <line key={`h-${i}`} x1="0" y1={i * 50} x2="100%" y2={i * 50} stroke="#374151" strokeWidth="0.5" opacity="0.3" />
                        ))}

                        {/* Training accuracy curve */}
                        <path
                          d={`M 0 ${200 - trainingMetrics[0].train_acc * 200} ${trainingMetrics.map((metric, i) => 
                            `L ${(i / trainingMetrics.length) * 400} ${200 - metric.train_acc * 200}`
                          ).join(' ')}`}
                          stroke="#10b981"
                          strokeWidth="2"
                          fill="none"
                        />

                        {/* Validation accuracy curve */}
                        <path
                          d={`M 0 ${200 - trainingMetrics[0].val_acc * 200} ${trainingMetrics.map((metric, i) => 
                            `L ${(i / trainingMetrics.length) * 400} ${200 - metric.val_acc * 200}`
                          ).join(' ')}`}
                          stroke="#3b82f6"
                          strokeWidth="2"
                          strokeDasharray="4,4"
                          fill="none"
                        />

                        {/* Legend */}
                        <text x="10" y="20" className="text-xs fill-current">Accuracy</text>
                        <line x1="60" y1="15" x2="80" y2="15" stroke="#10b981" strokeWidth="2" />
                        <text x="85" y="20" className="text-xs fill-current">Train</text>
                        <line x1="120" y1="15" x2="140" y2="15" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" />
                        <text x="145" y="20" className="text-xs fill-current">Validation</text>
                      </svg>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <div className="font-medium">Current Epoch</div>
                        <div className="font-mono text-lg">{isTraining ? Math.floor(trainingProgress / 2) : 50}</div>
                      </div>
                      <div>
                        <div className="font-medium">Best Validation</div>
                        <div className="font-mono text-lg text-green-600">80.3%</div>
                      </div>
                      <div>
                        <div className="font-medium">Training Loss</div>
                        <div className="font-mono">0.342</div>
                      </div>
                      <div>
                        <div className="font-medium">Validation Loss</div>
                        <div className="font-mono">0.389</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Feature Importance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Importance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {featureImportance.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{item.feature}</span>
                            <span className="font-mono">{(item.importance * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={item.importance * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Feature Engineering */}
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Engineering</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm">Feature Selection Method</Label>
                      <Select defaultValue="recursive">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recursive">Recursive Feature Elimination</SelectItem>
                          <SelectItem value="univariate">Univariate Selection</SelectItem>
                          <SelectItem value="lasso">LASSO Regularization</SelectItem>
                          <SelectItem value="mutual-info">Mutual Information</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="technical-indicators" defaultChecked />
                        <Label htmlFor="technical-indicators" className="text-sm">Technical indicators</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="order-book-features" defaultChecked />
                        <Label htmlFor="order-book-features" className="text-sm">Order book features</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="volume-profile" defaultChecked />
                        <Label htmlFor="volume-profile" className="text-sm">Volume profile</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="market-microstructure" />
                        <Label htmlFor="market-microstructure" className="text-sm">Market microstructure</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sentiment-data" />
                        <Label htmlFor="sentiment-data" className="text-sm">Sentiment data</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm">Lookback Window</Label>
                        <Input type="number" defaultValue="50" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-sm">Prediction Horizon</Label>
                        <Input type="number" defaultValue="5" className="mt-1" />
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      Regenerate Features
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Feature Correlation Matrix */}
              <Card>
                <CardHeader>
                  <CardTitle>Feature Correlation Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-muted-foreground">Feature correlation heatmap visualization</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evaluation" className="space-y-4">
              {/* Model Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">84.7%</div>
                    <p className="text-xs text-muted-foreground">Test set performance</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Precision</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">82.1%</div>
                    <p className="text-xs text-muted-foreground">True positive rate</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recall</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">79.6%</div>
                    <p className="text-xs text-muted-foreground">Sensitivity</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">F1-Score</CardTitle>
                    <Brain className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">80.8%</div>
                    <p className="text-xs text-muted-foreground">Harmonic mean</p>
                  </CardContent>
                </Card>
              </div>

              {/* Confusion Matrix & ROC Curve */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Confusion Matrix</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 w-full bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-muted-foreground">Confusion matrix visualization</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>ROC Curve</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 w-full bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-muted-foreground">ROC curve (AUC: 0.876)</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Model Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Model Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(models).map(([key, model]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant={model.status === 'ready' ? 'default' : 'secondary'}>
                            {model.status}
                          </Badge>
                          <span className="font-medium">{model.name}</span>
                          <span className="text-sm text-muted-foreground">{model.type}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>Accuracy: <span className="font-mono font-bold">{(model.accuracy * 100).toFixed(1)}%</span></span>
                          <Button size="sm" variant="outline">Deploy</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deployment" className="space-y-4">
              {/* Deployment Configuration */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Deployment Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm">Deployment Target</Label>
                      <Select defaultValue="production">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="production">Production Environment</SelectItem>
                          <SelectItem value="staging">Staging Environment</SelectItem>
                          <SelectItem value="local">Local Testing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm">Model Version</Label>
                      <Input defaultValue="v1.2.0" className="mt-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm">CPU Cores</Label>
                        <Input type="number" defaultValue="4" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-sm">Memory (GB)</Label>
                        <Input type="number" defaultValue="8" className="mt-1" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="auto-scaling" defaultChecked />
                        <Label htmlFor="auto-scaling" className="text-sm">Auto-scaling</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="health-checks" defaultChecked />
                        <Label htmlFor="health-checks" className="text-sm">Health checks</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="monitoring" defaultChecked />
                        <Label htmlFor="monitoring" className="text-sm">Performance monitoring</Label>
                      </div>
                    </div>

                    <Button className="w-full">Deploy Model</Button>
                  </CardContent>
                </Card>

                {/* Model Monitoring */}
                <Card>
                  <CardHeader>
                    <CardTitle>Model Monitoring</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Model Status</span>
                        <Badge variant="default">Active</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Prediction Latency</span>
                          <span className="font-mono">2.3ms</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Throughput</span>
                          <span className="font-mono">1,247 pred/sec</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Memory Usage</span>
                          <span className="font-mono">6.2 GB</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>CPU Usage</span>
                          <span className="font-mono">73%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Model Drift Score</span>
                          <span className="font-mono text-green-600">0.023</span>
                        </div>
                        <Progress value={2.3} />
                        <p className="text-xs text-muted-foreground">Low drift detected</p>
                      </div>

                      <div className="pt-2 border-t">
                        <h4 className="font-medium text-sm mb-2">Recent Deployments</h4>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>v1.2.0</span>
                            <span className="text-muted-foreground">2h ago</span>
                          </div>
                          <div className="flex justify-between">
                            <span>v1.1.5</span>
                            <span className="text-muted-foreground">1d ago</span>
                          </div>
                          <div className="flex justify-between">
                            <span>v1.1.4</span>
                            <span className="text-muted-foreground">3d ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}