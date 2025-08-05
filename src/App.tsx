import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeProvider";

// Components
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import AuthPage from "./pages/auth/AuthPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import Marketplace from "./pages/marketplace/Marketplace";
import CircuitSimulator from "./pages/simulations/CircuitSimulator";
import ROSPlayground from "./pages/simulations/ROSPlayground";
import StudentCourses from "./pages/student/StudentCourses";
import StudentProgress from "./pages/student/StudentProgress";
import StudentProfile from "./pages/student/StudentProfile";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherCourses from "./pages/teacher/TeacherCourses";
import TeacherAnalytics from "./pages/teacher/TeacherAnalytics";
import TeacherEarnings from "./pages/teacher/TeacherEarnings";
import CreateCourse from "./pages/teacher/CreateCourse";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="robotics-app-theme">
      <AuthProvider>
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
          <Route path="/student/courses" element={<StudentCourses />} />
          <Route path="/student/progress" element={<StudentProgress />} />
          
          {/* Teacher Routes */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/courses" element={<TeacherCourses />} />
          <Route path="/teacher/create" element={<CreateCourse />} />
          <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
          <Route path="/teacher/earnings" element={<TeacherEarnings />} />
          <Route path="/teacher/students" element={<TeacherStudents />} />
          
          {/* Shared Routes */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/courses/:id" element={<div>Course Detail</div>} />
          
          {/* Simulation Routes */}
          <Route path="/simulations" element={<div>Simulation Hub</div>} />
          <Route path="/simulations/circuit" element={<CircuitSimulator />} />
          <Route path="/simulations/ros" element={<ROSPlayground />} />
          <Route path="/simulations/programming" element={<div>Robot Programming</div>} />
          
          {/* Profile & Settings */}
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/settings" element={<Settings />} />
          
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
  </AuthProvider>
</ThemeProvider>
</QueryClientProvider>
);

export default App;