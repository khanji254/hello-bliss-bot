import React, { useState, useRef, useEffect } from 'react';
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Play,
  Pause,
  Square,
  RotateCcw,
  Zap,
  Settings,
  Monitor,
  Code,
  Bot,
  Target,
  Navigation,
  Activity,
  Gauge,
  Eye,
  Radio,
  Save,
  Upload,
  Download
} from 'lucide-react';

interface Robot {
  x: number;
  y: number;
  angle: number;
  speed: number;
  sensors: {
    ultrasonic: { distance: number; maxRange: number };
    ir: { left: number; right: number; front: number };
    compass: { heading: number };
    encoder: { leftSpeed: number; rightSpeed: number };
  };
}

interface Environment {
  width: number;
  height: number;
  obstacles: Obstacle[];
  startPosition: { x: number; y: number; angle: number };
  goals: Goal[];
  lineTrack?: LineTrack;
}

interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'wall' | 'box' | 'pillar';
}

interface Goal {
  id: string;
  x: number;
  y: number;
  radius: number;
  reached: boolean;
}

interface LineTrack {
  points: { x: number; y: number }[];
  width: number;
}

const environments = [
  {
    id: 'empty',
    name: 'Empty Field',
    description: 'Open space for basic movement testing'
  },
  {
    id: 'maze',
    name: 'Simple Maze',
    description: 'Navigate through walls to reach the goal'
  },
  {
    id: 'line_follow',
    name: 'Line Following',
    description: 'Follow the black line to complete the track'
  },
  {
    id: 'obstacle_course',
    name: 'Obstacle Course',
    description: 'Navigate around obstacles to reach multiple goals'
  }
];

const programmingLanguages = [
  { value: 'python', label: 'Python', example: `# Robot Control Code
def main():
    robot = Robot()
    
    while robot.is_running():
        # Read sensors
        distance = robot.get_ultrasonic_distance()
        ir_left = robot.get_ir_sensor('left')
        ir_right = robot.get_ir_sensor('right')
        
        # Simple obstacle avoidance
        if distance < 20:  # cm
            robot.turn_right(90)
        elif ir_left > ir_right:
            robot.turn_left(15)
        elif ir_right > ir_left:
            robot.turn_right(15)
        else:
            robot.move_forward()
        
        robot.sleep(0.1)

main()` },
  { value: 'cpp', label: 'C++', example: `#include <robot.h>

int main() {
    Robot robot;
    
    while (robot.isRunning()) {
        // Read sensors
        float distance = robot.getUltrasonicDistance();
        int irLeft = robot.getIRSensor(LEFT);
        int irRight = robot.getIRSensor(RIGHT);
        
        // Simple obstacle avoidance
        if (distance < 20.0) {  // cm
            robot.turnRight(90);
        } else if (irLeft > irRight) {
            robot.turnLeft(15);
        } else if (irRight > irLeft) {
            robot.turnRight(15);
        } else {
            robot.moveForward();
        }
        
        robot.sleep(100);  // ms
    }
    
    return 0;
}` },
  { value: 'rust', label: 'Rust', example: `use robot_lib::Robot;

fn main() {
    let mut robot = Robot::new();
    
    while robot.is_running() {
        // Read sensors
        let distance = robot.get_ultrasonic_distance();
        let ir_left = robot.get_ir_sensor(Side::Left);
        let ir_right = robot.get_ir_sensor(Side::Right);
        
        // Simple obstacle avoidance
        if distance < 20.0 {  // cm
            robot.turn_right(90.0);
        } else if ir_left > ir_right {
            robot.turn_left(15.0);
        } else if ir_right > ir_left {
            robot.turn_right(15.0);
        } else {
            robot.move_forward();
        }
        
        robot.sleep(100);  // ms
    }
}` }
];

export default function Robot2DSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState('empty');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState(programmingLanguages[0].example);
  const [activeTab, setActiveTab] = useState('code');
  const [showSensorReadings, setShowSensorReadings] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState([1]);
  
  const [robot, setRobot] = useState<Robot>({
    x: 100,
    y: 100,
    angle: 0,
    speed: 0,
    sensors: {
      ultrasonic: { distance: 100, maxRange: 200 },
      ir: { left: 512, right: 512, front: 512 },
      compass: { heading: 0 },
      encoder: { leftSpeed: 0, rightSpeed: 0 }
    }
  });

  const [environment, setEnvironment] = useState<Environment>({
    width: 800,
    height: 600,
    obstacles: [],
    startPosition: { x: 100, y: 100, angle: 0 },
    goals: []
  });

  // Initialize canvas and start animation loop
  useEffect(() => {
    loadEnvironment(selectedEnvironment);
  }, [selectedEnvironment]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      const interval = setInterval(() => {
        updateSimulation();
      }, 50 / simulationSpeed[0]); // Adjust speed based on slider
      
      return () => clearInterval(interval);
    }
  }, [isRunning, isPaused, simulationSpeed]);

  useEffect(() => {
    drawSimulation();
  }, [robot, environment]);

  const loadEnvironment = (envId: string) => {
    let newEnv: Environment = {
      width: 800,
      height: 600,
      obstacles: [],
      startPosition: { x: 100, y: 100, angle: 0 },
      goals: []
    };

    switch (envId) {
      case 'maze':
        newEnv.obstacles = [
          { id: '1', x: 0, y: 0, width: 800, height: 20, type: 'wall' },
          { id: '2', x: 0, y: 0, width: 20, height: 600, type: 'wall' },
          { id: '3', x: 780, y: 0, width: 20, height: 600, type: 'wall' },
          { id: '4', x: 0, y: 580, width: 800, height: 20, type: 'wall' },
          { id: '5', x: 200, y: 100, width: 20, height: 300, type: 'wall' },
          { id: '6', x: 400, y: 200, width: 200, height: 20, type: 'wall' },
          { id: '7', x: 500, y: 400, width: 20, height: 150, type: 'wall' }
        ];
        newEnv.goals = [{ id: 'goal1', x: 700, y: 500, radius: 30, reached: false }];
        break;
        
      case 'line_follow':
        newEnv.lineTrack = {
          points: [
            { x: 50, y: 300 },
            { x: 200, y: 300 },
            { x: 300, y: 200 },
            { x: 500, y: 200 },
            { x: 600, y: 300 },
            { x: 750, y: 300 },
            { x: 750, y: 450 },
            { x: 600, y: 450 },
            { x: 500, y: 350 },
            { x: 300, y: 350 },
            { x: 200, y: 450 },
            { x: 50, y: 450 },
            { x: 50, y: 300 }
          ],
          width: 3
        };
        break;
        
      case 'obstacle_course':
        newEnv.obstacles = [
          { id: '1', x: 200, y: 150, width: 50, height: 50, type: 'box' },
          { id: '2', x: 400, y: 300, width: 30, height: 30, type: 'pillar' },
          { id: '3', x: 600, y: 100, width: 40, height: 100, type: 'box' },
          { id: '4', x: 300, y: 500, width: 60, height: 40, type: 'box' }
        ];
        newEnv.goals = [
          { id: 'goal1', x: 150, y: 500, radius: 25, reached: false },
          { id: 'goal2', x: 650, y: 450, radius: 25, reached: false },
          { id: 'goal3', x: 750, y: 150, radius: 25, reached: false }
        ];
        break;
    }

    setEnvironment(newEnv);
    setRobot(prev => ({
      ...prev,
      x: newEnv.startPosition.x,
      y: newEnv.startPosition.y,
      angle: newEnv.startPosition.angle
    }));
  };

  const updateSimulation = () => {
    setRobot(prev => {
      const newRobot = { ...prev };
      
      // Simulate robot movement (basic physics)
      if (newRobot.speed > 0) {
        const radians = (newRobot.angle * Math.PI) / 180;
        newRobot.x += Math.cos(radians) * newRobot.speed;
        newRobot.y += Math.sin(radians) * newRobot.speed;
      }
      
      // Update sensors
      updateSensors(newRobot);
      
      // Keep robot within bounds
      newRobot.x = Math.max(20, Math.min(environment.width - 20, newRobot.x));
      newRobot.y = Math.max(20, Math.min(environment.height - 20, newRobot.y));
      
      return newRobot;
    });
  };

  const updateSensors = (robot: Robot) => {
    // Update ultrasonic sensor (distance to nearest obstacle)
    let minDistance = robot.sensors.ultrasonic.maxRange;
    
    // Check distance to walls
    const wallDistances = [
      robot.x, // left wall
      environment.width - robot.x, // right wall
      robot.y, // top wall
      environment.height - robot.y // bottom wall
    ];
    
    minDistance = Math.min(minDistance, ...wallDistances);
    
    // Check distance to obstacles
    environment.obstacles.forEach(obstacle => {
      const dx = Math.abs(robot.x - (obstacle.x + obstacle.width / 2));
      const dy = Math.abs(robot.y - (obstacle.y + obstacle.height / 2));
      const distance = Math.sqrt(dx * dx + dy * dy);
      minDistance = Math.min(minDistance, distance);
    });
    
    robot.sensors.ultrasonic.distance = Math.round(minDistance);
    
    // Update IR sensors (simulated line detection for line following)
    if (environment.lineTrack) {
      // Simulate IR sensors detecting the line
      const leftSensorPos = {
        x: robot.x - 15 * Math.sin((robot.angle * Math.PI) / 180),
        y: robot.y + 15 * Math.cos((robot.angle * Math.PI) / 180)
      };
      const rightSensorPos = {
        x: robot.x + 15 * Math.sin((robot.angle * Math.PI) / 180),
        y: robot.y - 15 * Math.cos((robot.angle * Math.PI) / 180)
      };
      
      robot.sensors.ir.left = isOnLine(leftSensorPos, environment.lineTrack) ? 100 : 900;
      robot.sensors.ir.right = isOnLine(rightSensorPos, environment.lineTrack) ? 100 : 900;
      robot.sensors.ir.front = isOnLine(robot, environment.lineTrack) ? 100 : 900;
    }
    
    // Update compass
    robot.sensors.compass.heading = robot.angle;
  };

  const isOnLine = (pos: { x: number; y: number }, lineTrack: LineTrack): boolean => {
    // Simplified line detection - check if position is close to any line segment
    for (let i = 0; i < lineTrack.points.length - 1; i++) {
      const p1 = lineTrack.points[i];
      const p2 = lineTrack.points[i + 1];
      
      const distance = distanceToLineSegment(pos, p1, p2);
      if (distance < lineTrack.width * 5) {
        return true;
      }
    }
    return false;
  };

  const distanceToLineSegment = (
    p: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ): number => {
    const A = p.x - p1.x;
    const B = p.y - p1.y;
    const C = p2.x - p1.x;
    const D = p2.y - p1.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) return Math.sqrt(A * A + B * B);
    
    let param = dot / lenSq;
    param = Math.max(0, Math.min(1, param));
    
    const xx = p1.x + param * C;
    const yy = p1.y + param * D;
    
    const dx = p.x - xx;
    const dy = p.y - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  };

  const drawSimulation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw environment boundaries
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, environment.width, environment.height);
    
    // Draw line track if exists
    if (environment.lineTrack) {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = environment.lineTrack.width;
      ctx.beginPath();
      environment.lineTrack.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    }
    
    // Draw obstacles
    environment.obstacles.forEach(obstacle => {
      ctx.fillStyle = obstacle.type === 'wall' ? '#8B4513' : '#666';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
    
    // Draw goals
    environment.goals.forEach(goal => {
      ctx.fillStyle = goal.reached ? '#4CAF50' : '#FFC107';
      ctx.beginPath();
      ctx.arc(goal.x, goal.y, goal.radius, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    
    // Draw robot
    ctx.save();
    ctx.translate(robot.x, robot.y);
    ctx.rotate((robot.angle * Math.PI) / 180);
    
    // Robot body
    ctx.fillStyle = '#2196F3';
    ctx.fillRect(-15, -10, 30, 20);
    
    // Robot direction indicator
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(10, -3, 8, 6);
    
    // Sensor indicators
    if (showSensorReadings) {
      // Ultrasonic sensor range
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, robot.sensors.ultrasonic.distance, -Math.PI/4, Math.PI/4);
      ctx.stroke();
    }
    
    ctx.restore();
    
    // Draw sensor readings as text overlay
    if (showSensorReadings) {
      ctx.fillStyle = '#333';
      ctx.font = '12px monospace';
      ctx.fillText(`Ultrasonic: ${robot.sensors.ultrasonic.distance}cm`, 10, 20);
      ctx.fillText(`IR Left: ${robot.sensors.ir.left}`, 10, 35);
      ctx.fillText(`IR Right: ${robot.sensors.ir.right}`, 10, 50);
      ctx.fillText(`Compass: ${Math.round(robot.sensors.compass.heading)}°`, 10, 65);
      ctx.fillText(`Position: (${Math.round(robot.x)}, ${Math.round(robot.y)})`, 10, 80);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    // Reset robot to start position
    setRobot(prev => ({
      ...prev,
      x: environment.startPosition.x,
      y: environment.startPosition.y,
      angle: environment.startPosition.angle,
      speed: 0
    }));
  };

  const handleReset = () => {
    handleStop();
    loadEnvironment(selectedEnvironment);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const langData = programmingLanguages.find(lang => lang.value === language);
    if (langData) {
      setCode(langData.example);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bot className="h-8 w-8 text-primary" />
              2D Robot Simulator
            </h1>
            <p className="text-muted-foreground mt-2">
              Program virtual robots for line following, maze solving, and obstacle avoidance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600">
              {isRunning ? (isPaused ? 'Paused' : 'Running') : 'Stopped'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulation Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Controls */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Simulation Controls</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleStart}
                      disabled={isRunning && !isPaused}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                    <Button
                      onClick={handlePause}
                      disabled={!isRunning}
                      size="sm"
                      variant="outline"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                    <Button
                      onClick={handleStop}
                      disabled={!isRunning}
                      size="sm"
                      variant="outline"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                    <Button
                      onClick={handleReset}
                      size="sm"
                      variant="outline"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Environment</Label>
                    <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {environments.map((env) => (
                          <SelectItem key={env.id} value={env.id}>
                            <div>
                              <div className="font-medium">{env.name}</div>
                              <div className="text-sm text-muted-foreground">{env.description}</div>
                            </div>
                          </SelectItem>
                        ))}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Simulation Speed</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm">0.5x</span>
                      <Slider
                        value={simulationSpeed}
                        onValueChange={setSimulationSpeed}
                        min={0.5}
                        max={3}
                        step={0.5}
                        className="flex-1"
                      />
                      <span className="text-sm">3x</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Simulation Canvas */}
            <Card>
              <CardContent className="p-4">
                <canvas
                  ref={canvasRef}
                  width={environment.width}
                  height={environment.height}
                  className="border rounded-lg w-full"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Code Editor and Settings */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Robot Programming</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="sensors">Sensors</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="code" className="p-4 space-y-4">
                    <div>
                      <Label>Programming Language</Label>
                      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {programmingLanguages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}</SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="font-mono text-sm min-h-[300px]"
                        placeholder="Write your robot control code here..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Zap className="h-4 w-4 mr-2" />
                        Upload Code
                      </Button>
                      <Button variant="outline" size="sm">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="sensors" className="p-4 space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Show Sensor Readings</Label>
                        <Switch
                          checked={showSensorReadings}
                          onCheckedChange={setShowSensorReadings}
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-2">
                            <Radio className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">Ultrasonic</span>
                          </div>
                          <Badge variant="outline">{robot.sensors.ultrasonic.distance}cm</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-green-500" />
                            <span className="font-medium">IR Left</span>
                          </div>
                          <Badge variant="outline">{robot.sensors.ir.left}</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-green-500" />
                            <span className="font-medium">IR Right</span>
                          </div>
                          <Badge variant="outline">{robot.sensors.ir.right}</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-2">
                            <Navigation className="h-4 w-4 text-purple-500" />
                            <span className="font-medium">Compass</span>
                          </div>
                          <Badge variant="outline">{Math.round(robot.sensors.compass.heading)}°</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-2">
                            <Gauge className="h-4 w-4 text-orange-500" />
                            <span className="font-medium">Position</span>
                          </div>
                          <Badge variant="outline">
                            ({Math.round(robot.x)}, {Math.round(robot.y)})
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="p-4 space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Robot Speed</Label>
                        <Slider
                          value={[robot.speed]}
                          onValueChange={(value) => setRobot(prev => ({ ...prev, speed: value[0] }))}
                          min={0}
                          max={5}
                          step={0.1}
                          className="mt-2"
                        />
                        <div className="text-sm text-muted-foreground mt-1">
                          Current: {robot.speed.toFixed(1)} units/frame
                        </div>
                      </div>

                      <div>
                        <Label>Start Position X</Label>
                        <Slider
                          value={[environment.startPosition.x]}
                          onValueChange={(value) => setEnvironment(prev => ({
                            ...prev,
                            startPosition: { ...prev.startPosition, x: value[0] }
                          }))}
                          min={20}
                          max={environment.width - 20}
                          step={1}
                          className="mt-2"
                        />
                        <div className="text-sm text-muted-foreground mt-1">
                          X: {environment.startPosition.x}
                        </div>
                      </div>

                      <div>
                        <Label>Start Position Y</Label>
                        <Slider
                          value={[environment.startPosition.y]}
                          onValueChange={(value) => setEnvironment(prev => ({
                            ...prev,
                            startPosition: { ...prev.startPosition, y: value[0] }
                          }))}
                          min={20}
                          max={environment.height - 20}
                          step={1}
                          className="mt-2"
                        />
                        <div className="text-sm text-muted-foreground mt-1">
                          Y: {environment.startPosition.y}
                        </div>
                      </div>

                      <div>
                        <Label>Start Angle</Label>
                        <Slider
                          value={[environment.startPosition.angle]}
                          onValueChange={(value) => setEnvironment(prev => ({
                            ...prev,
                            startPosition: { ...prev.startPosition, angle: value[0] }
                          }))}
                          min={0}
                          max={360}
                          step={1}
                          className="mt-2"
                        />
                        <div className="text-sm text-muted-foreground mt-1">
                          Angle: {environment.startPosition.angle}°
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
