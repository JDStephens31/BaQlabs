import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Database, Wifi, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

interface DatasetUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DatasetUploadModal({ open, onOpenChange }: DatasetUploadModalProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Real-time API connection state
  const [apiConnection, setApiConnection] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [apiKey, setApiKey] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('NQ');

  const handleFileUpload = (file: File) => {
    setSelectedFile(file);
    setUploadStatus('uploading');
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        setUploadStatus('success');
        clearInterval(interval);
        
        // Close modal after success
        setTimeout(() => {
          onOpenChange(false);
          setUploadStatus('idle');
          setUploadProgress(0);
          setSelectedFile(null);
        }, 2000);
      }
      setUploadProgress(progress);
    }, 200);
  };

  const connectToAPI = async (provider: string) => {
    setApiConnection('connecting');
    
    // Simulate API connection
    setTimeout(() => {
      setApiConnection('connected');
    }, 2000);
  };

  const startRealtimeStream = () => {
    // This would start the real-time data stream
    console.log(`Starting ${selectedSymbol} stream...`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Dataset</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="csv" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="csv">CSV Upload</TabsTrigger>
            <TabsTrigger value="databento">Databento API</TabsTrigger>
            <TabsTrigger value="rithmic">Rithmic R+</TabsTrigger>
          </TabsList>
          
          {/* CSV Upload Tab */}
          <TabsContent value="csv" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              {uploadStatus === 'idle' && (
                <>
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <div className="space-y-2">
                    <h3 className="font-medium">Upload Market Data CSV</h3>
                    <p className="text-sm text-muted-foreground">
                      Support for tick data, order book, and trade files
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expected format: timestamp, symbol, price, size, side, event_type
                    </p>
                  </div>
                  <Button 
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </>
              )}
              
              {uploadStatus === 'uploading' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Uploading {selectedFile?.name}</h3>
                    <p className="text-sm text-muted-foreground">Processing market data...</p>
                  </div>
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}% complete</p>
                  </div>
                </div>
              )}
              
              {uploadStatus === 'success' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-600">Upload Complete!</h3>
                    <p className="text-sm text-muted-foreground">Dataset processed and ready for backtesting</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Dataset Name</Label>
                <Input placeholder="e.g., NQ 2025-01-15" className="mt-1" />
              </div>
              <div>
                <Label>Symbol</Label>
                <Input placeholder="e.g., NQ, ES, RTY" className="mt-1" />
              </div>
            </div>
          </TabsContent>
          
          {/* Databento API Tab */}
          <TabsContent value="databento" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <h3 className="font-medium">Databento Live Data</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label>API Key</Label>
                  <Input 
                    type="password" 
                    placeholder="Enter your Databento API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Dataset</Label>
                    <Select defaultValue="GLBX.MDP3">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GLBX.MDP3">CME Globex MDP3</SelectItem>
                        <SelectItem value="DBEQ.BASIC">US Equities Basic</SelectItem>
                        <SelectItem value="XNAS.ITCH">Nasdaq ITCH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Schema</Label>
                    <Select defaultValue="mbo">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mbo">Market by Order</SelectItem>
                        <SelectItem value="mbp1">Market by Price L1</SelectItem>
                        <SelectItem value="trades">Trades Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Symbols (comma-separated)</Label>
                  <Input 
                    placeholder="NQ, ES, RTY"
                    value={selectedSymbol}
                    onChange={(e) => setSelectedSymbol(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      apiConnection === 'connected' ? 'bg-green-500' : 
                      apiConnection === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm">
                      {apiConnection === 'connected' ? 'Connected to Databento' :
                       apiConnection === 'connecting' ? 'Connecting...' : 'Disconnected'}
                    </span>
                  </div>
                  
                  <Button 
                    size="sm"
                    onClick={() => connectToAPI('databento')}
                    disabled={!apiKey || apiConnection === 'connecting'}
                  >
                    {apiConnection === 'connecting' ? 'Connecting...' : 'Connect'}
                  </Button>
                </div>
                
                {apiConnection === 'connected' && (
                  <Button 
                    onClick={startRealtimeStream}
                    className="w-full"
                  >
                    <Wifi className="w-4 h-4 mr-2" />
                    Start Live Stream
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Rithmic R+ Tab */}
          <TabsContent value="rithmic" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Wifi className="w-5 h-5" />
                <h3 className="font-medium">Rithmic R+ Feed</h3>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Username</Label>
                    <Input placeholder="Rithmic username" className="mt-1" />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" placeholder="Password" className="mt-1" />
                  </div>
                </div>
                
                <div>
                  <Label>System Name</Label>
                  <Select defaultValue="Rithmic 01">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rithmic 01">Rithmic 01</SelectItem>
                      <SelectItem value="Rithmic Paper Trading">Paper Trading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Server</Label>
                  <Select defaultValue="Chicago">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chicago">Chicago Primary</SelectItem>
                      <SelectItem value="Aurora">Aurora Backup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Instruments</Label>
                  <Textarea 
                    placeholder="Enter contract symbols (one per line)&#10;NQH25&#10;ESH25&#10;RTYH25"
                    className="mt-1 font-mono text-sm"
                    rows={4}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-sm">Disconnected from Rithmic</span>
                  </div>
                  
                  <Button size="sm">
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}