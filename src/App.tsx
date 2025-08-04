import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import AuthPage from "./pages/auth/AuthPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import Marketplace from "./pages/marketplace/Marketplace";
import CircuitSimulator from "./pages/simulations/CircuitSimulator";
import ROSPlayground from "./pages/simulations/ROSPlayground";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth/*" element={<AuthPage />} />
          
          {/* Student Routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<div>Student Courses</div>} />
          <Route path="/student/progress" element={<div>Student Progress</div>} />
          
          {/* Teacher Routes */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/courses" element={<div>Teacher Courses</div>} />
          <Route path="/teacher/create" element={<div>Create Course</div>} />
          <Route path="/teacher/analytics" element={<div>Teacher Analytics</div>} />
          <Route path="/teacher/earnings" element={<div>Earnings</div>} />
          <Route path="/teacher/students" element={<div>Manage Students</div>} />
          
          {/* Shared Routes */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/courses/:id" element={<div>Course Detail</div>} />
          
          {/* Simulation Routes */}
          <Route path="/simulations" element={<div>Simulation Hub</div>} />
          <Route path="/simulations/circuit" element={<CircuitSimulator />} />
          <Route path="/simulations/ros" element={<ROSPlayground />} />
          <Route path="/simulations/programming" element={<div>Robot Programming</div>} />
          
          {/* Profile & Settings */}
          <Route path="/profile" element={<div>User Profile</div>} />
          <Route path="/settings" element={<div>Settings</div>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<div>Admin Dashboard</div>} />
          <Route path="/admin/users" element={<div>Manage Users</div>} />
          <Route path="/admin/courses" element={<div>Manage Courses</div>} />
          <Route path="/admin/payments" element={<div>Manage Payments</div>} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;