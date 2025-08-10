import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Settings,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Upload,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  Monitor,
  Zap,
  FileText,
  Mail,
  Bell,
  Calendar,
  CreditCard,
  RefreshCw,
  ExternalLink,
  Plus,
  Minus,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for admin dashboard
const platformStats = {
  totalUsers: 15847,
  totalCourses: 342,
  totalRevenue: 1284567,
  activeUsers: 8234,
  monthlyGrowth: 12.5,
  courseCompletions: 4521,
  avgSessionTime: '24 minutes',
  supportTickets: 127
};

const recentUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Student', joinDate: '2024-08-01', status: 'active', courses: 3 },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Teacher', joinDate: '2024-08-02', status: 'active', courses: 8 },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'Student', joinDate: '2024-08-03', status: 'pending', courses: 1 },
  { id: 4, name: 'David Wilson', email: 'david@example.com', role: 'Student', joinDate: '2024-08-04', status: 'active', courses: 5 },
  { id: 5, name: 'Eve Brown', email: 'eve@example.com', role: 'Teacher', joinDate: '2024-08-05', status: 'suspended', courses: 12 }
];

const recentCourses = [
  { id: 1, title: 'Introduction to Robotics', instructor: 'Dr. Smith', students: 245, revenue: 12450, status: 'published', rating: 4.8 },
  { id: 2, title: 'Advanced AI Programming', instructor: 'Prof. Johnson', students: 189, revenue: 18900, status: 'published', rating: 4.9 },
  { id: 3, title: 'Circuit Design Basics', instructor: 'Dr. Davis', students: 156, revenue: 7800, status: 'draft', rating: 0 },
  { id: 4, title: 'ROS2 Fundamentals', instructor: 'Dr. Wilson', students: 298, revenue: 29800, status: 'published', rating: 4.7 },
  { id: 5, title: 'Computer Vision for Robots', instructor: 'Prof. Brown', students: 134, revenue: 20100, status: 'review', rating: 0 }
];

const revenueData = [
  { month: 'Jan', revenue: 45000, users: 1200 },
  { month: 'Feb', revenue: 52000, users: 1350 },
  { month: 'Mar', revenue: 48000, users: 1280 },
  { month: 'Apr', revenue: 61000, users: 1520 },
  { month: 'May', revenue: 55000, users: 1450 },
  { month: 'Jun', revenue: 67000, users: 1680 },
  { month: 'Jul', revenue: 74000, users: 1820 },
  { month: 'Aug', revenue: 68000, users: 1750 }
];

const userGrowthData = [
  { month: 'Jan', students: 8500, teachers: 450 },
  { month: 'Feb', students: 9200, teachers: 480 },
  { month: 'Mar', students: 9800, teachers: 520 },
  { month: 'Apr', students: 10500, teachers: 550 },
  { month: 'May', students: 11200, teachers: 580 },
  { month: 'Jun', students: 12000, teachers: 620 },
  { month: 'Jul', students: 12800, teachers: 650 },
  { month: 'Aug', students: 13500, teachers: 680 }
];

const systemMetrics = {
  cpu: 45,
  memory: 62,
  disk: 38,
  network: 78,
  uptime: '99.9%',
  responseTime: '120ms',
  activeConnections: 2847,
  dailyRequests: 1284567
};

const supportTickets = [
  { id: 1, title: 'Course video not loading', user: 'Alice Johnson', priority: 'high', status: 'open', created: '2 hours ago' },
  { id: 2, title: 'Payment processing issue', user: 'Bob Smith', priority: 'critical', status: 'in-progress', created: '4 hours ago' },
  { id: 3, title: 'Feature request: Dark mode', user: 'Carol Davis', priority: 'low', status: 'closed', created: '1 day ago' },
  { id: 4, title: 'Cannot access simulation', user: 'David Wilson', priority: 'medium', status: 'open', created: '3 hours ago' },
  { id: 5, title: 'Account verification problem', user: 'Eve Brown', priority: 'high', status: 'in-progress', created: '1 hour ago' }
];

const auditLogs = [
  { id: 1, action: 'User Created', user: 'admin@nexa.com', target: 'alice@example.com', timestamp: '2024-08-05 14:30:25', ip: '192.168.1.100' },
  { id: 2, action: 'Course Published', user: 'teacher@nexa.com', target: 'Advanced AI Programming', timestamp: '2024-08-05 13:45:12', ip: '192.168.1.200' },
  { id: 3, action: 'Payment Processed', user: 'system', target: '$199.99 - Course Purchase', timestamp: '2024-08-05 12:20:08', ip: '192.168.1.150' },
  { id: 4, action: 'User Suspended', user: 'admin@nexa.com', target: 'spam@example.com', timestamp: '2024-08-05 11:15:30', ip: '192.168.1.100' },
  { id: 5, action: 'Course Updated', user: 'teacher@nexa.com', target: 'ROS2 Fundamentals', timestamp: '2024-08-05 10:30:45', ip: '192.168.1.300' }
];

export function AdminDashboard() {
  const { user } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');

  const StatCard = ({ title, value, icon: Icon, change, changeType = 'positive' }: {
    title: string;
    value: string | number;
    icon: any;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${
            changeType === 'positive' ? 'text-green-600' : 
            changeType === 'negative' ? 'text-red-600' : 
            'text-muted-foreground'
          }`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage and monitor your robotics education platform</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={platformStats.totalUsers.toLocaleString()}
            icon={Users}
            change={`+${platformStats.monthlyGrowth}% from last month`}
            changeType="positive"
          />
          <StatCard
            title="Total Courses"
            value={platformStats.totalCourses}
            icon={BookOpen}
            change="+12 new this month"
            changeType="positive"
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${platformStats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            change="+8.2% from last month"
            changeType="positive"
          />
          <StatCard
            title="Active Users"
            value={platformStats.activeUsers.toLocaleString()}
            icon={Activity}
            change={`${((platformStats.activeUsers / platformStats.totalUsers) * 100).toFixed(1)}% of total`}
            changeType="neutral"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Monthly revenue and user growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary) / 0.2)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Student and teacher registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="students" fill="hsl(var(--primary))" name="Students" />
                      <Bar dataKey="teachers" fill="hsl(var(--secondary))" name="Teachers" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Course Completions"
                value={platformStats.courseCompletions}
                icon={CheckCircle}
                change="+15% this month"
                changeType="positive"
              />
              <StatCard
                title="Avg Session Time"
                value={platformStats.avgSessionTime}
                icon={Clock}
                change="+2 min from last month"
                changeType="positive"
              />
              <StatCard
                title="Support Tickets"
                value={platformStats.supportTickets}
                icon={AlertTriangle}
                change="-8% from last month"
                changeType="positive"
              />
              <StatCard
                title="System Uptime"
                value={systemMetrics.uptime}
                icon={Server}
                change="Last 30 days"
                changeType="neutral"
              />
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system events and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {log.user} → {log.target}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {log.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users..." 
                    className="pl-8 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={user.role === 'Teacher' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                        <Badge variant={
                          user.status === 'active' ? 'default' : 
                          user.status === 'suspended' ? 'destructive' : 
                          'secondary'
                        }>
                          {user.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{user.courses} courses</span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search courses..." className="pl-8 w-64" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Course
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>Manage platform courses and content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm font-medium">{course.students}</p>
                          <p className="text-xs text-muted-foreground">Students</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">${course.revenue.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                        <Badge variant={
                          course.status === 'published' ? 'default' : 
                          course.status === 'draft' ? 'secondary' : 
                          'outline'
                        }>
                          {course.status}
                        </Badge>
                        {course.rating > 0 && (
                          <div className="text-center">
                            <p className="text-sm font-medium">⭐ {course.rating}</p>
                            <p className="text-xs text-muted-foreground">Rating</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Finances Tab */}
          <TabsContent value="finances" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Total Revenue"
                value={`$${platformStats.totalRevenue.toLocaleString()}`}
                icon={DollarSign}
                change="+12.5% from last month"
                changeType="positive"
              />
              <StatCard
                title="Pending Payouts"
                value="$24,567"
                icon={CreditCard}
                change="To 45 instructors"
                changeType="neutral"
              />
              <StatCard
                title="Transaction Fees"
                value="$1,247"
                icon={TrendingUp}
                change="2.1% of revenue"
                changeType="neutral"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Detailed financial performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Revenue ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="CPU Usage"
                value={`${systemMetrics.cpu}%`}
                icon={Cpu}
              />
              <StatCard
                title="Memory Usage"
                value={`${systemMetrics.memory}%`}
                icon={HardDrive}
              />
              <StatCard
                title="Disk Usage"
                value={`${systemMetrics.disk}%`}
                icon={HardDrive}
              />
              <StatCard
                title="Network I/O"
                value={`${systemMetrics.network}%`}
                icon={Wifi}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>Real-time system metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">CPU Usage</span>
                      <span className="text-sm">{systemMetrics.cpu}%</span>
                    </div>
                    <Progress value={systemMetrics.cpu} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Memory Usage</span>
                      <span className="text-sm">{systemMetrics.memory}%</span>
                    </div>
                    <Progress value={systemMetrics.memory} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Disk Usage</span>
                      <span className="text-sm">{systemMetrics.disk}%</span>
                    </div>
                    <Progress value={systemMetrics.disk} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Network I/O</span>
                      <span className="text-sm">{systemMetrics.network}%</span>
                    </div>
                    <Progress value={systemMetrics.network} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>Platform status and configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className="text-sm font-medium">{systemMetrics.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="text-sm font-medium">{systemMetrics.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Connections</span>
                    <span className="text-sm font-medium">{systemMetrics.activeConnections.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Daily Requests</span>
                    <span className="text-sm font-medium">{systemMetrics.dailyRequests.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <Button variant="outline" className="w-full">
                      <Monitor className="h-4 w-4 mr-2" />
                      View Detailed Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tickets</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Announcement
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Ticket
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Manage customer support and help requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <div>
                          <p className="font-medium">{ticket.title}</p>
                          <p className="text-sm text-muted-foreground">by {ticket.user}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={
                          ticket.priority === 'critical' ? 'destructive' :
                          ticket.priority === 'high' ? 'default' :
                          ticket.priority === 'medium' ? 'secondary' :
                          'outline'
                        }>
                          {ticket.priority}
                        </Badge>
                        <Badge variant={
                          ticket.status === 'open' ? 'destructive' :
                          ticket.status === 'in-progress' ? 'default' :
                          'secondary'
                        }>
                          {ticket.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{ticket.created}</span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
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
