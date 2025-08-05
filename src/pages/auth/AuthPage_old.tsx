import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Bot, User, GraduationCap, Shield, Loader2 } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";

export default function AuthPage() {
  const { user, login, register, isLoading } = useAuth();
  const [userType, setUserType] = useState<UserRole>("student");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    role: "student" as UserRole 
  });
  const [error, setError] = useState("");

  // Redirect if already logged in
  if (user) {
    const redirectTo = user.role === "student" ? "/student" : 
                      user.role === "teacher" ? "/teacher" : "/admin";
    return <Navigate to={redirectTo} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // For demo purposes, determine role based on email
      const role: UserRole = loginData.email.includes("teacher") ? "teacher" :
                            loginData.email.includes("admin") ? "admin" : "student";
      await login(loginData.email, loginData.password, role);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(registerData.name, registerData.email, registerData.password, registerData.role);
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 circuit-pattern p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <span>RoboLearn</span>
          </Link>
          <p className="text-muted-foreground mt-2">Join the robotics learning revolution</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to continue your robotics journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="student@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
                
                <div className="text-center text-sm text-muted-foreground space-y-1">
                  <p className="font-medium">Demo accounts:</p>
                  <p>Student: student@example.com</p>
                  <p>Teacher: teacher@example.com</p>
                  <p>Admin: admin@example.com</p>
                  <p>Password: any text</p>
                </div>
                  <Input id="password" type="password" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
                <Button className="w-full">Sign In</Button>
                <div className="text-center">
                  <Link to="/auth/forgot" className="text-sm text-primary hover:underline">
                    Forgot your password?
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Start learning robotics today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* User Type Selection */}
                <div className="space-y-3">
                  <Label>I am a:</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant={userType === "student" ? "default" : "outline"}
                      className="h-auto p-4 flex-col space-y-2"
                      onClick={() => setUserType("student")}
                    >
                      <GraduationCap className="h-6 w-6" />
                      <span>Student</span>
                    </Button>
                    <Button 
                      variant={userType === "teacher" ? "default" : "outline"}
                      className="h-auto p-4 flex-col space-y-2"
                      onClick={() => setUserType("teacher")}
                    >
                      <User className="h-6 w-6" />
                      <span>Teacher</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" />
                </div>

                {userType === "teacher" && (
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your expertise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circuits">Electronics & Circuits</SelectItem>
                        <SelectItem value="programming">Robot Programming</SelectItem>
                        <SelectItem value="ros">ROS Development</SelectItem>
                        <SelectItem value="mechanics">Mechanical Design</SelectItem>
                        <SelectItem value="ai">AI & Machine Learning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  </Label>
                </div>
                
                <Button className="w-full">
                  Create Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}