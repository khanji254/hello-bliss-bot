import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Cpu, Monitor, Users, Trophy, Star, Play, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <Cpu className="h-8 w-8" />,
    title: "Circuit Simulation",
    description: "Interactive breadboard builder with live simulation capabilities"
  },
  {
    icon: <Bot className="h-8 w-8" />,
    title: "ROS Playground", 
    description: "Run Robot Operating System simulations with real-world scenarios"
  },
  {
    icon: <Monitor className="h-8 w-8" />,
    title: "Robot Programming",
    description: "Learn coding with visual blocks and Python for robot control"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Collaborative Learning",
    description: "Join classrooms, work on team projects, and learn together"
  },
  {
    icon: <Trophy className="h-8 w-8" />,
    title: "Gamified Progress",
    description: "Earn badges, track achievements, and compete on leaderboards"
  },
  {
    icon: <Star className="h-8 w-8" />,
    title: "Expert Teachers",
    description: "Learn from verified robotics professionals and educators"
  }
];

const stats = [
  { label: "Active Students", value: "10,000+" },
  { label: "Expert Teachers", value: "500+" },
  { label: "Courses Available", value: "200+" },
  { label: "Simulations Run", value: "1M+" }
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 circuit-pattern">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <Badge variant="secondary" className="mb-4">
                🚀 New: ROS 2 Simulations Available
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Learn Robotics
                <span className="block text-primary">Through Practice</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Master robotics with interactive simulations, expert-led courses, and hands-on projects. 
                From circuits to ROS programming - everything you need to build the future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link to="/auth/signup">
                    Start Learning Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="relative">
                <div className="w-full h-80 lg:h-96 bg-card rounded-2xl shadow-circuit animate-float overflow-hidden">
                  <div className="h-full bg-gradient-tech p-8 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Bot className="h-20 w-20 mx-auto mb-4 animate-pulse-glow" />
                      <h3 className="text-2xl font-bold mb-2">Interactive Simulation</h3>
                      <p className="text-white/80">Experience robotics in action</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Everything You Need to Master Robotics
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From basic circuits to advanced ROS programming, our platform provides 
              comprehensive tools and expert guidance for every skill level.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-component hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Start Your Robotics Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students and teachers already building the future with robotics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link to="/auth/signup">
                Get Started Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link to="/marketplace">
                Browse Courses
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}