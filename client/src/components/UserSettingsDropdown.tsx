import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings, 
  User, 
  LogOut, 
  Download, 
  Upload, 
  Shield, 
  Bell, 
  Palette,
  Database,
  Key,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface UserSettingsDropdownProps {
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  };
}

export default function UserSettingsDropdown({ user }: UserSettingsDropdownProps) {
  const { toast } = useToast();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  
  // Profile form state
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleProfileUpdate = async () => {
    try {
      await apiRequest('/api/auth/profile', 'PUT', { firstName, lastName, email });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setProfileDialogOpen(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBackupDownload = async () => {
    try {
      const response = await fetch('/api/backup/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `baq-labs-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Backup Downloaded",
        description: "Your data backup has been successfully downloaded.",
      });
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: "Failed to download backup. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string);
        
        await apiRequest('/api/backup/import', 'POST', backup);
        
        toast({
          title: "Backup Restored",
          description: "Your data has been successfully restored from backup.",
        });
        setBackupDialogOpen(false);
      } catch (error) {
        toast({
          title: "Restore Failed",
          description: "Failed to restore from backup. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const userInitials = user ? 
    `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 
    user.email?.[0]?.toUpperCase() || 'U' : 'U';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profileImageUrl} alt={user?.email} />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email
                }
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setProfileDialogOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setSettingsDialogOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setBackupDialogOpen(true)}>
            <Database className="mr-2 h-4 w-4" />
            <span>Backup & Restore</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.profileImageUrl} alt={user?.email} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setProfileDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProfileUpdate}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Configure your trading platform preferences and security settings.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="trading">Trading</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="api">API Keys</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[400px] mt-4">
              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Appearance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Dark Mode</Label>
                        <p className="text-xs text-muted-foreground">Toggle dark theme</p>
                      </div>
                      <Button 
                        variant={darkMode ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setDarkMode(!darkMode)}
                      >
                        {darkMode ? "On" : "Off"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive strategy alerts</p>
                      </div>
                      <Button 
                        variant={notifications ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setNotifications(!notifications)}
                      >
                        {notifications ? "On" : "Off"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="trading" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Strategy Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-save Strategies</Label>
                        <p className="text-xs text-muted-foreground">Automatically save changes</p>
                      </div>
                      <Button 
                        variant={autoSave ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setAutoSave(!autoSave)}
                      >
                        {autoSave ? "On" : "Off"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Queue tracking is optimized for NQ futures trading (23770-23800 range).
                  </AlertDescription>
                </Alert>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Account Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Session Status</Label>
                        <p className="text-xs text-muted-foreground">Current login session</p>
                      </div>
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out All Sessions
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="api" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">API Configuration</CardTitle>
                    <CardDescription>
                      Manage external trading platform connections
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        API keys are securely encrypted and never displayed in full.
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                      <Label>Trading Platform API</Label>
                      <div className="flex gap-2">
                        <Input placeholder="Enter API key..." type="password" />
                        <Button size="sm">Save</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
          
          <div className="flex justify-end">
            <Button onClick={() => setSettingsDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Backup & Restore Dialog */}
      <Dialog open={backupDialogOpen} onOpenChange={setBackupDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Backup & Restore</DialogTitle>
            <DialogDescription>
              Export your strategies and settings, or restore from a previous backup.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Download Backup
                </CardTitle>
                <CardDescription>
                  Export all your strategies, settings, and configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleBackupDownload} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Complete Backup
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Restore from Backup
                </CardTitle>
                <CardDescription>
                  Upload a backup file to restore your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This will overwrite your current data. Make sure to download a current backup first.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setBackupDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}