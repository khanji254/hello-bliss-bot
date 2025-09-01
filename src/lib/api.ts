// src/lib/api.ts
// Enhanced API Service with Full Course Integration

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// API Helper Function
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      let errorMessage = 'Request failed';
      
      if (data.error) {
        errorMessage = data.error;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.detail) {
        errorMessage = data.detail;
      }
      
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        endpoint: endpoint
      });
      
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Make sure the backend is running on http://127.0.0.1:8000');
    }
    throw error;
  }
};

// File upload helper
const apiFileUpload = async (endpoint: string, formData: FormData) => {
  const token = localStorage.getItem('accessToken');
  
  const config: RequestInit = {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      
      if (data.error) {
        errorMessage = data.error;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.detail) {
        errorMessage = data.detail;
      }
      
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Make sure the backend is running on http://127.0.0.1:8000');
    }
    throw error;
  }
};

// ============================================================================
// COURSES API - Complete Integration
// ============================================================================

export const coursesApi = {
  // Get all categories
  getCategories: async () => {
    return await apiCall('/courses/categories/');
  },

  // Get all courses with filters
  getCourses: async (params?: {
    category?: string;
    level?: string;
    search?: string;
    ordering?: string;
    page?: number;
  }) => {
    const searchParams = new URLSearchParams();
    
    if (params?.category && params.category !== 'all') {
      searchParams.set('category', params.category);
    }
    if (params?.level) searchParams.set('level', params.level);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.ordering) searchParams.set('ordering', params.ordering);
    if (params?.page) searchParams.set('page', params.page.toString());
    
    const queryString = searchParams.toString();
    return await apiCall(`/courses/courses/${queryString ? `?${queryString}` : ''}`);
  },

  // Get course details by slug
  getCourseBySlug: async (slug: string) => {
    return await apiCall(`/courses/courses/${slug}/`);
  },

  // Get marketplace overview
  getMarketplaceOverview: async () => {
    return await apiCall('/courses/marketplace/overview/');
  },

  // Get course statistics
  getCourseStats: async () => {
    return await apiCall('/courses/marketplace/stats/');
  },

  // Get course suggestions
  getCourseSuggestions: async () => {
    return await apiCall('/courses/courses/suggestions/');
  },

  // Advanced search
  searchCourses: async (params: {
    q?: string;
    category?: string;
    level?: string;
    min_rating?: number;
    max_price?: number;
    sort_by?: string;
    page?: number;
  }) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, value.toString());
      }
    });
    
    const queryString = searchParams.toString();
    return await apiCall(`/courses/search/${queryString ? `?${queryString}` : ''}`);
  },

  // Student enrollment
  enrollInCourse: async (courseId: string) => {
    return await apiCall(`/courses/courses/${courseId}/enroll/`, {
      method: 'POST',
    });
  },

  // Check enrollment status
  getEnrollmentStatus: async (courseId: string) => {
    return await apiCall(`/courses/courses/${courseId}/enrollment-status/`);
  },

  // Get student's enrollments
  getMyEnrollments: async () => {
    return await apiCall('/courses/enrollments/');
  },

  // Course reviews
  getCourseReviews: async (courseId: string) => {
    return await apiCall(`/courses/courses/${courseId}/reviews/`);
  },

  // Add course review
  addCourseReview: async (courseId: string, reviewData: {
    rating: number;
    title?: string;
    comment?: string;
  }) => {
    return await apiCall(`/courses/courses/${courseId}/reviews/`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },
};

// ============================================================================
// TEACHER API - Course Management
// ============================================================================

export const teacherApi = {
  // Get teacher's courses
  getMyCourses: async () => {
    return await apiCall('/courses/teacher/courses/');
  },

  // Create new course with file upload support
  createCourse: async (courseData: any) => {
    // Check if there's a thumbnail file to upload
    if (courseData.thumbnail instanceof File) {
      const formData = new FormData();
      
      // Add all course data to FormData
      Object.keys(courseData).forEach(key => {
        if (key === 'tags' || key === 'learning_objectives' || key === 'prerequisites') {
          // Send arrays as JSON strings
          formData.append(key, JSON.stringify(courseData[key]));
        } else if (courseData[key] !== null && courseData[key] !== undefined) {
          formData.append(key, courseData[key]);
        }
      });
      
      return await apiFileUpload('/courses/teacher/courses/', formData);
    } else {
      // No file upload, use regular JSON
      return await apiCall('/courses/teacher/courses/', {
        method: 'POST',
        body: JSON.stringify(courseData),
      });
    }
  },

  // Update course with file upload support
  updateCourse: async (courseId: string, courseData: any) => {
    // Check if there's a thumbnail file to upload
    if (courseData.thumbnail instanceof File) {
      const formData = new FormData();
      
      // Add all course data to FormData
      Object.keys(courseData).forEach(key => {
        if (key === 'tags' || key === 'learning_objectives' || key === 'prerequisites') {
          // Send arrays as JSON strings
          formData.append(key, JSON.stringify(courseData[key]));
        } else if (courseData[key] !== null && courseData[key] !== undefined) {
          formData.append(key, courseData[key]);
        }
      });
      
      const token = localStorage.getItem('accessToken');
      
      const config: RequestInit = {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      };

      const response = await fetch(`${API_BASE_URL}/courses/teacher/courses/${courseId}/`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Update failed');
      }

      return data;
    } else {
      // No file upload, use regular JSON
      return await apiCall(`/courses/teacher/courses/${courseId}/`, {
        method: 'PUT',
        body: JSON.stringify(courseData),
      });
    }
  },

  // Delete course
  deleteCourse: async (courseId: string) => {
    return await apiCall(`/courses/teacher/courses/${courseId}/`, {
      method: 'DELETE',
    });
  },

  // Get teacher dashboard stats
  getDashboardStats: async () => {
    return await apiCall('/courses/teacher/dashboard/stats/');
  },
};

// ============================================================================
// AUTHENTICATION API (Enhanced)
// ============================================================================

export const authApi = {
  // Get full profile data
  getProfile: async () => {
    return await apiCall('/auth/profile/');
  },

  // Update profile
  updateProfile: async (profileData: any) => {
    return await apiCall('/auth/profile/update/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Upload avatar
  uploadAvatar: async (formData: FormData) => {
    return await apiFileUpload('/auth/profile/avatar/', formData);
  },

  // Generate avatar placeholder URL
  generateAvatarUrl: (name: string, backgroundColor?: string) => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    const bgColor = backgroundColor || '3B82F6';
    const textColor = 'FFFFFF';
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=${textColor}&size=200&font-size=0.6`;
  },
};

// ============================================================================
// STUDENTS API (Enhanced with Real Backend)
// ============================================================================

export const studentsApi = {
  // Get student dashboard data
  getDashboard: async () => {
    return await apiCall('/students/dashboard/');
  },

  // Get student's enrolled courses (redirect to courses API)
  getStudentCourses: async (status?: string) => {
    return await coursesApi.getMyEnrollments();
  },

  // Enroll in course (redirect to courses API)
  enrollCourse: async (courseId: string) => {
    return await coursesApi.enrollInCourse(courseId);
  },

  // Get student badges
  getBadges: async () => {
    return await apiCall('/students/badges/');
  },

  // Get student activities
  getActivities: async () => {
    return await apiCall('/students/activities/');
  },
};