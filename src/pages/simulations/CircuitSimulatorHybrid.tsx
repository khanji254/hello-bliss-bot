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
  ZoomOut,
  Info
} from "lucide-react";

// SimcirJS Integration Hook
const useSimcirJS = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [simcir, setSimcir] = useState<any>(null);

  useEffect(() => {
    // Load SimcirJS dynamically
    const loadSimcirJS = async () => {
      try {
        // Load CSS files
        const cssFiles = [
          '/simcirjs/simcir.css'
        ];
        
        cssFiles.forEach(href => {
          if (!document.querySelector(`link[href="${href}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
          }
        });

        // Load jQuery from CDN first, then SimcirJS files
        const jsFiles = [
          'https://code.jquery.com/jquery-3.6.0.min.js', // Load jQuery from CDN
          '/simcirjs/simcir.js',
          '/simcirjs/simcir-basicset.js'
        ];
        
        const loadScript = (src: string): Promise<void> => {
          return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
              resolve();
              return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.head.appendChild(script);
          });
        };

        // Load scripts sequentially
        for (const src of jsFiles) {
          await loadScript(src);
        }

        // Wait a bit for simcir to initialize
        setTimeout(() => {
          if (window.simcir) {
            setSimcir(window.simcir);
            setIsLoaded(true);
          } else {
            console.error('SimcirJS not found on window object');
          }
        }, 100);
      } catch (error) {
        console.error('Failed to load SimcirJS:', error);
      }
    };

    loadSimcirJS();
  }, []);

  return { isLoaded, simcir };
};

// Custom component library for the sidebar
const componentLibrary = {
  basic: [
    { 
      id: "DC", 
      name: "DC Source", 
      icon: "🔋", 
      color: "#32CD32",
      description: "DC voltage source",
      simcirType: "DC"
    },
    { 
      id: "LED", 
      name: "LED", 
      icon: "💡", 
      color: "#FFD700",
      description: "Light Emitting Diode",
      simcirType: "LED"
    },
    { 
      id: "OSC", 
      name: "Oscillator", 
      icon: "⏱️", 
      color: "#FF6347",
      description: "Clock signal generator",
      simcirType: "OSC"
    }
  ],
  logic: [
    { 
      id: "AND", 
      name: "AND Gate", 
      icon: "∧", 
      color: "#4169E1",
      description: "Logic AND gate",
      simcirType: "AND"
    },
    { 
      id: "OR", 
      name: "OR Gate", 
      icon: "∨", 
      color: "#8A2BE2",
      description: "Logic OR gate",
      simcirType: "OR"
    },
    { 
      id: "NOT", 
      name: "NOT Gate", 
      icon: "¬", 
      color: "#FF6347",
      description: "Logic NOT gate",
      simcirType: "NOT"
    },
    { 
      id: "NAND", 
      name: "NAND Gate", 
      icon: "⊼", 
      color: "#FF4500",
      description: "Logic NAND gate",
      simcirType: "NAND"
    },
    { 
      id: "NOR", 
      name: "NOR Gate", 
      icon: "⊽", 
      color: "#DC143C",
      description: "Logic NOR gate",
      simcirType: "NOR"
    },
    { 
      id: "XOR", 
      name: "XOR Gate", 
      icon: "⊕", 
      color: "#9932CC",
      description: "Logic XOR gate",
      simcirType: "XOR"
    }
  ],
  input: [
    { 
      id: "Toggle", 
      name: "Toggle Switch", 
      icon: "🔘", 
      color: "#FF4500",
      description: "Toggle switch",
      simcirType: "Toggle"
    },
    { 
      id: "PushOff", 
      name: "Push Button (OFF)", 
      icon: "⚪", 
      color: "#FF6347",
      description: "Push button (normally closed)",
      simcirType: "PushOff"
    },
    { 
      id: "PushOn", 
      name: "Push Button (ON)", 
      icon: "🔴", 
      color: "#32CD32",
      description: "Push button (normally open)",
      simcirType: "PushOn"
    }
  ],
  output: [
    { 
      id: "LED", 
      name: "LED", 
      icon: "💡", 
      color: "#FFD700",
      description: "Light Emitting Diode",
      simcirType: "LED"
    },
    { 
      id: "7seg", 
      name: "7-Segment Display", 
      icon: "�", 
      color: "#FF1493",
      description: "7-segment LED display",
      simcirType: "7seg"
    },
    { 
      id: "16seg", 
      name: "16-Segment Display", 
      icon: "📟", 
      color: "#8B008B",
      description: "16-segment LED display",
      simcirType: "16seg"
    }
  ]
};

const categories = ["basic", "logic", "input", "output"];

declare global {
  interface Window {
    simcir: any;
    jQuery: any;
    $: any;
  }
}

export default function CircuitSimulatorHybrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoaded, simcir } = useSimcirJS();
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("basic");
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [currentCircuit, setCurrentCircuit] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);

  // Initialize SimcirJS workspace
  useEffect(() => {
    if (isLoaded && simcir && containerRef.current) {
      try {
        // Clear any existing content
        containerRef.current.innerHTML = '';
        
        // Create a div for the SimcirJS workspace
        const workspaceDiv = document.createElement('div');
        workspaceDiv.style.width = '100%';
        workspaceDiv.style.height = '100%';
        containerRef.current.appendChild(workspaceDiv);
        
        // Initialize SimcirJS in the div
        const $ = window.jQuery || window.$;
        if ($) {
          $(workspaceDiv).simcir({
            width: 800,
            height: 600,
            showToolbox: false, // We'll use our custom sidebar
            devices: [
              {
                "type": "DC",
                "id": "power",
                "x": 50,
                "y": 100,
                "label": "Power"
              },
              {
                "type": "Toggle",
                "id": "switch1",
                "x": 150,
                "y": 100,
                "label": "Switch"
              },
              {
                "type": "LED",
                "id": "led1",
                "x": 250,
                "y": 100,
                "label": "LED"
              }
            ],
            connectors: [
              {
                "from": "power.out0",
                "to": "switch1.in0"
              },
              {
                "from": "switch1.out0",
                "to": "led1.in0"
              }
            ]
          });
          
          setCurrentCircuit(workspaceDiv);
        } else {
          console.error('jQuery not found - required for SimcirJS');
        }
      } catch (error) {
        console.error('Failed to initialize SimcirJS workspace:', error);
      }
    }
  }, [isLoaded, simcir]);

  const addComponent = useCallback((componentType: string) => {
    if (currentCircuit && simcir && isLoaded) {
      try {
        const $ = window.jQuery || window.$;
        if ($) {
          // Get current circuit data
          const currentData = $(currentCircuit).simcir('getData') || { devices: [], connectors: [] };
          
          // Create new device
          const newDevice = {
            type: componentType,
            id: `dev_${Date.now()}`,
            x: 100 + Math.random() * 300,
            y: 100 + Math.random() * 200,
            label: componentType
          };
          
          // Add device to the circuit data
          currentData.devices.push(newDevice);
          
          // Update the circuit
          $(currentCircuit).simcir('setData', currentData);
          console.log(`Added ${componentType} component`);
        }
      } catch (error) {
        console.error('Failed to add component:', error);
        // Fallback: try direct approach
        try {
          const $ = window.jQuery || window.$;
          if ($) {
            $(currentCircuit).simcir('addDevice', {
              type: componentType,
              x: 150,
              y: 150
            });
          }
        } catch (fallbackError) {
          console.error('Fallback add component also failed:', fallbackError);
        }
      }
    }
  }, [currentCircuit, simcir, isLoaded]);

  const startSimulation = useCallback(() => {
    // SimcirJS runs simulation automatically, so we just toggle the state
    setIsSimulating(true);
    console.log('Simulation started - SimcirJS runs automatically');
  }, []);

  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
    console.log('Simulation stopped');
  }, []);

  const clearCircuit = useCallback(() => {
    if (currentCircuit && simcir) {
      try {
        const $ = window.jQuery || window.$;
        if ($) {
          $(currentCircuit).simcir('setData', { devices: [], connectors: [] });
          setIsSimulating(false);
          console.log('Circuit cleared');
        }
      } catch (error) {
        console.error('Failed to clear circuit:', error);
      }
    }
  }, [currentCircuit, simcir]);

  const saveCircuit = useCallback(() => {
    if (currentCircuit && simcir) {
      try {
        const $ = window.jQuery || window.$;
        if ($) {
          const circuitData = $(currentCircuit).simcir('getData');
          const blob = new Blob([JSON.stringify(circuitData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'circuit.json';
          a.click();
          URL.revokeObjectURL(url);
          console.log('Circuit saved');
        }
      } catch (error) {
        console.error('Failed to save circuit:', error);
      }
    }
  }, [currentCircuit, simcir]);

  const loadCircuit = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentCircuit && simcir) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const circuitData = JSON.parse(e.target?.result as string);
          const $ = window.jQuery || window.$;
          if ($) {
            $(currentCircuit).simcir('setData', circuitData);
            console.log('Circuit loaded');
          }
        } catch (error) {
          console.error('Failed to load circuit:', error);
        }
      };
      reader.readAsText(file);
    }
    // Clear the input value so the same file can be loaded again
    event.target.value = '';
  }, [currentCircuit, simcir]);

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
                <TabsList className="grid grid-cols-2 gap-1 mb-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="logic">Logic</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-2 gap-1 mb-4">
                  <TabsTrigger value="input">Input</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                </TabsList>

                {categories.map(category => (
                  <TabsContent key={category} value={category} className="space-y-2">
                    {componentLibrary[category as keyof typeof componentLibrary].map(component => (
                      <div
                        key={component.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedComponent?.id === component.id ? 'bg-primary/10 border-primary' : ''
                        }`}
                        onClick={() => {
                          setSelectedComponent(component);
                          addComponent(component.simcirType);
                        }}
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
                              {component.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* SimcirJS Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Powered by SimcirJS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p className="text-muted-foreground">
                  Professional circuit simulation engine with real-time analysis.
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant={isLoaded ? "default" : "secondary"}>
                    {isLoaded ? "Loaded" : "Loading..."}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Circuit Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="border-b bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  onClick={isSimulating ? stopSimulation : startSimulation}
                  variant={isSimulating ? "destructive" : "default"}
                  disabled={!isLoaded}
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
                
                <Button variant="outline" onClick={clearCircuit} disabled={!isLoaded}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                
                <Separator orientation="vertical" className="h-6" />
                
                <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
                  <Grid3X3 className={`h-4 w-4 ${showGrid ? 'text-primary' : ''}`} />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={isSimulating ? "default" : "secondary"}>
                  {isSimulating ? "Simulating" : "Stopped"}
                </Badge>
                <Badge variant={isLoaded ? "default" : "secondary"}>
                  SimcirJS {isLoaded ? "Ready" : "Loading"}
                </Badge>
                
                <Separator orientation="vertical" className="h-6" />
                
                <Button variant="outline" size="sm" onClick={saveCircuit} disabled={!isLoaded}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" disabled={!isLoaded}>
                    <Upload className="h-4 w-4 mr-2" />
                    Load
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={loadCircuit}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* SimcirJS Circuit Canvas */}
          <div className="flex-1 relative">
            <div 
              ref={containerRef}
              className="absolute inset-0 w-full h-full"
              style={{ 
                transform: `scale(${zoom})`,
                transformOrigin: 'top left'
              }}
            />
            
            {/* Loading Overlay */}
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium mb-2">Loading SimcirJS</h3>
                  <p className="text-sm text-muted-foreground">
                    Initializing professional circuit simulation engine...
                  </p>
                </div>
              </div>
            )}
            
            {/* Instructions Overlay */}
            {isLoaded && !currentCircuit && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-muted-foreground">
                  <h3 className="text-lg font-medium mb-2">Build Your Circuit</h3>
                  <p className="text-sm">
                    1. Select components from the sidebar<br/>
                    2. Drag components onto the workspace<br/>
                    3. Connect components by dragging wires<br/>
                    4. Click Start to simulate your circuit
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
