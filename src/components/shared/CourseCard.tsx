import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Users, Clock, Play } from "lucide-react";
import { Course } from "@/types/user";
import { Link } from "react-router-dom";

interface CourseCardProps {
  course: Course;
  showEnrollButton?: boolean;
  onEnroll?: (courseId: string) => void;
}

export function CourseCard({ course, showEnrollButton = true, onEnroll }: CourseCardProps) {
  const handleEnroll = () => {
    if (onEnroll) {
      onEnroll(course.id);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'circuits': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'programming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'ros': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'mechanics': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        <Play className="h-12 w-12 text-primary/60" />
      </div>
      
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
          <div className="flex flex-col gap-1">
            <Badge className={getCategoryColor(course.category)} variant="secondary">
              {course.category.toUpperCase()}
            </Badge>
            <Badge className={getLevelColor(course.level)} variant="secondary">
              {course.level.toUpperCase()}
            </Badge>
          </div>
        </div>
        
        <CardDescription className="line-clamp-3">
          {course.description}
        </CardDescription>
        
        {/* Teacher Info */}
        <div className="flex items-center gap-2 pt-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.teacherName}`} />
            <AvatarFallback>{course.teacherName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{course.teacherName}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Course Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.studentsCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {course.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {course.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{course.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="text-lg font-bold">
          {course.price === 0 ? 'Free' : `$${course.price}`}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/courses/${course.id}`}>View Details</Link>
          </Button>
          {showEnrollButton && (
            <Button size="sm" onClick={handleEnroll}>
              Enroll Now
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
