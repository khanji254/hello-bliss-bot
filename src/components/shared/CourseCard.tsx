// src/components/shared/CourseCard.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Users, Clock, Play, Loader2, CheckCircle } from "lucide-react";
import { Course } from "@/types/user";
import { Link } from "react-router-dom";

interface CourseCardProps {
  course: Course;
  showEnrollButton?: boolean;
  onEnroll?: (courseId: string) => void;
  loading?: boolean; // For enrollment loading state
}

export function CourseCard({ 
  course, 
  showEnrollButton = true, 
  onEnroll, 
  loading = false 
}: CourseCardProps) {
  
  const handleEnroll = () => {
    if (onEnroll && !loading) {
      onEnroll(course.id);
    }
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'circuits': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'electronics': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'programming': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'ros': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'mechanics': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    };
    return colorMap[category.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const getLevelColor = (level: string) => {
    const colorMap: Record<string, string> = {
      'beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'intermediate': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'advanced': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colorMap[level] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  // Use backend field names with fallbacks
  const teacherName = course.teacher_name || course.teacherName;
  const categoryName = course.category_name || course.category;
  const studentsCount = course.students_count || course.studentsCount;
  const thumbnailUrl = course.thumbnail_url || course.thumbnail;
  const isEnrolled = course.is_enrolled;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Course Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
        {thumbnailUrl && thumbnailUrl !== '/placeholder-course.jpg' ? (
          <img 
            src={thumbnailUrl} 
            alt={course.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to play icon if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <Play className="h-12 w-12 text-primary/60" />
        )}
        
        {/* Enrollment Status Indicator */}
        {isEnrolled && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-500 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              Enrolled
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
          <div className="flex flex-col gap-1">
            <Badge className={getCategoryColor(categoryName)} variant="secondary">
              {categoryName.toUpperCase()}
            </Badge>
            <Badge className={getLevelColor(course.level)} variant="secondary">
              {course.level.toUpperCase()}
            </Badge>
          </div>
        </div>
        
        <CardDescription className="line-clamp-3">
          {course.short_description || course.description}
        </CardDescription>
        
        {/* Teacher Info */}
        <div className="flex items-center gap-2 pt-2">
          <Avatar className="h-6 w-6">
            <AvatarImage 
              src={course.teacher_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacherName}`} 
            />
            <AvatarFallback>
              {teacherName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{teacherName}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Course Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{course.rating?.toFixed(1) || '0.0'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{studentsCount?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
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
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="text-lg font-bold">
          {course.price === 0 ? 'Free' : `$${course.price}`}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/courses/${course.slug || course.id}`}>
              View Details
            </Link>
          </Button>
          
          {showEnrollButton && !isEnrolled && (
            <Button 
              size="sm" 
              onClick={handleEnroll}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Enrolling...
                </>
              ) : (
                'Enroll Now'
              )}
            </Button>
          )}
          
          {isEnrolled && (
            <Button size="sm" variant="secondary" asChild>
              <Link to={`/student/courses/${course.id}`}>
                Continue Learning
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}