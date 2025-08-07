// src/hooks/useStudentData.ts
// Fixed to handle the actual API response structure

import { useState, useEffect } from 'react';
import { studentsApi, coursesApi } from '@/lib/api';

// Hook for dashboard data
export const useStudentDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the raw API response
      const apiData = await studentsApi.getDashboard();
      console.log('Dashboard API response:', apiData); // Debug log
      
      // The API already returns the transformed data structure
      setData(apiData);
      
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

// Hook for student courses (enrolled courses)
export const useStudentCourses = (status?: string) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use students API for enrolled courses
      const apiData = await studentsApi.getStudentCourses(status);
      console.log('Student courses API response:', apiData); // Debug log
      
      // Check if apiData is an array, if not handle accordingly
      if (Array.isArray(apiData)) {
        setCourses(apiData);
      } else if (apiData && apiData.results && Array.isArray(apiData.results)) {
        // Handle paginated response
        setCourses(apiData.results);
      } else if (apiData && Array.isArray(apiData.data)) {
        // Handle wrapped response
        setCourses(apiData.data);
      } else {
        console.warn('Unexpected API response structure:', apiData);
        setCourses([]);
      }
      
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching student courses:', err);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentCourses();
  }, [status]);

  const enrollInCourse = async (courseId: string) => {
    try {
      await coursesApi.enrollInCourse(courseId);
      await fetchStudentCourses(); // Refresh the list
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
      
      const apiData = await coursesApi.getCourses(params);
      console.log('Courses API response:', apiData); // Debug log
      
      // Handle different response structures
      if (Array.isArray(apiData)) {
        setCourses(apiData);
      } else if (apiData && apiData.results && Array.isArray(apiData.results)) {
        // Handle paginated response
        setCourses(apiData.results);
      } else if (apiData && Array.isArray(apiData.data)) {
        // Handle wrapped response
        setCourses(apiData.data);
      } else {
        console.warn('Unexpected courses API response structure:', apiData);
        setCourses([]);
      }
      
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching courses:', err);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [params?.category, params?.level, params?.search]);

  return { courses, isLoading, error, refetch: fetchCourses };
};

// Hook for course enrollments specifically
export const useCourseEnrollments = () => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use courses API for enrollments
      const apiData = await coursesApi.getMyEnrollments();
      console.log('Enrollments API response:', apiData); // Debug log
      
      // Handle different response structures
      if (Array.isArray(apiData)) {
        setEnrollments(apiData);
      } else if (apiData && apiData.results && Array.isArray(apiData.results)) {
        setEnrollments(apiData.results);
      } else if (apiData && Array.isArray(apiData.data)) {
        setEnrollments(apiData.data);
      } else {
        console.warn('Unexpected enrollments API response structure:', apiData);
        setEnrollments([]);
      }
      
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching enrollments:', err);
      setEnrollments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return { enrollments, isLoading, error, refetch: fetchEnrollments };
};