'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI_service } from '../../lib/authAPI';
import { toast } from 'sonner';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('[AuthContext] checkAuth started');
      try {
        const token = localStorage.getItem('token');
        console.log('[AuthContext] Token from localStorage:', token ? 'found' : 'not found');
        if (token) {
          console.log('[AuthContext] Fetching user data from /me...');
          const userData = await authAPI_service.getCurrentUser();
          console.log('[AuthContext] User data received:', userData);
          setUser(userData);
          setIsAuthenticated(true);
          console.log('[AuthContext] Authenticated = true');
        } else {
          console.log('[AuthContext] No token, user is not authenticated');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('[AuthContext] checkAuth error:', error.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        console.log('[AuthContext] checkAuth finished, loading = false');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (email, password, name) => {
    try {
      const result = await authAPI_service.register(email, password, name);
      setUser(result.user);
      setIsAuthenticated(true);
      toast.success('Account created successfully!');
      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const result = await authAPI_service.login(email, password);
      setUser(result.user);
      setIsAuthenticated(true);
      toast.success('Logged in successfully!');
      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI_service.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
