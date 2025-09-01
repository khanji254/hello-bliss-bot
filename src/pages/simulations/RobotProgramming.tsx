import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Square, 
  Save, 
  Upload, 
  Download, 
  Settings, 
  Cpu, 
  Zap, 
  Eye, 
  Code, 
  Terminal, 
  Gamepad2,
  Brain,
  Layers,
  Monitor,
  Wrench,
  BookOpen,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Camera,
  Wifi,
  Battery,
  Thermometer,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  RotateCcw,
  Target,
  Compass,
  Gauge
} from 'lucide-react';

// Robot Programming Templates
const programmingTemplates = {
  beginner: [
    {
      id: 'basic-movement',
      title: 'Basic Movement',
      language: 'python',
      description: 'Learn how to make your robot move forward, backward, and turn',
      code: `# Basic Robot Movement
import robot_api as robot
import time

# Initialize robot
robot.init()

print("Starting basic movement program...")

# Move forward for 2 seconds
robot.move_forward(speed=0.5)
time.sleep(2)

# Stop
robot.stop()
time.sleep(1)

# Turn right 90 degrees
robot.turn_right(90)
time.sleep(1)

# Move forward again
robot.move_forward(speed=0.5)
time.sleep(2)

# Stop and cleanup
robot.stop()
robot.cleanup()

print("Movement complete!")`
    },
    {
      id: 'sensor-reading',
      title: 'Sensor Reading',
      language: 'python',
      description: 'Read data from ultrasonic and camera sensors',
      code: `# Sensor Reading Example
import robot_api as robot
import time

# Initialize robot and sensors
robot.init()

print("Reading sensor data...")

for i in range(10):
    # Read ultrasonic sensor
    distance = robot.get_distance()
    
    # Read camera data
    image = robot.get_camera_frame()
    
    # Read battery level
    battery = robot.get_battery_level()
    
    print(f"Distance: {distance:.2f}cm, Battery: {battery}%")
    
    # Check for obstacles
    if distance < 20:
        print("Obstacle detected!")
        robot.set_led_color("red")
    else:
        robot.set_led_color("green")
    
    time.sleep(1)

robot.cleanup()`
    }
  ],
  intermediate: [
    {
      id: 'obstacle-avoidance',
      title: 'Obstacle Avoidance',
      language: 'python',
      description: 'Navigate around obstacles using sensors',
      code: `# Obstacle Avoidance Algorithm
import robot_api as robot
import time
import random

robot.init()

def avoid_obstacle():
    """Avoid obstacle by turning and finding clear path"""
    # Back up slightly
    robot.move_backward(speed=0.3)
    time.sleep(0.5)
    robot.stop()
    
    # Check left and right
    robot.turn_left(45)
    time.sleep(0.5)
    left_distance = robot.get_distance()
    
    robot.turn_right(90)
    time.sleep(0.5)
    right_distance = robot.get_distance()
    
    # Choose direction with more space
    if left_distance > right_distance:
        robot.turn_left(45)  # Face left
    else:
        robot.turn_right(45)  # Stay facing right

print("Starting obstacle avoidance...")

while True:
    distance = robot.get_distance()
    
    if distance > 30:  # Clear path
        robot.move_forward(speed=0.4)
        robot.set_led_color("green")
    else:  # Obstacle detected
        robot.stop()
        robot.set_led_color("red")
        avoid_obstacle()
        robot.set_led_color("yellow")
    
    time.sleep(0.1)`
    },
    {
      id: 'line-following',
      title: 'Line Following',
      language: 'python',
      description: 'Follow a line using camera vision',
      code: `# Line Following Robot
import robot_api as robot
import cv2
import numpy as np

robot.init()

def process_camera_frame(frame):
    """Process camera frame to detect line"""
    # Convert to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Apply threshold to get binary image
    _, binary = cv2.threshold(gray, 50, 255, cv2.THRESH_BINARY)
    
    # Find contours
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if contours:
        # Find largest contour (assumed to be the line)
        largest_contour = max(contours, key=cv2.contourArea)
        
        # Calculate centroid
        M = cv2.moments(largest_contour)
        if M["m00"] != 0:
            cx = int(M["m10"] / M["m00"])
            return cx
    
    return None

def follow_line():
    """Main line following logic"""
    frame = robot.get_camera_frame()
    line_center = process_camera_frame(frame)
    
    if line_center is not None:
        frame_center = frame.shape[1] // 2
        error = line_center - frame_center
        
        # PID-like control
        base_speed = 0.3
        turn_factor = error * 0.001
        
        left_speed = base_speed - turn_factor
        right_speed = base_speed + turn_factor
        
        robot.set_motor_speeds(left_speed, right_speed)
        robot.set_led_color("green")
    else:
        # No line detected, stop
        robot.stop()
        robot.set_led_color("red")

print("Starting line following...")

try:
    while True:
        follow_line()
        time.sleep(0.05)
except KeyboardInterrupt:
    robot.stop()
    robot.cleanup()
    print("Line following stopped.")`
    }
  ],
  advanced: [
    {
      id: 'slam-mapping',
      title: 'SLAM Mapping',
      language: 'python',
      description: 'Simultaneous Localization and Mapping',
      code: `# SLAM (Simultaneous Localization and Mapping)
import robot_api as robot
import numpy as np
import matplotlib.pyplot as plt
from collections import deque

class SimpleSLAM:
    def __init__(self):
        self.robot_path = []
        self.landmarks = []
        self.position = [0, 0, 0]  # x, y, theta
        self.map_data = np.zeros((100, 100))
        
    def update_position(self, distance, angle):
        """Update robot position based on movement"""
        dx = distance * np.cos(self.position[2])
        dy = distance * np.sin(self.position[2])
        
        self.position[0] += dx
        self.position[1] += dy
        self.position[2] += angle
        
        self.robot_path.append(self.position.copy())
    
    def add_landmark(self, distance, bearing):
        """Add detected landmark to map"""
        landmark_x = self.position[0] + distance * np.cos(self.position[2] + bearing)
        landmark_y = self.position[1] + distance * np.sin(self.position[2] + bearing)
        
        self.landmarks.append([landmark_x, landmark_y])
    
    def visualize_map(self):
        """Display current map"""
        plt.clf()
        
        # Plot robot path
        if self.robot_path:
            path = np.array(self.robot_path)
            plt.plot(path[:, 0], path[:, 1], 'b-', label='Robot Path')
        
        # Plot current position
        plt.plot(self.position[0], self.position[1], 'ro', markersize=10, label='Robot')
        
        # Plot landmarks
        if self.landmarks:
            landmarks = np.array(self.landmarks)
            plt.plot(landmarks[:, 0], landmarks[:, 1], 'g^', markersize=8, label='Landmarks')
        
        plt.legend()
        plt.grid(True)
        plt.axis('equal')
        plt.title('SLAM Map')
        plt.draw()
        plt.pause(0.1)

# Initialize robot and SLAM
robot.init()
slam = SimpleSLAM()

print("Starting SLAM mapping...")

try:
    last_position = robot.get_position()
    
    while True:
        # Get current position and calculate movement
        current_position = robot.get_position()
        distance_moved = np.linalg.norm(
            np.array(current_position[:2]) - np.array(last_position[:2])
        )
        angle_change = current_position[2] - last_position[2]
        
        # Update SLAM
        if distance_moved > 0.1:  # Only update if significant movement
            slam.update_position(distance_moved, angle_change)
            last_position = current_position
        
        # Scan for landmarks
        distance = robot.get_distance()
        if 10 < distance < 200:  # Valid landmark range
            bearing = 0  # Assuming forward-facing sensor
            slam.add_landmark(distance, bearing)
        
        # Update visualization
        slam.visualize_map()
        
        # Simple exploration behavior
        if distance < 30:
            robot.turn_right(30)
        else:
            robot.move_forward(speed=0.3)
        
        time.sleep(0.1)

except KeyboardInterrupt:
    robot.stop()
    robot.cleanup()
    print("SLAM mapping stopped.")`
    }
  ]
};

// Robot Models
const robotModels = [
  {
    id: 'turtlebot',
    name: 'TurtleBot 3',
    description: 'Perfect for beginners, great for navigation and mapping',
    specs: { sensors: 'Lidar, Camera, IMU', speed: '0.5 m/s', battery: '2 hours' },
    image: '/api/placeholder/200/150'
  },
  {
    id: 'arduino',
    name: 'Arduino Robot',
    description: 'DIY robot perfect for learning electronics and programming',
    specs: { sensors: 'Ultrasonic, Camera', speed: '0.3 m/s', battery: '1 hour' },
    image: '/api/placeholder/200/150'
  },
  {
    id: 'jetbot',
    name: 'JetBot',
    description: 'AI-powered robot with NVIDIA Jetson for computer vision',
    specs: { sensors: 'Camera, IMU', speed: '0.4 m/s', battery: '1.5 hours' },
    image: '/api/placeholder/200/150'
  }
];

// Programming Challenges
const challenges = [
  {
    id: 'maze-solver',
    title: 'Maze Solver',
    difficulty: 'Intermediate',
    description: 'Program your robot to navigate through a maze and find the exit',
    points: 150,
    timeLimit: '30 minutes',
    completed: false
  },
  {
    id: 'object-tracker',
    title: 'Object Tracker',
    difficulty: 'Advanced',
    description: 'Create a robot that can track and follow colored objects',
    points: 250,
    timeLimit: '45 minutes',
    completed: true
  },
  {
    id: 'dance-routine',
    title: 'Dance Routine',
    difficulty: 'Beginner',
    description: 'Program a fun dance routine for your robot',
    points: 100,
    timeLimit: '20 minutes',
    completed: true
  }
];

export function RobotProgramming() {
  const { user } = useAuth();
  const [selectedRobot, setSelectedRobot] = useState(robotModels[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(programmingTemplates.beginner[0]);
  const [code, setCode] = useState(selectedTemplate.code);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [robotStatus, setRobotStatus] = useState({
    connected: true,
    battery: 87,
    temperature: 32,
    position: { x: 0, y: 0, angle: 0 },
    sensors: {
      distance: 156,
      camera: 'Active',
      wifi: 'Connected'
    }
  });
  // Pyodide and in-browser simulator refs
  const pyodideRef = useRef<any>(null);
  const simulatorRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const runPromiseRef = useRef<Promise<any> | null>(null);

  // Helper to push lines to the console output in UI
  const pushConsole = useCallback((line: string) => {
    setConsoleOutput(prev => [...prev, line]);
  }, []);

  // Simple JS in-browser simulator (kinematic, educational)
  class SimpleSimulator {
    position = { x: 0, y: 0, angle: 0 };
    battery = 100;
    distance = 200; // cm
    motors = { left: 0, right: 0 };
    led = 'off';
    running = false;
  canvas: HTMLCanvasElement | null = null;
  rafHandle: number | null = null;

    init() {
      this.running = true;
      pushConsole('Simulator: init() called');
  this.startRendering();
    }
    move_forward({ speed = 0.3 } = {}) {
      this.motors.left = speed;
      this.motors.right = speed;
      pushConsole(`Simulator: move_forward speed=${speed}`);
    }
    move_backward({ speed = 0.3 } = {}) {
      this.motors.left = -speed;
      this.motors.right = -speed;
      pushConsole(`Simulator: move_backward speed=${speed}`);
    }
    stop() {
      this.motors.left = 0;
      this.motors.right = 0;
      pushConsole('Simulator: stop()');
    }
    turn_left(deg = 90) {
      this.position.angle = (this.position.angle - deg + 360) % 360;
      pushConsole(`Simulator: turn_left ${deg}°`);
    }
    turn_right(deg = 90) {
      this.position.angle = (this.position.angle + deg) % 360;
      pushConsole(`Simulator: turn_right ${deg}°`);
    }
    set_motor_speeds(left = 0, right = 0) {
      this.motors.left = left;
      this.motors.right = right;
      pushConsole(`Simulator: set_motor_speeds L=${left} R=${right}`);
    }
    get_distance() {
      // Return a simple function of position for demo
      const d = Math.max(5, Math.round(this.distance - (this.position.x + this.position.y)));
      pushConsole(`Simulator: get_distance -> ${d}`);
      return d;
    }
    get_battery_level() {
      this.battery = Math.max(0, this.battery - 0.01);
      return Math.round(this.battery);
    }
    get_position() {
      return [this.position.x, this.position.y, this.position.angle];
    }
    set_led_color(color = 'off') {
      this.led = color;
      pushConsole(`Simulator: LED set to ${color}`);
    }
    cleanup() {
      this.running = false;
      pushConsole('Simulator: cleanup()');
      this.stopRendering();
    }

    startRendering() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      this.canvas = canvas;
      const ctx = canvas.getContext('2d');
      const render = () => {
        if (!ctx || !this.running) return;
        const w = canvas.width;
        const h = canvas.height;
        // clear
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, w, h);

        // draw a simple line (white) across the middle for line-following demo
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, h/2);
        ctx.lineTo(w, h/2);
        ctx.stroke();

        // draw robot as a circle
        const rx = (w/2) + this.position.x % (w/4);
        const ry = h/2 + this.position.y % (h/6);
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(rx, ry, 12, 0, Math.PI*2);
        ctx.fill();

        // sensor text
        ctx.fillStyle = '#d1d5db';
        ctx.font = '12px monospace';
        ctx.fillText(`Dist: ${this.get_distance()}cm`, 6, 14);
        ctx.fillText(`Battery: ${this.get_battery_level()}%`, 6, 30);

        // update some position to simulate movement
        this.position.x += (this.motors.left + this.motors.right) * 0.5;
        this.position.y += (this.motors.left - this.motors.right) * 0.25;

        this.rafHandle = requestAnimationFrame(render);
      };
      this.rafHandle = requestAnimationFrame(render);
    }

    stopRendering() {
      if (this.rafHandle) {
        cancelAnimationFrame(this.rafHandle);
        this.rafHandle = null;
      }
    }

    captureCameraFrame() {
      const canvas = this.canvas || canvasRef.current;
      if (!canvas) return null;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.getImageData(0, 0, w, h);
      // Return plain object with pixel data (Uint8ClampedArray)
      return { width: w, height: h, data: imageData.data };
    }
  }

  // Load Pyodide lazily and register robot_api & output bridge
  const ensurePyodide = async () => {
    if (pyodideRef.current) return pyodideRef.current;
    pushConsole('Loading Pyodide... (this may take a few seconds)');
    // Load the Pyodide script
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    // @ts-ignore
    const pyodide = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/' });
    // load numpy for basic numeric needs
    try {
      await pyodide.loadPackage(['micropip', 'numpy']);
    } catch (e) {
      // non-fatal
      console.warn('Pyodide package load failed', e);
    }

    // create simulator instance
    simulatorRef.current = new SimpleSimulator();

    // Expose console bridge
    const outputBridge = {
      write: (s: any) => {
        // pyodide may call with non-strings
        pushConsole(String(s));
      }
    };

    // Expose robot_api JS module to Python
    const jsRobotApi = {
      init: () => simulatorRef.current?.init(),
      move_forward: (opts: any) => simulatorRef.current?.move_forward(opts),
      move_backward: (opts: any) => simulatorRef.current?.move_backward(opts),
      stop: () => simulatorRef.current?.stop(),
      turn_left: (deg: number) => simulatorRef.current?.turn_left(deg),
      turn_right: (deg: number) => simulatorRef.current?.turn_right(deg),
      set_motor_speeds: (left: number, right: number) => simulatorRef.current?.set_motor_speeds(left, right),
      get_distance: () => simulatorRef.current?.get_distance(),
      get_camera_frame: () => {
        // return camera frame object; Python helper will attempt to convert
        return simulatorRef.current?.captureCameraFrame();
      },
      get_battery_level: () => simulatorRef.current?.get_battery_level(),
      get_position: () => simulatorRef.current?.get_position(),
      set_led_color: (c: string) => simulatorRef.current?.set_led_color(c),
      cleanup: () => simulatorRef.current?.cleanup()
    };

    // Register JS modules so Python can `import robot_api` and `import bliss_output`
    // @ts-ignore
    pyodide.registerJsModule('robot_api', jsRobotApi);
    // @ts-ignore
    pyodide.registerJsModule('bliss_output', outputBridge);

    pyodideRef.current = pyodide;
    pushConsole('Pyodide loaded.');
    return pyodide;
  };

  // Run user code using Pyodide. Best-effort: supports print() and the JS-registered robot_api functions.
  const executeCode = async () => {
    setIsRunning(true);
    setConsoleOutput([]);
    try {
      const pyodide = await ensurePyodide();

      // Prepare Python-side stdout/stderr bridge to our outputBridge
    const setupStdout = `
import sys
import bliss_output
class StdOut:
    def write(self, s):
        try:
            bliss_output.write(s)
        except Exception as e:
            pass
    def flush(self):
        pass
sys.stdout = StdOut()
sys.stderr = StdOut()
# Helper to convert camera JS object (returned from robot_api.get_camera_frame()) into a numpy array
try:
  import js
  import numpy as _np
  def _get_camera_numpy(cam):
    try:
      # 'cam' is a JsProxy with fields 'width','height','data' (Uint8ClampedArray)
      buf = js.Uint8ClampedArray.new(cam['data']).to_py()
      arr = _np.frombuffer(buf, dtype=_np.uint8)
      arr = arr.reshape((cam['height'], cam['width'], 4))
      return arr[:, :, :3].copy()
    except Exception as e:
      print('camera conversion failed:', e)
      return None
except Exception:
  pass
`;

      await pyodide.runPythonAsync(setupStdout);

      // Ensure simulator reset for each run
      simulatorRef.current = new SimpleSimulator();

      // Run the user's code
      const userCode = code;
      pushConsole('Starting program execution (Pyodide)...');
      const runPromise = pyodide.runPythonAsync(userCode);
      runPromiseRef.current = runPromise;

      await runPromise;
      pushConsole('Program completed successfully (Pyodide).');
    } catch (err: any) {
      pushConsole(`Error during execution: ${err?.toString()}`);
    } finally {
      setIsRunning(false);
      runPromiseRef.current = null;
    }
  };

  // Best-effort stop: signal and update UI. Pyodide cannot always be interrupted cleanly.
  const stopExecution = () => {
    pushConsole('Stop requested. Attempting to terminate execution...');
    setIsRunning(false);
    // Try to throw KeyboardInterrupt in the running Pyodide coroutine
    const py = pyodideRef.current;
    if (py) {
      try {
        // This may raise inside pyodide but may not cancel blocking calls
        // @ts-ignore
        py.runPythonAsync("raise KeyboardInterrupt('Stopped by user')").catch(() => {});
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Robot Programming Lab</h1>
            <p className="text-muted-foreground">Write, test, and debug robot programs in real-time</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={robotStatus.connected ? "default" : "destructive"}>
              {robotStatus.connected ? "Connected" : "Disconnected"}
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Robot Selection & Templates */}
          <div className="space-y-4">
            {/* Robot Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5" />
                  Select Robot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {robotModels.map((robot) => (
                  <div
                    key={robot.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedRobot.id === robot.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedRobot(robot)}
                  >
                    <h4 className="font-medium">{robot.name}</h4>
                    <p className="text-sm text-muted-foreground">{robot.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Programming Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="beginner" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="beginner">Basic</TabsTrigger>
                    <TabsTrigger value="intermediate">Inter</TabsTrigger>
                    <TabsTrigger value="advanced">Adv</TabsTrigger>
                  </TabsList>
                  
                  {Object.entries(programmingTemplates).map(([level, templates]) => (
                    <TabsContent key={level} value={level} className="space-y-2 mt-3">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className={`p-2 border rounded cursor-pointer text-sm transition-colors ${
                            selectedTemplate.id === template.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => {
                            setSelectedTemplate(template);
                            setCode(template.code);
                          }}
                        >
                          <div className="font-medium">{template.title}</div>
                          <div className="text-xs text-muted-foreground">{template.description}</div>
                        </div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Challenges */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="p-2 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{challenge.title}</h4>
                      {challenge.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Badge variant="outline" className="text-xs">{challenge.points}pts</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{challenge.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="secondary" className="text-xs">{challenge.difficulty}</Badge>
                      <span className="text-xs text-muted-foreground">{challenge.timeLimit}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Code Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Editor Header */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Code Editor - {selectedTemplate.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Load
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Write your robot program here..."
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Button onClick={executeCode} disabled={isRunning}>
                      <Play className="h-4 w-4 mr-2" />
                      {isRunning ? 'Running...' : 'Run Program'}
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={stopExecution} 
                      disabled={!isRunning}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Language: {selectedTemplate.language}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Console Output */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Console Output
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm min-h-[150px] max-h-[200px] overflow-y-auto">
                  {consoleOutput.length === 0 ? (
                    <div className="text-gray-500">Ready to execute program...</div>
                  ) : (
                    consoleOutput.map((line, index) => (
                      <div key={index} className="mb-1">
                        <span className="text-gray-500">[{new Date().toLocaleTimeString()}] </span>
                        {line}
                      </div>
                    ))
                  )}
                  {isRunning && (
                    <div className="animate-pulse">
                      <span className="text-gray-500">[{new Date().toLocaleTimeString()}] </span>
                      Executing...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Robot Status & Controls */}
          <div className="space-y-4">
            {/* Robot Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Robot Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Battery */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Battery className="h-4 w-4" />
                      Battery
                    </span>
                    <span className="text-sm">{robotStatus.battery}%</span>
                  </div>
                  <Progress value={robotStatus.battery} className="h-2" />
                </div>

                {/* Temperature */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    Temperature
                  </span>
                  <span className="text-sm">{robotStatus.temperature}°C</span>
                </div>

                {/* Position */}
                <div>
                  <span className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Compass className="h-4 w-4" />
                    Position
                  </span>
                  <div className="text-xs space-y-1">
                    <div>X: {robotStatus.position.x.toFixed(2)}m</div>
                    <div>Y: {robotStatus.position.y.toFixed(2)}m</div>
                    <div>Angle: {robotStatus.position.angle}°</div>
                  </div>
                </div>

                {/* Sensors */}
                <div>
                  <span className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4" />
                    Sensors
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Distance</span>
                      <span>{robotStatus.sensors.distance}cm</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Camera</span>
                      <Badge variant="outline" className="text-xs">{robotStatus.sensors.camera}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>WiFi</span>
                      <Badge variant="outline" className="text-xs">{robotStatus.sensors.wifi}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manual Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5" />
                  Manual Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <div></div>
                  <Button variant="outline" size="sm">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <div></div>
                  
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Square className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  
                  <div></div>
                  <Button variant="outline" size="sm">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <div></div>
                </div>
                
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Camera Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Camera Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                  <div className="text-white text-sm">Live Camera Feed</div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-muted-foreground">Resolution: 640x480</div>
                  <div className="text-xs text-muted-foreground">FPS: 30</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Join Community
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Info className="h-4 w-4 mr-2" />
                  Get Help
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
