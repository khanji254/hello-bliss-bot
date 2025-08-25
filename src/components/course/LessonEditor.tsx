import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  FileText,
  Code,
  Image,
  Play,
  Upload,
  Plus,
  Trash2,
  Link,
  CircuitBoard,
  Bot,
  Terminal,
  Monitor
} from "lucide-react";

export type LessonType = 'video' | 'text' | 'code' | 'image' | 'quiz' | 'simulation' | 'interactive';

export interface LessonContent {
  id: string;
  title: string;
  type: LessonType;
  duration: number;
  content: {
    text?: string;
    videoUrl?: string;
    codeSnippet?: string;
    language?: string;
    imageUrl?: string;
    quizData?: any;
    simulationType?: 'circuit' | 'ros' | 'robot2d' | 'arduino';
    simulationConfig?: any;
  };
  resources: Resource[];
  isPublished: boolean;
}

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'link' | 'code' | 'dataset' | 'image';
  url: string;
  size?: string;
}

interface LessonEditorProps {
  lesson: LessonContent;
  onUpdate: (lesson: LessonContent) => void;
  onDelete: () => void;
}

const lessonTypeOptions = [
  { value: 'text', label: 'Text Content', icon: FileText, description: 'Written content with formatting' },
  { value: 'video', label: 'Video Lesson', icon: Video, description: 'Video content with player controls' },
  { value: 'code', label: 'Code Example', icon: Code, description: 'Interactive code snippets' },
  { value: 'image', label: 'Image/Diagram', icon: Image, description: 'Visual content and diagrams' },
  { value: 'simulation', label: 'Simulation', icon: CircuitBoard, description: 'Interactive simulators' },
  { value: 'interactive', label: 'Interactive Activity', icon: Bot, description: 'Hands-on exercises' }
];

const simulationTypes = [
  { value: 'circuit', label: 'Circuit Simulator', icon: CircuitBoard, description: 'Electronic circuit design' },
  { value: 'arduino', label: 'Arduino Playground', icon: Terminal, description: 'Microcontroller programming' },
  { value: 'ros', label: 'ROS Environment', icon: Bot, description: 'Robot Operating System' },
  { value: 'robot2d', label: '2D Robot Simulator', icon: Monitor, description: '2D robot navigation and control' }
];

export function LessonEditor({ lesson, onUpdate, onDelete }: LessonEditorProps) {
  const [activeTab, setActiveTab] = useState("content");
  
  const updateLesson = (updates: Partial<LessonContent>) => {
    onUpdate({ ...lesson, ...updates });
  };

  const updateContent = (contentUpdates: Partial<LessonContent['content']>) => {
    updateLesson({
      content: { ...lesson.content, ...contentUpdates }
    });
  };

  const addResource = () => {
    const newResource: Resource = {
      id: `resource_${Date.now()}`,
      name: 'New Resource',
      type: 'link',
      url: ''
    };
    updateLesson({
      resources: [...lesson.resources, newResource]
    });
  };

  const updateResource = (resourceId: string, updates: Partial<Resource>) => {
    updateLesson({
      resources: lesson.resources.map(r => 
        r.id === resourceId ? { ...r, ...updates } : r
      )
    });
  };

  const removeResource = (resourceId: string) => {
    updateLesson({
      resources: lesson.resources.filter(r => r.id !== resourceId)
    });
  };

  const renderContentEditor = () => {
    switch (lesson.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-content">Content</Label>
              <Textarea
                id="text-content"
                placeholder="Write your lesson content here..."
                rows={12}
                value={lesson.content.text || ''}
                onChange={(e) => updateContent({ text: e.target.value })}
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                placeholder="https://youtube.com/watch?v=..."
                value={lesson.content.videoUrl || ''}
                onChange={(e) => updateContent({ videoUrl: e.target.value })}
              />
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-center justify-center h-48 bg-background rounded border-2 border-dashed">
                <div className="text-center">
                  <Video className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Video preview will appear here</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code-language">Programming Language</Label>
                <Select 
                  value={lesson.content.language || 'python'} 
                  onValueChange={(value) => updateContent({ language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="arduino">Arduino IDE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={lesson.duration}
                  onChange={(e) => updateLesson({ duration: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="code-content">Code</Label>
              <Textarea
                id="code-content"
                placeholder="# Write your code example here..."
                rows={15}
                className="font-mono text-sm"
                value={lesson.content.codeSnippet || ''}
                onChange={(e) => updateContent({ codeSnippet: e.target.value })}
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label>Upload Image</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                  Choose Image
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Handle file upload logic here
                      const url = URL.createObjectURL(file);
                      updateContent({ imageUrl: url });
                    }
                  }}
                />
                <p className="text-sm text-muted-foreground mt-2">PNG, JPG up to 5MB</p>
              </div>
            </div>
            {lesson.content.imageUrl && (
              <div className="border rounded-lg p-4">
                <img 
                  src={lesson.content.imageUrl} 
                  alt="Lesson content" 
                  className="max-w-full h-auto rounded"
                />
              </div>
            )}
          </div>
        );

      case 'simulation':
        return (
          <div className="space-y-4">
            <div>
              <Label>Simulation Type</Label>
              <Select 
                value={lesson.content.simulationType || 'circuit'} 
                onValueChange={(value: any) => updateContent({ simulationType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {simulationTypes.map((sim) => (
                    <SelectItem key={sim.value} value={sim.value}>
                      <div className="flex items-center gap-2">
                        <sim.icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{sim.label}</div>
                          <div className="text-sm text-muted-foreground">{sim.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="border rounded-lg p-6 bg-muted/50">
              <div className="text-center">
                <CircuitBoard className="h-16 w-16 mx-auto text-primary mb-4" />
                <h3 className="font-semibold mb-2">Interactive Simulation</h3>
                <p className="text-muted-foreground mb-4">
                  Students will be able to interact with the {lesson.content.simulationType} simulator
                </p>
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Preview Simulation
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Select a lesson type to start editing</p>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Input
              value={lesson.title}
              onChange={(e) => updateLesson({ title: e.target.value })}
              className="text-lg font-semibold border-none p-0 h-auto"
              placeholder="Lesson Title"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={lesson.isPublished}
              onCheckedChange={(checked) => updateLesson({ isPublished: checked })}
            />
            <Label className="text-sm">Published</Label>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6 mt-6">
            <div>
              <Label>Lesson Type</Label>
              <Select 
                value={lesson.type} 
                onValueChange={(value: LessonType) => updateLesson({ type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lessonTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {renderContentEditor()}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={lesson.duration}
                  onChange={(e) => updateLesson({ duration: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={lesson.isPublished}
                  onCheckedChange={(checked) => updateLesson({ isPublished: checked })}
                />
                <Label htmlFor="published">Publish this lesson</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Lesson Resources</h3>
              <Button onClick={addResource} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>

            {lesson.resources.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No resources added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lesson.resources.map((resource) => (
                  <Card key={resource.id}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4">
                          <Input
                            value={resource.name}
                            onChange={(e) => updateResource(resource.id, { name: e.target.value })}
                            placeholder="Resource name"
                          />
                        </div>
                        <div className="col-span-2">
                          <Select 
                            value={resource.type} 
                            onValueChange={(value: any) => updateResource(resource.id, { type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pdf">PDF</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="link">Link</SelectItem>
                              <SelectItem value="code">Code</SelectItem>
                              <SelectItem value="image">Image</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-5">
                          <Input
                            value={resource.url}
                            onChange={(e) => updateResource(resource.id, { url: e.target.value })}
                            placeholder="URL or file path"
                          />
                        </div>
                        <div className="col-span-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeResource(resource.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}