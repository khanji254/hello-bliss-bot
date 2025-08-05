import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BookOpen,
  Users,
  Star,
  Clock,
  Plus,
  Edit,
  MoreHorizontal,
  Eye,
  Settings,
  TrendingUp,
  DollarSign,
  Calendar,
  Play,
  Search,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";

export default function TeacherCourses() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("published");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock teacher courses data
  const mockCourses = [
    {
      id: "course_1",
      title: "Robotics Fundamentals",
      description: "Introduction to robotics concepts, hardware, and basic programming",
      status: "published",
      enrolledStudents: 24,
      rating: 4.8,
      totalRatings: 18,
      revenue: 1200,
      lastUpdated: "2 days ago",
      createdDate: "Jan 15, 2024",
      duration: "8 weeks",
      modules: 12,
      completionRate: 85,
      category: "Fundamentals",
      difficulty: "Beginner",
      price: 99
    },
    {
      id: "course_2",
      title: "Advanced ROS Development",
      description: "Deep dive into Robot Operating System for complex robotics applications",
      status: "published",
      enrolledStudents: 16,
      rating: 4.9,
      totalRatings: 12,
      revenue: 960,
      lastUpdated: "1 week ago",
      createdDate: "Feb 3, 2024",
      duration: "10 weeks",
      modules: 15,
      completionRate: 78,
      category: "Programming",
      difficulty: "Advanced",
      price: 149
    },
    {
      id: "course_3",
      title: "Circuit Design for Robotics",
      description: "Learn to design and build electronic circuits for robotic systems",
      status: "draft",
      enrolledStudents: 0,
      rating: 0,
      totalRatings: 0,
      revenue: 0,
      lastUpdated: "3 days ago",
      createdDate: "Mar 10, 2024",
      duration: "6 weeks",
      modules: 8,
      completionRate: 0,
      category: "Electronics",
      difficulty: "Intermediate",
      price: 119
    },
    {
      id: "course_4",
      title: "AI in Robotics",
      description: "Integration of artificial intelligence and machine learning in robotics",
      status: "review",
      enrolledStudents: 0,
      rating: 0,
      totalRatings: 0,
      revenue: 0,
      lastUpdated: "5 days ago",
      createdDate: "Mar 20, 2024",
      duration: "12 weeks",
      modules: 18,
      completionRate: 0,
      category: "AI/ML",
      difficulty: "Advanced",
      price: 199
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "draft": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "review": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Intermediate": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Filter courses
  const publishedCourses = mockCourses.filter(c => c.status === "published");
  const draftCourses = mockCourses.filter(c => c.status === "draft");
  const reviewCourses = mockCourses.filter(c => c.status === "review");

  const filteredCourses = mockCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const CourseCard = ({ course }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(course.status)}>
                {course.status}
              </Badge>
              <Badge variant="outline" className={getDifficultyColor(course.difficulty)}>
                {course.difficulty}
              </Badge>
            </div>
            <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {course.description}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{course.enrolledStudents} students</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>{course.modules} modules</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>${course.price}</span>
          </div>
        </div>

        {/* Rating and Revenue */}
        {course.status === "published" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>{course.rating}/5</span>
                <span className="text-muted-foreground">({course.totalRatings})</span>
              </div>
              <div className="text-green-600 font-medium">
                ${course.revenue} earned
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Completion Rate</span>
                <span>{course.completionRate}%</span>
              </div>
              <Progress value={course.completionRate} className="h-2" />
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Last updated: {course.lastUpdated}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          {course.status === "published" && (
            <Button variant="outline" size="sm">
              <TrendingUp className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="h-8 w-8" />
              My Courses
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and monitor your course content and student engagement
            </p>
          </div>
          <Button asChild>
            <Link to="/teacher/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Course
            </Link>
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{mockCourses.length}</p>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {publishedCourses.reduce((sum, c) => sum + c.enrolledStudents, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    ${publishedCourses.reduce((sum, c) => sum + c.revenue, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Course Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="published">
              Published ({publishedCourses.length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Drafts ({draftCourses.length})
            </TabsTrigger>
            <TabsTrigger value="review">
              In Review ({reviewCourses.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All Courses ({mockCourses.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="published" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {publishedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="draft" className="space-y-6 mt-6">
            {draftCourses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {draftCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No draft courses</h3>
                <p className="text-muted-foreground mb-4">
                  Start creating a new course to see it here
                </p>
                <Button asChild>
                  <Link to="/teacher/create">Create Course</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="review" className="space-y-6 mt-6">
            {reviewCourses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {reviewCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses in review</h3>
                <p className="text-muted-foreground">
                  Courses submitted for review will appear here
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
