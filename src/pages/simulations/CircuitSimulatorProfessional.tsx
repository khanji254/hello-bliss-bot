import React, { useEffect, useRef, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface SimcirComponent {
  type: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
}

declare global {
  interface Window {
    simcir: any;
    $: any;
  }
}

const useSimcirJS = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSimcirJS = async () => {
      try {
        console.log('Starting SimcirJS loading...');
        
        // Check if already loaded
        if (window.simcir) {
          console.log('SimcirJS already loaded');
          setIsLoaded(true);
          return;
        }

        // Load jQuery first if not available
        if (!window.$) {
          console.log('Loading jQuery...');
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
            script.onload = () => {
              console.log('jQuery loaded successfully');
              resolve();
            };
            script.onerror = () => reject(new Error('Failed to load jQuery'));
            document.head.appendChild(script);
          });
        }

        // Wait for jQuery to initialize
        await new Promise(resolve => setTimeout(resolve, 100));

        // Load SimcirJS core
        console.log('Loading SimcirJS core...');
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = '/simcirjs/simcir.js';
          script.onload = () => {
            console.log('SimcirJS core loaded');
            resolve();
          };
          script.onerror = () => reject(new Error('Failed to load simcir.js'));
          document.head.appendChild(script);
        });

        // Load SimcirJS basicset
        console.log('Loading SimcirJS basicset...');
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = '/simcirjs/simcir-basicset.js';
          script.onload = () => {
            console.log('SimcirJS basicset loaded');
            resolve();
          };
          script.onerror = () => reject(new Error('Failed to load simcir-basicset.js'));
          document.head.appendChild(script);
        });

        // Load CSS files
        const cssFiles = ['/simcirjs/simcir.css', '/simcirjs/simcir-basicset.css'];
        cssFiles.forEach(href => {
          if (!document.querySelector(`link[href="${href}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
          }
        });

        // Wait for SimcirJS to be available
        let attempts = 0;
        while (attempts < 50) { // Wait up to 5 seconds
          await new Promise(resolve => setTimeout(resolve, 100));
          if (window.simcir) {
            console.log('SimcirJS is ready!');
            setIsLoaded(true);
            return;
          }
          attempts++;
        }

        throw new Error('SimcirJS did not become available after loading');

      } catch (error) {
        console.error('Failed to load SimcirJS:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setIsLoaded(false);
      }
    };

    loadSimcirJS();
  }, []);

  return { isLoaded, error };
};

const CircuitSimulatorProfessional: React.FC = () => {
  const { isLoaded, error } = useSimcirJS();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [circuitData, setCircuitData] = useState<any>({
    "width": 800,
    "height": 500,
    "showToolbox": false,
    "devices": [
      {
        "type": "DC",
        "id": "dev0",
        "x": 50,
        "y": 100,
        "label": "Power"
      },
      {
        "type": "Toggle",
        "id": "dev1",
        "x": 150,
        "y": 80,
        "label": "Input A"
      },
      {
        "type": "Toggle",
        "id": "dev2",
        "x": 150,
        "y": 120,
        "label": "Input B"
      },
      {
        "type": "AND",
        "id": "dev3",
        "x": 280,
        "y": 100,
        "label": "AND Gate"
      },
      {
        "type": "LED",
        "id": "dev4",
        "x": 400,
        "y": 100,
        "label": "Output"
      }
    ],
    "connectors": [
      {
        "from": "dev0.out0",
        "to": "dev1.in0"
      },
      {
        "from": "dev0.out0",
        "to": "dev2.in0"
      },
      {
        "from": "dev1.out0",
        "to": "dev3.in0"
      },
      {
        "from": "dev2.out0",
        "to": "dev3.in1"
      },
      {
        "from": "dev3.out0",
        "to": "dev4.in0"
      }
    ]
  });

  const components: SimcirComponent[] = [
    // Power & Input
    { type: 'DC', name: 'DC Source', description: 'Direct Current Power Source', category: 'power' },
    { type: 'PushOn', name: 'Push Button (ON)', description: 'Momentary Switch (Normally Open)', category: 'input' },
    { type: 'PushOff', name: 'Push Button (OFF)', description: 'Momentary Switch (Normally Closed)', category: 'input' },
    { type: 'Toggle', name: 'Toggle Switch', description: 'Toggle Switch', category: 'input' },
    
    // Logic Gates
    { type: 'AND', name: 'AND Gate', description: 'Logic AND Gate', category: 'logic' },
    { type: 'OR', name: 'OR Gate', description: 'Logic OR Gate', category: 'logic' },
    { type: 'NOT', name: 'NOT Gate', description: 'Logic NOT Gate (Inverter)', category: 'logic' },
    { type: 'NAND', name: 'NAND Gate', description: 'Logic NAND Gate', category: 'logic' },
    { type: 'NOR', name: 'NOR Gate', description: 'Logic NOR Gate', category: 'logic' },
    { type: 'XOR', name: 'XOR Gate', description: 'Logic XOR Gate', category: 'logic' },
    { type: 'XNOR', name: 'XNOR Gate', description: 'Logic XNOR Gate', category: 'logic' },
    { type: 'BUF', name: 'Buffer', description: 'Logic Buffer', category: 'logic' },
    
    // Output & Display
    { type: 'LED', name: 'LED', description: 'Light Emitting Diode', category: 'output' },
    { type: '7seg', name: '7-Segment Display', description: '7-Segment LED Display', category: 'output' },
    { type: '16seg', name: '16-Segment Display', description: '16-Segment LED Display', category: 'output' },
    { type: '4bit7seg', name: '4-bit 7-Segment', description: '4-bit 7-Segment Display', category: 'output' },
    
    // Special Components
    { type: 'OSC', name: 'Oscillator', description: 'Clock Signal Generator', category: 'special' },
    { type: 'RotaryEncoder', name: 'Rotary Encoder', description: 'Rotary Position Encoder', category: 'special' },
  ];

  const categories = [
    { id: 'all', name: 'All Components', color: 'bg-gray-100' },
    { id: 'power', name: 'Power', color: 'bg-red-100' },
    { id: 'input', name: 'Input', color: 'bg-blue-100' },
    { id: 'logic', name: 'Logic Gates', color: 'bg-green-100' },
    { id: 'output', name: 'Output', color: 'bg-yellow-100' },
    { id: 'special', name: 'Special', color: 'bg-purple-100' },
  ];

  const filteredComponents = selectedCategory === 'all' 
    ? components 
    : components.filter(comp => comp.category === selectedCategory);

  // Trigger SimcirJS initialization when loaded
  useEffect(() => {
    if (isLoaded && canvasRef.current && window.simcir) {
      try {
        console.log('Initializing SimcirJS with DOM approach...');
        
        // SimcirJS automatically processes divs with class "simcir" 
        // So we just need to make sure our div has the right class and JSON content
        canvasRef.current.className = 'simcir';
        canvasRef.current.textContent = JSON.stringify(circuitData, null, 2);
        
        // Trigger SimcirJS to process this element
        if (window.simcir && window.simcir.setupSimcir) {
          window.simcir.setupSimcir(window.$(canvasRef.current), circuitData);
        } else {
          // Fallback: trigger by changing the content
          const event = new Event('DOMContentLoaded');
          document.dispatchEvent(event);
        }
        
        console.log('SimcirJS initialized successfully');
      } catch (error) {
        console.error('Failed to initialize SimcirJS:', error);
      }
    }
  }, [isLoaded, circuitData]);

  const addComponent = (componentType: string) => {
    if (!isLoaded) {
      console.warn('SimcirJS not ready yet, cannot add component');
      return;
    }
    
    try {
      const newDevice = {
        type: componentType,
        id: `dev_${Date.now()}`,
        x: 100 + Math.random() * 300,
        y: 100 + Math.random() * 200,
        label: componentType
      };
      
      const newCircuitData = {
        ...circuitData,
        devices: [...circuitData.devices, newDevice]
      };
      
      setCircuitData(newCircuitData);
      console.log(`Added ${componentType} component`);
    } catch (error) {
      console.error('Error adding component:', error);
    }
  };

  const clearCircuit = () => {
    if (!isLoaded) {
      console.warn('SimcirJS not ready yet, cannot clear circuit');
      return;
    }
    
    try {
      const newCircuitData = {
        ...circuitData,
        devices: [],
        connectors: []
      };
      setCircuitData(newCircuitData);
      console.log('Circuit cleared');
    } catch (error) {
      console.error('Error clearing circuit:', error);
    }
  };

  const loadExampleCircuit = () => {
    if (!isLoaded) {
      console.warn('SimcirJS not ready yet, cannot load example circuit');
      return;
    }
    
    try {
      const exampleCircuit = {
        "width": 800,
        "height": 500,
        "showToolbox": false,
        "devices": [
          { "type": "DC", "id": "power", "x": 50, "y": 150, "label": "Power" },
          { "type": "Toggle", "id": "sw1", "x": 150, "y": 100, "label": "A" },
          { "type": "Toggle", "id": "sw2", "x": 150, "y": 150, "label": "B" },
          { "type": "Toggle", "id": "sw3", "x": 150, "y": 200, "label": "C" },
          { "type": "AND", "id": "and1", "x": 280, "y": 125, "label": "AND" },
          { "type": "OR", "id": "or1", "x": 400, "y": 150, "label": "OR" },
          { "type": "LED", "id": "led1", "x": 520, "y": 150, "label": "Result" },
          { "type": "7seg", "id": "display", "x": 280, "y": 250, "label": "Display" }
        ],
        "connectors": [
          { "from": "power.out0", "to": "sw1.in0" },
          { "from": "power.out0", "to": "sw2.in0" },
          { "from": "power.out0", "to": "sw3.in0" },
          { "from": "sw1.out0", "to": "and1.in0" },
          { "from": "sw2.out0", "to": "and1.in1" },
          { "from": "and1.out0", "to": "or1.in0" },
          { "from": "sw3.out0", "to": "or1.in1" },
          { "from": "or1.out0", "to": "led1.in0" }
        ]
      };
      
      setCircuitData(exampleCircuit);
      console.log('Example circuit loaded');
    } catch (error) {
      console.error('Error loading example circuit:', error);
    }
  };

  if (!isLoaded || error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          {error ? (
            <>
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="mt-4 text-lg text-red-600">Failed to Load SimcirJS</p>
              <p className="text-sm text-red-500 mt-2">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </>
          ) : (
            <>
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading SimcirJS Circuit Simulator...</p>
              <p className="text-sm text-gray-500">Initializing components and engine...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Advanced Circuit Simulator</h1>
            <p className="text-gray-600 mt-2">Professional digital circuit design with SimcirJS components</p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            SimcirJS Powered
          </Badge>
        </div>

        {/* Main Circuit Interface */}
        <Card className="h-[calc(100vh-12rem)]">
          <CardContent className="p-0 h-full">
            <div className="flex h-full">
              {/* Component Palette */}
              <div className="w-80 bg-white shadow-lg border-r overflow-y-auto">
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Component Library</h2>
                  
                  {/* Category Filter */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category.id)}
                          className={`text-xs ${selectedCategory === category.id ? '' : category.color}`}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {filteredComponents.map((component) => (
                      <Card
                        key={component.type}
                        className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                          selectedComponent === component.type 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedComponent(component.type)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-sm text-gray-800">{component.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {component.category}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{component.description}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                addComponent(component.type);
                              }}
                              className="ml-2 flex-shrink-0"
                            >
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Canvas Area */}
              <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <div className="bg-white border-b p-4 flex items-center space-x-4">
                  <Button onClick={loadExampleCircuit} className="bg-blue-600 hover:bg-blue-700">
                    Load Example
                  </Button>
                  <Button variant="outline" onClick={clearCircuit}>
                    Clear Circuit
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <span className="text-sm text-gray-600">
                    {selectedComponent ? `Selected: ${selectedComponent}` : 'Click components to select, drag to move, click connections to wire'}
                  </span>
                  <div className="flex-1"></div>
                  <Badge variant="outline" className="text-xs">
                    Real-time Simulation Active
                  </Badge>
                </div>

                {/* Canvas */}
                <div className="flex-1 bg-gray-50 relative overflow-hidden">
                  {/* SimcirJS Canvas - uses class="simcir" with JSON content */}
                  <div 
                    ref={canvasRef}
                    className="simcir absolute inset-0 w-full h-full"
                    style={{ fontSize: '14px' }}
                  >
                    {JSON.stringify(circuitData, null, 2)}
                  </div>
                  
                  {/* Instructions Overlay */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-sm">
                    <h4 className="font-medium text-sm text-gray-800 mb-2">How to Use:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Add components from the left panel</li>
                      <li>• Click and drag to move components</li>
                      <li>• Click output pins and drag to input pins to connect</li>
                      <li>• Toggle switches to test your circuit</li>
                      <li>• Right-click components for options</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CircuitSimulatorProfessional;
