// src/contexts/AuthContext.tsx
// Complete authentication context with all features

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ requiresVerification: boolean; email: string }>;
  verifyOTP: (email: string, otpCode: string, purpose: string) => Promise<void>;
  resendOTP: (email: string, purpose: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otpCode: string, newPassword: string, confirmPassword: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
  requestEmailChange: (newEmail: string) => Promise<{ newEmail: string }>;
  verifyEmailChange: (newEmail: string, otpCode: string) => Promise<void>;
  deleteAccount: (password: string, confirmation: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Enhanced API Helper Functions
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
      // Extract the most specific error message
      let errorMessage = 'Request failed';
      
      if (data.error) {
        errorMessage = data.error;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.detail) {
        errorMessage = data.detail;
      } else if (data.non_field_errors) {
        errorMessage = Array.isArray(data.non_field_errors) 
          ? data.non_field_errors.join(', ')
          : data.non_field_errors;
      } else if (typeof data === 'string') {
        errorMessage = data;
      } else if (data.email && Array.isArray(data.email)) {
        errorMessage = `Email: ${data.email.join(', ')}`;
      } else if (data.password && Array.isArray(data.password)) {
        errorMessage = `Password: ${data.password.join(', ')}`;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token on mount
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Optionally verify token with backend
        verifyToken();
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
      }
    }
    setIsLoading(false);
  }, []);

  const verifyToken = async () => {
    try {
      const response = await apiCall('/auth/profile/');
      setUser(response);
      localStorage.setItem('userData', JSON.stringify(response));
    } catch (error) {
      // Token is invalid, clear storage
      console.error('Token verification failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiCall('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Store tokens and user data
      localStorage.setItem('accessToken', response.tokens.access);
      localStorage.setItem('refreshToken', response.tokens.refresh);
      localStorage.setItem('userData', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      throw error; // Re-throw with preserved error message
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const response = await apiCall('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          password_confirm: password,
          role 
        }),
      });

      return {
        requiresVerification: response.requires_verification || true,
        email: response.email
      };
    } catch (error) {
      throw error; // Re-throw with preserved error message
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, otpCode: string, purpose: string) => {
    setIsLoading(true);
    try {
      const response = await apiCall('/auth/verify-otp/', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          otp_code: otpCode, 
          purpose 
        }),
      });

      // If verification is successful and includes tokens (for registration)
      if (response.tokens) {
        localStorage.setItem('accessToken', response.tokens.access);
        localStorage.setItem('refreshToken', response.tokens.refresh);
        localStorage.setItem('userData', JSON.stringify(response.user));
        setUser(response.user);
      }

      return response;
    } catch (error) {
      throw error; // Re-throw with preserved error message
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (email: string, purpose: string) => {
    try {
      await apiCall('/auth/resend-otp/', {
        method: 'POST',
        body: JSON.stringify({ email, purpose }),
      });
    } catch (error) {
      throw error; // Re-throw with preserved error message
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await apiCall('/auth/forgot-password/', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string, otpCode: string, newPassword: string, confirmPassword: string) => {
    try {
      await apiCall('/auth/reset-password/', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          otp_code: otpCode, 
          purpose: 'password_reset',
          new_password: newPassword,
          confirm_password: confirmPassword
        }),
      });
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      await apiCall('/auth/change-password/', {
        method: 'POST',
        body: JSON.stringify({ 
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword
        }),
      });
    } catch (error) {
      throw error;
    }
  };

  const requestEmailChange = async (newEmail: string) => {
    try {
      const response = await apiCall('/auth/request-email-change/', {
        method: 'POST',
        body: JSON.stringify({ new_email: newEmail }),
      });
      return { newEmail: response.new_email };
    } catch (error) {
      throw error;
    }
  };

  const verifyEmailChange = async (newEmail: string, otpCode: string) => {
    try {
      const response = await apiCall('/auth/verify-email-change/', {
        method: 'POST',
        body: JSON.stringify({ 
          new_email: newEmail,
          otp_code: otpCode
        }),
      });
      
      // Update user data with new email
      if (response.user) {
        localStorage.setItem('userData', JSON.stringify(response.user));
        setUser(response.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async (password: string, confirmation: string) => {
    try {
      await apiCall('/auth/delete-account/', {
        method: 'DELETE',
        body: JSON.stringify({ 
          password,
          confirmation
        }),
      });
      
      // Clear all data after successful deletion
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiCall('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      }
    } catch (error) {
      // Even if logout request fails, clear local storage
      console.error('Logout request failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      verifyOTP,
      resendOTP,
      forgotPassword,
      resetPassword,
      changePassword,
      requestEmailChange,
      verifyEmailChange,
      deleteAccount,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};