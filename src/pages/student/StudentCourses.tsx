import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCard } from "@/components/shared/CourseCard";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentCourses, useCourses } from "@/hooks/useStudentData";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Play,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function StudentCourses() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("enrolled");
  
  // Fetch student's courses
  const { courses: studentCourses, isLoading: studentCoursesLoading, error: studentCoursesError, enrollInCourse } = useStudentCourses();
  
  // Fetch all available courses for browse tab
  const { courses: allCourses, isLoading: allCoursesLoading } = useCourses();
  
  if (!user) return null;

  // Filter courses by status
  const enrolledCourses = studentCourses.filter(sc => 
    sc.status === 'enrolled' || sc.status === 'in_progress'
  );
  const completedCourses = studentCourses.filter(sc => 
    sc.status === 'completed'
  );

  // Calculate total study time from enrolled courses (mock calculation)
  const totalStudyTime = studentCourses.reduce((total, sc) => {
    return total + (sc.course.modules?.length || 0) * 15; // Estimate 15 min per module
  }, 0);

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollInCourse(courseId);
      toast.success("Successfully enrolled in course!");
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll in course");
    }
  };

  const CourseProgressCard = ({ studentCourse, isCompleted = false }) => {
    const { course, progressPercentage } = studentCourse;
    
    return (
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
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>{course.modules?.length || 0} modules</span>
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
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        <p className="text-muted-foreground">Loading courses...</p>
      </div>
    </div>
  );

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="text-center py-12">
      <p className="text-destructive mb-2">Failed to load courses</p>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
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
                  <p className="text-2xl font-bold">
                    {studentCoursesLoading ? '-' : enrolledCourses.length}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {studentCoursesLoading ? '-' : completedCourses.length}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {studentCoursesLoading ? '-' : `${Math.round(totalStudyTime / 60)}h`}
                  </p>
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
              Enrolled ({studentCoursesLoading ? '-' : enrolledCourses.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({studentCoursesLoading ? '-' : completedCourses.length})
            </TabsTrigger>
            <TabsTrigger value="browse">
              Browse More
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="enrolled" className="space-y-6 mt-6">
            {studentCoursesLoading ? (
              <LoadingSpinner />
            ) : studentCoursesError ? (
              <ErrorMessage message={studentCoursesError} />
            ) : enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {enrolledCourses.map((studentCourse) => (
                  <CourseProgressCard 
                    key={studentCourse.id} 
                    studentCourse={studentCourse}
                    isCompleted={false}
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
            {studentCoursesLoading ? (
              <LoadingSpinner />
            ) : studentCoursesError ? (
              <ErrorMessage message={studentCoursesError} />
            ) : completedCourses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {completedCourses.map((studentCourse) => (
                  <CourseProgressCard 
                    key={studentCourse.id} 
                    studentCourse={studentCourse}
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
            {allCoursesLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allCourses.slice(0, 6).map((course) => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      onEnroll={handleEnroll}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <Button variant="outline" asChild>
                    <Link to="/marketplace">View All Courses</Link>
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}