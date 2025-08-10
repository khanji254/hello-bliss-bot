import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Plus, 
  Eye, 
  Download, 
  Upload,
  Star,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  Pause,
  Ban,
  BarChart3
} from 'lucide-react';

// Mock course data
const courses = [
  {
    id: 1,
    title: 'Introduction to Robotics',
    instructor: 'Dr. John Smith',
    instructorId: 2,
    category: 'Robotics',
    level: 'Beginner',
    status: 'published',
    createdDate: '2024-01-15',
    publishedDate: '2024-02-01',
    students: 245,
    rating: 4.8,
    reviews: 89,
    revenue: 12450.00,
    price: 99.99,
    duration: '8 hours',
    lessons: 24,
    completionRate: 87,
    thumbnail: '/api/placeholder/300/200',
    description: 'Learn the fundamentals of robotics including sensors, actuators, and basic programming.',
    tags: ['robotics', 'beginner', 'fundamentals']
  },
  {
    id: 2,
    title: 'Advanced AI Programming',
    instructor: 'Prof. Sarah Johnson',
    instructorId: 5,
    category: 'AI/ML',
    level: 'Advanced',
    status: 'published',
    createdDate: '2024-02-20',
    publishedDate: '2024-03-05',
    students: 189,
    rating: 4.9,
    reviews: 156,
    revenue: 18900.00,
    price: 199.99,
    duration: '12 hours',
    lessons: 36,
    completionRate: 92,
    thumbnail: '/api/placeholder/300/200',
    description: 'Master advanced AI programming techniques for robotics applications.',
    tags: ['ai', 'programming', 'advanced', 'machine-learning']
  },
  {
    id: 3,
    title: 'Circuit Design Basics',
    instructor: 'Dr. Mike Davis',
    instructorId: 8,
    category: 'Electronics',
    level: 'Intermediate',
    status: 'draft',
    createdDate: '2024-07-15',
    publishedDate: null,
    students: 0,
    rating: 0,
    reviews: 0,
    revenue: 0,
    price: 79.99,
    duration: '6 hours',
    lessons: 18,
    completionRate: 0,
    thumbnail: '/api/placeholder/300/200',
    description: 'Learn to design and build electronic circuits for robotics projects.',
    tags: ['electronics', 'circuits', 'intermediate']
  },
  {
    id: 4,
    title: 'ROS2 Fundamentals',
    instructor: 'Dr. Lisa Wilson',
    instructorId: 12,
    category: 'Programming',
    level: 'Intermediate',
    status: 'published',
    createdDate: '2024-03-10',
    publishedDate: '2024-03-25',
    students: 298,
    rating: 4.7,
    reviews: 201,
    revenue: 29800.00,
    price: 149.99,
    duration: '10 hours',
    lessons: 30,
    completionRate: 85,
    thumbnail: '/api/placeholder/300/200',
    description: 'Master Robot Operating System 2 with practical examples and projects.',
    tags: ['ros', 'programming', 'intermediate', 'robotics']
  },
  {
    id: 5,
    title: 'Computer Vision for Robots',
    instructor: 'Prof. David Brown',
    instructorId: 15,
    category: 'AI/ML',
    level: 'Advanced',
    status: 'review',
    createdDate: '2024-06-01',
    publishedDate: null,
    students: 0,
    rating: 0,
    reviews: 0,
    revenue: 0,
    price: 249.99,
    duration: '15 hours',
    lessons: 45,
    completionRate: 0,
    thumbnail: '/api/placeholder/300/200',
    description: 'Implement computer vision algorithms for robotic perception and navigation.',
    tags: ['computer-vision', 'ai', 'advanced', 'perception']
  }
];

const categories = ['All', 'Robotics', 'AI/ML', 'Electronics', 'Programming', 'Simulation'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const statuses = ['All', 'Published', 'Draft', 'Review', 'Suspended'];

export function ManageCourses() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    const matchesStatus = selectedStatus === 'All' || course.status === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'review': return 'outline';
      case 'suspended': return 'destructive';
      default: return 'secondary';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'secondary';
      case 'Intermediate': return 'default';
      case 'Advanced': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Course Management</h1>
            <p className="text-muted-foreground">Manage platform courses, content, and instructors</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Course
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">+3 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.filter(c => c.status === 'published').length}</div>
              <p className="text-xs text-muted-foreground">Active courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.reduce((sum, c) => sum + c.students, 0)}</div>
              <p className="text-xs text-muted-foreground">Across all courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${courses.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search courses..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Course List */}
        <Card>
          <CardHeader>
            <CardTitle>Courses ({filteredCourses.length})</CardTitle>
            <CardDescription>Manage course content, pricing, and availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <div key={course.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-20 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{course.title}</h3>
                      <Badge variant={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                      <Badge variant={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      by {course.instructor} • {course.category} • {course.duration} • {course.lessons} lessons
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      {course.status === 'published' && (
                        <>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{course.rating}</span>
                            <span className="text-muted-foreground">({course.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{course.students} students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Completion: {course.completionRate}%</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">${course.price}</p>
                    {course.revenue > 0 && (
                      <p className="text-sm text-muted-foreground">${course.revenue.toLocaleString()} earned</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Created {course.createdDate}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Course Details - {course.title}</DialogTitle>
                          <DialogDescription>Complete course information and analytics</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium">Course Information</Label>
                              <div className="mt-2 space-y-2">
                                <p><span className="text-muted-foreground">Title:</span> {course.title}</p>
                                <p><span className="text-muted-foreground">Instructor:</span> {course.instructor}</p>
                                <p><span className="text-muted-foreground">Category:</span> {course.category}</p>
                                <p><span className="text-muted-foreground">Level:</span> {course.level}</p>
                                <p><span className="text-muted-foreground">Duration:</span> {course.duration}</p>
                                <p><span className="text-muted-foreground">Lessons:</span> {course.lessons}</p>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Description</Label>
                              <p className="mt-2 text-sm">{course.description}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Tags</Label>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {course.tags.map(tag => (
                                  <Badge key={tag} variant="outline">{tag}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium">Performance Metrics</Label>
                              <div className="mt-2 space-y-3">
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Students Enrolled</span>
                                    <span>{course.students}</span>
                                  </div>
                                  <Progress value={(course.students / 300) * 100} />
                                </div>
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Completion Rate</span>
                                    <span>{course.completionRate}%</span>
                                  </div>
                                  <Progress value={course.completionRate} />
                                </div>
                                {course.rating > 0 && (
                                  <div>
                                    <div className="flex justify-between text-sm mb-1">
                                      <span>Rating</span>
                                      <span>{course.rating}/5.0</span>
                                    </div>
                                    <Progress value={(course.rating / 5) * 100} />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Financial Information</Label>
                              <div className="mt-2 space-y-2">
                                <p><span className="text-muted-foreground">Price:</span> ${course.price}</p>
                                <p><span className="text-muted-foreground">Total Revenue:</span> ${course.revenue.toLocaleString()}</p>
                                <p><span className="text-muted-foreground">Avg Revenue/Student:</span> ${course.students > 0 ? (course.revenue / course.students).toFixed(2) : '0.00'}</p>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Dates</Label>
                              <div className="mt-2 space-y-2">
                                <p><span className="text-muted-foreground">Created:</span> {course.createdDate}</p>
                                <p><span className="text-muted-foreground">Published:</span> {course.publishedDate || 'Not published'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                          <Button variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Course
                          </Button>
                          <Button variant="outline">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            View Analytics
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>Course Actions</DialogTitle>
                          <DialogDescription>Select an action for {course.title}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                          {course.status === 'published' ? (
                            <Button variant="outline" className="w-full justify-start">
                              <Pause className="h-4 w-4 mr-2" />
                              Unpublish Course
                            </Button>
                          ) : (
                            <Button variant="outline" className="w-full justify-start">
                              <Play className="h-4 w-4 mr-2" />
                              Publish Course
                            </Button>
                          )}
                          <Button variant="outline" className="w-full justify-start">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            View Analytics
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Update Pricing
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                          </Button>
                          <Button variant="destructive" className="w-full justify-start">
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend Course
                          </Button>
                          <Button variant="destructive" className="w-full justify-start">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Course
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Bulk Actions</CardTitle>
            <CardDescription>Perform actions on multiple courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Publish Selected
              </Button>
              <Button variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Unpublish Selected
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </Button>
              <Button variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Update Pricing
              </Button>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
