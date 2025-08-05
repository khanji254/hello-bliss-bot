import React, { useState } from 'react';
import { Layout } from "@/components/layout/Layout";
import { 
  Calendar,
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  BookOpen, 
  Target,
  Lightbulb,
  Brain,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Filter,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Award,
  Clock,
  Globe,
  Smartphone,
  Share2,
  MessageSquare,
  Heart,
  Eye,
  ThumbsUp,
  Gift,
  Megaphone,
  Trophy,
  Coins,
  CreditCard,
  Wallet,
  BanknoteIcon
} from 'lucide-react';

// Custom Building2 icon component
const Building2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from "@/contexts/AuthContext";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  ScatterChart,
  Scatter
} from 'recharts';

// Mock data for earnings analytics
const monthlyEarnings = [
  { month: 'Jan', revenue: 4200, students: 85, courses: 12, avgPrice: 49 },
  { month: 'Feb', revenue: 5800, students: 118, courses: 15, avgPrice: 52 },
  { month: 'Mar', revenue: 6400, students: 127, courses: 18, avgPrice: 55 },
  { month: 'Apr', revenue: 7200, students: 145, courses: 20, avgPrice: 58 },
  { month: 'May', revenue: 8900, students: 178, courses: 24, avgPrice: 62 },
  { month: 'Jun', revenue: 10500, students: 205, courses: 28, avgPrice: 65 },
  { month: 'Jul', revenue: 12300, students: 238, courses: 32, avgPrice: 68 },
  { month: 'Aug', revenue: 13800, students: 267, courses: 35, avgPrice: 72 },
];

const coursePerformance = [
  { name: 'Arduino Basics', revenue: 3200, students: 64, rating: 4.8, completion: 89 },
  { name: 'Robot Programming', revenue: 2800, students: 42, rating: 4.9, completion: 92 },
  { name: 'AI Fundamentals', revenue: 4200, students: 58, rating: 4.7, completion: 85 },
  { name: 'IoT Projects', revenue: 2400, students: 38, rating: 4.6, completion: 88 },
  { name: 'Machine Learning', revenue: 3800, students: 45, rating: 4.8, completion: 91 },
];

const revenueStreams = [
  { name: 'Course Sales', value: 45, amount: 15680 },
  { name: 'Subscriptions', value: 30, amount: 10450 },
  { name: 'Mentoring', value: 15, amount: 5220 },
  { name: 'Workshops', value: 10, amount: 3480 },
];

const studentAcquisitionChannels = [
  { channel: 'Organic Search', students: 45, cost: 0, conversion: 12.3, roi: 'Infinite' },
  { channel: 'Social Media', students: 32, cost: 280, conversion: 8.7, roi: '1240%' },
  { channel: 'Referrals', students: 28, cost: 150, conversion: 15.2, roi: '1680%' },
  { channel: 'Email Marketing', students: 22, cost: 120, conversion: 11.8, roi: '1450%' },
  { channel: 'Paid Ads', students: 18, cost: 450, conversion: 6.2, roi: '380%' },
  { channel: 'Content Marketing', students: 15, cost: 200, conversion: 9.5, roi: '675%' },
];

const strategicInsights = [
  {
    category: 'Market Opportunity',
    title: 'Robotics Education Market Growth',
    insight: 'The robotics education market is growing at 12.8% CAGR. Consider expanding into emerging areas like AI ethics and sustainable robotics.',
    impact: 'High',
    effort: 'Medium',
    timeframe: '3-6 months',
    icon: TrendingUp,
    color: 'text-green-600'
  },
  {
    category: 'Student Demographics',
    title: 'Untapped Age Groups',
    insight: 'Only 15% of your students are in the 35-50 age range, but this demographic shows highest completion rates (94%). Target professional upskilling.',
    impact: 'High',
    effort: 'Low',
    timeframe: '1-2 months',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    category: 'Content Strategy',
    title: 'Micro-Learning Opportunity',
    insight: 'Students engage 3x more with courses under 30 minutes per module. Consider breaking down complex topics into bite-sized lessons.',
    impact: 'Medium',
    effort: 'High',
    timeframe: '2-4 months',
    icon: Clock,
    color: 'text-purple-600'
  },
  {
    category: 'Geographic Expansion',
    title: 'International Markets',
    insight: 'Southeast Asian markets show 40% higher engagement rates. Consider creating region-specific content or partnerships.',
    impact: 'High',
    effort: 'High',
    timeframe: '6-12 months',
    icon: Globe,
    color: 'text-orange-600'
  }
];

const growthStrategies = [
  {
    strategy: 'Student Referral Program',
    description: 'Implement a tiered referral system with course credits and exclusive content access.',
    potential: '+25% student growth',
    investment: '$500',
    timeframe: '2-4 weeks',
    difficulty: 'Easy',
    icon: Share2,
    actions: ['Design referral tiers', 'Create tracking system', 'Develop rewards structure', 'Launch campaign']
  },
  {
    strategy: 'Corporate Training Partnerships',
    description: 'Partner with tech companies for employee robotics training programs.',
    potential: '+40% revenue',
    investment: '$2000',
    timeframe: '2-3 months',
    difficulty: 'Medium',
    icon: Building2,
    actions: ['Identify target companies', 'Create B2B packages', 'Develop enterprise features', 'Sales outreach']
  },
  {
    strategy: 'YouTube Content Marketing',
    description: 'Create weekly robotics tutorials and project showcases to drive organic traffic.',
    potential: '+60% organic reach',
    investment: '$800',
    timeframe: '1-2 months',
    difficulty: 'Medium',
    icon: Eye,
    actions: ['Content calendar', 'Video production setup', 'SEO optimization', 'Community engagement']
  },
  {
    strategy: 'Mobile App Development',
    description: 'Develop a mobile app for on-the-go learning with offline capabilities.',
    potential: '+35% engagement',
    investment: '$5000',
    timeframe: '4-6 months',
    difficulty: 'Hard',
    icon: Smartphone,
    actions: ['Market research', 'App design', 'Development', 'App store optimization']
  }
];

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <div className="flex items-center mt-1">
            {trend === 'up' ? (
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm ml-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </span>
          </div>
        </div>
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
    </CardContent>
  </Card>
);

export default function TeacherEarnings() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);

  const totalRevenue = monthlyEarnings.reduce((sum, month) => sum + month.revenue, 0);
  const totalStudents = monthlyEarnings[monthlyEarnings.length - 1].students;
  const averagePrice = Math.round(totalRevenue / totalStudents);
  const growthRate = ((monthlyEarnings[7].revenue - monthlyEarnings[0].revenue) / monthlyEarnings[0].revenue * 100);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8'];

  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <DollarSign className="h-8 w-8" />
              Earnings & Growth Strategy
            </h1>
            <p className="text-muted-foreground">
              Comprehensive revenue analytics and strategic planning dashboard
            </p>
          </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change="+12.5%"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Active Students"
          value={totalStudents.toLocaleString()}
          change="+8.3%"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Average Course Price"
          value={`$${averagePrice}`}
          change="+5.2%"
          icon={BookOpen}
          trend="up"
        />
        <StatCard
          title="Growth Rate"
          value={`${growthRate.toFixed(1)}%`}
          change="+2.1%"
          icon={TrendingUp}
          trend="up"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
          <TabsTrigger value="channels">Acquisition Channels</TabsTrigger>
          <TabsTrigger value="insights">Strategic Insights</TabsTrigger>
          <TabsTrigger value="growth">Growth Strategies</TabsTrigger>
          <TabsTrigger value="forecasting">Revenue Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Revenue Trend */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyEarnings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
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

            {/* Revenue Streams */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Streams</CardTitle>
                <CardDescription>Breakdown of income sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueStreams.map((stream, index) => (
                    <div key={stream.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{stream.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${stream.amount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{stream.value}%</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">$34,830</div>
                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">+18%</div>
                    <div className="text-sm text-muted-foreground">vs Last Period</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Courses</CardTitle>
              <CardDescription>Course revenue and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coursePerformance.map((course, index) => (
                  <div key={course.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{course.name}</h4>
                        <Badge variant="secondary">{course.students} students</Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          {course.rating}
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-green-500 mr-1" />
                          {course.completion}% completion
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">${course.revenue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Acquisition Analysis</CardTitle>
              <CardDescription>Performance metrics for each marketing channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentAcquisitionChannels.map((channel, index) => (
                  <div key={channel.channel} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{channel.channel}</h4>
                      <Badge variant={channel.cost === 0 ? "default" : "secondary"}>
                        {channel.cost === 0 ? 'Free' : `$${channel.cost} cost`}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Students</div>
                        <div className="font-bold text-lg">{channel.students}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Conversion</div>
                        <div className="font-bold text-lg">{channel.conversion}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">ROI</div>
                        <div className="font-bold text-lg text-green-600">{channel.roi}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Cost per Student</div>
                        <div className="font-bold text-lg">
                          {channel.cost === 0 ? 'Free' : `$${Math.round(channel.cost / channel.students)}`}
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={channel.students} 
                      className="mt-3" 
                      max={Math.max(...studentAcquisitionChannels.map(c => c.students))} 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
                <CardDescription>Students acquired by channel</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={studentAcquisitionChannels}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="channel" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students" fill="hsl(var(--primary))" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Analysis</CardTitle>
                <CardDescription>Cost vs. student acquisition effectiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={studentAcquisitionChannels.filter(c => c.cost > 0)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cost" name="Cost" />
                    <YAxis dataKey="students" name="Students" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'cost' ? `$${value}` : value,
                        name === 'cost' ? 'Cost' : 'Students'
                      ]}
                      labelFormatter={() => ''}
                      cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Scatter dataKey="students" fill="hsl(var(--secondary))" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI-Powered Strategic Insights
              </CardTitle>
              <CardDescription>
                Data-driven recommendations based on market analysis and your performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategicInsights.map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <insight.icon className={`h-6 w-6 ${insight.color} mt-1`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <Badge variant="outline" className="text-xs">
                              {insight.category}
                            </Badge>
                            <h4 className="font-semibold mt-1">{insight.title}</h4>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant={insight.impact === 'High' ? 'default' : 'secondary'}>
                              {insight.impact} Impact
                            </Badge>
                            <Badge variant="outline">
                              {insight.effort} Effort
                            </Badge>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{insight.insight}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Timeline: {insight.timeframe}
                          </span>
                          <Button variant="outline" size="sm">
                            <Lightbulb className="h-4 w-4 mr-2" />
                            Explore Strategy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Robotics Education</span>
                    <Badge className="bg-green-100 text-green-800">+12.8%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AI/ML Courses</span>
                    <Badge className="bg-green-100 text-green-800">+18.5%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">IoT Training</span>
                    <Badge className="bg-blue-100 text-blue-800">+9.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Automation</span>
                    <Badge className="bg-green-100 text-green-800">+15.3%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Competitor Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Your Average Price</span>
                      <span className="font-bold">${averagePrice}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Market Average</span>
                      <span>$78</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Your Completion Rate</span>
                      <span className="font-bold text-green-600">89%</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Industry Average</span>
                      <span>67%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Opportunity Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">8.7/10</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Excellent growth potential in your niche
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Market Position</span>
                      <span>Strong</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Content Quality</span>
                      <span>Excellent</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth Trajectory</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Growth Strategy Brainstorming Platform
              </CardTitle>
              <CardDescription>
                Strategic initiatives to accelerate student acquisition and revenue growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {growthStrategies.map((strategy, index) => (
                  <div 
                    key={index} 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedStrategy === index ? 'border-primary shadow-md' : 'hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedStrategy(selectedStrategy === index ? null : index)}
                  >
                    <div className="flex items-start space-x-3">
                      <strategy.icon className="h-6 w-6 text-primary mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{strategy.strategy}</h4>
                          <Badge 
                            variant={
                              strategy.difficulty === 'Easy' ? 'default' : 
                              strategy.difficulty === 'Medium' ? 'secondary' : 'destructive'
                            }
                          >
                            {strategy.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Potential:</span>
                            <div className="font-bold text-green-600">{strategy.potential}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Investment:</span>
                            <div className="font-bold">{strategy.investment}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Timeline:</span>
                            <div className="font-bold">{strategy.timeframe}</div>
                          </div>
                        </div>
                        
                        {selectedStrategy === index && (
                          <div className="mt-4 pt-4 border-t">
                            <h5 className="font-semibold mb-2">Action Plan:</h5>
                            <div className="space-y-2">
                              {strategy.actions.map((action, actionIndex) => (
                                <div key={actionIndex} className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-primary rounded-full" />
                                  <span className="text-sm">{action}</span>
                                </div>
                              ))}
                            </div>
                            <Button className="w-full mt-3" size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Start Implementation
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Priority Matrix</CardTitle>
                <CardDescription>Impact vs. effort analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 h-64">
                  <div className="border-r border-b p-2">
                    <div className="text-xs text-muted-foreground mb-2">High Impact, Low Effort</div>
                    <div className="space-y-1">
                      <Badge variant="default" className="text-xs">Student Referrals</Badge>
                    </div>
                  </div>
                  <div className="border-b p-2">
                    <div className="text-xs text-muted-foreground mb-2">High Impact, High Effort</div>
                    <div className="space-y-1">
                      <Badge variant="secondary" className="text-xs">Corporate Training</Badge>
                      <Badge variant="secondary" className="text-xs">Mobile App</Badge>
                    </div>
                  </div>
                  <div className="border-r p-2">
                    <div className="text-xs text-muted-foreground mb-2">Low Impact, Low Effort</div>
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-xs">Social Media</Badge>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="text-xs text-muted-foreground mb-2">Low Impact, High Effort</div>
                    <div className="space-y-1">
                      <Badge variant="destructive" className="text-xs">Traditional Ads</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Implementation Roadmap</CardTitle>
                <CardDescription>Suggested timeline for growth initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-600 rounded-full" />
                    <div>
                      <div className="font-semibold text-sm">Week 1-2</div>
                      <div className="text-xs text-muted-foreground">Launch referral program</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    <div>
                      <div className="font-semibold text-sm">Month 1-2</div>
                      <div className="text-xs text-muted-foreground">YouTube content strategy</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-600 rounded-full" />
                    <div>
                      <div className="font-semibold text-sm">Month 2-3</div>
                      <div className="text-xs text-muted-foreground">Corporate partnerships</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-600 rounded-full" />
                    <div>
                      <div className="font-semibold text-sm">Month 4-6</div>
                      <div className="text-xs text-muted-foreground">Mobile app development</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Projections</CardTitle>
                <CardDescription>AI-powered forecasting based on current trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">$45K</div>
                      <div className="text-xs text-muted-foreground">Next Month</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">$180K</div>
                      <div className="text-xs text-muted-foreground">Next Quarter</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">$750K</div>
                      <div className="text-xs text-muted-foreground">Next Year</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conservative Estimate</span>
                      <span className="font-bold">$620K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Optimistic Estimate</span>
                      <span className="font-bold text-green-600">$890K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Confidence Level</span>
                      <span className="font-bold">87%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goal Tracking</CardTitle>
                <CardDescription>Progress towards annual targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Annual Revenue Goal</span>
                      <span>$500K</span>
                    </div>
                    <Progress value={75} className="mb-1" />
                    <div className="text-xs text-muted-foreground">$375K achieved (75%)</div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Student Enrollment Goal</span>
                      <span>1,000</span>
                    </div>
                    <Progress value={62} className="mb-1" />
                    <div className="text-xs text-muted-foreground">620 students (62%)</div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Course Completion Goal</span>
                      <span>90%</span>
                    </div>
                    <Progress value={99} className="mb-1" />
                    <div className="text-xs text-muted-foreground">89% average (99% of goal)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Scenario Planning</CardTitle>
              <CardDescription>Revenue impact of different growth strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">Best Case Scenario</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>All strategies implemented</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue:</span>
                      <span className="font-bold">$890K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Students:</span>
                      <span className="font-bold">1,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth:</span>
                      <span className="font-bold text-green-600">+185%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-blue-600 mb-2">Realistic Scenario</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>2-3 strategies successful</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue:</span>
                      <span className="font-bold">$650K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Students:</span>
                      <span className="font-bold">920</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth:</span>
                      <span className="font-bold text-blue-600">+108%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-orange-600 mb-2">Conservative Scenario</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Current trajectory</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue:</span>
                      <span className="font-bold">$480K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Students:</span>
                      <span className="font-bold">680</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth:</span>
                      <span className="font-bold text-orange-600">+54%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
}
