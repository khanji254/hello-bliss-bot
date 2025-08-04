import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Square, 
  RotateCcw, 
  Download, 
  Upload,
  Bot,
  Terminal,
  Eye,
  Settings,
  Zap,
  Map,
  Camera,
  Radar
} from "lucide-react";

const rosPackages = [
  { name: "navigation2", description: "Navigation stack for autonomous robots", status: "active" },
  { name: "gazebo_ros", description: "Gazebo simulator integration", status: "active" },
  { name: "moveit2", description: "Motion planning framework", status: "inactive" },
  { name: "perception", description: "Computer vision and perception", status: "active" },
  { name: "robot_state_publisher", description: "Robot state publishing", status: "active" }
];

const environments = [
  { id: "empty", name: "Empty World", description: "Basic empty environment for testing" },
  { id: "warehouse", name: "Warehouse", description: "Industrial warehouse with obstacles" },
  { id: "office", name: "Office", description: "Office building with furniture" },
  { id: "outdoor", name: "Outdoor Park", description: "Outdoor environment with trees" }
];

const robots = [
  { id: "turtlebot3", name: "TurtleBot3", description: "Popular educational robot platform" },
  { id: "pr2", name: "PR2", description: "Advanced research robot" },
  { id: "husky", name: "Husky UGV", description: "Rugged outdoor mobile platform" },
  { id: "ur5", name: "UR5 Arm", description: "Industrial robot arm" }
];

export default function ROSPlayground() {
  const [selectedEnvironment, setSelectedEnvironment] = useState("empty");
  const [selectedRobot, setSelectedRobot] = useState("turtlebot3");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);

  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationTime(0);
    // Mock simulation timer
    const timer = setInterval(() => {
      setSimulationTime(prev => prev + 1);
    }, 1000);
    
    // Stop after demo time
    setTimeout(() => {
      clearInterval(timer);
      setIsSimulating(false);
    }, 30000);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationTime(0);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Bot className="mr-3 h-8 w-8 text-primary" />
              ROS Playground
            </h1>
            <p className="text-muted-foreground mt-2">
              Simulate robots using Robot Operating System in realistic environments
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button 
              onClick={isSimulating ? stopSimulation : startSimulation}
              variant={isSimulating ? "destructive" : "default"}
            >
              {isSimulating ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop Simulation
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Simulation
                </>
              )}
            </Button>
            <Button variant="outline" onClick={resetSimulation}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Configuration Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Configuration</CardTitle>
              <CardDescription>
                Set up your simulation environment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="robot" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="robot">Robot</TabsTrigger>
                  <TabsTrigger value="world">World</TabsTrigger>
                </TabsList>
                
                <TabsContent value="robot" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Select Robot</h4>
                    <div className="space-y-2">
                      {robots.map((robot) => (
                        <Button
                          key={robot.id}
                          variant={selectedRobot === robot.id ? "default" : "outline"}
                          className="w-full justify-start h-auto p-3"
                          onClick={() => setSelectedRobot(robot.id)}
                        >
                          <div className="text-left">
                            <p className="font-medium">{robot.name}</p>
                            <p className="text-xs text-muted-foreground">{robot.description}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="world" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Environment</h4>
                    <div className="space-y-2">
                      {environments.map((env) => (
                        <Button
                          key={env.id}
                          variant={selectedEnvironment === env.id ? "default" : "outline"}
                          className="w-full justify-start h-auto p-3"
                          onClick={() => setSelectedEnvironment(env.id)}
                        >
                          <div className="text-left">
                            <p className="font-medium">{env.name}</p>
                            <p className="text-xs text-muted-foreground">{env.description}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Simulation View */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Gazebo Simulation</span>
                {isSimulating && (
                  <Badge variant="secondary" className="animate-pulse">
                    <Zap className="mr-1 h-3 w-3" />
                    Running {simulationTime}s
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 bg-gradient-to-br from-slate-100 to-slate-200 border-t flex items-center justify-center relative overflow-hidden">
                {isSimulating ? (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4 animate-pulse">
                      <Bot className="h-12 w-12 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Simulation Running</h3>
                    <p className="text-sm text-muted-foreground">
                      {robots.find(r => r.id === selectedRobot)?.name} in {environments.find(e => e.id === selectedEnvironment)?.name}
                    </p>
                    <div className="mt-4 flex justify-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Eye className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Simulation Viewer</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click "Start Simulation" to begin
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 bg-white/50 rounded">
                        <Map className="h-4 w-4 mx-auto mb-1" />
                        Navigation
                      </div>
                      <div className="p-2 bg-white/50 rounded">
                        <Camera className="h-4 w-4 mx-auto mb-1" />
                        Vision
                      </div>
                      <div className="p-2 bg-white/50 rounded">
                        <Radar className="h-4 w-4 mx-auto mb-1" />
                        LIDAR
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Control Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Control Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ROS Packages */}
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  ROS Packages
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {rosPackages.map((pkg, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="truncate">{pkg.name}</span>
                      <Badge 
                        variant={pkg.status === "active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {pkg.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Terminal Output */}
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <Terminal className="mr-2 h-4 w-4" />
                  ROS Output
                </h4>
                <div className="bg-black text-green-400 p-3 rounded text-xs font-mono h-32 overflow-y-auto">
                  {isSimulating ? (
                    <div className="space-y-1">
                      <div>[INFO] [gazebo_ros]: Starting Gazebo...</div>
                      <div>[INFO] [robot_state_publisher]: Publishing robot state</div>
                      <div>[INFO] [navigation2]: Navigation stack loaded</div>
                      <div>[INFO] [move_base]: Ready to receive goals</div>
                      <div className="text-yellow-400">[WARN] [controller]: No goal received</div>
                      <div className="animate-pulse">roscore@localhost:~$ _</div>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      Waiting for simulation to start...
                      <br />roscore@localhost:~$ _
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Quick Commands */}
              <div>
                <h4 className="font-medium mb-2">Quick Commands</h4>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" size="sm" disabled={!isSimulating}>
                    <Map className="mr-1 h-3 w-3" />
                    Send Goal
                  </Button>
                  <Button variant="outline" size="sm" disabled={!isSimulating}>
                    <Camera className="mr-1 h-3 w-3" />
                    Take Photo
                  </Button>
                  <Button variant="outline" size="sm" disabled={!isSimulating}>
                    <Radar className="mr-1 h-3 w-3" />
                    Scan Area
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-1 h-3 w-3" />
                    Load Map
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}