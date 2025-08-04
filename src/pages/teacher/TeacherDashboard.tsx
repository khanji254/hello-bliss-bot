import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Eye,
  Star,
  Calendar,
  Activity,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const earningsData = [
  { month: 'Jan', earnings: 1200 },
  { month: 'Feb', earnings: 1800 },
  { month: 'Mar', earnings: 1600 },
  { month: 'Apr', earnings: 2200 },
  { month: 'May', earnings: 2800 },
  { month: 'Jun', earnings: 3200 },
];

const courses = [
  {
    id: "1",
    title: "Arduino for Beginners",
    students: 145,
    rating: 4.8,
    revenue: "$2,150",
    status: "Published",
    lastUpdated: "2 days ago"
  },
  {
    id: "2",
    title: "Advanced ROS Programming", 
    students: 89,
    rating: 4.9,
    revenue: "$3,200",
    status: "Published",
    lastUpdated: "1 week ago"
  },
  {
    id: "3",
    title: "Circuit Design Masterclass",
    students: 0,
    rating: 0,
    revenue: "$0",
    status: "Draft",
    lastUpdated: "Just now"
  }
];

const recentActivities = [
  {
    type: "enrollment",
    message: "John Doe enrolled in Arduino for Beginners",
    time: "2 hours ago"
  },
  {
    type: "review",
    message: "Sarah Chen left a 5-star review",
    time: "5 hours ago"
  },
  {
    type: "completion",
    message: "Mike Johnson completed Circuit Design Masterclass",
    time: "1 day ago"
  },
  {
    type: "payment",
    message: "Received payment of $49.99",
    time: "2 days ago"
  }
];

export default function TeacherDashboard() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Dr. Sarah!</h1>
            <p className="text-muted-foreground mt-2">
              Manage your courses, track your earnings, and engage with your students.
            </p>
          </div>
          <div className="flex gap-4 mt-4 lg:mt-0">
            <Button asChild>
              <Link to="/teacher/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/teacher/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,200</div>
              <p className="text-xs text-muted-foreground">
                +14% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Course Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                1 in draft
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Earnings Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Earnings Overview
                </CardTitle>
                <CardDescription>
                  Your monthly earnings for the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Earnings']} />
                    <Line 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Course Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                My Courses
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/teacher/courses">
                  View All
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          {course.students} students
                        </span>
                        {course.rating > 0 && (
                          <span className="flex items-center">
                            <Star className="mr-1 h-3 w-3" />
                            {course.rating}
                          </span>
                        )}
                        <span>{course.revenue}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={course.status === "Published" ? "default" : "secondary"}>
                      {course.status}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/teacher/courses/${course.id}`}>
                        <Eye className="mr-1 h-3 w-3" />
                        Manage
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}