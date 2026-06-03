import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../lib/axiosClient';

interface UserProfile {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  bio?: string;
  title?: string;
  skills: string[];
  organization?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'BUSINESS' | 'ADMIN';
  isVerified: boolean;
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (payload: any) => Promise<any>;
  logout: () => Promise<void>;
  updateUserProfile: (profileData: any) => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        // Try to run silent refresh in case we have refresh cookies
        const refreshResponse = await axiosClient.post('/auth/refresh');
        const { accessToken: newAccess, user: loggedUser } = refreshResponse.data.data;
        localStorage.setItem('accessToken', newAccess);
        setUser(loggedUser);
      } else {
        const response = await axiosClient.get('/users/me');
        setUser(response.data.data);
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for auth-expired event from Axios client
    const handleAuthExpired = () => {
      setUser(null);
      localStorage.removeItem('accessToken');
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      const { accessToken, user: loggedUser } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      setUser(loggedUser);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Login failed';
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.post('/auth/register', payload);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Registration failed';
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await axiosClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout request failed', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (profileData: any) => {
    try {
      const response = await axiosClient.put('/users/profile', profileData);
      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          profile: response.data.data,
        };
      });
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to update profile';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUserProfile,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
