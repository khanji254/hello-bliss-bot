// src/pages/student/StudentCourses.tsx
// Fixed to handle API response properly

import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCard } from "@/components/shared/CourseCard";
import { useStudentCourses, useCourses } from "@/hooks/useStudentData";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendingUp,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentCourses() {
  const [activeTab, setActiveTab] = useState("enrolled");
  
  // Get student's enrolled courses
  const { 
    courses: enrolledCourses, 
    isLoading: loadingEnrolled, 
    error: errorEnrolled 
  } = useStudentCourses();
  
  // Get all courses for "Browse More" section
  const { 
    courses: allCourses, 
    isLoading: loadingAll, 
    error: errorAll 
  } = useCourses();

  // Filter courses by status
  const inProgressCourses = enrolledCourses.filter(
    (enrollment: any) => enrollment.status === 'in_progress' || enrollment.status === 'enrolled'
  );
  
  const completedCourses = enrolledCourses.filter(
    (enrollment: any) => enrollment.status === 'completed'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'enrolled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const renderCourseStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{enrolledCourses.length}</div>
          <p className="text-xs text-muted-foreground">
            Total courses enrolled
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedCourses.length}</div>
          <p className="text-xs text-muted-foreground">
            Courses completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressCourses.length}</div>
          <p className="text-xs text-muted-foreground">
            Currently learning
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Study Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0h</div>
          <p className="text-xs text-muted-foreground">
            Total study time
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderCourseList = (courses: any[], showProgress = true) => {
    if (!courses || courses.length === 0) {
      return (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">
            {activeTab === 'enrolled' 
              ? "You haven't enrolled in any courses yet." 
              : "You haven't completed any courses yet."
            }
          </p>
          {activeTab === 'enrolled' && (
            <Button asChild>
              <Link to="/marketplace">Browse Courses</Link>
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((enrollment: any) => {
          const course = enrollment.course || enrollment; // Handle both enrollment and course objects
          
          return (
            <Card key={enrollment.id || course.id} className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-primary/60" />
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  {enrollment.status && (
                    <Badge className={getStatusColor(enrollment.status)}>
                      {enrollment.status.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  by {course.teacher_name || course.teacherName}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {showProgress && enrollment.progress_percentage !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(enrollment.progress_percentage)}%</span>
                    </div>
                    <Progress value={enrollment.progress_percentage} className="w-full" />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link to={`/student/courses/${course.id}`}>
                      {enrollment.status === 'completed' ? 'Review' : 'Continue'}
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to={`/courses/${course.slug || course.id}`}>Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  if (loadingEnrolled) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading your courses...</span>
        </div>
      </Layout>
    );
  }

  if (errorEnrolled) {
    return (
      <Layout>
        <div className="flex flex-col items-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Courses</h3>
          <p className="text-muted-foreground mb-4">{errorEnrolled}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }

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

        {/* Course Statistics */}
        {renderCourseStats()}

        {/* Course Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="enrolled">
              Enrolled ({inProgressCourses.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedCourses.length})
            </TabsTrigger>
            <TabsTrigger value="browse">
              Browse More
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled" className="mt-8">
            {renderCourseList(inProgressCourses)}
          </TabsContent>

          <TabsContent value="completed" className="mt-8">
            {renderCourseList(completedCourses, false)}
          </TabsContent>

          <TabsContent value="browse" className="mt-8">
            {loadingAll ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading courses...</span>
              </div>
            ) : errorAll ? (
              <div className="text-center py-8">
                <p className="text-red-500">Error loading courses: {errorAll}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.slice(0, 6).map((course: any) => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    showEnrollButton={true}
                  />
                ))}
              </div>
            )}
            
            {!loadingAll && !errorAll && (
              <div className="text-center mt-8">
                <Button asChild size="lg">
                  <Link to="/marketplace">View All Courses</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}