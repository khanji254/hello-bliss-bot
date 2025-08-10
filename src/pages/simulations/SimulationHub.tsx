import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity,
  Zap,
  CircuitBoard,
  Bot,
  Code,
  ArrowRight,
  Cpu,
  Battery,
  Lightbulb,
  Settings,
  Eye,
  BarChart3,
  Play,
  Users,
  Clock,
  Gauge
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface Simulator {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string;
  features: string[];
  href: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Electronics' | 'Arduino' | 'Robotics' | 'Programming';
}

const SimulationHub: React.FC = () => {
  const navigate = useNavigate();

  const simulators: Simulator[] = [
    {
      id: 'basic-circuit',
      title: 'Basic Circuit Simulator',
      description: 'Simple logic gates and basic electronic components using SimcirJS',
      icon: Activity,
      color: 'from-blue-500 to-blue-600',
      features: ['Logic Gates', 'Basic Components', 'Real-time Simulation', 'Educational Focus'],
      href: '/simulations/circuit',
      difficulty: 'Beginner',
      category: 'Electronics'
    },
    {
      id: 'arduino-playground',
      title: 'Arduino Playground',
      description: 'Tinkercad-style Arduino circuit design with microcontroller programming',
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      badge: 'New',
      features: ['Arduino Boards', 'Sensors & Actuators', 'Code Generation', 'Tinkercad Style'],
      href: '/simulations/arduino',
      difficulty: 'Intermediate',
      category: 'Arduino'
    },
    {
      id: 'advanced-electronics',
      title: 'Advanced Electronics Simulator',
      description: 'Professional SPICE-like circuit analysis with advanced components',
      icon: CircuitBoard,
      color: 'from-purple-500 to-purple-600',
      badge: 'Pro',
      features: ['SPICE Engine', 'Complex Analysis', 'Professional Components', 'Real-time Data'],
      href: '/simulations/electronics',
      difficulty: 'Expert',
      category: 'Electronics'
    },
    {
      id: 'ros-playground',
      title: 'ROS Playground',
      description: 'Robot Operating System simulation and development environment',
      icon: Bot,
      color: 'from-green-500 to-green-600',
      features: ['ROS Nodes', 'Robot Simulation', 'SLAM', 'Navigation'],
      href: '/simulations/ros',
      difficulty: 'Advanced',
      category: 'Robotics'
    },
    {
      id: 'robot-programming',
      title: 'Robot Programming',
      description: 'Visual programming interface for robotics and automation',
      icon: Code,
      color: 'from-indigo-500 to-indigo-600',
      features: ['Visual Programming', 'Block Coding', 'Robot Control', 'Automation'],
      href: '/simulations/programming',
      difficulty: 'Intermediate',
      category: 'Programming'
    }
  ];

  const categories = ['All', 'Electronics', 'Arduino', 'Robotics', 'Programming'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredSimulators = selectedCategory === 'All' 
    ? simulators 
    : simulators.filter(sim => sim.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    { label: 'Active Simulators', value: '5', icon: Play },
    { label: 'Students Using', value: '1.2k+', icon: Users },
    { label: 'Simulation Hours', value: '15k+', icon: Clock },
    { label: 'Success Rate', value: '98%', icon: Gauge }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">Simulation Hub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive suite of educational simulators for electronics, Arduino, robotics, and programming
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <stat.icon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Simulator Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSimulators.map((simulator) => (
            <Card key={simulator.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-0">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${simulator.color} p-6 text-white relative`}>
                  <div className="flex items-center justify-between mb-4">
                    <simulator.icon className="h-8 w-8" />
                    <div className="flex gap-2">
                      {simulator.badge && (
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {simulator.badge}
                        </Badge>
                      )}
                      <Badge variant="secondary" className={`${getDifficultyColor(simulator.difficulty)} border-0`}>
                        {simulator.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{simulator.title}</h3>
                  <p className="text-white/90 text-sm">{simulator.description}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Key Features:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {simulator.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Category: <span className="font-medium text-gray-700">{simulator.category}</span>
                      </div>
                      <Button 
                        onClick={() => navigate(simulator.href)}
                        className="group-hover:bg-blue-600 transition-colors"
                      >
                        Launch
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Start Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">Start with Basics</h3>
                <p className="text-sm text-gray-600">
                  Begin with the Basic Circuit Simulator to learn fundamental electronics concepts and logic gates.
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold">Try Arduino Projects</h3>
                <p className="text-sm text-gray-600">
                  Move to the Arduino Playground for hands-on microcontroller programming and circuit design.
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <CircuitBoard className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">Advanced Analysis</h3>
                <p className="text-sm text-gray-600">
                  Use the Advanced Electronics Simulator for professional circuit analysis and complex designs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SimulationHub;
