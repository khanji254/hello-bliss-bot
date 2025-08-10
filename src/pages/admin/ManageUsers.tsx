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
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  UserPlus, 
  Mail, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Ban,
  UserCheck,
  Settings
} from 'lucide-react';

// Mock user data
const users = [
  { 
    id: 1, 
    name: 'Alice Johnson', 
    email: 'alice@example.com', 
    role: 'Student', 
    status: 'active', 
    joinDate: '2024-01-15',
    lastLogin: '2024-08-05 14:30',
    coursesEnrolled: 5,
    coursesCompleted: 3,
    totalSpent: 299.99,
    country: 'United States',
    verified: true
  },
  { 
    id: 2, 
    name: 'Bob Smith', 
    email: 'bob@example.com', 
    role: 'Teacher', 
    status: 'active', 
    joinDate: '2024-02-20',
    lastLogin: '2024-08-05 12:15',
    coursesCreated: 8,
    totalStudents: 245,
    totalEarnings: 12450.00,
    country: 'Canada',
    verified: true
  },
  { 
    id: 3, 
    name: 'Carol Davis', 
    email: 'carol@example.com', 
    role: 'Student', 
    status: 'pending', 
    joinDate: '2024-08-01',
    lastLogin: '2024-08-03 09:45',
    coursesEnrolled: 1,
    coursesCompleted: 0,
    totalSpent: 99.99,
    country: 'United Kingdom',
    verified: false
  },
  { 
    id: 4, 
    name: 'David Wilson', 
    email: 'david@example.com', 
    role: 'Student', 
    status: 'active', 
    joinDate: '2024-03-10',
    lastLogin: '2024-08-05 16:20',
    coursesEnrolled: 12,
    coursesCompleted: 8,
    totalSpent: 899.88,
    country: 'Australia',
    verified: true
  },
  { 
    id: 5, 
    name: 'Eve Brown', 
    email: 'eve@example.com', 
    role: 'Teacher', 
    status: 'suspended', 
    joinDate: '2024-01-05',
    lastLogin: '2024-07-28 11:30',
    coursesCreated: 12,
    totalStudents: 156,
    totalEarnings: 8750.00,
    country: 'Germany',
    verified: true
  }
];

export function ManageUsers() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role.toLowerCase() === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = (action: string, userId: number) => {
    console.log(`${action} user ${userId}`);
    // Implement user actions here
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage platform users, roles, and permissions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Users
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new user account</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="verified" />
                    <Label htmlFor="verified">Email Verified</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create User</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="teacher">Teachers</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User List */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>Manage and monitor user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((userData) => (
                <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{userData.name}</p>
                        {userData.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{userData.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {userData.joinDate} • Last login {userData.lastLogin}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <Badge variant={userData.role === 'Teacher' ? 'default' : userData.role === 'Admin' ? 'destructive' : 'secondary'}>
                        {userData.role}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{userData.country}</p>
                    </div>
                    
                    <div className="text-center">
                      <Badge variant={
                        userData.status === 'active' ? 'default' : 
                        userData.status === 'suspended' ? 'destructive' : 
                        'secondary'
                      }>
                        {userData.status}
                      </Badge>
                    </div>
                    
                    <div className="text-center min-w-[80px]">
                      {userData.role === 'Student' ? (
                        <>
                          <p className="text-sm font-medium">{userData.coursesEnrolled} enrolled</p>
                          <p className="text-xs text-muted-foreground">{userData.coursesCompleted} completed</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium">{userData.coursesCreated} courses</p>
                          <p className="text-xs text-muted-foreground">{userData.totalStudents} students</p>
                        </>
                      )}
                    </div>
                    
                    <div className="text-center min-w-[80px]">
                      <p className="text-sm font-medium">
                        ${userData.role === 'Student' ? userData.totalSpent : userData.totalEarnings}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userData.role === 'Student' ? 'spent' : 'earned'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>User Details - {userData.name}</DialogTitle>
                            <DialogDescription>Complete user information and activity</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium">Personal Information</Label>
                                <div className="mt-2 space-y-2">
                                  <p><span className="text-muted-foreground">Name:</span> {userData.name}</p>
                                  <p><span className="text-muted-foreground">Email:</span> {userData.email}</p>
                                  <p><span className="text-muted-foreground">Country:</span> {userData.country}</p>
                                  <p><span className="text-muted-foreground">Verified:</span> {userData.verified ? 'Yes' : 'No'}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Account Status</Label>
                                <div className="mt-2 space-y-2">
                                  <p><span className="text-muted-foreground">Role:</span> {userData.role}</p>
                                  <p><span className="text-muted-foreground">Status:</span> {userData.status}</p>
                                  <p><span className="text-muted-foreground">Join Date:</span> {userData.joinDate}</p>
                                  <p><span className="text-muted-foreground">Last Login:</span> {userData.lastLogin}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium">Activity Summary</Label>
                                <div className="mt-2 space-y-2">
                                  {userData.role === 'Student' ? (
                                    <>
                                      <p><span className="text-muted-foreground">Courses Enrolled:</span> {userData.coursesEnrolled}</p>
                                      <p><span className="text-muted-foreground">Courses Completed:</span> {userData.coursesCompleted}</p>
                                      <p><span className="text-muted-foreground">Total Spent:</span> ${userData.totalSpent}</p>
                                    </>
                                  ) : (
                                    <>
                                      <p><span className="text-muted-foreground">Courses Created:</span> {userData.coursesCreated}</p>
                                      <p><span className="text-muted-foreground">Total Students:</span> {userData.totalStudents}</p>
                                      <p><span className="text-muted-foreground">Total Earnings:</span> ${userData.totalEarnings}</p>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Button variant="outline" className="w-full">
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Message
                                </Button>
                                <Button variant="outline" className="w-full">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit User
                                </Button>
                                {userData.status === 'active' ? (
                                  <Button variant="destructive" className="w-full">
                                    <Ban className="h-4 w-4 mr-2" />
                                    Suspend User
                                  </Button>
                                ) : (
                                  <Button variant="default" className="w-full">
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Activate User
                                  </Button>
                                )}
                              </div>
                            </div>
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
                            <DialogTitle>User Actions</DialogTitle>
                            <DialogDescription>Select an action for {userData.name}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <Shield className="h-4 w-4 mr-2" />
                              Change Role
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <Settings className="h-4 w-4 mr-2" />
                              Reset Password
                            </Button>
                            {userData.status === 'active' ? (
                              <Button variant="destructive" className="w-full justify-start">
                                <Ban className="h-4 w-4 mr-2" />
                                Suspend Account
                              </Button>
                            ) : (
                              <Button variant="default" className="w-full justify-start">
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activate Account
                              </Button>
                            )}
                            <Button variant="destructive" className="w-full justify-start">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
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
            <CardDescription>Perform actions on multiple users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Bulk Email
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </Button>
              <Button variant="outline">
                <UserCheck className="h-4 w-4 mr-2" />
                Verify Users
              </Button>
              <Button variant="destructive">
                <Ban className="h-4 w-4 mr-2" />
                Suspend Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
