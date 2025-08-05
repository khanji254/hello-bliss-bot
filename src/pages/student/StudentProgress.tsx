import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { mockCourses, mockStudent } from "@/lib/mockData";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Target,
  TrendingUp,
  Calendar,
  Award,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentProgress() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("week");
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!user) return null;

  // Get enrolled courses
  const enrolledCourses = mockCourses.filter(course => 
    mockStudent.enrolledCourses.includes(course.id)
  );

  // Get completed courses
  const completedCourses = mockCourses.filter(course => 
    mockStudent.completedCourses.includes(course.id)
  );

  // Mock progress data
  const courseProgress = {
    'course_1': 85,
    'course_2': 45,
    'course_3': 100
  };

  // Mock activity data
  const weeklyActivity = [
    { day: "Mon", hours: 2.5, completed: 3 },
    { day: "Tue", hours: 1.8, completed: 2 },
    { day: "Wed", hours: 3.2, completed: 4 },
    { day: "Thu", hours: 2.1, completed: 2 },
    { day: "Fri", hours: 1.5, completed: 1 },
    { day: "Sat", hours: 4.0, completed: 5 },
    { day: "Sun", hours: 2.8, completed: 3 }
  ];

  // Mock achievements
  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first course module",
      icon: "🎯",
      earned: true,
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Speed Learner",
      description: "Complete 5 modules in one day",
      icon: "⚡",
      earned: true,
      date: "2024-01-20"
    },
    {
      id: 3,
      title: "Circuit Master",
      description: "Complete all circuit simulation courses",
      icon: "🔌",
      earned: false,
      progress: 60
    },
    {
      id: 4,
      title: "Consistent Learner",
      description: "Study for 7 consecutive days",
      icon: "📅",
      earned: false,
      progress: 85
    }
  ];

  // Calculate overall stats
  const totalHours = weeklyActivity.reduce((sum, day) => sum + day.hours, 0);
  const totalCompleted = weeklyActivity.reduce((sum, day) => sum + day.completed, 0);
  const avgProgress = enrolledCourses.length > 0 ? 
    enrolledCourses.reduce((sum, course) => sum + (courseProgress[course.id] || 0), 0) / enrolledCourses.length : 0;

  const ProgressCard = ({ course, progress }) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base line-clamp-1">{course.title}</CardTitle>
            <CardDescription className="text-sm">{course.instructor}</CardDescription>
          </div>
          <Badge variant={progress === 100 ? "default" : "secondary"}>
            {progress === 100 ? "Complete" : `${progress}%`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={progress} className="h-2" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{course.modules.length} modules</span>
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/courses/${course.id}`}>Continue</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ActivityChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Weekly Activity
        </CardTitle>
        <CardDescription>Your learning activity for this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weeklyActivity.map((day) => (
            <div key={day.day} className="flex items-center gap-4">
              <div className="w-12 text-sm font-medium">{day.day}</div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{day.hours}h studied</span>
                  <span>{day.completed} completed</span>
                </div>
                <Progress value={(day.hours / 4) * 100} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const AchievementCard = ({ achievement }) => (
    <Card className={achievement.earned ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{achievement.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm">{achievement.title}</h4>
              {achievement.earned && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
            {achievement.earned ? (
              <Badge variant="secondary" className="text-xs">
                Earned {new Date(achievement.date).toLocaleDateString()}
              </Badge>
            ) : (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span>{achievement.progress}%</span>
                </div>
                <Progress value={achievement.progress} className="h-1" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Learning Progress</h1>
            <p className="text-muted-foreground mt-2">
              Track your learning journey and achievements
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
                  <p className="text-sm text-muted-foreground">Study Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{totalCompleted}</p>
                  <p className="text-sm text-muted-foreground">Modules Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{avgProgress.toFixed(0)}%</p>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{achievements.filter(a => a.earned).length}</p>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Course Progress</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Current Courses
                  </CardTitle>
                  <CardDescription>Your active learning progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {enrolledCourses.slice(0, 3).map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium line-clamp-1">{course.title}</span>
                        <span>{courseProgress[course.id] || 0}%</span>
                      </div>
                      <Progress value={courseProgress[course.id] || 0} className="h-2" />
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/student/courses">View All Courses</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Recent Achievements
                  </CardTitle>
                  <CardDescription>Your latest accomplishments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {achievements.filter(a => a.earned).slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <div className="text-lg">{achievement.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {new Date(achievement.date).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("achievements")}>
                    View All Achievements
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Activity Chart */}
            <ActivityChart />
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <ProgressCard 
                  key={course.id} 
                  course={course} 
                  progress={courseProgress[course.id] || 0}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ActivityChart />
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Study Streaks
                  </CardTitle>
                  <CardDescription>Your learning consistency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500">7</div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-muted-foreground">Longest Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">4.2h</div>
                    <div className="text-sm text-muted-foreground">Daily Average</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
