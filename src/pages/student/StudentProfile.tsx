import { useState, useEffect, useMemo } from "react";
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
import { useStudentCourses, useStudentDashboard } from "@/hooks/useStudentData";
import { authApi } from "@/lib/api";
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
  X,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function StudentProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch real student data
  const { data: dashboardData, isLoading: dashboardLoading } = useStudentDashboard();
  const { courses: studentCourses, isLoading: coursesLoading } = useStudentCourses();
  
  // Real profile data from backend
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    dateOfBirth: "",
    institution: "",
    major: "",
    yearOfStudy: "",
    bio: "",
    interests: [] as string[],
    learningGoals: "",
    githubProfile: "",
    linkedinProfile: ""
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

  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const data = await authApi.getProfile();
      
      setCurrentUser(prev => ({
        ...prev,
        ...data,
        avatar: data.avatar
      }));
      
      setProfileData({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        dateOfBirth: data.date_of_birth || "",
        institution: data.institution || "",
        major: data.major || "",
        yearOfStudy: data.year_of_study || "",
        bio: data.bio || "",
        interests: Array.isArray(data.interests) ? data.interests : [],
        learningGoals: data.learning_goals || "",
        githubProfile: data.github_profile || "",
        linkedinProfile: data.linkedin_profile || ""
      });

      setPreferences({
        emailNotifications: data.email_notifications ?? true,
        pushNotifications: data.push_notifications ?? false,
        weeklyProgress: data.weekly_progress ?? true,
        courseUpdates: data.course_updates ?? true,
        marketing: data.marketing ?? false,
        publicProfile: data.public_profile ?? false,
        showProgress: data.show_progress ?? true,
        showAchievements: data.show_achievements ?? true
      });
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updateData = {
        first_name: profileData.firstName.trim(),
        last_name: profileData.lastName.trim(),
        phone: profileData.phone.trim(),
        location: profileData.location.trim(),
        date_of_birth: profileData.dateOfBirth ? profileData.dateOfBirth : null,
        institution: profileData.institution.trim(),
        major: profileData.major.trim(),
        year_of_study: profileData.yearOfStudy,
        bio: profileData.bio.trim(),
        interests: Array.isArray(profileData.interests) ? profileData.interests.filter(i => i.trim()) : [],
        learning_goals: profileData.learningGoals.trim(),
        github_profile: profileData.githubProfile.trim(),
        linkedin_profile: profileData.linkedinProfile.trim(),
        email_notifications: preferences.emailNotifications,
        push_notifications: preferences.pushNotifications,
        weekly_progress: preferences.weeklyProgress,
        course_updates: preferences.courseUpdates,
        marketing: preferences.marketing,
        public_profile: preferences.publicProfile,
        show_progress: preferences.showProgress,
        show_achievements: preferences.showAchievements
      };

      const result = await authApi.updateProfile(updateData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      await fetchProfileData();
    } catch (error: any) {
      console.error("Profile update error:", error);
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          const errorMessages = Object.entries(errorData)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          toast.error(`Validation errors: ${errorMessages}`);
        } else {
          toast.error(`Failed to update profile: ${errorData}`);
        }
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfileData();
  };

  const displayHelpers = useMemo(() => {
    const getDisplayName = () => {
      if (profileData.firstName && profileData.lastName) {
        return `${profileData.firstName} ${profileData.lastName}`;
      }
      return currentUser?.name || "Student";
    };

    const getInitials = () => {
      const name = getDisplayName();
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const getAvatarUrl = () => {
      if (currentUser?.avatar) {
        return currentUser.avatar;
      }
      return authApi.generateAvatarUrl(getDisplayName());
    };

    return { getDisplayName, getInitials, getAvatarUrl };
  }, [profileData.firstName, profileData.lastName, currentUser?.name, currentUser?.avatar]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
          return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          toast.error("File size must be less than 5MB");
          return;
        }

        const formData = new FormData();
        formData.append('avatar', file);
        
        toast.loading("Uploading avatar...");
        await authApi.uploadAvatar(formData);
        toast.dismiss();
        toast.success("Avatar updated successfully!");
        
        await fetchProfileData();
        event.target.value = '';
      } catch (error: any) {
        console.error("Avatar upload error:", error);
        toast.dismiss();
        toast.error("Failed to upload avatar: " + (error.message || "Unknown error"));
      }
    }
  };

  // SIMPLE handlers - NO complications
  const handleFieldChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  if (!currentUser) return null;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const enrolledCourses = studentCourses?.filter(sc => 
    sc.status === 'enrolled' || sc.status === 'in_progress'
  ) || [];
  const completedCourses = studentCourses?.filter(sc => 
    sc.status === 'completed'
  ) || [];

  const totalPoints = dashboardData?.progress?.totalPoints || 0;
  const totalBadges = dashboardData?.progress?.badges || 0;
  const studyTimeHours = dashboardData?.progress?.studyTime ? Math.round(dashboardData.progress.studyTime / 60) : 0;

  return (
    <Layout>
      <div className="space-y-8">
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
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={displayHelpers.getAvatarUrl()} 
                    alt="Profile"
                    key={currentUser?.avatar || 'default'}
                  />
                  <AvatarFallback className="text-lg">
                    {displayHelpers.getInitials()}
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

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">
                    {displayHelpers.getDisplayName()}
                  </h2>
                  <Badge variant="secondary">{currentUser?.role || "Student"}</Badge>
                </div>
                <p className="text-muted-foreground mb-4">{profileData.bio || "No bio provided yet"}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {coursesLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : enrolledCourses.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {coursesLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : completedCourses.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">
                      {dashboardLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : totalBadges}
                    </div>
                    <div className="text-sm text-muted-foreground">Achievements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {dashboardLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : `${studyTimeHours}h`}
                    </div>
                    <div className="text-sm text-muted-foreground">Study Time</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.firstName}
                        onChange={(e) => handleFieldChange('firstName', e.target.value)}
                        placeholder="Enter first name"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profileData.firstName || "Not provided"}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.lastName}
                        onChange={(e) => handleFieldChange('lastName', e.target.value)}
                        placeholder="Enter last name"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profileData.lastName || "Not provided"}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">{profileData.email || "Not provided"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profileData.phone || "Not provided"}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.location}
                        onChange={(e) => handleFieldChange('location', e.target.value)}
                        placeholder="Enter location"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profileData.location || "Not provided"}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profileData.dateOfBirth || "Not provided"}</p>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Bio</Label>
                  {isEditing ? (
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => handleFieldChange('bio', e.target.value)}
                      rows={3}
                      placeholder="Enter bio"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profileData.bio || "Not provided"}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Interests</Label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.length > 0 ? (
                      profileData.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">{interest}</Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No interests added yet</p>
                    )}
                  </div>
                  {isEditing && (
                    <Input
                      placeholder="Add interests (comma-separated)"
                      value={profileData.interests.join(', ')}
                      onChange={(e) => {
                        const interests = e.target.value.split(',').map(i => i.trim()).filter(i => i);
                        setProfileData(prev => ({ ...prev, interests }));
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Profiles</CardTitle>
                <CardDescription>Connect your professional profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>GitHub Profile</Label>
                  {isEditing ? (
                    <Input
                      type="url"
                      value={profileData.githubProfile}
                      onChange={(e) => handleFieldChange('githubProfile', e.target.value)}
                      placeholder="Enter GitHub profile URL"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profileData.githubProfile || "Not provided"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn Profile</Label>
                  {isEditing ? (
                    <Input
                      type="url"
                      value={profileData.linkedinProfile}
                      onChange={(e) => handleFieldChange('linkedinProfile', e.target.value)}
                      placeholder="Enter LinkedIn profile URL"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profileData.linkedinProfile || "Not provided"}</p>
                  )}
                </div>
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
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.institution}
                        onChange={(e) => handleFieldChange('institution', e.target.value)}
                        placeholder="Enter institution"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profileData.institution || "Not provided"}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Major/Field of Study</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.major}
                        onChange={(e) => handleFieldChange('major', e.target.value)}
                        placeholder="Enter major"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profileData.major || "Not provided"}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Year of Study</Label>
                    {isEditing ? (
                      <Select value={profileData.yearOfStudy} onValueChange={(value) => handleFieldChange('yearOfStudy', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year of study" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="freshman">Freshman</SelectItem>
                          <SelectItem value="sophomore">Sophomore</SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-muted-foreground">{profileData.yearOfStudy || "Not provided"}</p>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Learning Goals</Label>
                  {isEditing ? (
                    <Textarea
                      value={profileData.learningGoals}
                      onChange={(e) => handleFieldChange('learningGoals', e.target.value)}
                      rows={3}
                      placeholder="Enter learning goals"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{profileData.learningGoals || "Not provided"}</p>
                  )}
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