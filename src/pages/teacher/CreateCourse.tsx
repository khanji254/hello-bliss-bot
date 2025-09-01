import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { LessonEditor, LessonContent } from "@/components/course/LessonEditor";
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
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { teacherApi } from "@/lib/api";
import { 
  Plus,
  Upload,
  BookOpen,
  Video,
  Link,
  Monitor,
  Terminal,
  CircuitBoard,
  Cog,
  Calendar,
  Globe,
  Award,
  Save,
  Send,
  FileText,
  Image,
  Database,
  X,
  Trash2,
  Settings,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface CourseSection {
  id: string;
  title: string;
  description: string;
  lessons: LessonContent[];
  isCollapsed: boolean;
}

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'link' | 'code' | 'dataset' | 'image';
  url: string;
  size?: string;
}

interface ExternalLink {
  id: string;
  title: string;
  url: string;
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

export default function CreateCourse() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    price: '',
    thumbnail: null as File | null,
    thumbnailPreview: null as string | null,
    tags: [] as string[],
    duration: '',
    isPublic: true,
    enableCertificate: true,
    maxStudents: '',
    startDate: '',
    endDate: ''
  });

  const [sections, setSections] = useState<CourseSection[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([
    {
      id: '1',
      title: 'Arduino Official Documentation',
      url: 'https://docs.arduino.cc/'
    }
  ]);
  const [currentTag, setCurrentTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

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

  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
    toast({
      title: "Section deleted",
      description: "The section has been removed from your course."
    });
  };

  const handleAddLesson = (sectionId: string) => {
    const newLesson: LessonContent = {
      id: `lesson_${Date.now()}`,
      title: 'New Lesson',
      type: 'text',
      duration: 15,
      content: {},
      resources: [],
      isPublished: false
    };

    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, lessons: [...section.lessons, newLesson] }
        : section
    ));
  };

  const handleUpdateLesson = (sectionId: string, updatedLesson: LessonContent) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            lessons: section.lessons.map(lesson => 
              lesson.id === updatedLesson.id ? updatedLesson : lesson
            )
          }
        : section
    ));
  };

  const handleDeleteLesson = (sectionId: string, lessonId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            lessons: section.lessons.filter(lesson => lesson.id !== lessonId)
          }
        : section
    ));
    toast({
      title: "Lesson deleted",
      description: "The lesson has been removed from the section."
    });
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 2MB.",
          variant: "destructive"
        });
        return;
      }

      setCourseData({ 
        ...courseData, 
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file)
      });
      
      toast({
        title: "Image uploaded",
        description: "Course thumbnail has been updated."
      });
    }
  };

  const handleAddExternalLink = () => {
    if (newLinkTitle.trim() && newLinkUrl.trim()) {
      const newLink: ExternalLink = {
        id: `link_${Date.now()}`,
        title: newLinkTitle.trim(),
        url: newLinkUrl.trim()
      };
      setExternalLinks([...externalLinks, newLink]);
      setNewLinkTitle('');
      setNewLinkUrl('');
      toast({
        title: "Link added",
        description: "External resource has been added to your course."
      });
    }
  };

  const handleDeleteExternalLink = (linkId: string) => {
    setExternalLinks(externalLinks.filter(link => link.id !== linkId));
    toast({
      title: "Link removed",
      description: "External resource has been removed."
    });
  };

  const handleFileUpload = (type: 'documents' | 'videos' | 'code' | 'assets') => {
    // Simulated file upload - in real implementation, this would upload to storage
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Upload successful",
        description: `${type} have been uploaded to your course resources.`
      });
    }, 2000);
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Your course progress has been saved as a draft."
    });
  };

  const handlePublishCourse = async () => {
    try {
      setIsUploading(true);
      
      // Validate required fields
      if (!courseData.title || !courseData.description || !courseData.category || !courseData.difficulty) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields before publishing.",
          variant: "destructive"
        });
        return;
      }

      // Prepare course data for submission
      const coursePayload = {
        title: courseData.title,
        description: courseData.description,
        short_description: courseData.description.substring(0, 500), // Truncate for short description
        category_id: parseInt(courseData.category), // Convert to number if needed
        level: courseData.difficulty,
        price: parseFloat(courseData.price) || 0,
        duration: courseData.duration || "4 weeks",
        thumbnail: courseData.thumbnail, // File object or null
        tags: courseData.tags,
        learning_objectives: [], // TODO: Add learning objectives from form
        prerequisites: [], // TODO: Add prerequisites from form
        status: 'published',
        is_featured: false,
        video_preview: "", // TODO: Add if you have video preview functionality
      };

      const response = await teacherApi.createCourse(coursePayload);
      
      toast({
        title: "Course published!",
        description: `"${courseData.title}" is now live and available to students.`
      });

      // Reset form or redirect
      // You might want to redirect to the course management page
      console.log('Course created:', response);
      
    } catch (error: any) {
      console.error('Error creating course:', error);
      toast({
        title: "Failed to publish course",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
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
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    {courseData.thumbnailPreview ? (
                      <div className="space-y-4">
                        <img 
                          src={courseData.thumbnailPreview} 
                          alt="Course thumbnail" 
                          className="mx-auto h-32 w-48 object-cover rounded"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => setCourseData({ ...courseData, thumbnail: null, thumbnailPreview: null })}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div className="mt-2">
                          <Button variant="outline" onClick={() => document.getElementById('thumbnail-upload')?.click()}>
                            Upload Image
                          </Button>
                          <input
                            id="thumbnail-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleThumbnailUpload}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          PNG, JPG up to 2MB
                        </p>
                      </>
                    )}
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
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-medium">No sections yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first section.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sections.map((section) => (
                      <Card key={section.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSections(sections.map(s => 
                                    s.id === section.id ? { ...s, isCollapsed: !s.isCollapsed } : s
                                  ));
                                }}
                              >
                                {section.isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                              <Input
                                value={section.title}
                                onChange={(e) => {
                                  setSections(sections.map(s => 
                                    s.id === section.id ? { ...s, title: e.target.value } : s
                                  ));
                                }}
                                className="font-semibold border-none p-0 h-auto"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleAddLesson(section.id)}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add Lesson
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteSection(section.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        {!section.isCollapsed && (
                          <CardContent>
                            {section.lessons.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No lessons in this section yet.</p>
                            ) : (
                              <div className="space-y-4">
                                {section.lessons.map((lesson) => (
                                  <LessonEditor
                                    key={lesson.id}
                                    lesson={lesson}
                                    onUpdate={(updatedLesson) => handleUpdateLesson(section.id, updatedLesson)}
                                    onDelete={() => handleDeleteLesson(section.id, lesson.id)}
                                  />
                                ))}
                              </div>
                            )}
                          </CardContent>
                        )}
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
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => handleFileUpload('documents')}
                      disabled={isUploading}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload Documents'}
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
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => handleFileUpload('videos')}
                        disabled={isUploading}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        {isUploading ? 'Uploading...' : 'Upload Videos'}
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">MP4, AVI, MOV</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Terminal className="h-5 w-5 mr-2" />
                    Code & Projects
                  </CardTitle>
                  <CardDescription>Share code examples and project files</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => handleFileUpload('code')}
                      disabled={isUploading}
                    >
                      <Terminal className="h-4 w-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload Code Files'}
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
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => handleFileUpload('assets')}
                      disabled={isUploading}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload Assets'}
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
                    <Input 
                      placeholder="Link title" 
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                    />
                    <Input 
                      placeholder="URL" 
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleAddExternalLink}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {externalLinks.map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{link.title}</div>
                          <div className="text-sm text-muted-foreground">{link.url}</div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteExternalLink(link.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
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
              <h2 className="text-2xl font-bold mb-4">Interactive Simulators</h2>
              <p className="text-muted-foreground">Enable interactive learning tools for your course.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <CircuitBoard className="h-6 w-6" />
                    <div>
                      <CardTitle>Circuit Simulator</CardTitle>
                      <CardDescription>Interactive circuit design and simulation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label>Enable for students</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label>Real-time collaboration</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Terminal className="h-6 w-6" />
                    <div>
                      <CardTitle>Arduino Playground</CardTitle>
                      <CardDescription>Microcontroller programming environment</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label>Enable for students</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label>Code sharing</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Cog className="h-6 w-6" />
                    <div>
                      <CardTitle>ROS Environment</CardTitle>
                      <CardDescription>Robot Operating System playground</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label>Enable for students</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch />
                      <Label>Advanced features</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Monitor className="h-6 w-6" />
                    <div>
                      <CardTitle>2D Robot Simulator</CardTitle>
                      <CardDescription>2D robot navigation and control</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label>Enable for students</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label>Multi-language support</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Course Summary</CardTitle>
                <CardDescription>Review your course details before publishing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Course Title</Label>
                      <p className="font-medium">{courseData.title || 'Not set'}</p>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <p className="font-medium">{courseData.category || 'Not set'}</p>
                    </div>
                    <div>
                      <Label>Difficulty</Label>
                      <p className="font-medium">{courseData.difficulty || 'Not set'}</p>
                    </div>
                    <div>
                      <Label>Price</Label>
                      <p className="font-medium">${courseData.price || '0'}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Sections & Lessons</Label>
                    <p className="font-medium">
                      {sections.length} sections, {sections.reduce((total, section) => total + section.lessons.length, 0)} lessons
                    </p>
                  </div>
                  <div>
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {courseData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
          <p className="text-muted-foreground">Build an engaging robotics course with interactive lessons and simulations.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            
            {currentStep === totalSteps ? (
              <Button onClick={handlePublishCourse} disabled={isUploading}>
                <Send className="h-4 w-4 mr-2" />
                {isUploading ? 'Publishing...' : 'Publish Course'}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}