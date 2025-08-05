import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  MessageSquare,
  UserCheck,
  UserX,
  GraduationCap,
  Clock,
  Trophy,
  TrendingUp,
  Download,
  Eye,
  Settings,
  BookOpen,
  Calendar,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

export default function TeacherStudents() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Mock student data
  const mockStudents = [
    {
      id: "student_1",
      name: "Alex Chen",
      email: "alex.chen@email.com",
      avatar: "/placeholder-avatar.jpg",
      enrolledCourses: ["course_1", "course_2"],
      completedCourses: ["course_3"],
      totalProgress: 78,
      lastActive: "2 hours ago",
      joinDate: "Jan 15, 2024",
      status: "active",
      studyStreak: 15,
      totalHours: 45,
      averageGrade: 92,
      achievements: 8,
      currentCourse: "Advanced Robotics Programming",
      nextDeadline: "Assignment due in 2 days"
    },
    {
      id: "student_2", 
      name: "Maya Patel",
      email: "maya.patel@email.com",
      avatar: "/placeholder-avatar.jpg",
      enrolledCourses: ["course_1"],
      completedCourses: ["course_2", "course_3"],
      totalProgress: 95,
      lastActive: "5 minutes ago",
      joinDate: "Dec 3, 2023",
      status: "active",
      studyStreak: 28,
      totalHours: 67,
      averageGrade: 96,
      achievements: 12,
      currentCourse: "Circuit Design Fundamentals",
      nextDeadline: "Quiz tomorrow"
    },
    {
      id: "student_3",
      name: "Jordan Smith",
      email: "jordan.smith@email.com", 
      avatar: "/placeholder-avatar.jpg",
      enrolledCourses: ["course_2"],
      completedCourses: [],
      totalProgress: 34,
      lastActive: "1 week ago",
      joinDate: "Feb 20, 2024",
      status: "inactive",
      studyStreak: 0,
      totalHours: 12,
      averageGrade: 78,
      achievements: 3,
      currentCourse: "ROS Basics",
      nextDeadline: "Project due in 1 week"
    },
    {
      id: "student_4",
      name: "Sam Rodriguez",
      email: "sam.rodriguez@email.com",
      avatar: "/placeholder-avatar.jpg", 
      enrolledCourses: ["course_1", "course_2", "course_3"],
      completedCourses: [],
      totalProgress: 56,
      lastActive: "1 day ago",
      joinDate: "Jan 8, 2024",
      status: "active",
      studyStreak: 7,
      totalHours: 34,
      averageGrade: 85,
      achievements: 6,
      currentCourse: "Robotics Fundamentals",
      nextDeadline: "Lab report due today"
    }
  ];

  // Filter students based on search and status
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get students by status
  const activeStudents = mockStudents.filter(s => s.status === "active");
  const inactiveStudents = mockStudents.filter(s => s.status === "inactive");
  const topPerformers = mockStudents
    .sort((a, b) => b.averageGrade - a.averageGrade)
    .slice(0, 3);

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const StudentCard = ({ student }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{student.name}</h3>
              <p className="text-sm text-muted-foreground">{student.email}</p>
            </div>
          </div>
          <Badge className={getStatusColor(student.status)}>
            {student.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{student.totalProgress}%</span>
          </div>
          <Progress value={student.totalProgress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Study Time</span>
            </div>
            <p className="font-medium">{student.totalHours}h</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Trophy className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Avg Grade</span>
            </div>
            <p className="font-medium">{student.averageGrade}%</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Enrolled</span>
            </div>
            <p className="font-medium">{student.enrolledCourses.length}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Completed</span>
            </div>
            <p className="font-medium">{student.completedCourses.length}</p>
          </div>
        </div>

        <div className="pt-2 space-y-2">
          <p className="text-sm text-muted-foreground">Current: {student.currentCourse}</p>
          <p className="text-sm text-orange-600 dark:text-orange-400">{student.nextDeadline}</p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="mr-2 h-4 w-4" />
            View Profile
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4" />
          </Button>
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
              <Users className="h-8 w-8" />
              Manage Students
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor student progress and engagement across your courses
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              Message All
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{mockStudents.length}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <UserCheck className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{activeStudents.length}</p>
                  <p className="text-sm text-muted-foreground">Active Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(mockStudents.reduce((sum, s) => sum + s.totalProgress, 0) / mockStudents.length)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(mockStudents.reduce((sum, s) => sum + s.averageGrade, 0) / mockStudents.length)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Grade</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All Students ({filteredStudents.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeStudents.length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Needs Attention ({inactiveStudents.length})
            </TabsTrigger>
            <TabsTrigger value="top">
              Top Performers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="inactive" className="space-y-6 mt-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600 dark:text-orange-400">Students Needing Attention</CardTitle>
                  <CardDescription>Students who haven't been active recently or are falling behind</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {inactiveStudents.map((student) => (
                      <div key={student.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Avatar>
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">Last active: {student.lastActive}</p>
                          <p className="text-sm text-orange-600">Progress: {student.totalProgress}%</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button size="sm">Send Reminder</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="top" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Performers
                </CardTitle>
                <CardDescription>Students with the highest grades and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((student, index) => (
                    <div key={student.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <Avatar>
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{student.name}</h4>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Grade: {student.averageGrade}%</span>
                          <span>Streak: {student.studyStreak} days</span>
                          <span>Hours: {student.totalHours}h</span>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        {student.achievements} achievements
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
