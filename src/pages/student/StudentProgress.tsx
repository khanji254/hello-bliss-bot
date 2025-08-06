import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentCourses, useStudentDashboard } from "@/hooks/useStudentData";
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
  Activity,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentProgress() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("week");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch real data
  const { data: dashboardData, isLoading: dashboardLoading } = useStudentDashboard();
  const { courses: studentCourses, isLoading: coursesLoading } = useStudentCourses();
  
  if (!user) return null;

  // Filter courses by status
  const enrolledCourses = studentCourses.filter(sc => 
    sc.status === 'enrolled' || sc.status === 'in_progress'
  );
  const completedCourses = studentCourses.filter(sc => 
    sc.status === 'completed'
  );

  // Mock activity data (would come from activities API)
  const weeklyActivity = [
    { day: "Mon", hours: 2.5, completed: 3 },
    { day: "Tue", hours: 1.8, completed: 2 },
    { day: "Wed", hours: 3.2, completed: 4 },
    { day: "Thu", hours: 2.1, completed: 2 },
    { day: "Fri", hours: 1.5, completed: 1 },
    { day: "Sat", hours: 4.0, completed: 5 },
    { day: "Sun", hours: 2.8, completed: 3 }
  ];

  // Use real badges data
  const achievements = dashboardData?.badges?.map(badge => ({
    id: badge.id,
    title: badge.name,
    description: badge.description,
    icon: badge.icon,
    earned: true,
    date: badge.earnedAt.toISOString().split('T')[0]
  })) || [];

  // Add some mock future achievements
  const mockFutureAchievements = [
    {
      id: 'circuit_master',
      title: "Circuit Master",
      description: "Complete all circuit simulation courses",
      icon: "🔌",
      earned: false,
      progress: 60
    },
    {
      id: 'consistent_learner',
      title: "Consistent Learner",
      description: "Study for 7 consecutive days",
      icon: "📅",
      earned: false,
      progress: 85
    }
  ];

  const allAchievements = [...achievements, ...mockFutureAchievements];

  // Calculate overall stats from real data
  const totalHours = weeklyActivity.reduce((sum, day) => sum + day.hours, 0);
  const totalCompleted = weeklyActivity.reduce((sum, day) => sum + day.completed, 0);
  const avgProgress = enrolledCourses.length > 0 ? 
    enrolledCourses.reduce((sum, sc) => sum + sc.progressPercentage, 0) / enrolledCourses.length : 0;

  const ProgressCard = ({ studentCourse }) => {
    const { course, progressPercentage } = studentCourse;
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base line-clamp-1">{course.title}</CardTitle>
              <CardDescription className="text-sm">{course.teacherName}</CardDescription>
            </div>
            <Badge variant={progressPercentage === 100 ? "default" : "secondary"}>
              {progressPercentage === 100 ? "Complete" : `${Math.round(progressPercentage)}%`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{course.modules?.length || 0} modules</span>
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/courses/${course.id}`}>Continue</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

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

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        <p className="text-muted-foreground">Loading progress data...</p>
      </div>
    </div>
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
                  <p className="text-2xl font-bold">
                    {dashboardLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      `${Math.round((dashboardData?.progress?.studyTime || 0) / 60)}h`
                    )}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {coursesLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      studentCourses.reduce((total, sc) => total + (sc.course.modules?.length || 0), 0)
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {coursesLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      `${Math.round(avgProgress)}%`
                    )}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {dashboardLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      achievements.length
                    )}
                  </p>
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
                  {coursesLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      {enrolledCourses.slice(0, 3).map((studentCourse) => (
                        <div key={studentCourse.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium line-clamp-1">{studentCourse.course.title}</span>
                            <span>{Math.round(studentCourse.progressPercentage)}%</span>
                          </div>
                          <Progress value={studentCourse.progressPercentage} className="h-2" />
                        </div>
                      ))}
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/student/courses">View All Courses</Link>
                      </Button>
                    </>
                  )}
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
                  {dashboardLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      {achievements.slice(0, 3).map((achievement) => (
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
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Weekly Activity Chart */}
            <ActivityChart />
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6 mt-6">
            {coursesLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((studentCourse) => (
                  <ProgressCard 
                    key={studentCourse.id} 
                    studentCourse={studentCourse}
                  />
                ))}
              </div>
            )}
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
                    <div className="text-3xl font-bold text-orange-500">
                      {dashboardLoading ? (
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                      ) : (
                        dashboardData?.progress?.level || 1
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {dashboardLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      ) : (
                        dashboardData?.progress?.totalPoints || 0
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {dashboardLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      ) : (
                        `${Math.round((dashboardData?.progress?.studyTime || 0) / (dashboardData?.progress?.enrolledCourses || 1))}m`
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg per Course</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-6 mt-6">
            {dashboardLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allAchievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}