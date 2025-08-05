import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseCard } from "@/components/shared/CourseCard";
import { mockCourses } from "@/lib/mockData";
import { 
  Search, 
  Filter, 
  BookOpen,
  Cpu,
  Bot,
  Monitor,
  Zap
} from "lucide-react";

const categories = [
  { id: "all", name: "All Courses", icon: BookOpen },
  { id: "circuits", name: "Electronics", icon: Cpu },
  { id: "programming", name: "Programming", icon: Monitor },
  { id: "ros", name: "ROS", icon: Bot },
  { id: "mechanics", name: "Mechanics", icon: Zap }
];

const courses = [
  {
    id: "1",
    title: "Arduino Programming Masterclass",
    description: "Learn to program Arduino from scratch with hands-on projects and real-world applications.",
    instructor: "Dr. Sarah Chen",
    instructorAvatar: "/instructor1.jpg",
    price: 49.99,
    originalPrice: 79.99,
    rating: 4.8,
    students: 2341,
    duration: "12 hours",
    level: "Beginner",
    category: "circuits",
    thumbnail: "/course1.jpg",
    isFree: false,
    isNew: true
  },
  {
    id: "2",
    title: "ROS 2 Robot Development",
    description: "Master Robot Operating System 2 with practical simulations and real robot programming.",
    instructor: "Prof. Mike Johnson",
    instructorAvatar: "/instructor2.jpg", 
    price: 0,
    originalPrice: 0,
    rating: 4.9,
    students: 1892,
    duration: "16 hours",
    level: "Advanced",
    category: "ros",
    thumbnail: "/course2.jpg",
    isFree: true,
    isNew: false
  },
  {
    id: "3",
    title: "Circuit Design & Analysis",
    description: "Comprehensive course on electronic circuit design using industry-standard tools.",
    instructor: "Emily Rodriguez",
    instructorAvatar: "/instructor3.jpg",
    price: 69.99,
    originalPrice: 99.99,
    rating: 4.7,
    students: 956,
    duration: "20 hours", 
    level: "Intermediate",
    category: "circuits",
    thumbnail: "/course3.jpg",
    isFree: false,
    isNew: false
  },
  {
    id: "4",
    title: "Python for Robotics",
    description: "Learn Python programming specifically for robotics applications and automation.",
    instructor: "Dr. Alex Kim",
    instructorAvatar: "/instructor4.jpg",
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.6,
    students: 3210,
    duration: "14 hours",
    level: "Beginner",
    category: "programming",
    thumbnail: "/course4.jpg",
    isFree: false,
    isNew: true
  },
  {
    id: "5",
    title: "Mechanical Design for Robots",
    description: "Design and build mechanical systems for robots using CAD and 3D printing.",
    instructor: "Prof. Lisa Wang",
    instructorAvatar: "/instructor5.jpg",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    students: 742,
    duration: "24 hours",
    level: "Advanced",
    category: "mechanics",
    thumbnail: "/course5.jpg",
    isFree: false,
    isNew: false
  },
  {
    id: "6",
    title: "Introduction to Robotics",
    description: "Perfect starting point for anyone interested in learning robotics fundamentals.",
    instructor: "Dr. John Smith",
    instructorAvatar: "/instructor6.jpg",
    price: 0,
    originalPrice: 0,
    rating: 4.5,
    students: 5420,
    duration: "8 hours",
    level: "Beginner",
    category: "all",
    thumbnail: "/course6.jpg",
    isFree: true,
    isNew: false
  }
];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = mockCourses.filter(course => {
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEnroll = (courseId: string) => {
    console.log(`Enrolling in course: ${courseId}`);
    // Add enrollment logic here
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Course Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Discover amazing robotics courses from expert instructors
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search courses, instructors, topics..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onEnroll={handleEnroll}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Course Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Discover courses from expert robotics educators around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search for courses, instructors, or topics..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              <category.icon className="mr-2 h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* Featured Banner */}
        <Card className="bg-gradient-tech text-white">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-4">
                  🎉 Limited Time Offer
                </Badge>
                <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                  Get 50% off Premium Robotics Courses
                </h2>
                <p className="text-white/90 mb-6 max-w-2xl">
                  Join thousands of students learning robotics with our comprehensive courses. 
                  From beginner Arduino projects to advanced ROS development.
                </p>
                <Button variant="secondary" size="lg">
                  View Deals
                </Button>
              </div>
              <div className="w-full lg:w-80 h-48 bg-white/10 rounded-xl mt-6 lg:mt-0 flex items-center justify-center">
                <Bot className="h-16 w-16 text-white/60" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {selectedCategory === "all" ? "All Courses" : 
               categories.find(c => c.id === selectedCategory)?.name} 
              <span className="text-muted-foreground ml-2">
                ({filteredCourses.length} results)
              </span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="relative">
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    {course.isFree && (
                      <Badge variant="secondary">Free</Badge>
                    )}
                    {course.isNew && (
                      <Badge variant="destructive">New</Badge>
                    )}
                  </div>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Button 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      asChild
                    >
                      <Link to={`/courses/${course.id}`}>
                        <Play className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="text-xs">
                      {course.level}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-current text-yellow-500 mr-1" />
                      {course.rating}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center space-x-2 mb-4">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={course.instructorAvatar} />
                      <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{course.instructor}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {course.students.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {course.isFree ? (
                        <span className="text-lg font-bold text-primary">Free</span>
                      ) : (
                        <>
                          <span className="text-lg font-bold">${course.price}</span>
                          {course.originalPrice > course.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${course.originalPrice}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <Button size="sm" asChild>
                      <Link to={`/courses/${course.id}`}>
                        {course.isFree ? "Enroll Free" : "Enroll Now"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}