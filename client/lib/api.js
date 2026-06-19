import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api/chat`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to outgoing requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.error || error.message);
    throw error;
  }
);

export const chatAPI = {
  // Create a new session
  createNewSession: async () => {
    try {
      const response = await api.post('/session/new');
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create session');
    }
  },

  // Submit user answer
  submitAnswer: async (sessionId, userMessage) => {
    try {
      const response = await api.post('/submit', {
        sessionId,
        userMessage,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to submit answer');
    }
  },

  // Get specific session
  getSession: async (sessionId) => {
    try {
      const response = await api.get(`/session/${sessionId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch session');
    }
  },

  // Get all sessions
  getAllSessions: async () => {
    try {
      const response = await api.get('/sessions');
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch sessions');
    }
  },

  // Get session transcript
  getSessionTranscript: async (sessionId) => {
    try {
      const response = await api.get(`/session/${sessionId}/transcript`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch transcript');
    }
  },
};

export default api;
