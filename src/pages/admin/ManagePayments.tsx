import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Receipt,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock payment data
const transactions = [
  {
    id: 'TXN-001',
    user: 'Alice Johnson',
    userEmail: 'alice@example.com',
    course: 'Introduction to Robotics',
    amount: 99.99,
    fee: 2.99,
    netAmount: 97.00,
    status: 'completed',
    method: 'credit_card',
    gateway: 'Stripe',
    date: '2024-08-05 14:30:25',
    refunded: false,
    currency: 'USD'
  },
  {
    id: 'TXN-002',
    user: 'Bob Smith',
    userEmail: 'bob@example.com',
    course: 'Advanced AI Programming',
    amount: 199.99,
    fee: 5.99,
    netAmount: 194.00,
    status: 'completed',
    method: 'paypal',
    gateway: 'PayPal',
    date: '2024-08-05 12:15:10',
    refunded: false,
    currency: 'USD'
  },
  {
    id: 'TXN-003',
    user: 'Carol Davis',
    userEmail: 'carol@example.com',
    course: 'ROS2 Fundamentals',
    amount: 149.99,
    fee: 4.49,
    netAmount: 145.50,
    status: 'failed',
    method: 'credit_card',
    gateway: 'Stripe',
    date: '2024-08-05 10:45:33',
    refunded: false,
    currency: 'USD'
  },
  {
    id: 'TXN-004',
    user: 'David Wilson',
    userEmail: 'david@example.com',
    course: 'Circuit Design Basics',
    amount: 79.99,
    fee: 2.39,
    netAmount: 77.60,
    status: 'pending',
    method: 'bank_transfer',
    gateway: 'Stripe',
    date: '2024-08-05 09:20:15',
    refunded: false,
    currency: 'USD'
  },
  {
    id: 'TXN-005',
    user: 'Eve Brown',
    userEmail: 'eve@example.com',
    course: 'Introduction to Robotics',
    amount: 99.99,
    fee: 2.99,
    netAmount: 97.00,
    status: 'completed',
    method: 'credit_card',
    gateway: 'Stripe',
    date: '2024-08-04 16:55:42',
    refunded: true,
    currency: 'USD'
  }
];

const payouts = [
  {
    id: 'PAY-001',
    instructor: 'Dr. John Smith',
    instructorEmail: 'john.smith@example.com',
    amount: 4850.00,
    courses: 3,
    students: 245,
    status: 'completed',
    date: '2024-08-01',
    method: 'bank_transfer',
    period: 'July 2024'
  },
  {
    id: 'PAY-002',
    instructor: 'Prof. Sarah Johnson',
    instructorEmail: 'sarah.johnson@example.com',
    amount: 7560.00,
    courses: 2,
    students: 189,
    status: 'pending',
    date: '2024-08-05',
    method: 'paypal',
    period: 'July 2024'
  },
  {
    id: 'PAY-003',
    instructor: 'Dr. Mike Davis',
    instructorEmail: 'mike.davis@example.com',
    amount: 2340.00,
    courses: 1,
    students: 78,
    status: 'processing',
    date: '2024-08-03',
    method: 'bank_transfer',
    period: 'July 2024'
  }
];

const revenueData = [
  { month: 'Jan', revenue: 45000, transactions: 450, fees: 1350 },
  { month: 'Feb', revenue: 52000, transactions: 520, fees: 1560 },
  { month: 'Mar', revenue: 48000, transactions: 480, fees: 1440 },
  { month: 'Apr', revenue: 61000, transactions: 610, fees: 1830 },
  { month: 'May', revenue: 55000, transactions: 550, fees: 1650 },
  { month: 'Jun', revenue: 67000, transactions: 670, fees: 2010 },
  { month: 'Jul', revenue: 74000, transactions: 740, fees: 2220 },
  { month: 'Aug', revenue: 68000, transactions: 680, fees: 2040 }
];

const paymentMethods = [
  { name: 'Credit Card', value: 68, color: 'hsl(var(--primary))' },
  { name: 'PayPal', value: 22, color: 'hsl(var(--secondary))' },
  { name: 'Bank Transfer', value: 8, color: 'hsl(var(--accent))' },
  { name: 'Other', value: 2, color: 'hsl(var(--muted))' }
];

const financialMetrics = {
  totalRevenue: 384000,
  monthlyRevenue: 68000,
  totalTransactions: 2847,
  pendingPayouts: 24567,
  failedTransactions: 23,
  refundRequests: 12,
  averageOrderValue: 134.85,
  conversionRate: 3.2
};

export function ManagePayments() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    const matchesMethod = selectedMethod === 'all' || transaction.method === selectedMethod;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'processing': return 'outline';
      default: return 'secondary';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card': return <CreditCard className="h-4 w-4" />;
      case 'paypal': return <Wallet className="h-4 w-4" />;
      case 'bank_transfer': return <DollarSign className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Payment Management</h1>
            <p className="text-muted-foreground">Monitor transactions, payouts, and financial metrics</p>
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

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${financialMetrics.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${financialMetrics.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${financialMetrics.pendingPayouts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">To {payouts.length} instructors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${financialMetrics.averageOrderValue}</div>
              <p className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2.3% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search transactions..." 
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Transaction List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions ({filteredTransactions.length})</CardTitle>
                <CardDescription>Monitor payment transactions and processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {getMethodIcon(transaction.method)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{transaction.id}</p>
                            <Badge variant={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                            {transaction.refunded && (
                              <Badge variant="destructive">Refunded</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{transaction.user} • {transaction.userEmail}</p>
                          <p className="text-xs text-muted-foreground">{transaction.course}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold">${transaction.amount}</p>
                        <p className="text-sm text-muted-foreground">Fee: ${transaction.fee}</p>
                        <p className="text-xs text-muted-foreground">Net: ${transaction.netAmount}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm">{transaction.gateway}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
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
                              <DialogTitle>Transaction Details - {transaction.id}</DialogTitle>
                              <DialogDescription>Complete transaction information</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Customer Information</h4>
                                  <div className="space-y-1 text-sm">
                                    <p><span className="text-muted-foreground">Name:</span> {transaction.user}</p>
                                    <p><span className="text-muted-foreground">Email:</span> {transaction.userEmail}</p>
                                    <p><span className="text-muted-foreground">Course:</span> {transaction.course}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Payment Information</h4>
                                  <div className="space-y-1 text-sm">
                                    <p><span className="text-muted-foreground">Method:</span> {transaction.method.replace('_', ' ')}</p>
                                    <p><span className="text-muted-foreground">Gateway:</span> {transaction.gateway}</p>
                                    <p><span className="text-muted-foreground">Currency:</span> {transaction.currency}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Amount Breakdown</h4>
                                  <div className="space-y-1 text-sm">
                                    <p><span className="text-muted-foreground">Amount:</span> ${transaction.amount}</p>
                                    <p><span className="text-muted-foreground">Processing Fee:</span> ${transaction.fee}</p>
                                    <p><span className="text-muted-foreground">Net Amount:</span> ${transaction.netAmount}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Transaction Status</h4>
                                  <div className="space-y-1 text-sm">
                                    <p><span className="text-muted-foreground">Status:</span> {transaction.status}</p>
                                    <p><span className="text-muted-foreground">Date:</span> {transaction.date}</p>
                                    <p><span className="text-muted-foreground">Refunded:</span> {transaction.refunded ? 'Yes' : 'No'}</p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Button variant="outline" className="w-full">
                                    Process Refund
                                  </Button>
                                  <Button variant="outline" className="w-full">
                                    Download Receipt
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payouts Tab */}
          <TabsContent value="payouts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Instructor Payouts</CardTitle>
                <CardDescription>Manage payments to course instructors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payouts.map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{payout.instructor}</p>
                            <Badge variant={getStatusColor(payout.status)}>
                              {payout.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{payout.instructorEmail}</p>
                          <p className="text-xs text-muted-foreground">
                            {payout.courses} courses • {payout.students} students • {payout.period}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-lg">${payout.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{payout.method.replace('_', ' ')}</p>
                        <p className="text-xs text-muted-foreground">{payout.date}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          Process Payout
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Monthly revenue and transaction volume</CardDescription>
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
                        name="Revenue ($)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Distribution of payment methods used</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={paymentMethods}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>Generate and download financial reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Receipt className="h-6 w-6 mb-2" />
                    Transaction Report
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <DollarSign className="h-6 w-6 mb-2" />
                    Revenue Report
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    Payout Report
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Analytics Report
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    Failed Transactions
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <RefreshCw className="h-6 w-6 mb-2" />
                    Refund Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
