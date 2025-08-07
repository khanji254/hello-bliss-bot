// src/pages/marketplace/Marketplace.tsx
// Fixed SelectItem empty value issue

import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseCard } from "@/components/shared/CourseCard";
import { coursesApi } from "@/lib/api";
import { Course, Category } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, 
  Filter, 
  BookOpen,
  Cpu,
  Bot,
  Monitor,
  Zap,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function Marketplace() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  
  // Filter states - Fixed: Use "all" instead of empty string
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all"); // Changed from "" to "all"
  const [sortBy, setSortBy] = useState("-created_at"); // Changed default to most common

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await coursesApi.getCategories();
        console.log('Categories response:', data); // Debug log
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
        setCategories([]); // Set empty array on error
      }
    };

    fetchCategories();
  }, []);

  // Fetch courses with filters
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          level: selectedLevel !== 'all' ? selectedLevel : undefined,
          search: searchQuery || undefined,
          ordering: sortBy,
        };

        console.log('Fetching courses with params:', params); // Debug log
        const data = await coursesApi.getCourses(params);
        console.log('Courses response:', data); // Debug log
        
        // Handle both paginated and non-paginated responses
        let coursesList: Course[] = [];
        if (Array.isArray(data)) {
          coursesList = data;
        } else if (data && Array.isArray(data.results)) {
          coursesList = data.results;
        } else if (data && Array.isArray(data.data)) {
          coursesList = data.data;
        } else {
          console.warn('Unexpected courses response format:', data);
          coursesList = [];
        }
        
        setCourses(coursesList);
        
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
        setCourses([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory, searchQuery, selectedLevel, sortBy]);

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast.error('Please log in to enroll in courses');
      return;
    }

    if (user.role !== 'student') {
      toast.error('Only students can enroll in courses');
      return;
    }

    setEnrolling(courseId);
    try {
      await coursesApi.enrollInCourse(courseId);
      toast.success('Successfully enrolled in course!');
      
      // Refresh courses to update enrollment status
      const params = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        level: selectedLevel !== 'all' ? selectedLevel : undefined,
        search: searchQuery || undefined,
        ordering: sortBy,
      };
      const data = await coursesApi.getCourses(params);
      
      let coursesList: Course[] = [];
      if (Array.isArray(data)) {
        coursesList = data;
      } else if (data && Array.isArray(data.results)) {
        coursesList = data.results;
      } else if (data && Array.isArray(data.data)) {
        coursesList = data.data;
      }
      
      setCourses(coursesList);
      
    } catch (error: any) {
      console.error('Error enrolling in course:', error);
      toast.error(error.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
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
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Level Filter - Fixed: Use "all" instead of empty string */}
            <Select value={selectedLevel} onValueChange={handleLevelChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-created_at">Newest</SelectItem>
                <SelectItem value="created_at">Oldest</SelectItem>
                <SelectItem value="-rating">Highest Rated</SelectItem>
                <SelectItem value="-students_count">Most Popular</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="-price">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading courses...</span>
          </div>
        )}

        {/* Course Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onEnroll={handleEnroll}
                loading={enrolling === course.id}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria, or check if there are courses in the database.
            </p>
            <Button onClick={() => {
              setSelectedCategory("all");
              setSelectedLevel("all");
              setSearchQuery("");
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
            <p><strong>Debug Info:</strong></p>
            <p>Categories loaded: {categories.length}</p>
            <p>Courses loaded: {courses.length}</p>
            <p>Loading: {loading.toString()}</p>
            <p>Selected category: {selectedCategory}</p>
            <p>Selected level: {selectedLevel}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}