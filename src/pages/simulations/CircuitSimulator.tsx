import { useState, useRef, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Gauge
} from "lucide-react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const components = [
  { id: "resistor", name: "Resistor", icon: "🔧", category: "Basic" },
  { id: "led", name: "LED", icon: "💡", category: "Output" },
  { id: "button", name: "Push Button", icon: "⚪", category: "Input" },
  { id: "battery", name: "Battery", icon: "🔋", category: "Power" },
  { id: "capacitor", name: "Capacitor", icon: "⚡", category: "Basic" },
  { id: "arduino", name: "Arduino Uno", icon: "🔲", category: "Microcontroller" },
  { id: "breadboard", name: "Breadboard", icon: "⬜", category: "Board" },
  { id: "buzzer", name: "Buzzer", icon: "🔊", category: "Output" },
  { id: "sensor", name: "Temperature Sensor", icon: "🌡️", category: "Input" },
  { id: "motor", name: "Servo Motor", icon: "⚙️", category: "Output" }
];

const categories = ["All", "Basic", "Input", "Output", "Power", "Microcontroller", "Board"];

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    data: { label: 'Arduino Uno' },
    type: 'default',
  },
  {
    id: '2',
    position: { x: 300, y: 100 },
    data: { label: 'LED' },
    type: 'default',
  },
];

const initialEdges: Edge[] = [];

export default function CircuitSimulator() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const filteredComponents = components.filter(comp => 
    selectedCategory === "All" || comp.category === selectedCategory
  );

  const startSimulation = () => {
    setIsSimulating(true);
    // Mock simulation results
    setTimeout(() => {
      setSimulationResults({
        voltage: "5.0V",
        current: "20mA", 
        power: "0.1W",
        status: "Circuit working correctly"
      });
    }, 2000);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    setSimulationResults(null);
  };

  const resetCircuit = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSimulationResults(null);
    setIsSimulating(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Cpu className="mr-3 h-8 w-8 text-primary" />
              Circuit Simulator
            </h1>
            <p className="text-muted-foreground mt-2">
              Design and simulate electronic circuits with interactive components
            </p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button 
              onClick={isSimulating ? stopSimulation : startSimulation}
              variant={isSimulating ? "destructive" : "default"}
              className="flex items-center"
            >
              {isSimulating ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop Simulation
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Simulation
                </>
              )}
            </Button>
            <Button variant="outline" onClick={resetCircuit}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Component Library */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Components</CardTitle>
              <CardDescription>
                Drag components to the workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-1">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              <Separator />

              {/* Component List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredComponents.map((component) => (
                  <div
                    key={component.id}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/reactflow', JSON.stringify({
                        id: component.id,
                        name: component.name
                      }));
                    }}
                  >
                    <span className="text-lg mr-3">{component.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{component.name}</p>
                      <p className="text-xs text-muted-foreground">{component.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Circuit Workspace */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Circuit Workspace</span>
                {isSimulating && (
                  <Badge variant="secondary" className="animate-pulse">
                    <Zap className="mr-1 h-3 w-3" />
                    Simulating...
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 border-t">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  fitView
                  style={{ background: '#fafafa' }}
                >
                  <MiniMap />
                  <Controls />
                  <Background gap={20} size={1} />
                </ReactFlow>
              </div>
            </CardContent>
          </Card>

          {/* Properties & Results */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Properties & Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Circuit Properties */}
              <div>
                <h4 className="font-medium mb-2">Circuit Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Components:</span>
                    <span>{nodes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connections:</span>
                    <span>{edges.length}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Simulation Results */}
              {simulationResults ? (
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Gauge className="mr-2 h-4 w-4 text-primary" />
                    Simulation Results
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Voltage:</span>
                      <span className="font-mono">{simulationResults.voltage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current:</span>
                      <span className="font-mono">{simulationResults.current}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Power:</span>
                      <span className="font-mono">{simulationResults.power}</span>
                    </div>
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-green-800 text-xs">
                      {simulationResults.status}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Run simulation to see results</p>
                </div>
              )}

              <Separator />

              {/* Quick Actions */}
              <div>
                <h4 className="font-medium mb-2">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Battery className="mr-1 h-3 w-3" />
                    Add Power
                  </Button>
                  <Button variant="outline" size="sm">
                    <Lightbulb className="mr-1 h-3 w-3" />
                    Add LED
                  </Button>
                  <Button variant="outline" size="sm">
                    <Volume2 className="mr-1 h-3 w-3" />
                    Add Buzzer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Gauge className="mr-1 h-3 w-3" />
                    Add Meter
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