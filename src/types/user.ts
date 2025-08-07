// src/types/user.ts
// Enhanced type definitions matching Django backend

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  avatar_url?: string; // Backend field
  createdAt: Date;
  created_at?: string; // Backend field
  is_verified?: boolean;
  is_active?: boolean;
}

export interface Student extends User {
  role: 'student';
  enrolledCourses: string[];
  completedCourses: string[];
  badges: Badge[];
  totalPoints: number;
  total_points?: number; // Backend field
  level: number;
}

export interface Teacher extends User {
  role: 'teacher';
  courses: string[];
  totalEarnings: number;
  total_earnings?: number; // Backend field
  rating: number;
  specializations: string[];
  verified: boolean;
  teacher_verified?: boolean; // Backend field
}

export interface Badge {
  id: string;
  badge_id?: string; // Backend field
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  earned_at?: string; // Backend field
  points_required?: number;
}

// Enhanced Course interface matching Django model
export interface Course {
  id: string;
  title: string;
  slug?: string;
  description: string;
  short_description?: string;
  teacherId: string;
  teacher_id?: string; // Backend field
  teacherName: string;
  teacher_name?: string; // Backend field
  teacher_avatar?: string;
  price: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string; // Now supports any category from backend
  category_name?: string; // Backend field
  thumbnail: string;
  thumbnail_url?: string; // Backend field
  video_preview?: string;
  rating: number;
  studentsCount: number;
  students_count?: number; // Backend field
  modules: CourseModule[];
  tags: string[];
  learning_objectives?: string[];
  prerequisites?: string[];
  status?: 'draft' | 'published' | 'archived';
  is_featured?: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  total_duration_minutes?: number;
  is_enrolled?: boolean;
  enrollment_details?: EnrollmentDetails;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'simulation' | 'quiz' | 'assignment' | 'reading';
  duration: number; // in minutes
  order?: number;
  completed?: boolean;
  content?: any;
  video_url?: string;
  resources?: any[];
  is_preview?: boolean;
  is_active?: boolean;
}

// Course enrollment interface
export interface CourseEnrollment {
  id: string;
  course: Course;
  course_id?: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped' | 'refunded';
  progress_percentage: number;
  amount_paid: number;
  enrolled_at: Date;
  started_at?: Date;
  completed_at?: Date;
  certificate_issued?: boolean;
  certificate_url?: string;
}

export interface EnrollmentDetails {
  status: string;
  progress_percentage: number;
  enrolled_at: string;
  started_at?: string;
  completed_at?: string;
}

// Course category interface
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  is_active?: boolean;
  course_count?: number;
}

// Course review interface
export interface CourseReview {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  student_name: string;
  student_avatar?: string;
  helpful_votes: number;
  is_verified_purchase: boolean;
  created_at: string;
  updated_at: string;
}

// Module progress tracking
export interface ModuleProgress {
  module: CourseModule;
  completed: boolean;
  score?: number;
  time_spent: number; // in minutes
  attempts: number;
  started_at?: string;
  completed_at?: string;
  last_accessed: string;
}

// API Response interfaces
export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface MarketplaceOverview {
  featured_courses: Course[];
  popular_categories: Record<string, {
    name: string;
    course_count: number;
    icon?: string;
  }>;
  top_rated_courses: Course[];
  recent_courses: Course[];
}

export interface CourseStats {
  total_courses: number;
  total_students: number;
  total_enrollments: number;
  average_rating: number;
  categories_breakdown: Record<string, {
    name: string;
    count: number;
  }>;
  level_breakdown: Record<string, {
    name: string;
    count: number;
  }>;
}

export interface SearchCoursesResponse {
  courses: Course[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

// Teacher dashboard stats
export interface TeacherStats {
  total_courses: number;
  published_courses: number;
  draft_courses: number;
  total_students: number;
  total_enrollments: number;
  average_rating: number;
  total_earnings: number;
}

// Student activity
export interface StudentActivity {
  id: string;
  activity_type: 'login' | 'course_start' | 'module_complete' | 'course_complete' | 'badge_earned' | 'simulation_run';
  description: string;
  metadata?: any;
  points_earned: number;
  timestamp: Date;
}

// Student dashboard data
export interface StudentDashboard {
  user: User;
  progress: {
    total_points: number;
    level: number;
    completed_courses: number;
    enrolled_courses: number;
    study_time: number;
    badges_count: number;
  };
  recent_courses: CourseEnrollment[];
  badges: Badge[];
  activities: StudentActivity[];
}