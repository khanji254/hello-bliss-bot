// src/lib/api.ts
// API Service for Students Backend Integration

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// API Helper Function (similar to your AuthContext)
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

// File upload helper (for FormData requests)
const apiFileUpload = async (endpoint: string, formData: FormData) => {
  const token = localStorage.getItem('accessToken');
  
  const config: RequestInit = {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Don't set Content-Type for FormData - browser will set it with boundary
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
      
      console.error('API Upload Error:', {
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

// Authentication & Profile API Functions
export const authApi = {
  // Get full profile data
  getProfile: async () => {
    return await apiCall('/auth/profile/');
  },

  // Update full profile
  updateProfile: async (profileData: any) => {
    return await apiCall('/auth/profile/update/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Update basic profile (for onboarding)
  updateBasicProfile: async (profileData: any) => {
    return await apiCall('/auth/profile/basic/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences: any) => {
    return await apiCall('/auth/profile/notifications/', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },

  // Update privacy settings
  updatePrivacySettings: async (settings: any) => {
    return await apiCall('/auth/profile/privacy/', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Upload avatar (proper file upload)
  uploadAvatar: async (formData: FormData) => {
    return await apiFileUpload('/auth/profile/avatar/', formData);
  },

  // Upload avatar by URL (if you have an external URL)
  uploadAvatarByUrl: async (avatarUrl: string) => {
    return await apiCall('/auth/profile/avatar/', {
      method: 'POST',
      body: JSON.stringify({ avatar: avatarUrl }),
    });
  },

  // Delete avatar
  deleteAvatar: async () => {
    return await apiCall('/auth/profile/avatar/', {
      method: 'DELETE',
    });
  },

  // Generate avatar placeholder URL
  generateAvatarUrl: (name: string, backgroundColor?: string) => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    const bgColor = backgroundColor || '3B82F6'; // Default blue
    const textColor = 'FFFFFF';
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=${textColor}&size=200&font-size=0.6`;
  },
};

// Students API Functions
export const studentsApi = {
  // Get student dashboard data
  getDashboard: async () => {
    return await apiCall('/students/dashboard/');
  },

  // Get all available courses
  getCourses: async (params?: {
    category?: string;
    level?: string;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.level) searchParams.set('level', params.level);
    if (params?.search) searchParams.set('search', params.search);
    
    const queryString = searchParams.toString();
    return await apiCall(`/students/courses/${queryString ? `?${queryString}` : ''}`);
  },

  // Get course details
  getCourseById: async (courseId: string) => {
    return await apiCall(`/students/courses/${courseId}/`);
  },

  // Get student's enrolled courses
  getStudentCourses: async (status?: string) => {
    const queryString = status ? `?status=${status}` : '';
    return await apiCall(`/students/my-courses/${queryString}`);
  },

  // Enroll in a course
  enrollCourse: async (courseId: string) => {
    return await apiCall('/students/enroll/', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId }),
    });
  },

  // Get course progress
  getCourseProgress: async (courseId: string) => {
    return await apiCall(`/students/course-progress/${courseId}/`);
  },

  // Update module progress
  updateModuleProgress: async (data: {
    module_id: string;
    completed: boolean;
    score?: number;
    time_spent: number;
  }) => {
    return await apiCall('/students/update-progress/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
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