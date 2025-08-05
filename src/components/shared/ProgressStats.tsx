import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Clock, TrendingUp } from "lucide-react";

interface ProgressStatsProps {
  totalPoints: number;
  level: number;
  completedCourses: number;
  enrolledCourses: number;
  studyTime?: number; // in hours
  badges?: number;
}

export function ProgressStats({ 
  totalPoints, 
  level, 
  completedCourses, 
  enrolledCourses, 
  studyTime = 0,
  badges = 0 
}: ProgressStatsProps) {
  // Calculate progress to next level (assuming 250 points per level)
  const pointsPerLevel = 250;
  const currentLevelPoints = totalPoints % pointsPerLevel;
  const progressPercentage = (currentLevelPoints / pointsPerLevel) * 100;
  const pointsToNextLevel = pointsPerLevel - currentLevelPoints;

  const stats = [
    {
      label: "Total Points",
      value: totalPoints.toLocaleString(),
      icon: <Target className="h-5 w-5 text-blue-500" />,
      description: `${pointsToNextLevel} points to level ${level + 1}`
    },
    {
      label: "Completed Courses",
      value: completedCourses,
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      description: `${enrolledCourses - completedCourses} in progress`
    },
    {
      label: "Study Time",
      value: `${studyTime}h`,
      icon: <Clock className="h-5 w-5 text-green-500" />,
      description: "This month"
    },
    {
      label: "Badges Earned",
      value: badges,
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
      description: "Achievements unlocked"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Level Progress */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Level {level}</CardTitle>
              <CardDescription>
                {currentLevelPoints} / {pointsPerLevel} XP
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-bold">
              Level {level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {pointsToNextLevel} points to next level
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {stat.icon}
                <div className="flex-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Progress</CardTitle>
          <CardDescription>
            Your learning journey overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Completed Courses</span>
              <span>{completedCourses} / {enrolledCourses}</span>
            </div>
            <Progress 
              value={enrolledCourses > 0 ? (completedCourses / enrolledCourses) * 100 : 0} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Keep up the great work!</span>
              <span>
                {enrolledCourses > 0 
                  ? `${Math.round((completedCourses / enrolledCourses) * 100)}% complete` 
                  : 'No courses enrolled'
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
