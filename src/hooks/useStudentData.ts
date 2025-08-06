// src/hooks/useStudentData.ts
// Custom hooks for student data management

import { useState, useEffect } from 'react';
import { studentsApi } from '@/lib/api';

// Hook for dashboard data
export const useStudentDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiData = await studentsApi.getDashboard();
      
      const transformedData = {
        user: {
          id: apiData.user.id,
          email: apiData.user.email,
          name: apiData.user.name,
          role: apiData.user.role,
          avatar: apiData.user.avatar,
          createdAt: new Date(apiData.user.created_at)
        },
        progress: {
          totalPoints: apiData.progress.total_points,
          level: apiData.progress.level,
          completedCourses: apiData.progress.completed_courses,
          enrolledCourses: apiData.progress.enrolled_courses,
          studyTime: apiData.progress.study_time,
          badges: apiData.progress.badges_count
        },
        recentCourses: apiData.recent_courses.map((sc: any) => ({
          id: sc.id,
          course: {
            id: sc.course.id,
            title: sc.course.title,
            description: sc.course.description,
            teacherId: sc.course.teacher_id,
            teacherName: sc.course.teacher_name,
            price: sc.course.price,
            duration: sc.course.duration,
            level: sc.course.level,
            category: sc.course.category,
            thumbnail: sc.course.thumbnail || '/placeholder-course.jpg',
            rating: sc.course.rating,
            studentsCount: sc.course.students_count,
            tags: sc.course.tags,
            modules: sc.course.modules
          },
          status: sc.status,
          progressPercentage: sc.progress_percentage,
          enrolledAt: new Date(sc.enrolled_at),
          completedAt: sc.completed_at ? new Date(sc.completed_at) : undefined
        })),
        badges: apiData.badges.map((badge: any) => ({
          id: badge.badge_id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          earnedAt: new Date(badge.earned_at)
        })),
        activities: apiData.recent_activities.map((activity: any) => ({
          id: activity.id,
          type: activity.activity_type,
          description: activity.description,
          pointsEarned: activity.points_earned,
          timestamp: new Date(activity.timestamp)
        }))
      };
      
      setData(transformedData);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { data, isLoading, error, refetch: fetchDashboard };
};

// Hook for student courses
export const useStudentCourses = (status?: string) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiData = await studentsApi.getStudentCourses(status);
      const transformedCourses = apiData.map((sc: any) => ({
        id: sc.id,
        course: {
          id: sc.course.id,
          title: sc.course.title,
          description: sc.course.description,
          teacherId: sc.course.teacher_id,
          teacherName: sc.course.teacher_name,
          price: sc.course.price,
          duration: sc.course.duration,
          level: sc.course.level,
          category: sc.course.category,
          thumbnail: sc.course.thumbnail || '/placeholder-course.jpg',
          rating: sc.course.rating,
          studentsCount: sc.course.students_count,
          tags: sc.course.tags,
          modules: sc.course.modules
        },
        status: sc.status,
        progressPercentage: sc.progress_percentage,
        enrolledAt: new Date(sc.enrolled_at),
        completedAt: sc.completed_at ? new Date(sc.completed_at) : undefined
      }));
      setCourses(transformedCourses);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching student courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentCourses();
  }, [status]);

  const enrollInCourse = async (courseId: string) => {
    try {
      await studentsApi.enrollCourse(courseId);
      await fetchStudentCourses();
      return true;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { 
    courses, 
    isLoading, 
    error, 
    refetch: fetchStudentCourses,
    enrollInCourse
  };
};

// Hook for all courses (marketplace)
export const useCourses = (params?: {
  category?: string;
  level?: string;
  search?: string;
}) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiData = await studentsApi.getCourses(params);
      const transformedCourses = apiData.results.map((course: any) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        teacherId: course.teacher_id,
        teacherName: course.teacher_name,
        price: course.price,
        duration: course.duration,
        level: course.level,
        category: course.category,
        thumbnail: course.thumbnail || '/placeholder-course.jpg',
        rating: course.rating,
        studentsCount: course.students_count,
        tags: course.tags,
        modules: course.modules
      }));
      setCourses(transformedCourses);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [params]);

  return { courses, isLoading, error, refetch: fetchCourses };
};