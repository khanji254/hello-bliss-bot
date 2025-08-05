import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { mockCourses, mockStudent } from "@/lib/mockData";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  GraduationCap,
  Trophy,
  BookOpen,
  Clock,
  Settings,
  Bell,
  Shield,
  Eye,
  Edit3,
  Camera,
  Save,
  X
} from "lucide-react";

export default function StudentProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Mock user profile data
  const [profileData, setProfileData] = useState({
    firstName: "Alex",
    lastName: "Chen",
    email: "alex.chen@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    dateOfBirth: "1998-03-15",
    institution: "UC Berkeley",
    major: "Computer Science",
    yearOfStudy: "Junior",
    bio: "Passionate about robotics and AI. Currently exploring autonomous systems and machine learning applications in robotics.",
    interests: ["Robotics", "AI/ML", "Circuit Design", "Programming", "3D Printing"],
    learningGoals: "Master ROS development and build autonomous robots",
    githubProfile: "https://github.com/alexchen",
    linkedinProfile: "https://linkedin.com/in/alexchen"
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyProgress: true,
    courseUpdates: true,
    marketing: false,
    publicProfile: false,
    showProgress: true,
    showAchievements: true
  });

  if (!user) return null;

  // Get user stats
  const enrolledCourses = mockCourses.filter(course => 
    mockStudent.enrolledCourses.includes(course.id)
  );
  const completedCourses = mockCourses.filter(course => 
    mockStudent.completedCourses.includes(course.id)
  );

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to a backend
    console.log("Profile updated:", profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset any changes
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle image upload
      console.log("Uploading image:", file.name);
    }
  };

  const ProfileField = ({ label, value, name, type = "text", options = null }) => {
    if (!isEditing) {
      return (
        <div className="space-y-1">
          <Label className="text-sm font-medium">{label}</Label>
          <p className="text-sm text-muted-foreground">{value || "Not provided"}</p>
        </div>
      );
    }

    if (type === "select" && options) {
      return (
        <div className="space-y-2">
          <Label htmlFor={name}>{label}</Label>
          <Select value={value} onValueChange={(newValue) => 
            setProfileData(prev => ({ ...prev, [name]: newValue }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (type === "textarea") {
      return (
        <div className="space-y-2">
          <Label htmlFor={name}>{label}</Label>
          <Textarea
            id={name}
            value={value}
            onChange={(e) => setProfileData(prev => ({ ...prev, [name]: e.target.value }))}
            rows={3}
          />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <Input
          id={name}
          type={type}
          value={value}
          onChange={(e) => setProfileData(prev => ({ ...prev, [name]: e.target.value }))}
        />
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account and learning preferences
            </p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Profile Overview Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                  <AvatarFallback className="text-lg">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 cursor-pointer transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <Badge variant="secondary">{user?.role || "Student"}</Badge>
                </div>
                <p className="text-muted-foreground mb-4">{profileData.bio}</p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{enrolledCourses.length}</div>
                    <div className="text-sm text-muted-foreground">Active Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{completedCourses.length}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">12</div>
                    <div className="text-sm text-muted-foreground">Achievements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">156h</div>
                    <div className="text-sm text-muted-foreground">Study Time</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="academic">
              <GraduationCap className="mr-2 h-4 w-4" />
              Academic
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="mr-2 h-4 w-4" />
              Privacy
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    label="First Name"
                    value={profileData.firstName}
                    name="firstName"
                  />
                  <ProfileField
                    label="Last Name"
                    value={profileData.lastName}
                    name="lastName"
                  />
                  <ProfileField
                    label="Email"
                    value={profileData.email}
                    name="email"
                    type="email"
                  />
                  <ProfileField
                    label="Phone"
                    value={profileData.phone}
                    name="phone"
                    type="tel"
                  />
                  <ProfileField
                    label="Location"
                    value={profileData.location}
                    name="location"
                  />
                  <ProfileField
                    label="Date of Birth"
                    value={profileData.dateOfBirth}
                    name="dateOfBirth"
                    type="date"
                  />
                </div>
                
                <Separator />
                
                <ProfileField
                  label="Bio"
                  value={profileData.bio}
                  name="bio"
                  type="textarea"
                />
                
                <div className="space-y-2">
                  <Label>Interests</Label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">{interest}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Profiles</CardTitle>
                <CardDescription>Connect your professional profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProfileField
                  label="GitHub Profile"
                  value={profileData.githubProfile}
                  name="githubProfile"
                  type="url"
                />
                <ProfileField
                  label="LinkedIn Profile"
                  value={profileData.linkedinProfile}
                  name="linkedinProfile"
                  type="url"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="academic" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>Your educational background and goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    label="Institution"
                    value={profileData.institution}
                    name="institution"
                  />
                  <ProfileField
                    label="Major/Field of Study"
                    value={profileData.major}
                    name="major"
                  />
                  <ProfileField
                    label="Year of Study"
                    value={profileData.yearOfStudy}
                    name="yearOfStudy"
                    type="select"
                    options={["Freshman", "Sophomore", "Junior", "Senior", "Graduate", "PhD"]}
                  />
                </div>
                
                <Separator />
                
                <ProfileField
                  label="Learning Goals"
                  value={profileData.learningGoals}
                  name="learningGoals"
                  type="textarea"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Statistics</CardTitle>
                <CardDescription>Your progress and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{enrolledCourses.length}</div>
                    <div className="text-sm text-muted-foreground">Enrolled Courses</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{completedCourses.length}</div>
                    <div className="text-sm text-muted-foreground">Completed Courses</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">156h</div>
                    <div className="text-sm text-muted-foreground">Total Study Time</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">23</div>
                    <div className="text-sm text-muted-foreground">Study Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified about updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications</p>
                    </div>
                    <Switch
                      checked={preferences.pushNotifications}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Progress Reports</Label>
                      <p className="text-sm text-muted-foreground">Get weekly learning summaries</p>
                    </div>
                    <Switch
                      checked={preferences.weeklyProgress}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, weeklyProgress: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Course Updates</Label>
                      <p className="text-sm text-muted-foreground">Notifications about course changes</p>
                    </div>
                    <Switch
                      checked={preferences.courseUpdates}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, courseUpdates: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Communications</Label>
                      <p className="text-sm text-muted-foreground">Promotional content and offers</p>
                    </div>
                    <Switch
                      checked={preferences.marketing}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, marketing: checked }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your profile and progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Public Profile</Label>
                      <p className="text-sm text-muted-foreground">Make your profile visible to other students</p>
                    </div>
                    <Switch
                      checked={preferences.publicProfile}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, publicProfile: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Progress</Label>
                      <p className="text-sm text-muted-foreground">Display your learning progress publicly</p>
                    </div>
                    <Switch
                      checked={preferences.showProgress}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, showProgress: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Achievements</Label>
                      <p className="text-sm text-muted-foreground">Display your badges and certificates</p>
                    </div>
                    <Switch
                      checked={preferences.showAchievements}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, showAchievements: checked }))
                      }
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Account Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="mr-2 h-4 w-4" />
                      Download My Data
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
