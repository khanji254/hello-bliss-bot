import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  BookOpen, 
  Zap, 
  Trophy, 
  Settings, 
  User, 
  Users, 
  BarChart3, 
  DollarSign,
  Monitor,
  Cpu,
  Bot,
  ShoppingBag
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const studentNavItems = [
  { name: "Dashboard", href: "/student", icon: Home },
  { name: "My Courses", href: "/student/courses", icon: BookOpen },
  { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { name: "Simulations", href: "/simulations", icon: Monitor },
  { name: "Progress", href: "/student/progress", icon: Trophy },
];

const teacherNavItems = [
  { name: "Dashboard", href: "/teacher", icon: Home },
  { name: "My Courses", href: "/teacher/courses", icon: BookOpen },
  { name: "Create Course", href: "/teacher/create", icon: Zap },
  { name: "Students", href: "/teacher/students", icon: Users },
  { name: "Analytics", href: "/teacher/analytics", icon: BarChart3 },
  { name: "Earnings", href: "/teacher/earnings", icon: DollarSign },
];

const simulationItems = [
  { name: "Circuit Lab", href: "/simulations/circuit", icon: Cpu },
  { name: "ROS Playground", href: "/simulations/ros", icon: Bot },
  { name: "Robot Programming", href: "/simulations/programming", icon: Monitor },
];

export function Sidebar({ className, isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  
  // Mock user role - replace with actual auth
  const userRole: "student" | "teacher" = "student";
  
  const navItems = userRole === "teacher" ? teacherNavItems : studentNavItems;

  return (
    <div className={cn(
      "pb-12 border-r bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/20",
      isOpen ? "w-64" : "w-0 overflow-hidden",
      "transition-all duration-300 ease-in-out lg:w-64",
      className
    )}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
                onClick={onClose}
              >
                <Link to={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Simulations
          </h2>
          <div className="space-y-1">
            {simulationItems.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
                onClick={onClose}
              >
                <Link to={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={onClose}
            >
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={onClose}
            >
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}