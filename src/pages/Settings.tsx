import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeProvider";
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Key,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Download,
  Trash2,
  Save,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("general");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    desktopNotifications: true,
    soundEnabled: true,
    courseReminders: true,
    deadlineAlerts: true,
    weeklyDigest: true,
    marketingEmails: false,
    systemUpdates: true,
    communityUpdates: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showOnlineStatus: true,
    allowDirectMessages: true,
    showLearningActivity: true,
    showAchievements: true,
    dataCollection: true,
    analytics: true,
    thirdPartyIntegrations: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: "30",
    autoLogout: true
  });

  if (!user) return null;

  const handleSaveSettings = () => {
    // Here you would save settings to backend
    console.log("Saving settings:", {
      general: generalSettings,
      notifications: notificationSettings,
      privacy: privacySettings,
      security: securitySettings
    });
    
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleResetSettings = () => {
    // Reset to default values
    setGeneralSettings({
      language: "en",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h"
    });
    // Reset other settings...
  };

  const handleExportData = () => {
    // Export user data
    console.log("Exporting user data...");
  };

  const handleDeleteAccount = () => {
    // Show confirmation dialog and handle account deletion
    console.log("Account deletion requested...");
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <SettingsIcon className="h-8 w-8" />
              Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your account preferences and application settings
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetSettings}>
              Reset to Default
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="mr-2 h-4 w-4" />
              Save All Settings
            </Button>
          </div>
        </div>

        {/* Success Alert */}
        {showSaveSuccess && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Settings saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">
              <Globe className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="mr-2 h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="mr-2 h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="security">
              <Key className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>Set your language and regional preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select 
                      value={generalSettings.language} 
                      onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select 
                      value={generalSettings.timezone} 
                      onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (EST)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CST)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MST)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PST)</SelectItem>
                        <SelectItem value="Europe/London">GMT</SelectItem>
                        <SelectItem value="Europe/Paris">Central European Time</SelectItem>
                        <SelectItem value="Asia/Tokyo">Japan Standard Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select 
                      value={generalSettings.dateFormat} 
                      onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, dateFormat: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        <SelectItem value="MMM DD, YYYY">MMM DD, YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Time Format</Label>
                    <Select 
                      value={generalSettings.timeFormat} 
                      onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timeFormat: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Basic account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Role</Label>
                    <Badge variant="secondary">{user.role}</Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Member Since</Label>
                    <p className="text-sm text-muted-foreground">January 2024</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Account Status</Label>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Preferences</CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Card 
                      className={`cursor-pointer transition-all ${theme === 'light' ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setTheme('light')}
                    >
                      <CardContent className="p-4 text-center">
                        <Sun className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-medium">Light</p>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className={`cursor-pointer transition-all ${theme === 'dark' ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setTheme('dark')}
                    >
                      <CardContent className="p-4 text-center">
                        <Moon className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-medium">Dark</p>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className={`cursor-pointer transition-all ${theme === 'system' ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setTheme('system')}
                    >
                      <CardContent className="p-4 text-center">
                        <Monitor className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-medium">System</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Font Size</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="extra-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Sidebar Position</Label>
                  <Select defaultValue="left">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what email notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Course Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminders about upcoming lessons</p>
                  </div>
                  <Switch
                    checked={notificationSettings.courseReminders}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, courseReminders: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Deadline Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notifications about assignment deadlines</p>
                  </div>
                  <Switch
                    checked={notificationSettings.deadlineAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, deadlineAlerts: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">Summary of your weekly progress</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyDigest}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, weeklyDigest: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Updates about new features and courses</p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push & Desktop Notifications</CardTitle>
                <CardDescription>Real-time notifications on your device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Mobile and browser notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Desktop Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show notifications on desktop</p>
                  </div>
                  <Switch
                    checked={notificationSettings.desktopNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, desktopNotifications: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Label>Sound Effects</Label>
                    {notificationSettings.soundEnabled ? 
                      <Volume2 className="h-4 w-4 text-muted-foreground" /> : 
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                    }
                    <p className="text-sm text-muted-foreground">Play sound for notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.soundEnabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, soundEnabled: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Visibility</CardTitle>
                <CardDescription>Control who can see your profile and activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select 
                    value={privacySettings.profileVisibility} 
                    onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see</SelectItem>
                      <SelectItem value="students">Students Only</SelectItem>
                      <SelectItem value="private">Private - Only me</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Online Status</Label>
                    <p className="text-sm text-muted-foreground">Let others see when you're online</p>
                  </div>
                  <Switch
                    checked={privacySettings.showOnlineStatus}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, showOnlineStatus: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Learning Activity</Label>
                    <p className="text-sm text-muted-foreground">Display your course progress publicly</p>
                  </div>
                  <Switch
                    checked={privacySettings.showLearningActivity}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, showLearningActivity: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Achievements</Label>
                    <p className="text-sm text-muted-foreground">Display your badges and certificates</p>
                  </div>
                  <Switch
                    checked={privacySettings.showAchievements}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, showAchievements: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data & Analytics</CardTitle>
                <CardDescription>Manage how your data is used for improving the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Collection</Label>
                    <p className="text-sm text-muted-foreground">Help improve the platform with usage data</p>
                  </div>
                  <Switch
                    checked={privacySettings.dataCollection}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, dataCollection: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">Share analytics for personalized recommendations</p>
                  </div>
                  <Switch
                    checked={privacySettings.analytics}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, analytics: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>Secure your account with additional authentication methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant={securitySettings.twoFactorEnabled ? "default" : "outline"} size="sm">
                    {securitySettings.twoFactorEnabled ? "Enabled" : "Enable 2FA"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    checked={securitySettings.loginAlerts}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, loginAlerts: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
                <CardDescription>Control how long you stay logged in</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Session Timeout</Label>
                  <Select 
                    value={securitySettings.sessionTimeout} 
                    onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: value }))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Logout</Label>
                    <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                  </div>
                  <Switch
                    checked={securitySettings.autoLogout}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, autoLogout: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions that affect your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    These actions cannot be undone. Please proceed with caution.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export My Data
                  </Button>
                  <p className="text-sm text-muted-foreground">Download all your account data and course progress</p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button variant="destructive" className="w-full justify-start" onClick={handleDeleteAccount}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
