import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  DollarSign,
  Star,
  Clock,
  Target,
  Trophy,
  Award,
  Download,
  Calendar,
  Eye,
  Play,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  CheckCircle,
  Activity
} from "lucide-react";

export default function TeacherAnalytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");

  // Mock analytics data
  const overviewStats = {
    totalStudents: 67,
    activeStudents: 54,
    totalCourses: 4,
    publishedCourses: 2,
    totalRevenue: 12450,
    monthlyRevenue: 2160,
    averageRating: 4.8,
    totalRatings: 89,
    completionRate: 78,
    engagementRate: 85
  };

  const revenueData = [
    { month: "Jan", revenue: 1200, students: 15 },
    { month: "Feb", revenue: 1850, students: 22 },
    { month: "Mar", revenue: 2160, students: 28 },
    { month: "Apr", revenue: 1980, students: 26 },
    { month: "May", revenue: 2340, students: 32 },
    { month: "Jun", revenue: 2920, students: 38 }
  ];

  const coursePerformance = [
    {
      id: "course_1",
      title: "Robotics Fundamentals",
      students: 24,
      completion: 85,
      rating: 4.8,
      revenue: 2400,
      engagementTime: "4.2h avg",
      lastWeekEnrollments: 3,
      trend: "up"
    },
    {
      id: "course_2", 
      title: "Advanced ROS Development",
      students: 16,
      completion: 78,
      rating: 4.9,
      revenue: 2400,
      engagementTime: "6.1h avg",
      lastWeekEnrollments: 2,
      trend: "up"
    },
    {
      id: "course_3",
      title: "Circuit Design for Robotics",
      students: 0,
      completion: 0,
      rating: 0,
      revenue: 0,
      engagementTime: "0h",
      lastWeekEnrollments: 0,
      trend: "neutral"
    }
  ];

  const studentEngagement = [
    { day: "Mon", activeStudents: 42, totalTime: 156 },
    { day: "Tue", activeStudents: 38, totalTime: 142 },
    { day: "Wed", activeStudents: 45, totalTime: 178 },
    { day: "Thu", activeStudents: 41, totalTime: 163 },
    { day: "Fri", activeStudents: 36, totalTime: 134 },
    { day: "Sat", activeStudents: 28, totalTime: 98 },
    { day: "Sun", activeStudents: 31, totalTime: 112 }
  ];

  const topPerformingContent = [
    { title: "Introduction to ROS", views: 156, completion: 92, avgTime: "18 min" },
    { title: "Circuit Basics", views: 134, completion: 88, avgTime: "22 min" },
    { title: "Programming Robots", views: 128, completion: 85, avgTime: "35 min" },
    { title: "Sensor Integration", views: 112, completion: 79, avgTime: "28 min" },
    { title: "Robot Navigation", views: 98, completion: 76, avgTime: "31 min" }
  ];

  const recentFeedback = [
    {
      id: 1,
      student: "Alex Chen",
      course: "Robotics Fundamentals",
      rating: 5,
      comment: "Excellent course! Very clear explanations and practical examples.",
      date: "2 days ago"
    },
    {
      id: 2,
      student: "Maya Patel", 
      course: "Advanced ROS Development",
      rating: 5,
      comment: "Deep dive into ROS was exactly what I needed. Great instructor!",
      date: "3 days ago"
    },
    {
      id: 3,
      student: "Jordan Smith",
      course: "Robotics Fundamentals", 
      rating: 4,
      comment: "Good content, would love more hands-on exercises.",
      date: "1 week ago"
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Icon className="h-8 w-8 text-muted-foreground" />
            {trend && (
              <div className={`flex items-center gap-1 text-xs ${
                trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
              }`}>
                {getTrendIcon(trend)}
                {trendValue && <span>{trendValue}</span>}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EngagementChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Student Engagement
        </CardTitle>
        <CardDescription>Daily active students and study time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {studentEngagement.map((day) => (
            <div key={day.day} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium w-12">{day.day}</span>
                <span className="text-muted-foreground">{day.activeStudents} students</span>
                <span className="text-muted-foreground">{day.totalTime}h total</span>
              </div>
              <div className="flex gap-2">
                <Progress value={(day.activeStudents / 50) * 100} className="h-2 flex-1" />
                <Progress value={(day.totalTime / 200) * 100} className="h-2 flex-1" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const RevenueChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Revenue Trends
        </CardTitle>
        <CardDescription>Monthly revenue and student enrollment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {revenueData.map((data) => (
            <div key={data.month} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium w-12">{data.month}</span>
                <span className="text-green-600">${data.revenue}</span>
                <span className="text-muted-foreground">{data.students} students</span>
              </div>
              <Progress value={(data.revenue / 3000) * 100} className="h-3" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your teaching performance and student engagement
            </p>
          </div>
          <div className="flex gap-2">
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
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={overviewStats.totalStudents}
            subtitle={`${overviewStats.activeStudents} active`}
            icon={Users}
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Course Performance"
            value={`${overviewStats.completionRate}%`}
            subtitle="Avg completion rate"
            icon={Target}
            trend="up"
            trendValue="+5%"
          />
          <StatCard
            title="Revenue"
            value={`$${overviewStats.totalRevenue.toLocaleString()}`}
            subtitle={`$${overviewStats.monthlyRevenue} this month`}
            icon={DollarSign}
            trend="up"
            trendValue="+18%"
          />
          <StatCard
            title="Rating"
            value={overviewStats.averageRating}
            subtitle={`${overviewStats.totalRatings} reviews`}
            icon={Star}
            trend="up"
            trendValue="+0.2"
          />
        </div>

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Course Performance</TabsTrigger>
            <TabsTrigger value="students">Student Analytics</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EngagementChart />
              <RevenueChart />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Top Performing Content
                </CardTitle>
                <CardDescription>Most viewed and completed course modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformingContent.map((content, index) => (
                    <div key={content.title} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{content.title}</h4>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {content.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {content.completion}% completion
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {content.avgTime} avg
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-6">
              {coursePerformance.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {course.title}
                          {getTrendIcon(course.trend)}
                        </CardTitle>
                        <CardDescription>
                          {course.students} enrolled students • {course.engagementTime} engagement
                        </CardDescription>
                      </div>
                      <Badge variant={course.students > 0 ? "default" : "secondary"}>
                        {course.students > 0 ? "Active" : "Draft"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Completion Rate</span>
                          <span className="font-medium">{course.completion}%</span>
                        </div>
                        <Progress value={course.completion} className="h-2" />
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold flex items-center justify-center gap-1">
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                          {course.rating || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">Average Rating</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ${course.revenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Revenue</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          +{course.lastWeekEnrollments}
                        </div>
                        <div className="text-sm text-muted-foreground">This Week</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="students" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Distribution</CardTitle>
                  <CardDescription>Students by course and activity level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Students</span>
                      <span className="font-medium">{overviewStats.activeStudents}</span>
                    </div>
                    <Progress value={(overviewStats.activeStudents / overviewStats.totalStudents) * 100} />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Inactive Students</span>
                      <span className="font-medium">{overviewStats.totalStudents - overviewStats.activeStudents}</span>
                    </div>
                    <Progress value={((overviewStats.totalStudents - overviewStats.activeStudents) / overviewStats.totalStudents) * 100} />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                  <CardDescription>Key student engagement indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">85%</div>
                      <div className="text-sm text-muted-foreground">Engagement Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-500">4.2h</div>
                      <div className="text-sm text-muted-foreground">Avg Session</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-500">78%</div>
                      <div className="text-sm text-muted-foreground">Completion Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-500">92%</div>
                      <div className="text-sm text-muted-foreground">Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Revenue by Course</CardTitle>
                  <CardDescription>Earnings breakdown by individual courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {coursePerformance.filter(c => c.revenue > 0).map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">{course.students} students enrolled</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">${course.revenue}</div>
                          <div className="text-sm text-muted-foreground">
                            ${Math.round(course.revenue / course.students)}/student
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Summary</CardTitle>
                  <CardDescription>Financial overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Revenue</span>
                      <span className="font-medium">${overviewStats.totalRevenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">This Month</span>
                      <span className="font-medium text-green-600">${overviewStats.monthlyRevenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg per Student</span>
                      <span className="font-medium">${Math.round(overviewStats.totalRevenue / overviewStats.totalStudents)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Growth Rate</span>
                      <span className="font-medium text-green-600">+18%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="feedback" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                  <CardDescription>Latest student feedback on your courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentFeedback.map((feedback) => (
                      <div key={feedback.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{feedback.student}</span>
                            <Badge variant="outline">{feedback.course}</Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < feedback.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                        <p className="text-xs text-muted-foreground">{feedback.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Rating Breakdown</CardTitle>
                  <CardDescription>Distribution of student ratings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm">{rating}</span>
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      </div>
                      <Progress 
                        value={rating === 5 ? 75 : rating === 4 ? 20 : 5} 
                        className="flex-1 h-2" 
                      />
                      <span className="text-sm text-muted-foreground w-8">
                        {rating === 5 ? '67' : rating === 4 ? '18' : '4'}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
