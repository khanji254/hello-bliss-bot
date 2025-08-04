import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <Sidebar isOpen onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 top-16 z-30 bg-black/20 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className={cn(
          "flex-1 min-h-[calc(100vh-4rem)] p-4 lg:p-8",
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}