import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('taskflow_user', JSON.stringify(res.user));
          }
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          localStorage.removeItem('taskflow_token');
          localStorage.removeItem('taskflow_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Register
  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const data = await authService.register({ name, email, password });
      if (data.token && data.user) {
        localStorage.setItem('taskflow_token', data.token);
        localStorage.setItem('taskflow_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      }
      return { success: true, message: data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  // Login
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const data = await authService.login({ email, password });
      if (data.token && data.user) {
        localStorage.setItem('taskflow_token', data.token);
        localStorage.setItem('taskflow_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      }
      return { success: true, message: data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  // Logout
  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const data = await authService.updateProfile(profileData);
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('taskflow_user', JSON.stringify(data.user));
      }
      return { success: true, message: data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Profile update failed.';
      return { success: false, message: msg };
    }
  };

  const value = {
    user,
    token,
    loading,
    authError,
    isAuthenticated: !!token && !!user,
    register,
    login,
    logout,
    updateProfile,
    clearError: () => setAuthError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
