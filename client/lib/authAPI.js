import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const authAPI = axios.create({
  baseURL: `${API_URL}/api/auth`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
authAPI.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI_service = {
  // Register
  register: async (email, password, name) => {
    try {
      const response = await authAPI.post('/register', { email, password, name });
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const response = await authAPI.post('/login', { email, password });
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await authAPI.get('/me');
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch user');
    }
  },

  // Logout
  logout: async () => {
    try {
      await authAPI.post('/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
};

export default authAPI;
