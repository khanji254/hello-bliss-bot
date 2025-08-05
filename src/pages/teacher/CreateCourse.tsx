import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Plus,
  Upload,
  BookOpen,
  Video,
  Link,
  Users,
  Monitor,
  Terminal,
  CircuitBoard,
  Cog,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Save,
  Send,
  FileText,
  Image,
  Paperclip,
  Mic,
  Camera,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Maximize,
  MessageSquare,
  Users2,
  Presentation,
  FileCode,
  Database,
  Zap,
  Target,
  Award,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Edit3,
  Trash2,
  Copy,
  Settings,
  Share2,
  Download
} from "lucide-react";

interface CourseSection {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
  isCollapsed: boolean;
}

interface CourseLesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'simulation' | 'live';
  duration: number;
  content: any;
  resources: Resource[];
}

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'link' | 'code' | 'dataset' | 'image';
  url: string;
  size?: string;
}

interface ClassroomTool {
  id: string;
  name: string;
  icon: any;
  description: string;
  type: 'simulation' | 'terminal' | 'whiteboard' | 'screen_share' | 'breakout';
  enabled: boolean;
}

const courseCategories = [
  'Arduino & Microcontrollers',
  'Robot Programming',
  'AI & Machine Learning',
  'IoT Development',
  'Circuit Design',
  'Computer Vision',
  'Automation',
  'Embedded Systems'
];

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner', description: 'No prior experience required' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some programming knowledge helpful' },
  { value: 'advanced', label: 'Advanced', description: 'Strong technical background required' },
  { value: 'expert', label: 'Expert', description: 'Professional level expertise needed' }
];

const classroomTools: ClassroomTool[] = [
  {
    id: 'circuit_sim',
    name: 'Circuit Simulator',
    icon: CircuitBoard,
    description: 'Interactive circuit design and simulation',
    type: 'simulation',
    enabled: true
  },
  {
    id: 'ros_playground',
    name: 'ROS Playground',
    icon: Cog,
    description: 'Robot Operating System environment',
    type: 'simulation',
    enabled: true
  },
  {
    id: 'code_terminal',
    name: 'Code Terminal',
    icon: Terminal,
    description: 'Shared coding environment with real-time collaboration',
    type: 'terminal',
    enabled: true
  },
  {
    id: 'whiteboard',
    name: 'Interactive Whiteboard',
    icon: Edit3,
    description: 'Digital whiteboard for collaborative problem solving',
    type: 'whiteboard',
    enabled: true
  },
  {
    id: 'screen_share',
    name: 'Screen Sharing',
    icon: Monitor,
    description: 'Share your screen with students in real-time',
    type: 'screen_share',
    enabled: true
  },
  {
    id: 'breakout_rooms',
    name: 'Breakout Teams',
    icon: Users2,
    description: 'Create small groups for collaborative projects',
    type: 'breakout',
    enabled: true
  }
];

export default function CreateCourse() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    price: '',
    thumbnail: null as File | null,
    tags: [] as string[],
    duration: '',
    isPublic: true,
    enableCertificate: true,
    maxStudents: '',
    startDate: '',
    endDate: ''
  });

  const [sections, setSections] = useState<CourseSection[]>([]);
  const [enabledTools, setEnabledTools] = useState<string[]>(
    classroomTools.filter(tool => tool.enabled).map(tool => tool.id)
  );
  const [currentTag, setCurrentTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  if (!user) return null;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !courseData.tags.includes(currentTag.trim())) {
      setCourseData({
        ...courseData,
        tags: [...courseData.tags, currentTag.trim()]
      });
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCourseData({
      ...courseData,
      tags: courseData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleAddSection = () => {
    const newSection: CourseSection = {
      id: `section_${Date.now()}`,
      title: 'New Section',
      description: '',
      lessons: [],
      isCollapsed: false
    };
    setSections([...sections, newSection]);
  };

  const handleAddLesson = (sectionId: string) => {
    const newLesson: CourseLesson = {
      id: `lesson_${Date.now()}`,
      title: 'New Lesson',
      type: 'video',
      duration: 0,
      content: {},
      resources: []
    };

    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, lessons: [...section.lessons, newLesson] }
        : section
    ));
  };

  const handleToolToggle = (toolId: string) => {
    setEnabledTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'resource') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'thumbnail') {
        setCourseData({ ...courseData, thumbnail: file });
      }
      // Handle resource upload logic here
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Course Basics</h2>
              <p className="text-muted-foreground">Let's start with the fundamental information about your course.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Arduino Programming for Beginners"
                    value={courseData.title}
                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={courseData.category} onValueChange={(value) => setCourseData({ ...courseData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={courseData.difficulty} onValueChange={(value) => setCourseData({ ...courseData, difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div>
                            <div className="font-medium">{level.label}</div>
                            <div className="text-sm text-muted-foreground">{level.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="99"
                      value={courseData.price}
                      onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="20"
                      value={courseData.duration}
                      onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Course Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students will learn in this course..."
                    rows={6}
                    value={courseData.description}
                    onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Course Thumbnail</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <Button variant="outline" onClick={() => document.getElementById('thumbnail-upload')?.click()}>
                        Upload Image
                      </Button>
                      <input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'thumbnail')}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      PNG, JPG up to 2MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add tags..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {courseData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                    {tag} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
              <p className="text-muted-foreground">Organize your course content into sections and lessons.</p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Course Sections</CardTitle>
                  <Button onClick={handleAddSection}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {sections.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No sections yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating your first section.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sections.map((section, index) => (
                      <Card key={section.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <Input
                                value={section.title}
                                onChange={(e) => {
                                  setSections(sections.map(s => 
                                    s.id === section.id ? { ...s, title: e.target.value } : s
                                  ));
                                }}
                                className="font-semibold"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleAddLesson(section.id)}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add Lesson
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {section.lessons.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No lessons in this section yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {section.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className="flex items-center justify-between p-3 border rounded">
                                  <div className="flex items-center space-x-3">
                                    <div className="text-sm text-muted-foreground">
                                      {lessonIndex + 1}.
                                    </div>
                                    <Input
                                      value={lesson.title}
                                      className="border-none p-0 h-auto font-medium"
                                      onChange={(e) => {
                                        setSections(sections.map(s => 
                                          s.id === section.id 
                                            ? { 
                                                ...s, 
                                                lessons: s.lessons.map(l => 
                                                  l.id === lesson.id ? { ...l, title: e.target.value } : l
                                                )
                                              }
                                            : s
                                        ));
                                      }}
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Select value={lesson.type} onValueChange={(value: any) => {
                                      setSections(sections.map(s => 
                                        s.id === section.id 
                                          ? { 
                                              ...s, 
                                              lessons: s.lessons.map(l => 
                                                l.id === lesson.id ? { ...l, type: value } : l
                                              )
                                            }
                                          : s
                                      ));
                                    }}>
                                      <SelectTrigger className="w-32">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="text">Text</SelectItem>
                                        <SelectItem value="quiz">Quiz</SelectItem>
                                        <SelectItem value="assignment">Assignment</SelectItem>
                                        <SelectItem value="simulation">Simulation</SelectItem>
                                        <SelectItem value="live">Live Session</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button variant="ghost" size="sm">
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Course Resources</h2>
              <p className="text-muted-foreground">Upload materials and resources for your students.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Documents & Books
                  </CardTitle>
                  <CardDescription>Upload PDFs, eBooks, and reference materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <Button variant="outline" className="mt-2">
                      <FileText className="h-4 w-4 mr-2" />
                      Upload Documents
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">PDF, EPUB, DOCX</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="h-5 w-5 mr-2" />
                    Video Content
                  </CardTitle>
                  <CardDescription>Upload or link to video lectures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <Button variant="outline" className="mt-2">
                        <Video className="h-4 w-4 mr-2" />
                        Upload Videos
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">MP4, AVI, MOV</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Or</p>
                      <Input placeholder="YouTube/Vimeo URL" className="mt-2" />
                      <Button variant="outline" className="mt-2 w-full">
                        <Link className="h-4 w-4 mr-2" />
                        Add Video Link
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileCode className="h-5 w-5 mr-2" />
                    Code & Projects
                  </CardTitle>
                  <CardDescription>Share code examples and project files</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <Button variant="outline" className="mt-2">
                      <FileCode className="h-4 w-4 mr-2" />
                      Upload Code Files
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">ZIP, GitHub links</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Datasets & Assets
                  </CardTitle>
                  <CardDescription>Provide datasets and additional assets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <Button variant="outline" className="mt-2">
                      <Database className="h-4 w-4 mr-2" />
                      Upload Assets
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">CSV, JSON, Images</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>External Links & Resources</CardTitle>
                <CardDescription>Add helpful external links and references</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Input placeholder="Link title" />
                    <Input placeholder="URL" />
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">Arduino Official Documentation</div>
                        <div className="text-sm text-muted-foreground">https://docs.arduino.cc/</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Interactive Classroom Tools</h2>
              <p className="text-muted-foreground">Configure tools for live sessions and collaborative learning.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {classroomTools.map((tool) => (
                <Card key={tool.id} className={`transition-all ${enabledTools.includes(tool.id) ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <tool.icon className="h-6 w-6" />
                        <div>
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                          <CardDescription>{tool.description}</CardDescription>
                        </div>
                      </div>
                      <Switch
                        checked={enabledTools.includes(tool.id)}
                        onCheckedChange={() => handleToolToggle(tool.id)}
                      />
                    </div>
                  </CardHeader>
                  {enabledTools.includes(tool.id) && (
                    <CardContent>
                      <div className="space-y-3">
                        {tool.type === 'simulation' && (
                          <div>
                            <Label>Simulation Settings</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="flex items-center space-x-2">
                                <Switch defaultChecked />
                                <Label className="text-sm">Student Access</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch defaultChecked />
                                <Label className="text-sm">Real-time Sync</Label>
                              </div>
                            </div>
                          </div>
                        )}
                        {tool.type === 'breakout' && (
                          <div>
                            <Label>Team Configuration</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <Input placeholder="Max team size" type="number" defaultValue="4" />
                              <Select defaultValue="auto">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="auto">Auto-assign</SelectItem>
                                  <SelectItem value="manual">Manual selection</SelectItem>
                                  <SelectItem value="random">Random groups</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        {tool.type === 'screen_share' && (
                          <div>
                            <Label>Sharing Options</Label>
                            <div className="space-y-2 mt-2">
                              <div className="flex items-center space-x-2">
                                <Switch defaultChecked />
                                <Label className="text-sm">Allow student screen sharing</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch defaultChecked />
                                <Label className="text-sm">Record sessions</Label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Live Session Settings
                </CardTitle>
                <CardDescription>Configure your live classroom sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Default Session Duration</Label>
                    <Select defaultValue="60">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Max Participants</Label>
                    <Input type="number" placeholder="50" defaultValue="50" />
                  </div>
                  <div>
                    <Label>Recording Settings</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked />
                        <Label className="text-sm">Auto-record sessions</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch />
                        <Label className="text-sm">Allow downloads</Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Chat & Communication</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked />
                        <Label className="text-sm">Enable chat</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked />
                        <Label className="text-sm">Private messaging</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Course Settings & Publishing</h2>
              <p className="text-muted-foreground">Final settings and publish your course.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Visibility & Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Public Course</Label>
                      <p className="text-sm text-muted-foreground">Anyone can find and enroll</p>
                    </div>
                    <Switch 
                      checked={courseData.isPublic} 
                      onCheckedChange={(checked) => setCourseData({ ...courseData, isPublic: checked })}
                    />
                  </div>
                  <div>
                    <Label>Maximum Students</Label>
                    <Input 
                      type="number" 
                      placeholder="Unlimited" 
                      value={courseData.maxStudents}
                      onChange={(e) => setCourseData({ ...courseData, maxStudents: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Course Start Date</Label>
                      <Input 
                        type="date" 
                        value={courseData.startDate}
                        onChange={(e) => setCourseData({ ...courseData, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Course End Date</Label>
                      <Input 
                        type="date" 
                        value={courseData.endDate}
                        onChange={(e) => setCourseData({ ...courseData, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Certification & Completion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Certificate</Label>
                      <p className="text-sm text-muted-foreground">Issue completion certificates</p>
                    </div>
                    <Switch 
                      checked={courseData.enableCertificate} 
                      onCheckedChange={(checked) => setCourseData({ ...courseData, enableCertificate: checked })}
                    />
                  </div>
                  <div>
                    <Label>Completion Requirements</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked />
                        <Label className="text-sm">Complete all lessons</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked />
                        <Label className="text-sm">Pass all quizzes (70%)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch />
                        <Label className="text-sm">Submit final project</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Course Summary</CardTitle>
                <CardDescription>Review your course before publishing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">Course Details</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Title:</span> {courseData.title || 'Untitled Course'}</div>
                      <div><span className="font-medium">Category:</span> {courseData.category || 'Not selected'}</div>
                      <div><span className="font-medium">Difficulty:</span> {courseData.difficulty || 'Not selected'}</div>
                      <div><span className="font-medium">Price:</span> ${courseData.price || '0'}</div>
                      <div><span className="font-medium">Duration:</span> {courseData.duration || '0'} hours</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Content Structure</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Sections:</span> {sections.length}</div>
                      <div><span className="font-medium">Lessons:</span> {sections.reduce((total, section) => total + section.lessons.length, 0)}</div>
                      <div><span className="font-medium">Interactive Tools:</span> {enabledTools.length}</div>
                      <div><span className="font-medium">Tags:</span> {courseData.tags.join(', ') || 'None'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-4">
              <Button className="flex-1" size="lg">
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button className="flex-1" size="lg" variant="default">
                <Send className="h-4 w-4 mr-2" />
                Publish Course
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Plus className="h-8 w-8" />
              Create New Course
            </h1>
            <p className="text-muted-foreground mt-2">
              Build an engaging robotics course with interactive tools and comprehensive content
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Course Creation Progress</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={currentStep === totalSteps}
          >
            {currentStep === totalSteps ? 'Complete' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
}
