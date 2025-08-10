import React, { useState, useRef, useCallback, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Play, 
  Square, 
  RotateCcw, 
  Save, 
  Share, 
  Zap,
  Cpu,
  Battery,
  Lightbulb,
  Volume2,
  Gauge,
  Settings,
  Trash2,
  Copy,
  RotateCw,
  Move,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Download,
  Upload,
  Grid3X3,
  Maximize2,
  ZoomIn,
  ZoomOut
} from "lucide-react";
// Circuit Component Classes
class CircuitComponent {
  constructor(public id: string, public type: string, public x: number, public y: number, public properties: any = {}) {}
}

class Wire {
  constructor(
    public id: string, 
    public from: { componentId: string, pin: string }, 
    public to: { componentId: string, pin: string },
    public points: { x: number, y: number }[] = []
  ) {}
}

// Circuit Simulation Engine
class CircuitEngine {
  private components: Map<string, CircuitComponent> = new Map();
  private wires: Map<string, Wire> = new Map();
  private isRunning: boolean = false;
  private simulationInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    // Initialize the circuit engine
  }
  
  addComponent(component: CircuitComponent) {
    this.components.set(component.id, component);
  }
  
  removeComponent(id: string) {
    this.components.delete(id);
    // Remove connected wires
    Array.from(this.wires.values()).forEach(wire => {
      if (wire.from.componentId === id || wire.to.componentId === id) {
        this.wires.delete(wire.id);
      }
    });
  }
  
  addWire(wire: Wire) {
    this.wires.set(wire.id, wire);
  }
  
  removeWire(id: string) {
    this.wires.delete(id);
  }
  
  startSimulation() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    this.simulationInterval = setInterval(() => {
      this.simulateStep();
    }, 100); // 10 FPS simulation
  }
  
  stopSimulation() {
    this.isRunning = false;
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }
  
  private simulateStep() {
    // Basic circuit simulation logic
    // Calculate voltages, currents, and component states
    
    // Update LED brightness based on current
    this.components.forEach(component => {
      if (component.type === 'led') {
        const voltage = this.calculateVoltage(component.id);
        component.properties.brightness = Math.max(0, Math.min(100, voltage / 5 * 100));
      }
      
      if (component.type === 'motor') {
        const voltage = this.calculateVoltage(component.id);
        component.properties.speed = Math.max(0, Math.min(100, voltage / 5 * 100));
      }
    });
  }
  
  private calculateVoltage(componentId: string): number {
    // Simplified voltage calculation
    // In a real implementation, this would use Kirchhoff's laws and solve the circuit equations
    const component = this.components.get(componentId);
    if (!component) return 0;
    
    // Find connected power source
    const connectedWires = Array.from(this.wires.values()).filter(
      wire => wire.from.componentId === componentId || wire.to.componentId === componentId
    );
    
    // Simple logic: if connected to battery, return battery voltage
    for (const wire of connectedWires) {
      const otherId = wire.from.componentId === componentId ? wire.to.componentId : wire.from.componentId;
      const otherComponent = this.components.get(otherId);
      
      if (otherComponent?.type === 'battery') {
        return otherComponent.properties.voltage || 5;
      }
    }
    
    return 0;
  }
  
  getComponents() {
    return Array.from(this.components.values());
  }
  
  getWires() {
    return Array.from(this.wires.values());
  }
}

// Component Library
const componentLibrary = {
  basic: [
    { 
      id: "resistor", 
      name: "Resistor", 
      icon: "🔧", 
      color: "#8B4513",
      pins: ["left", "right"],
      properties: { resistance: 1000 }, // ohms
      width: 60,
      height: 20
    },
    { 
      id: "capacitor", 
      name: "Capacitor", 
      icon: "⚡", 
      color: "#4169E1",
      pins: ["left", "right"],
      properties: { capacitance: 100 }, // microfarads
      width: 40,
      height: 30
    },
    { 
      id: "inductor", 
      name: "Inductor", 
      icon: "🌀", 
      color: "#8A2BE2",
      pins: ["left", "right"],
      properties: { inductance: 10 }, // millihenries
      width: 50,
      height: 25
    }
  ],
  power: [
    { 
      id: "battery", 
      name: "Battery", 
      icon: "🔋", 
      color: "#32CD32",
      pins: ["positive", "negative"],
      properties: { voltage: 9 }, // volts
      width: 40,
      height: 80
    },
    { 
      id: "ground", 
      name: "Ground", 
      icon: "⏚", 
      color: "#000000",
      pins: ["pin"],
      properties: {},
      width: 30,
      height: 30
    }
  ],
  input: [
    { 
      id: "button", 
      name: "Push Button", 
      icon: "⚪", 
      color: "#FF6347",
      pins: ["pin1", "pin2"],
      properties: { pressed: false },
      width: 40,
      height: 40
    },
    { 
      id: "switch", 
      name: "Switch", 
      icon: "🔘", 
      color: "#FF4500",
      pins: ["common", "no", "nc"],
      properties: { state: false },
      width: 50,
      height: 30
    },
    { 
      id: "potentiometer", 
      name: "Potentiometer", 
      icon: "🎛️", 
      color: "#DAA520",
      pins: ["pin1", "wiper", "pin3"],
      properties: { resistance: 10000, position: 50 },
      width: 60,
      height: 60
    }
  ],
  output: [
    { 
      id: "led", 
      name: "LED", 
      icon: "💡", 
      color: "#FFD700",
      pins: ["anode", "cathode"],
      properties: { brightness: 0, color: "red" },
      width: 30,
      height: 30
    },
    { 
      id: "buzzer", 
      name: "Buzzer", 
      icon: "🔊", 
      color: "#FF1493",
      pins: ["positive", "negative"],
      properties: { frequency: 1000, volume: 0 },
      width: 40,
      height: 40
    },
    { 
      id: "motor", 
      name: "DC Motor", 
      icon: "⚙️", 
      color: "#4682B4",
      pins: ["positive", "negative"],
      properties: { speed: 0, direction: 1 },
      width: 50,
      height: 50
    },
    { 
      id: "servo", 
      name: "Servo Motor", 
      icon: "🔄", 
      color: "#20B2AA",
      pins: ["signal", "power", "ground"],
      properties: { angle: 90, speed: 0 },
      width: 60,
      height: 40
    }
  ],
  sensors: [
    { 
      id: "temperature", 
      name: "Temperature Sensor", 
      icon: "🌡️", 
      color: "#FF6B6B",
      pins: ["vcc", "signal", "ground"],
      properties: { temperature: 25 },
      width: 40,
      height: 60
    },
    { 
      id: "photoresistor", 
      name: "Photoresistor", 
      icon: "☀️", 
      color: "#FFA500",
      pins: ["pin1", "pin2"],
      properties: { lightLevel: 50 },
      width: 35,
      height: 35
    },
    { 
      id: "ultrasonic", 
      name: "Ultrasonic Sensor", 
      icon: "📡", 
      color: "#00CED1",
      pins: ["vcc", "trig", "echo", "ground"],
      properties: { distance: 10 },
      width: 80,
      height: 40
    }
  ],
  microcontrollers: [
    { 
      id: "arduino", 
      name: "Arduino Uno", 
      icon: "🔲", 
      color: "#006699",
      pins: [
        "digital0", "digital1", "digital2", "digital3", "digital4", "digital5",
        "digital6", "digital7", "digital8", "digital9", "digital10", "digital11",
        "digital12", "digital13", "analog0", "analog1", "analog2", "analog3",
        "analog4", "analog5", "vin", "5v", "3v3", "ground1", "ground2"
      ],
      properties: { code: "// Arduino code here\nvoid setup() {\n  \n}\n\nvoid loop() {\n  \n}" },
      width: 120,
      height: 200
    }
  ],
  tools: [
    { 
      id: "breadboard", 
      name: "Breadboard", 
      icon: "⬜", 
      color: "#F5F5DC",
      pins: [], // Breadboard has many connection points
      properties: { rows: 30, columns: 10 },
      width: 300,
      height: 200
    },
    { 
      id: "wire", 
      name: "Wire", 
      icon: "🔗", 
      color: "#696969",
      pins: ["pin1", "pin2"],
      properties: { color: "red" },
      width: 2,
      height: 100
    }
  ]
};

const categories = ["basic", "power", "input", "output", "sensors", "microcontrollers", "tools"];

export default function CircuitSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [simulator] = useState(() => new CircuitEngine());
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("basic");
  const [selectedComponent, setSelectedComponent] = useState<CircuitComponent | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [components, setComponents] = useState<CircuitComponent[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [wireMode, setWireMode] = useState(false);
  const [wireStart, setWireStart] = useState<{ componentId: string, pin: string } | null>(null);

  // Drawing functions
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    if (!showGrid) return;
    
    const gridSize = 20 * zoom;
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    
    for (let x = panOffset.x % gridSize; x < ctx.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }
    
    for (let y = panOffset.y % gridSize; y < ctx.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
  };

  const drawComponent = (ctx: CanvasRenderingContext2D, component: CircuitComponent) => {
    const def = findComponentDefinition(component.type);
    if (!def) return;

    const x = component.x * zoom + panOffset.x;
    const y = component.y * zoom + panOffset.y;
    const width = def.width * zoom;
    const height = def.height * zoom;

    // Draw component body
    ctx.fillStyle = component.id === selectedComponent?.id ? '#4CAF50' : def.color;
    ctx.fillRect(x - width/2, y - height/2, width, height);
    
    // Draw border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - width/2, y - height/2, width, height);
    
    // Draw component icon/text
    ctx.fillStyle = '#fff';
    ctx.font = `${12 * zoom}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(def.icon, x, y - 5);
    
    // Draw component name
    ctx.font = `${8 * zoom}px Arial`;
    ctx.fillText(def.name, x, y + 15);
    
    // Draw pins
    drawComponentPins(ctx, component, def);
    
    // Draw component-specific visuals
    drawComponentVisuals(ctx, component, def);
  };

  const drawComponentPins = (ctx: CanvasRenderingContext2D, component: CircuitComponent, def: any) => {
    const x = component.x * zoom + panOffset.x;
    const y = component.y * zoom + panOffset.y;
    const pinSize = 4 * zoom;
    
    ctx.fillStyle = '#FFD700';
    
    def.pins.forEach((pin: string, index: number) => {
      let pinX = x;
      let pinY = y;
      
      // Position pins around the component
      if (def.pins.length <= 2) {
        pinX = x + (index === 0 ? -def.width/2 : def.width/2) * zoom;
      } else {
        // For components with more pins, distribute them around the perimeter
        const angle = (index / def.pins.length) * 2 * Math.PI;
        pinX = x + Math.cos(angle) * def.width/2 * zoom;
        pinY = y + Math.sin(angle) * def.height/2 * zoom;
      }
      
      ctx.beginPath();
      ctx.arc(pinX, pinY, pinSize, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });
  };

  const drawComponentVisuals = (ctx: CanvasRenderingContext2D, component: CircuitComponent, def: any) => {
    const x = component.x * zoom + panOffset.x;
    const y = component.y * zoom + panOffset.y;
    
    // LED brightness visualization
    if (component.type === 'led') {
      const brightness = component.properties.brightness || 0;
      if (brightness > 0) {
        const glowSize = (brightness / 100) * 20 * zoom;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
        gradient.addColorStop(0, `rgba(255, 255, 0, ${brightness/100})`);
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, glowSize, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    
    // Motor rotation visualization
    if (component.type === 'motor' || component.type === 'servo') {
      const speed = component.properties.speed || 0;
      if (speed > 0) {
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 15 * zoom, 0, (speed/100) * 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const drawWire = (ctx: CanvasRenderingContext2D, wire: Wire) => {
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    if (wire.points.length > 0) {
      ctx.moveTo(wire.points[0].x * zoom + panOffset.x, wire.points[0].y * zoom + panOffset.y);
      for (let i = 1; i < wire.points.length; i++) {
        ctx.lineTo(wire.points[i].x * zoom + panOffset.x, wire.points[i].y * zoom + panOffset.y);
      }
    }
    
    ctx.stroke();
  };

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid(ctx);
    
    // Draw wires
    wires.forEach(wire => drawWire(ctx, wire));
    
    // Draw components
    components.forEach(component => drawComponent(ctx, component));
    
  }, [components, wires, zoom, panOffset, showGrid, selectedComponent]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      redrawCanvas();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [redrawCanvas]);

  const findComponentDefinition = (type: string) => {
    for (const category of Object.values(componentLibrary)) {
      const def = category.find(comp => comp.id === type);
      if (def) return def;
    }
    return null;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / zoom;
    const y = (e.clientY - rect.top - panOffset.y) / zoom;
    
    if (draggedComponent) {
      // Add component to canvas
      const newComponent = new CircuitComponent(
        `${draggedComponent.id}_${Date.now()}`,
        draggedComponent.id,
        x,
        y,
        { ...draggedComponent.properties }
      );
      
      simulator.addComponent(newComponent);
      setComponents([...components, newComponent]);
      setDraggedComponent(null);
      return;
    }
    
    if (wireMode && wireStart) {
      // Complete wire connection
      const clickedComponent = findComponentAt(x, y);
      if (clickedComponent && clickedComponent.id !== wireStart.componentId) {
        const newWire = new Wire(
          `wire_${Date.now()}`,
          wireStart,
          { componentId: clickedComponent.id, pin: 'auto' },
          [
            { x: components.find(c => c.id === wireStart.componentId)?.x || 0, y: components.find(c => c.id === wireStart.componentId)?.y || 0 },
            { x: clickedComponent.x, y: clickedComponent.y }
          ]
        );
        
        simulator.addWire(newWire);
        setWires([...wires, newWire]);
      }
      setWireStart(null);
      setWireMode(false);
      return;
    }
    
    // Select component
    const clickedComponent = findComponentAt(x, y);
    setSelectedComponent(clickedComponent);
  };

  const findComponentAt = (x: number, y: number): CircuitComponent | null => {
    for (const component of components) {
      const def = findComponentDefinition(component.type);
      if (!def) continue;
      
      const left = component.x - def.width / 2;
      const right = component.x + def.width / 2;
      const top = component.y - def.height / 2;
      const bottom = component.y + def.height / 2;
      
      if (x >= left && x <= right && y >= top && y <= bottom) {
        return component;
      }
    }
    return null;
  };

  const startSimulation = () => {
    simulator.startSimulation();
    setIsSimulating(true);
    
    // Update component states periodically
    const updateInterval = setInterval(() => {
      setComponents([...simulator.getComponents()]);
      setWires([...simulator.getWires()]);
    }, 100);
    
    return () => clearInterval(updateInterval);
  };

  const stopSimulation = () => {
    simulator.stopSimulation();
    setIsSimulating(false);
  };

  const clearCircuit = () => {
    simulator.stopSimulation();
    setComponents([]);
    setWires([]);
    setSelectedComponent(null);
    setIsSimulating(false);
  };

  const deleteSelected = () => {
    if (selectedComponent) {
      simulator.removeComponent(selectedComponent.id);
      setComponents(components.filter(c => c.id !== selectedComponent.id));
      setSelectedComponent(null);
    }
  };

  return (
    <Layout>
      <div className="flex h-screen bg-background">
        {/* Component Library Sidebar */}
        <div className="w-80 border-r bg-card p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold mb-4">Circuit Components</h2>
              
              {/* Category Tabs */}
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid grid-cols-3 gap-1 mb-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="power">Power</TabsTrigger>
                  <TabsTrigger value="input">Input</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-3 gap-1 mb-4">
                  <TabsTrigger value="output">Output</TabsTrigger>
                  <TabsTrigger value="sensors">Sensors</TabsTrigger>
                  <TabsTrigger value="microcontrollers">MCU</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-1 gap-1 mb-4">
                  <TabsTrigger value="tools">Tools</TabsTrigger>
                </TabsList>

                {categories.map(category => (
                  <TabsContent key={category} value={category} className="space-y-2">
                    {componentLibrary[category as keyof typeof componentLibrary].map(component => (
                      <div
                        key={component.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                          draggedComponent?.id === component.id ? 'bg-primary/10 border-primary' : ''
                        }`}
                        onClick={() => setDraggedComponent(component)}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded flex items-center justify-center text-lg"
                            style={{ backgroundColor: component.color + '40' }}
                          >
                            {component.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{component.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {Object.keys(component.properties).length} properties
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Component Properties */}
            {selectedComponent && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Component Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Component ID</Label>
                    <Input value={selectedComponent.id} disabled className="text-xs" />
                  </div>
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Input value={selectedComponent.type} disabled className="text-xs" />
                  </div>
                  
                  {/* Dynamic properties based on component type */}
                  {Object.entries(selectedComponent.properties).map(([key, value]) => (
                    <div key={key}>
                      <Label className="text-xs capitalize">{key}</Label>
                      {typeof value === 'number' ? (
                        <Input
                          type="number"
                          value={value}
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value);
                            selectedComponent.properties[key] = newValue;
                            setComponents([...components]);
                          }}
                          className="text-xs"
                        />
                      ) : typeof value === 'boolean' ? (
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => {
                            selectedComponent.properties[key] = checked;
                            setComponents([...components]);
                          }}
                        />
                      ) : (
                        <Input
                          value={String(value)}
                          onChange={(e) => {
                            selectedComponent.properties[key] = e.target.value;
                            setComponents([...components]);
                          }}
                          className="text-xs"
                        />
                      )}
                    </div>
                  ))}
                  
                  <Button variant="destructive" size="sm" onClick={deleteSelected} className="w-full">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete Component
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="border-b bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  onClick={isSimulating ? stopSimulation : startSimulation}
                  variant={isSimulating ? "destructive" : "default"}
                >
                  {isSimulating ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                
                <Separator orientation="vertical" className="h-6" />
                
                <Button variant="outline" onClick={clearCircuit}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                
                <Button variant="outline" onClick={() => setWireMode(!wireMode)}>
                  <Zap className={`h-4 w-4 mr-2 ${wireMode ? 'text-primary' : ''}`} />
                  Wire Mode
                </Button>
                
                <Separator orientation="vertical" className="h-6" />
                
                <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(3, zoom * 1.2))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.3, zoom / 1.2))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
                  <Grid3X3 className={`h-4 w-4 ${showGrid ? 'text-primary' : ''}`} />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={isSimulating ? "default" : "secondary"}>
                  {isSimulating ? "Simulating" : "Stopped"}
                </Badge>
                <Badge variant="outline">
                  Zoom: {Math.round(zoom * 100)}%
                </Badge>
                <Badge variant="outline">
                  Components: {components.length}
                </Badge>
                
                <Separator orientation="vertical" className="h-6" />
                
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-crosshair"
              onClick={handleCanvasClick}
              style={{ 
                cursor: draggedComponent ? 'copy' : 
                       wireMode ? 'crosshair' : 
                       'default' 
              }}
            />
            
            {/* Instructions Overlay */}
            {components.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-muted-foreground">
                  <h3 className="text-lg font-medium mb-2">Build Your Circuit</h3>
                  <p className="text-sm">
                    1. Select a component from the sidebar<br/>
                    2. Click on the canvas to place it<br/>
                    3. Use Wire Mode to connect components<br/>
                    4. Click Start to simulate your circuit
                  </p>
                </div>
              </div>
            )}
            
            {/* Drag preview */}
            {draggedComponent && (
              <div className="absolute top-4 left-4 pointer-events-none">
                <Badge>
                  Click to place: {draggedComponent.name}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}