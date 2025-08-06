import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressStats } from "@/components/shared/ProgressStats";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentDashboard } from "@/hooks/useStudentData";
import { 
  Zap, 
  ChevronRight,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = useStudentDashboard();
  
  if (!user) return null;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <p className="text-destructive">Failed to load dashboard data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!data) return null;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground mt-2">
              Ready to continue your robotics journey? You're making great progress!
            </p>
          </div>
          <div className="flex gap-4 mt-4 lg:mt-0">
            <Button asChild>
              <Link to="/simulations/circuit">
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

        {/* Progress Overview */}
        <ProgressStats
          totalPoints={data.progress.totalPoints}
          level={data.progress.level}
          completedCourses={data.progress.completedCourses}
          enrolledCourses={data.progress.enrolledCourses}
          studyTime={Math.round(data.progress.studyTime / 60)} // Convert minutes to hours
          badges={data.progress.badges}
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Courses</CardTitle>
              <CardDescription>Continue where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link to="/student/courses">
                  View My Courses
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Simulations</CardTitle>
              <CardDescription>Practice with virtual robots</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link to="/simulations/circuit">
                  Start Simulation
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marketplace</CardTitle>
              <CardDescription>Discover new courses</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link to="/marketplace">
                  Browse Courses
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}