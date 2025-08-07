// src/components/shared/ProgressStats.tsx
// Fixed to handle undefined values and loading states

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp,
  Star,
  Target
} from "lucide-react";

interface ProgressStatsProps {
  stats?: {
    totalCourses?: number;
    completedCourses?: number;
    totalPoints?: number;
    level?: number;
    studyTime?: number;
    badges?: number;
    weeklyGoal?: number;
    weeklyProgress?: number;
  };
  loading?: boolean;
}

export function ProgressStats({ stats, loading = false }: ProgressStatsProps) {
  // Provide default values for all stats
  const safeStats = {
    totalCourses: stats?.totalCourses || 0,
    completedCourses: stats?.completedCourses || 0,
    totalPoints: stats?.totalPoints || 0,
    level: stats?.level || 1,
    studyTime: stats?.studyTime || 0,
    badges: stats?.badges || 0,
    weeklyGoal: stats?.weeklyGoal || 10,
    weeklyProgress: stats?.weeklyProgress || 0,
  };

  // Calculate completion percentage safely
  const completionPercentage = safeStats.totalCourses > 0 
    ? Math.round((safeStats.completedCourses / safeStats.totalCourses) * 100)
    : 0;

  // Calculate weekly progress percentage safely
  const weeklyProgressPercentage = safeStats.weeklyGoal > 0
    ? Math.min(Math.round((safeStats.weeklyProgress / safeStats.weeklyGoal) * 100), 100)
    : 0;

  // Format study time safely
  const formatStudyTime = (minutes: number): string => {
    if (!minutes || minutes === 0) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Courses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.totalCourses.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {safeStats.completedCourses} completed
          </p>
          <Progress 
            value={completionPercentage} 
            className="mt-2" 
          />
        </CardContent>
      </Card>

      {/* Completed Courses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.completedCourses.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {completionPercentage}% completion rate
          </p>
        </CardContent>
      </Card>

      {/* Study Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Study Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatStudyTime(safeStats.studyTime)}</div>
          <p className="text-xs text-muted-foreground">
            Total time spent learning
          </p>
        </CardContent>
      </Card>

      {/* Total Points */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.totalPoints.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Level {safeStats.level}
          </p>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Badges</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.badges.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Achievements unlocked
          </p>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.weeklyProgress}/{safeStats.weeklyGoal}</div>
          <p className="text-xs text-muted-foreground">
            {weeklyProgressPercentage}% of weekly goal
          </p>
          <Progress 
            value={weeklyProgressPercentage} 
            className="mt-2" 
          />
        </CardContent>
      </Card>
    </div>
  );
}