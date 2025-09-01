import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "./Navigation";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen = true, onClose }: SidebarProps) {
  const { user, profile } = useAuth();
  
  if (!user) {
    return null;
  }

  return (
    <div className={cn(
      "flex h-full w-64 flex-col border-r bg-card",
      className
    )}>
      {/* Mobile close button */}
      <div className="flex items-center justify-between p-4 lg:hidden">
        <h2 className="text-lg font-semibold">Menu</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator className="lg:hidden" />
      
      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <Navigation userRole={profile?.role || 'student'} />
      </ScrollArea>
      
      {/* User info at bottom */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">
              {profile?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}