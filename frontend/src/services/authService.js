import api from './api';

export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login existing user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current authenticated user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignored if network issue, local cleanup is what matters
    }
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
  },
};
