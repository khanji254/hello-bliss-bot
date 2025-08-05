import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCard } from "@/components/shared/CourseCard";
import { useAuth } from "@/contexts/AuthContext";
import { mockCourses, mockStudent } from "@/lib/mockData";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Play,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentCourses() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("enrolled");
  
  if (!user) return null;

  // Get enrolled courses
  const enrolledCourses = mockCourses.filter(course => 
    mockStudent.enrolledCourses.includes(course.id)
  );

  // Get completed courses
  const completedCourses = mockCourses.filter(course => 
    mockStudent.completedCourses.includes(course.id)
  );

  // Mock progress data for courses
  const courseProgress = {
    'course_1': 85,
    'course_2': 45,
    'course_3': 100
  };

  const CourseProgressCard = ({ course, progress = 0, isCompleted = false }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
            <CardDescription className="line-clamp-2">{course.description}</CardDescription>
          </div>
          <Badge variant={isCompleted ? "default" : "secondary"} className="ml-2">
            {isCompleted ? "Completed" : "In Progress"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>{course.modules.length} modules</span>
          </div>
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-500" />
            )}
            <span>{course.level}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1" asChild>
            <Link to={`/courses/${course.id}`}>
              <Play className="mr-2 h-4 w-4" />
              {isCompleted ? "Review" : "Continue"}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/courses/${course.id}/progress`}>
              View Progress
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground mt-2">
            Track your learning progress and continue your robotics journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{enrolledCourses.length}</p>
                  <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{completedCourses.length}</p>
                  <p className="text-sm text-muted-foreground">Completed Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">45h</p>
                  <p className="text-sm text-muted-foreground">Total Study Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="enrolled">
              Enrolled ({enrolledCourses.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedCourses.length})
            </TabsTrigger>
            <TabsTrigger value="browse">
              Browse More
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="enrolled" className="space-y-6 mt-6">
            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {enrolledCourses.map((course) => (
                  <CourseProgressCard 
                    key={course.id} 
                    course={course} 
                    progress={courseProgress[course.id] || 0}
                    isCompleted={completedCourses.some(c => c.id === course.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No enrolled courses</h3>
                <p className="text-muted-foreground mb-4">
                  Start your learning journey by enrolling in a course
                </p>
                <Button asChild>
                  <Link to="/marketplace">Browse Courses</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6 mt-6">
            {completedCourses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {completedCourses.map((course) => (
                  <CourseProgressCard 
                    key={course.id} 
                    course={course} 
                    progress={100}
                    isCompleted={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No completed courses yet</h3>
                <p className="text-muted-foreground">
                  Complete your enrolled courses to see them here
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="browse" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCourses.slice(0, 6).map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onEnroll={(courseId) => console.log(`Enrolling in: ${courseId}`)}
                />
              ))}
            </div>
            <div className="text-center">
              <Button variant="outline" asChild>
                <Link to="/marketplace">View All Courses</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
