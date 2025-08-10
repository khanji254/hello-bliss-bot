import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Play, 
  Square, 
  Pause,
  RotateCcw, 
  Download, 
  Upload,
  Save,
  Share2,
  Bot,
  Terminal,
  Eye,
  Settings,
  Zap,
  Map,
  Camera,
  Radar,
  Code,
  FileText,
  Folder,
  Plus,
  Trash2,
  Edit3,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Activity,
  BarChart3,
  Target,
  Navigation,
  Gamepad2,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCw,
  Move,
  Orbit,
  Layers,
  Grid3x3,
  Compass,
  MapPin,
  Route,
  Gauge,
  Timer,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Lightbulb,
  BookOpen,
  Users,
  MessageSquare,
  Phone,
  Video,
  Mic,
  MicOff,
  Camera as CameraIcon,
  ScreenShare,
  Hand,
  Palette,
  Sliders
} from "lucide-react";

interface ROSNode {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  cpu: number;
  memory: number;
  messages: number;
}

interface RobotSensor {
  id: string;
  name: string;
  type: 'lidar' | 'camera' | 'imu' | 'gps' | 'ultrasonic';
  enabled: boolean;
  data: any;
}

interface ProgrammingTemplate {
  id: string;
  name: string;
  description: string;
  language: 'python' | 'cpp' | 'javascript';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  code: string;
}

const rosNodes: ROSNode[] = [
  { id: 'gazebo', name: '/gazebo', status: 'running', cpu: 15.2, memory: 234, messages: 1247 },
  { id: 'robot_state', name: '/robot_state_publisher', status: 'running', cpu: 2.1, memory: 45, messages: 892 },
  { id: 'navigation', name: '/move_base', status: 'running', cpu: 8.5, memory: 128, messages: 456 },
  { id: 'slam', name: '/slam_toolbox', status: 'running', cpu: 12.3, memory: 89, messages: 723 },
  { id: 'camera', name: '/camera_node', status: 'stopped', cpu: 0, memory: 0, messages: 0 },
  { id: 'lidar', name: '/lidar_node', status: 'running', cpu: 5.8, memory: 67, messages: 234 }
];

const robotSensors: RobotSensor[] = [
  { id: 'lidar', name: 'Velodyne VLP-16', type: 'lidar', enabled: true, data: { range: 100, resolution: 0.1 } },
  { id: 'camera_rgb', name: 'RGB Camera', type: 'camera', enabled: true, data: { resolution: '1920x1080', fps: 30 } },
  { id: 'camera_depth', name: 'Depth Camera', type: 'camera', enabled: true, data: { resolution: '640x480', fps: 15 } },
  { id: 'imu', name: 'IMU Sensor', type: 'imu', enabled: true, data: { frequency: 100 } },
  { id: 'gps', name: 'GPS Module', type: 'gps', enabled: false, data: { accuracy: 2.5 } },
  { id: 'ultrasonic', name: 'Ultrasonic Array', type: 'ultrasonic', enabled: true, data: { range: 4 } }
];

const programmingTemplates: ProgrammingTemplate[] = [
  {
    id: 'basic_movement',
    name: 'Basic Robot Movement',
    description: 'Learn how to make a robot move forward, backward, and turn',
    language: 'python',
    difficulty: 'beginner',
    category: 'Navigation',
    code: `#!/usr/bin/env python3
import rospy
from geometry_msgs.msg import Twist

class RobotMover:
    def __init__(self):
        rospy.init_node('robot_mover')
        self.cmd_pub = rospy.Publisher('/cmd_vel', Twist, queue_size=10)
        self.rate = rospy.Rate(10)  # 10 Hz
        
    def move_forward(self, duration=2.0):
        """Move robot forward for specified duration"""
        twist = Twist()
        twist.linear.x = 0.5  # 0.5 m/s forward
        
        start_time = rospy.Time.now()
        while (rospy.Time.now() - start_time).to_sec() < duration:
            self.cmd_pub.publish(twist)
            self.rate.sleep()
            
        # Stop the robot
        self.stop_robot()
        
    def turn_left(self, duration=1.0):
        """Turn robot left for specified duration"""
        twist = Twist()
        twist.angular.z = 0.5  # 0.5 rad/s counter-clockwise
        
        start_time = rospy.Time.now()
        while (rospy.Time.now() - start_time).to_sec() < duration:
            self.cmd_pub.publish(twist)
            self.rate.sleep()
            
        self.stop_robot()
        
    def stop_robot(self):
        """Stop all robot movement"""
        twist = Twist()  # All velocities are 0 by default
        self.cmd_pub.publish(twist)
        
if __name__ == '__main__':
    try:
        robot = RobotMover()
        
        # Example movement sequence
        robot.move_forward(2.0)
        rospy.sleep(1)
        robot.turn_left(1.0)
        rospy.sleep(1)
        robot.move_forward(2.0)
        
        rospy.loginfo("Movement sequence completed!")
        
    except rospy.ROSInterruptException:
        pass`
  },
  {
    id: 'sensor_reading',
    name: 'Sensor Data Processing',
    description: 'Read and process data from robot sensors',
    language: 'python',
    difficulty: 'intermediate',
    category: 'Sensors',
    code: `#!/usr/bin/env python3
import rospy
import numpy as np
from sensor_msgs.msg import LaserScan, Image
from cv_bridge import CvBridge
import cv2

class SensorProcessor:
    def __init__(self):
        rospy.init_node('sensor_processor')
        
        # Initialize CV bridge for image processing
        self.bridge = CvBridge()
        
        # Subscribers
        self.laser_sub = rospy.Subscriber('/scan', LaserScan, self.laser_callback)
        self.image_sub = rospy.Subscriber('/camera/image_raw', Image, self.image_callback)
        
        # Publishers
        self.processed_image_pub = rospy.Publisher('/processed_image', Image, queue_size=1)
        
    def laser_callback(self, data):
        """Process laser scan data"""
        ranges = np.array(data.ranges)
        
        # Remove invalid readings
        valid_ranges = ranges[np.isfinite(ranges)]
        
        if len(valid_ranges) > 0:
            min_distance = np.min(valid_ranges)
            max_distance = np.max(valid_ranges)
            mean_distance = np.mean(valid_ranges)
            
            rospy.loginfo(f"Laser: min={min_distance:.2f}m, max={max_distance:.2f}m, mean={mean_distance:.2f}m")
            
            # Detect obstacles within 1 meter
            close_obstacles = valid_ranges[valid_ranges < 1.0]
            if len(close_obstacles) > 0:
                rospy.logwarn(f"Obstacle detected! {len(close_obstacles)} points within 1m")
                
    def image_callback(self, data):
        """Process camera images"""
        try:
            # Convert ROS image to OpenCV format
            cv_image = self.bridge.imgmsg_to_cv2(data, "bgr8")
            
            # Apply image processing
            processed_image = self.process_image(cv_image)
            
            # Convert back to ROS image and publish
            processed_msg = self.bridge.cv2_to_imgmsg(processed_image, "bgr8")
            self.processed_image_pub.publish(processed_msg)
            
        except Exception as e:
            rospy.logerr(f"Image processing error: {e}")
            
    def process_image(self, image):
        """Apply computer vision processing"""
        # Convert to HSV for better color detection
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Define range for blue color detection
        lower_blue = np.array([100, 50, 50])
        upper_blue = np.array([130, 255, 255])
        
        # Create mask for blue objects
        mask = cv2.inRange(hsv, lower_blue, upper_blue)
        
        # Find contours
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Draw bounding boxes around detected objects
        result = image.copy()
        for contour in contours:
            if cv2.contourArea(contour) > 500:  # Filter small objects
                x, y, w, h = cv2.boundingRect(contour)
                cv2.rectangle(result, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.putText(result, "Blue Object", (x, y - 10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                
        return result

if __name__ == '__main__':
    try:
        processor = SensorProcessor()
        rospy.spin()
    except rospy.ROSInterruptException:
        pass`
  },
  {
    id: 'autonomous_navigation',
    name: 'Autonomous Navigation',
    description: 'Implement autonomous navigation with obstacle avoidance',
    language: 'python',
    difficulty: 'advanced',
    category: 'Navigation',
    code: `#!/usr/bin/env python3
import rospy
import actionlib
import numpy as np
from move_base_msgs.msg import MoveBaseAction, MoveBaseGoal
from geometry_msgs.msg import PoseStamped, Twist
from sensor_msgs.msg import LaserScan
from nav_msgs.msg import OccupancyGrid
import tf2_ros
import tf2_geometry_msgs

class AutonomousNavigator:
    def __init__(self):
        rospy.init_node('autonomous_navigator')
        
        # Action client for move_base
        self.move_base_client = actionlib.SimpleActionClient('move_base', MoveBaseAction)
        
        # Publishers and subscribers
        self.cmd_pub = rospy.Publisher('/cmd_vel', Twist, queue_size=1)
        self.laser_sub = rospy.Subscriber('/scan', LaserScan, self.laser_callback)
        self.map_sub = rospy.Subscriber('/map', OccupancyGrid, self.map_callback)
        
        # TF listener
        self.tf_buffer = tf2_ros.Buffer()
        self.tf_listener = tf2_ros.TransformListener(self.tf_buffer)
        
        # Navigation state
        self.current_goal = None
        self.obstacle_detected = False
        self.emergency_stop = False
        
        rospy.loginfo("Autonomous Navigator initialized")
        
    def laser_callback(self, data):
        """Monitor laser scan for obstacles"""
        ranges = np.array(data.ranges)
        
        # Check for obstacles in front of robot (±30 degrees)
        front_ranges = np.concatenate([
            ranges[:len(ranges)//6],  # Right side
            ranges[-len(ranges)//6:]  # Left side
        ])
        
        # Filter out invalid readings
        valid_ranges = front_ranges[np.isfinite(front_ranges)]
        
        if len(valid_ranges) > 0:
            min_distance = np.min(valid_ranges)
            
            # Emergency stop if obstacle too close
            if min_distance < 0.5:
                self.emergency_stop = True
                self.stop_robot()
                rospy.logwarn(f"Emergency stop! Obstacle at {min_distance:.2f}m")
            else:
                self.emergency_stop = False
                
    def map_callback(self, data):
        """Process occupancy grid map"""
        # Map processing for advanced path planning
        self.current_map = data
        
    def navigate_to_goal(self, x, y, theta=0.0):
        """Navigate to specified goal position"""
        if self.emergency_stop:
            rospy.logwarn("Cannot navigate: Emergency stop active")
            return False
            
        # Wait for move_base action server
        rospy.loginfo("Waiting for move_base action server...")
        self.move_base_client.wait_for_server()
        
        # Create goal
        goal = MoveBaseGoal()
        goal.target_pose.header.frame_id = "map"
        goal.target_pose.header.stamp = rospy.Time.now()
        
        # Set position
        goal.target_pose.pose.position.x = x
        goal.target_pose.pose.position.y = y
        goal.target_pose.pose.position.z = 0.0
        
        # Set orientation (quaternion from yaw)
        goal.target_pose.pose.orientation.z = np.sin(theta / 2.0)
        goal.target_pose.pose.orientation.w = np.cos(theta / 2.0)
        
        rospy.loginfo(f"Navigating to goal: ({x:.2f}, {y:.2f}, {theta:.2f})")
        
        # Send goal
        self.move_base_client.send_goal(goal)
        self.current_goal = goal
        
        # Wait for result
        success = self.move_base_client.wait_for_result()
        
        if success:
            state = self.move_base_client.get_state()
            if state == actionlib.GoalStatus.SUCCEEDED:
                rospy.loginfo("Navigation successful!")
                return True
            else:
                rospy.logwarn(f"Navigation failed with state: {state}")
                return False
        else:
            rospy.logwarn("Navigation timed out")
            return False
            
    def patrol_waypoints(self, waypoints):
        """Patrol through a list of waypoints"""
        rospy.loginfo(f"Starting patrol with {len(waypoints)} waypoints")
        
        for i, (x, y, theta) in enumerate(waypoints):
            rospy.loginfo(f"Going to waypoint {i+1}/{len(waypoints)}")
            
            success = self.navigate_to_goal(x, y, theta)
            
            if not success:
                rospy.logwarn(f"Failed to reach waypoint {i+1}, continuing...")
                
            # Brief pause at each waypoint
            rospy.sleep(2.0)
            
        rospy.loginfo("Patrol completed")
        
    def stop_robot(self):
        """Emergency stop"""
        twist = Twist()
        self.cmd_pub.publish(twist)
        
        # Cancel current navigation goal
        if self.current_goal:
            self.move_base_client.cancel_goal()
            
    def get_robot_pose(self):
        """Get current robot pose"""
        try:
            transform = self.tf_buffer.lookup_transform(
                'map', 'base_link', rospy.Time(0), rospy.Duration(1.0)
            )
            
            x = transform.transform.translation.x
            y = transform.transform.translation.y
            
            return (x, y)
            
        except Exception as e:
            rospy.logwarn(f"Could not get robot pose: {e}")
            return None

if __name__ == '__main__':
    try:
        navigator = AutonomousNavigator()
        
        # Example usage: patrol waypoints
        waypoints = [
            (2.0, 2.0, 0.0),    # Forward
            (2.0, -2.0, -1.57), # Turn left
            (-2.0, -2.0, 3.14), # Turn around
            (-2.0, 2.0, 1.57),  # Turn right
            (0.0, 0.0, 0.0)     # Return home
        ]
        
        navigator.patrol_waypoints(waypoints)
        
    except rospy.ROSInterruptException:
        pass`
  }
];

const environments = [
  { 
    id: "empty", 
    name: "Empty World", 
    description: "Basic empty environment for testing",
    complexity: "Beginner",
    features: ["Basic physics", "Ground plane", "Lighting"]
  },
  { 
    id: "warehouse", 
    name: "Industrial Warehouse", 
    description: "Realistic warehouse with obstacles and shelving",
    complexity: "Intermediate",
    features: ["Dynamic obstacles", "Shelving units", "Forklifts", "Realistic lighting"]
  },
  { 
    id: "office", 
    name: "Modern Office", 
    description: "Multi-floor office building with furniture",
    complexity: "Intermediate", 
    features: ["Multiple floors", "Furniture", "Elevators", "People simulation"]
  },
  { 
    id: "outdoor", 
    name: "Urban Environment", 
    description: "Outdoor city environment with roads and buildings",
    complexity: "Advanced",
    features: ["Traffic simulation", "Weather effects", "Day/night cycle", "Pedestrians"]
  },
  { 
    id: "factory", 
    name: "Manufacturing Plant", 
    description: "Industrial factory with assembly lines",
    complexity: "Advanced",
    features: ["Conveyor belts", "Industrial robots", "Safety zones", "Smoke effects"]
  }
];

const robots = [
  { 
    id: "turtlebot3", 
    name: "TurtleBot3 Burger", 
    description: "Compact educational robot platform",
    specifications: {
      "Max Speed": "0.22 m/s",
      "Payload": "15kg",
      "Battery": "1800mAh",
      "Sensors": "LiDAR, IMU, Encoder"
    },
    difficulty: "Beginner"
  },
  { 
    id: "turtlebot3_waffle", 
    name: "TurtleBot3 Waffle Pi", 
    description: "Advanced TurtleBot with camera and extended capabilities",
    specifications: {
      "Max Speed": "0.26 m/s",
      "Payload": "30kg", 
      "Battery": "2500mAh",
      "Sensors": "LiDAR, IMU, RGB-D Camera"
    },
    difficulty: "Intermediate"
  },
  { 
    id: "husky", 
    name: "Clearpath Husky", 
    description: "Rugged outdoor unmanned ground vehicle",
    specifications: {
      "Max Speed": "1.0 m/s",
      "Payload": "75kg",
      "Battery": "400Wh",
      "Sensors": "GPS, IMU, LiDAR, Stereo Camera"
    },
    difficulty: "Advanced"
  },
  { 
    id: "pr2", 
    name: "Willow Garage PR2", 
    description: "Advanced research robot with dual arms",
    specifications: {
      "Max Speed": "1.0 m/s",
      "DOF": "20+ degrees of freedom",
      "Battery": "48V Li-ion",
      "Sensors": "Multiple cameras, LiDAR, Force sensors"
    },
    difficulty: "Expert"
  },
  { 
    id: "ur5", 
    name: "Universal Robots UR5", 
    description: "6-axis industrial robot arm",
    specifications: {
      "Reach": "850mm",
      "Payload": "5kg",
      "Repeatability": "±0.1mm",
      "DOF": "6 rotational joints"
    },
    difficulty: "Advanced"
  }
];

export default function ROSPlayground() {
  const { user } = useAuth();
  const [selectedEnvironment, setSelectedEnvironment] = useState("empty");
  const [selectedRobot, setSelectedRobot] = useState("turtlebot3");
  const [selectedTemplate, setSelectedTemplate] = useState("basic_movement");
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [currentCode, setCurrentCode] = useState(programmingTemplates[0].code);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isCodeRunning, setIsCodeRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("simulation");
  const [viewMode, setViewMode] = useState("3d");
  const [showGrid, setShowGrid] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating && !isPaused) {
      interval = setInterval(() => {
        setSimulationTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, isPaused]);

  if (!user) return null;

  const startSimulation = () => {
    setIsSimulating(true);
    setIsPaused(false);
    setSimulationTime(0);
    addConsoleMessage("[INFO] [gazebo]: Starting Gazebo Physics Engine...");
    addConsoleMessage("[INFO] [robot_state_publisher]: Publishing robot transform tree");
    addConsoleMessage(`[INFO] [${selectedRobot}]: Robot model loaded successfully`);
    addConsoleMessage(`[INFO] [world]: Environment '${selectedEnvironment}' loaded`);
  };

  const pauseSimulation = () => {
    setIsPaused(!isPaused);
    addConsoleMessage(`[INFO] [simulation]: ${isPaused ? 'Resumed' : 'Paused'} simulation`);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    setIsPaused(false);
    addConsoleMessage("[INFO] [gazebo]: Shutting down simulation");
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setIsPaused(false);
    setSimulationTime(0);
    setConsoleOutput([]);
    addConsoleMessage("[INFO] [system]: Simulation reset");
  };

  const runCode = () => {
    setIsCodeRunning(true);
    addConsoleMessage("[INFO] [user_code]: Executing user program...");
    addConsoleMessage("$ python3 robot_program.py");
    
    // Simulate code execution
    setTimeout(() => {
      addConsoleMessage("[INFO] [user_code]: Program execution completed");
      setIsCodeRunning(false);
    }, 3000);
  };

  const addConsoleMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleOutput(prev => [...prev.slice(-20), `[${timestamp}] ${message}`]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSelectedRobot = () => robots.find(r => r.id === selectedRobot);
  const getSelectedEnvironment = () => environments.find(e => e.id === selectedEnvironment);
  const getSelectedTemplate = () => programmingTemplates.find(t => t.id === selectedTemplate);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bot className="h-8 w-8" />
              ROS Programming Playground
            </h1>
            <p className="text-muted-foreground mt-2">
              Advanced robot programming with ROS2, Gazebo simulation, and real-time collaboration
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Badge variant={isSimulating ? "default" : "secondary"} className="px-3 py-1">
              {isSimulating ? (isPaused ? "Paused" : "Running") : "Stopped"} • {formatTime(simulationTime)}
            </Badge>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Collaborate
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Project
            </Button>
          </div>
        </div>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Panel - Configuration & Code */}
          <div className="lg:col-span-2 space-y-6">
            {/* Robot & Environment Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Simulation Setup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="robot" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="robot">Robot</TabsTrigger>
                    <TabsTrigger value="environment">Environment</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="robot" className="space-y-4 mt-4">
                    <div>
                      <Label className="text-sm font-medium">Select Robot Platform</Label>
                      <div className="space-y-2 mt-2">
                        {robots.map((robot) => (
                          <div
                            key={robot.id}
                            className={`p-3 border rounded cursor-pointer transition-colors ${
                              selectedRobot === robot.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedRobot(robot.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{robot.name}</p>
                                <p className="text-xs text-muted-foreground">{robot.description}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {robot.difficulty}
                              </Badge>
                            </div>
                            {selectedRobot === robot.id && (
                              <div className="mt-3 pt-3 border-t text-xs space-y-1">
                                {Object.entries(robot.specifications).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-muted-foreground">{key}:</span>
                                    <span>{value}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="environment" className="space-y-4 mt-4">
                    <div>
                      <Label className="text-sm font-medium">Select Environment</Label>
                      <div className="space-y-2 mt-2">
                        {environments.map((env) => (
                          <div
                            key={env.id}
                            className={`p-3 border rounded cursor-pointer transition-colors ${
                              selectedEnvironment === env.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedEnvironment(env.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{env.name}</p>
                                <p className="text-xs text-muted-foreground">{env.description}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {env.complexity}
                              </Badge>
                            </div>
                            {selectedEnvironment === env.id && (
                              <div className="mt-3 pt-3 border-t">
                                <div className="flex flex-wrap gap-1">
                                  {env.features.map((feature, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Code Editor */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    Robot Programming
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {programmingTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div>
                              <div className="font-medium">{template.name}</div>
                              <div className="text-xs text-muted-foreground">{template.category}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <CardDescription>
                  {getSelectedTemplate()?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {getSelectedTemplate()?.language}
                      </Badge>
                      <Badge variant={getSelectedTemplate()?.difficulty === 'beginner' ? 'default' : 
                                   getSelectedTemplate()?.difficulty === 'intermediate' ? 'secondary' : 'destructive'}>
                        {getSelectedTemplate()?.difficulty}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={runCode}
                        disabled={!isSimulating || isCodeRunning}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {isCodeRunning ? "Running..." : "Run Code"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded">
                    <Textarea
                      value={getSelectedTemplate()?.code || currentCode}
                      onChange={(e) => setCurrentCode(e.target.value)}
                      className="min-h-[400px] font-mono text-sm border-none resize-none"
                      placeholder="Write your ROS code here..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - 3D Simulation */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Gazebo Simulation
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant={viewMode === "3d" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("3d")}
                      >
                        3D
                      </Button>
                      <Button
                        variant={viewMode === "top" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("top")}
                      >
                        Top
                      </Button>
                    </div>
                    <Separator orientation="vertical" className="h-6" />
                    <Button variant="ghost" size="sm">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden border-t">
                  {/* Simulation Controls Overlay */}
                  <div className="absolute top-4 left-4 z-10 flex space-x-2">
                    <Button
                      size="sm"
                      onClick={isSimulating ? (isPaused ? pauseSimulation : pauseSimulation) : startSimulation}
                      variant={isSimulating ? (isPaused ? "default" : "secondary") : "default"}
                    >
                      {isSimulating ? (isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />) : <Play className="h-4 w-4" />}
                    </Button>
                    {isSimulating && (
                      <Button size="sm" variant="destructive" onClick={stopSimulation}>
                        <Square className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={resetSimulation}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* View Controls */}
                  <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 bg-black/50 rounded px-2 py-1">
                      <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                      <Label className="text-white text-xs">Grid</Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-black/50 rounded px-2 py-1">
                      <Switch checked={showCoordinates} onCheckedChange={setShowCoordinates} />
                      <Label className="text-white text-xs">Coords</Label>
                    </div>
                  </div>

                  {/* Status Overlay */}
                  <div className="absolute bottom-4 left-4 z-10 bg-black/70 rounded px-3 py-2 text-white">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Timer className="h-4 w-4" />
                        <span>{formatTime(simulationTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bot className="h-4 w-4" />
                        <span>{getSelectedRobot()?.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Map className="h-4 w-4" />
                        <span>{getSelectedEnvironment()?.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Simulation View */}
                  <div className="h-full flex items-center justify-center">
                    {isSimulating ? (
                      <div className="text-center">
                        {/* Animated Robot */}
                        <div className="relative">
                          <div className="w-32 h-32 bg-primary rounded-lg flex items-center justify-center mb-4 animate-pulse shadow-2xl">
                            <Bot className="h-16 w-16 text-primary-foreground" />
                          </div>
                          {/* Sensor Rays */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="w-1 h-16 bg-green-500/50 absolute top-0 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
                            <div className="w-1 h-16 bg-green-500/50 absolute top-8 left-0 transform rotate-45 origin-bottom animate-pulse"></div>
                            <div className="w-1 h-16 bg-green-500/50 absolute top-8 right-0 transform -rotate-45 origin-bottom animate-pulse"></div>
                          </div>
                        </div>
                        
                        {/* Grid (if enabled) */}
                        {showGrid && (
                          <div className="absolute inset-0 opacity-20">
                            <svg className="w-full h-full">
                              <defs>
                                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
                                </pattern>
                              </defs>
                              <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>
                          </div>
                        )}
                        
                        <div className="text-white">
                          <h3 className="font-semibold text-lg mb-2">Simulation Active</h3>
                          <div className="flex justify-center space-x-6 text-sm">
                            <div className="text-center">
                              <Activity className="h-5 w-5 mx-auto mb-1 text-green-400" />
                              <div>Physics</div>
                            </div>
                            <div className="text-center">
                              <Radar className="h-5 w-5 mx-auto mb-1 text-blue-400" />
                              <div>Sensors</div>
                            </div>
                            <div className="text-center">
                              <Navigation className="h-5 w-5 mx-auto mb-1 text-purple-400" />
                              <div>Navigation</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <div className="w-24 h-24 border-4 border-white/20 rounded-lg flex items-center justify-center mb-4">
                          <Bot className="h-12 w-12 text-white/40" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Simulation Stopped</h3>
                        <p className="text-sm text-white/60 mb-4">
                          Configure your robot and environment, then click "Start Simulation"
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div className="p-3 bg-white/10 rounded">
                            <Map className="h-5 w-5 mx-auto mb-1" />
                            <div>SLAM</div>
                          </div>
                          <div className="p-3 bg-white/10 rounded">
                            <Camera className="h-5 w-5 mx-auto mb-1" />
                            <div>Vision</div>
                          </div>
                          <div className="p-3 bg-white/10 rounded">
                            <Radar className="h-5 w-5 mx-auto mb-1" />
                            <div>LiDAR</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Monitoring & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Robot Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gamepad2 className="h-5 w-5 mr-2" />
                  Robot Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Directional Controls */}
                  <div className="grid grid-cols-3 gap-2">
                    <div></div>
                    <Button variant="outline" size="sm" disabled={!isSimulating}>
                      ↑
                    </Button>
                    <div></div>
                    <Button variant="outline" size="sm" disabled={!isSimulating}>
                      ←
                    </Button>
                    <Button variant="outline" size="sm" disabled={!isSimulating}>
                      ⏹
                    </Button>
                    <Button variant="outline" size="sm" disabled={!isSimulating}>
                      →
                    </Button>
                    <div></div>
                    <Button variant="outline" size="sm" disabled={!isSimulating}>
                      ↓
                    </Button>
                    <div></div>
                  </div>

                  <Separator />

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Quick Actions</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <Button variant="outline" size="sm" disabled={!isSimulating}>
                        <Target className="h-4 w-4 mr-2" />
                        Set Goal
                      </Button>
                      <Button variant="outline" size="sm" disabled={!isSimulating}>
                        <MapPin className="h-4 w-4 mr-2" />
                        Add Waypoint
                      </Button>
                      <Button variant="outline" size="sm" disabled={!isSimulating}>
                        <Route className="h-4 w-4 mr-2" />
                        Plan Path
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Monitor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  System Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* ROS Nodes */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">ROS Nodes</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {rosNodes.slice(0, 4).map((node) => (
                        <div key={node.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              node.status === 'running' ? 'bg-green-500' : 
                              node.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                            }`} />
                            <span className="truncate max-w-20">{node.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {node.cpu.toFixed(1)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Sensors */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Sensors</h4>
                    <div className="space-y-2">
                      {robotSensors.slice(0, 3).map((sensor) => (
                        <div key={sensor.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${sensor.enabled ? 'bg-green-500' : 'bg-gray-500'}`} />
                            <span className="truncate">{sensor.name}</span>
                          </div>
                          <Switch 
                            checked={sensor.enabled} 
                            onCheckedChange={() => {}} 
                            disabled={!isSimulating}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Performance */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Performance</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>CPU Usage</span>
                        <span>23%</span>
                      </div>
                      <Progress value={23} className="h-1" />
                      <div className="flex justify-between">
                        <span>Memory</span>
                        <span>1.2GB</span>
                      </div>
                      <Progress value={45} className="h-1" />
                      <div className="flex justify-between">
                        <span>Network</span>
                        <span>12 KB/s</span>
                      </div>
                      <Progress value={30} className="h-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Console Output */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Terminal className="h-5 w-5 mr-2" />
                  Console Output
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-3 rounded text-xs font-mono h-48 overflow-y-auto">
                  <div className="space-y-1">
                    {consoleOutput.length === 0 ? (
                      <div className="text-gray-500">
                        ROS console output will appear here...
                        <br />
                        <span className="animate-pulse">ros2@robot:~$ _</span>
                      </div>
                    ) : (
                      consoleOutput.map((line, index) => (
                        <div key={index} className={
                          line.includes('[ERROR]') ? 'text-red-400' :
                          line.includes('[WARN]') ? 'text-yellow-400' :
                          line.includes('[INFO]') ? 'text-blue-400' :
                          'text-green-400'
                        }>
                          {line}
                        </div>
                      ))
                    )}
                    {isSimulating && (
                      <div className="animate-pulse text-white">ros2@robot:~$ _</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}