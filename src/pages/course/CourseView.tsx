import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from "@/components/layout/Layout";
import { formatTextContent } from '@/utils/sanitize';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Play,
  Pause,
  SkipForward,
  SkipBack,
  BookOpen,
  Clock,
  Users,
  Star,
  Award,
  CheckCircle,
  CircuitBoard,
  Code,
  Video,
  FileText,
  Image,
  Bot,
  Terminal,
  Monitor,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Download,
  ExternalLink
} from 'lucide-react';
import { coursesApi } from '@/lib/api';

interface CourseData {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    avatar: string;
    bio: string;
  };
  rating: number;
  totalStudents: number;
  duration: number;
  level: string;
  category: string;
  sections: CourseSection[];
  enrollment?: {
    id: string;
    progress: number;
    currentLesson: string;
    status: 'enrolled' | 'completed';
  };
}

interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'code' | 'image' | 'simulation' | 'quiz';
  duration: number;
  content: any;
  resources: Resource[];
  isCompleted: boolean;
  isLocked: boolean;
}

interface Resource {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: string;
}

export default function CourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("lesson");

  useEffect(() => {
    if (courseId) {
      loadCourse(courseId);
    }
  }, [courseId]);

  const loadCourse = async (id: string) => {
    try {
      setIsLoading(true);
      // In a real app, this would fetch the course data from the API
      // For now, we'll use mock data
      const mockCourse: CourseData = {
        id: id,
        title: "Arduino Programming for Robotics",
        description: "Learn to program Arduino microcontrollers for robotics applications. This comprehensive course covers everything from basic I/O operations to advanced sensor integration and motor control.",
        instructor: {
          name: "Dr. Sarah Johnson",
          avatar: "/api/placeholder/100/100",
          bio: "Robotics Engineer with 10+ years experience in embedded systems and robotics education."
        },
        rating: 4.8,
        totalStudents: 1250,
        duration: 180, // minutes
        level: "Intermediate",
        category: "Arduino & Microcontrollers",
        sections: [
          {
            id: "section-1",
            title: "Getting Started with Arduino",
            lessons: [
              {
                id: "lesson-1",
                title: "Introduction to Arduino",
                type: "video",
                duration: 15,
                content: {
                  videoUrl: "https://youtube.com/watch?v=example",
                  description: "Welcome to Arduino programming! In this lesson, we'll introduce the Arduino platform and set up your development environment."
                },
                resources: [
                  {
                    id: "res-1",
                    name: "Arduino IDE Setup Guide",
                    type: "pdf",
                    url: "/resources/arduino-setup.pdf"
                  }
                ],
                isCompleted: false,
                isLocked: false
              },
              {
                id: "lesson-2",
                title: "Basic Circuit Design",
                type: "simulation",
                duration: 20,
                content: {
                  simulationType: "circuit",
                  description: "Learn to design basic circuits using our interactive circuit simulator."
                },
                resources: [],
                isCompleted: false,
                isLocked: false
              },
              {
                id: "lesson-3",
                title: "First Arduino Program",
                type: "code",
                duration: 25,
                content: {
                  language: "arduino",
                  codeSnippet: `// LED Blink Example
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}`,
                  description: "Write your first Arduino program to blink an LED."
                },
                resources: [],
                isCompleted: false,
                isLocked: false
              }
            ]
          },
          {
            id: "section-2",
            title: "Sensors and Input",
            lessons: [
              {
                id: "lesson-4",
                title: "Reading Sensor Data",
                type: "text",
                duration: 30,
                content: {
                  text: `# Reading Sensor Data

In this lesson, we'll learn how to read data from various sensors connected to your Arduino.

## Digital vs Analog Sensors

Digital sensors provide binary information (HIGH/LOW, ON/OFF), while analog sensors provide a range of values.

### Reading Digital Sensors
\`\`\`arduino
int sensorValue = digitalRead(2);
\`\`\`

### Reading Analog Sensors
\`\`\`arduino
int sensorValue = analogRead(A0);
\`\`\`

This forms the foundation for more complex sensor interactions in robotics applications.`,
                  description: "Understanding how to read sensor data is crucial for robotics applications."
                },
                resources: [
                  {
                    id: "res-2",
                    name: "Sensor Reference Guide",
                    type: "pdf",
                    url: "/resources/sensor-guide.pdf"
                  }
                ],
                isCompleted: false,
                isLocked: true
              }
            ]
          }
        ],
        enrollment: {
          id: "enrollment-1",
          progress: 25,
          currentLesson: "lesson-1",
          status: "enrolled"
        }
      };

      setCourse(mockCourse);
      
      // Set the first lesson as current lesson
      if (mockCourse.sections[0]?.lessons[0]) {
        setCurrentLesson(mockCourse.sections[0].lessons[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'text': return FileText;
      case 'code': return Code;
      case 'image': return Image;
      case 'simulation': return CircuitBoard;
      case 'quiz': return CheckCircle;
      default: return BookOpen;
    }
  };

  const getSimulationIcon = (simulationType: string) => {
    switch (simulationType) {
      case 'circuit': return CircuitBoard;
      case 'arduino': return Terminal;
      case 'ros': return Bot;
      case 'robot2d': return Monitor;
      default: return CircuitBoard;
    }
  };

  const renderLessonContent = () => {
    if (!currentLesson) return null;

    switch (currentLesson.type) {
      case 'video':
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Video className="h-16 w-16 mx-auto mb-4" />
                <p>Video Player</p>
                <p className="text-sm opacity-75">URL: {currentLesson.content.videoUrl}</p>
              </div>
            </div>
            {currentLesson.content.description && (
              <div className="prose max-w-none">
                <p>{currentLesson.content.description}</p>
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: formatTextContent(currentLesson.content.text || '') }} />
          </div>
        );

      case 'code':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{currentLesson.content.language}</Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Code
              </Button>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                <code>{currentLesson.content.codeSnippet}</code>
              </pre>
            </div>
            {currentLesson.content.description && (
              <p className="text-muted-foreground">{currentLesson.content.description}</p>
            )}
          </div>
        );

      case 'simulation':
        const SimIcon = getSimulationIcon(currentLesson.content.simulationType);
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <SimIcon className="h-20 w-20 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive Simulation</h3>
                <p className="text-muted-foreground mb-6">
                  {currentLesson.content.description}
                </p>
                <Button 
                  size="lg"
                  onClick={() => {
                    // Navigate to appropriate simulator
                    const simulatorRoutes = {
                      circuit: '/simulations/circuit-simulator',
                      arduino: '/simulations/arduino-playground',
                      ros: '/simulations/ros-playground',
                      robot2d: '/simulations/robot-programming'
                    };
                    const route = simulatorRoutes[currentLesson.content.simulationType as keyof typeof simulatorRoutes];
                    if (route) {
                      window.open(route, '_blank');
                    }
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Launch Simulation
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            {currentLesson.content.imageUrl && (
              <img 
                src={currentLesson.content.imageUrl} 
                alt={currentLesson.title}
                className="w-full rounded-lg"
              />
            )}
            {currentLesson.content.description && (
              <p className="text-muted-foreground">{currentLesson.content.description}</p>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Lesson content not available</p>
          </div>
        );
    }
  };

  const getNextLesson = () => {
    if (!course || !currentLesson) return null;
    
    let foundCurrent = false;
    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        if (foundCurrent && !lesson.isLocked) {
          return lesson;
        }
        if (lesson.id === currentLesson.id) {
          foundCurrent = true;
        }
      }
    }
    return null;
  };

  const getPrevLesson = () => {
    if (!course || !currentLesson) return null;
    
    let prevLesson = null;
    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        if (lesson.id === currentLesson.id) {
          return prevLesson;
        }
        prevLesson = lesson;
      }
    }
    return null;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading course...</span>
        </div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {error || "The course you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate('/student/courses')}>
            Back to My Courses
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-4rem)]">
        {/* Course Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Course Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>by {course.instructor.name}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {course.rating}
                </div>
                <span>•</span>
                <span>{course.totalStudents} students</span>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/student/courses')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </div>

          {/* Progress Bar */}
          {course.enrollment && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {course.enrollment.progress}% Complete
                  </span>
                </div>
                <Progress value={course.enrollment.progress} className="w-full" />
              </CardContent>
            </Card>
          )}

          {/* Lesson Content */}
          <Card className="flex-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentLesson && (
                    <>
                      {React.createElement(getLessonIcon(currentLesson.type), { 
                        className: "h-5 w-5 text-primary" 
                      })}
                      <div>
                        <h2 className="text-xl font-semibold">{currentLesson.title}</h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {currentLesson.duration} minutes
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!getPrevLesson()}
                    onClick={() => {
                      const prev = getPrevLesson();
                      if (prev) setCurrentLesson(prev);
                    }}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm"
                    disabled={!getNextLesson()}
                    onClick={() => {
                      const next = getNextLesson();
                      if (next) setCurrentLesson(next);
                    }}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="lesson">Lesson</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="lesson" className="mt-6">
                  {renderLessonContent()}
                </TabsContent>

                <TabsContent value="resources" className="mt-6">
                  {currentLesson?.resources.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No resources for this lesson</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentLesson?.resources.map((resource) => (
                        <Card key={resource.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded">
                                  <ExternalLink className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{resource.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {resource.type.toUpperCase()}
                                    {resource.size && ` • ${resource.size}`}
                                  </p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
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
        </div>

        {/* Course Outline Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Course Outline</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {course.sections.map((section) => (
                  <div key={section.id}>
                    <div className="px-4 py-2 bg-muted/50 font-semibold text-sm">
                      {section.title}
                    </div>
                    {section.lessons.map((lesson) => {
                      const LessonIcon = getLessonIcon(lesson.type);
                      const isActive = currentLesson?.id === lesson.id;
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => !lesson.isLocked && setCurrentLesson(lesson)}
                          disabled={lesson.isLocked}
                          className={`w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-l-2 ${
                            isActive 
                              ? 'border-primary bg-primary/5' 
                              : 'border-transparent'
                          } ${lesson.isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center gap-3">
                            <LessonIcon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${isActive ? 'text-primary' : ''}`}>
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {lesson.duration}m
                                {lesson.isCompleted && (
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}