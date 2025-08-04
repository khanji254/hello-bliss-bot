import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Zap, 
  Play, 
  Calendar,
  TrendingUp,
  Target,
  Award,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

const recentCourses = [
  {
    id: "1",
    title: "Arduino Fundamentals",
    progress: 75,
    nextLesson: "Servo Motor Control",
    instructor: "Dr. Sarah Chen",
    thumbnail: "/course-arduino.jpg"
  },
  {
    id: "2", 
    title: "ROS Basics",
    progress: 30,
    nextLesson: "Understanding Nodes",
    instructor: "Prof. Mike Johnson",
    thumbnail: "/course-ros.jpg"
  },
  {
    id: "3",
    title: "Circuit Design",
    progress: 90,
    nextLesson: "Final Project",
    instructor: "Emily Rodriguez",
    thumbnail: "/course-circuits.jpg"
  }
];

const upcomingLessons = [
  {
    title: "Sensor Integration Workshop",
    time: "Today, 2:00 PM",
    type: "Live Session"
  },
  {
    title: "Robot Kinematics",
    time: "Tomorrow, 10:00 AM", 
    type: "Video Lesson"
  },
  {
    title: "Project Review",
    time: "Friday, 3:00 PM",
    type: "Assignment Due"
  }
];

const achievements = [
  { name: "First Circuit", icon: "🔌", earned: true },
  { name: "Code Master", icon: "💻", earned: true },
  { name: "Robot Builder", icon: "🤖", earned: false },
  { name: "Team Player", icon: "👥", earned: true }
];

export default function StudentDashboard() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Alex!</h1>
            <p className="text-muted-foreground mt-2">
              Ready to continue your robotics journey? You're making great progress!
            </p>
          </div>
          <div className="flex gap-4 mt-4 lg:mt-0">
            <Button asChild>
              <Link to="/simulations">
                <Zap className="mr-2 h-4 w-4" />
                Quick Simulation
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/marketplace">
                Browse Courses
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                +2 this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15 days</div>
              <p className="text-xs text-muted-foreground">
                Keep it up! 🔥
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,450</div>
              <p className="text-xs text-muted-foreground">
                Level 7 - Intermediate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                2 pending completion
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Play className="mr-2 h-5 w-5 text-primary" />
                  Continue Learning
                </CardTitle>
                <CardDescription>
                  Pick up where you left off
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">Next: {course.nextLesson}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Progress value={course.progress} className="flex-1" />
                        <span className="text-sm text-muted-foreground">{course.progress}%</span>
                      </div>
                    </div>
                    <Button size="sm" asChild>
                      <Link to={`/courses/${course.id}`}>
                        Continue
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingLessons.map((lesson, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">{lesson.time}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {lesson.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg text-center ${
                        achievement.earned 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'bg-muted/50 opacity-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <p className="text-xs font-medium">{achievement.name}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link to="/student/progress">
                    View All Badges
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}