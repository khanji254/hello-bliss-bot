import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  BookOpen,
  Monitor,
  ShoppingBag,
  User,
  Settings,
  Award,
  BarChart3,
  Users,
  DollarSign,
  Plus,
  Bot,
  Cpu,
  Code,
  Shield,
  Zap,
  CircuitBoard,
  Activity,
  Cpu as CpuIcon
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { UserRole } from "@/types/user";

interface NavigationProps {
  userRole: UserRole;
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles: UserRole[];
}

const navigationItems: NavItem[] = [
  // Common items
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    roles: ["student", "teacher", "admin"]
  },
  {
    title: "Marketplace",
    href: "/marketplace",
    icon: ShoppingBag,
    roles: ["student", "teacher", "admin"]
  },
  
  // Student-specific
  {
    title: "My Courses",
    href: "/student/courses",
    icon: BookOpen,
    roles: ["student"]
  },
  {
    title: "Progress",
    href: "/student/progress",
    icon: Award,
    roles: ["student"]
  },
  
  // Teacher-specific
  {
    title: "My Courses",
    href: "/teacher/courses",
    icon: BookOpen,
    roles: ["teacher"]
  },
  {
    title: "Create Course",
    href: "/teacher/create",
    icon: Plus,
    roles: ["teacher"]
  },
  {
    title: "Students",
    href: "/teacher/students",
    icon: Users,
    roles: ["teacher"]
  },
  {
    title: "Analytics",
    href: "/teacher/analytics",
    icon: BarChart3,
    roles: ["teacher"]
  },
  {
    title: "Earnings",
    href: "/teacher/earnings",
    icon: DollarSign,
    badge: "New",
    roles: ["teacher"]
  },
  
  // Simulation tools (all users)
  {
    title: "Simulation Hub",
    href: "/simulations",
    icon: Monitor,
    roles: ["student", "teacher", "admin"]
  },
  {
    title: "Basic Circuit Simulator",
    href: "/simulations/circuit",
    icon: Activity,
    roles: ["student", "teacher", "admin"]
  },
  {
    title: "Microcontroller Lab",
    href: "/simulations/arduino",
    icon: CpuIcon,
    badge: "Preview",
    roles: ["student", "teacher", "admin"]
  },
  {
    title: "Advanced Electronics",
    href: "/simulations/electronics",
    icon: CircuitBoard,
    badge: "Pro",
    roles: ["student", "teacher", "admin"]
  },
  {
    title: "ROS Playground",
    href: "/simulations/ros",
    icon: Bot,
    roles: ["student", "teacher", "admin"]
  },
  {
    title: "Isaac Sim",
    href: "/simulations/isaac",
    icon: Cpu,
    badge: "Pro",
    roles: ["student", "teacher", "admin"]
  },
  {
    title: "Webots Online",
    href: "/simulations/webots",
    icon: Bot,
    roles: ["student", "teacher", "admin"]
  },
  {
    title: "Robot Programming",
    href: "/simulations/programming",
    icon: Code,
    roles: ["student", "teacher", "admin"]
  },
  
  // Admin-specific
  {
    title: "Admin Panel",
    href: "/admin",
    icon: Shield,
    roles: ["admin"]
  },
  {
    title: "Manage Users",
    href: "/admin/users",
    icon: Users,
    roles: ["admin"]
  },
  {
    title: "Manage Courses",
    href: "/admin/courses",
    icon: BookOpen,
    roles: ["admin"]
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: DollarSign,
    roles: ["admin"]
  },
  
  // User settings (all users)
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    roles: ["student", "teacher", "admin"]
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["student", "teacher", "admin"]
  }
];

export function Navigation({ userRole, className }: NavigationProps) {
  const location = useLocation();
  
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  const isSim = (href: string) => href.startsWith("/simulations");
  const simCategory = (href: string): "Electronics" | "Arduino" | "Robotics" | "Programming" | "Hub" => {
    if (href === "/simulations") return "Hub";
    if (href.includes("/arduino")) return "Arduino";
    if (href.includes("/electronics") || href.includes("/circuit")) return "Electronics";
    if (href.includes("/ros") || href.includes("/isaac") || href.includes("/webots")) return "Robotics";
    if (href.includes("/programming")) return "Programming";
    return "Electronics";
  };

  // Group items by section
  const sections = [
    {
      title: "Main",
      items: filteredItems.filter(item => 
        ["Dashboard", "Marketplace", "My Courses", "Progress"].includes(item.title)
      )
    },
    {
      title: userRole === "teacher" ? "Teaching" : userRole === "admin" ? "Management" : "Learning",
      items: filteredItems.filter(item => 
        userRole === "teacher" 
          ? ["Create Course", "Students", "Analytics", "Earnings"].includes(item.title)
          : userRole === "admin"
          ? ["Admin Panel", "Manage Users", "Manage Courses", "Payments"].includes(item.title)
          : ["My Courses", "Progress"].includes(item.title)
      )
    },
    {
      title: "Simulations",
      items: filteredItems.filter(item => isSim(item.href))
    },
    {
      title: "Account",
      items: filteredItems.filter(item => 
        ["Profile", "Settings"].includes(item.title)
      )
    }
  ].filter(section => section.items.length > 0);

  return (
    <nav className={cn("space-y-6", className)}>
      {sections.map((section) => (
        <div key={section.title} className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
            {section.title}
          </h3>
          <div className="space-y-1">
            {section.title !== "Simulations" && section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || 
                (item.href !== "/" && location.pathname.startsWith(item.href));
              
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    isActive && "bg-secondary text-secondary-foreground"
                  )}
                  asChild
                >
                  <Link to={item.href}>
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </Button>
              );
            })}

            {section.title === "Simulations" && (
              <div className="space-y-3">
                {/* Hub on top */}
                {section.items.filter(i => simCategory(i.href) === "Hub").map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
                  return (
                    <Button key={item.href} variant={isActive ? "secondary" : "ghost"} className="w-full justify-start gap-3 h-10" asChild>
                      <Link to={item.href}>
                        <Icon className="h-4 w-4" />
                        <span className="flex-1 text-left">{item.title}</span>
                      </Link>
                    </Button>
                  );
                })}

                {(["Electronics", "Arduino", "Robotics", "Programming"] as const).map((cat) => {
                  const items = section.items
                    .filter(i => simCategory(i.href) === cat)
                    .sort((a, b) => a.title.localeCompare(b.title));
                  if (!items.length) return null;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="px-3 text-[10px] uppercase tracking-wider text-muted-foreground">{cat}</div>
                      {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
                        return (
                          <Button key={item.href} variant={isActive ? "secondary" : "ghost"} className="w-full justify-start gap-3 h-9" asChild>
                            <Link to={item.href}>
                              <Icon className="h-4 w-4" />
                              <span className="flex-1 text-left">{item.title}</span>
                              {item.badge && (
                                <Badge variant={item.badge === "Pro" ? "secondary" : "destructive"} className="ml-auto">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </Button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ))}
    </nav>
  );
}
