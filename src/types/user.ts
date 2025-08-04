export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface Student extends User {
  role: 'student';
  enrolledCourses: string[];
  completedCourses: string[];
  badges: Badge[];
  totalPoints: number;
  level: number;
}

export interface Teacher extends User {
  role: 'teacher';
  courses: string[];
  totalEarnings: number;
  rating: number;
  specializations: string[];
  verified: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  price: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'circuits' | 'programming' | 'ros' | 'mechanics';
  thumbnail: string;
  rating: number;
  studentsCount: number;
  modules: CourseModule[];
  tags: string[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'simulation' | 'quiz' | 'assignment';
  duration: number;
  completed?: boolean;
  content?: any;
}