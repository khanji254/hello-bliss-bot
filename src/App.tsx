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
import CircuitSimulatorHybrid from "./pages/simulations/CircuitSimulatorHybrid";
import CircuitSimulatorProfessional from "./pages/simulations/CircuitSimulatorProfessional";
import ArduinoPlayground from "./pages/simulations/ArduinoPlayground";
import AdvancedElectronicsSimulator from "./pages/simulations/AdvancedElectronicsSimulator";
import SimulationHub from "./pages/simulations/SimulationHub";
import ROSPlayground from "./pages/simulations/ROSPlayground";
import { RobotProgramming } from "./pages/simulations/RobotProgramming";
import StudentCourses from "./pages/student/StudentCourses";
import StudentProgress from "./pages/student/StudentProgress";
import StudentProfile from "./pages/student/StudentProfile";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherCourses from "./pages/teacher/TeacherCourses";
import TeacherAnalytics from "./pages/teacher/TeacherAnalytics";
import TeacherEarnings from "./pages/teacher/TeacherEarnings";
import CreateCourse from "./pages/teacher/CreateCourse";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ManageUsers } from "./pages/admin/ManageUsers";
import { ManageCourses } from "./pages/admin/ManageCourses";
import { ManagePayments } from "./pages/admin/ManagePayments";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import IsaacSim from "./pages/simulations/IsaacSim";
import WebotsSim from "./pages/simulations/WebotsSim";

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
              
              {/* Student Protected Routes */}
              <Route 
                path="/student" 
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/courses" 
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentCourses />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/progress" 
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentProgress />
                  </ProtectedRoute>
                } 
              />
              
              {/* Teacher Protected Routes */}
              <Route 
                path="/teacher" 
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/courses" 
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <TeacherCourses />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/create" 
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <CreateCourse />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/analytics" 
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <TeacherAnalytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/earnings" 
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <TeacherEarnings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/students" 
                element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <TeacherStudents />
                  </ProtectedRoute>
                } 
              />
              
              {/* Shared Protected Routes */}
              <Route 
                path="/marketplace" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher"]}>
                    <Marketplace />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/courses/:id" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher"]}>
                    <div>Course Detail</div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Simulation Routes - Allow both students and teachers */}
              <Route 
                path="/simulations" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher"]}>
                    <SimulationHub />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/simulations/circuit" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher"]}>
                    <CircuitSimulatorProfessional />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/simulations/circuit-hybrid" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher"]}>
                    <CircuitSimulatorHybrid />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/simulations/circuit-legacy" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher"]}>
                    <CircuitSimulator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/simulations/arduino" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher"]}>
                    <ArduinoPlayground />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/simulations/electronics" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher"]}>
                    <AdvancedElectronicsSimulator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/simulations/isaac" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher"]}>
                    <IsaacSim />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/simulations/ros" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher"]}>
                    <ROSPlayground />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/simulations/programming" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher"]}>
                    <RobotProgramming />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/simulations/mcu" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher"]}>
                    <ArduinoPlayground />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/simulations/webots" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher"]}>
                    <WebotsSim />
                  </ProtectedRoute>
                } 
              />
              
              {/* Profile & Settings - All authenticated users */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
                    <StudentProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ManageUsers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/courses" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ManageCourses />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/payments" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ManagePayments />
                  </ProtectedRoute>
                } 
              />
              
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