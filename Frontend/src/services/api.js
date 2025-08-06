import axios from 'axios';

const BACKEND_API = import.meta.env.VITE_BACKEND_API || 'https://ecommerce-9vbo.onrender.com/';

class ApiService {
  constructor() {
    this.baseURL = BACKEND_API;
    console.log('API Base URL:', this.baseURL); // Debug log
    
    // Create axios instance
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        console.error('API request failed:', error);
        if (error.response) {
          // Server responded with error status
          throw new Error(error.response.data?.message || `HTTP error! status: ${error.response.status}`);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error('Network error: No response received');
        } else {
          // Something else happened
          throw new Error('Request setup error');
        }
      }
    );
  }

  // Helper method to get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Helper method to set auth token in localStorage
  setAuthToken(token) {
    localStorage.setItem('token', token);
  }

  // Helper method to remove auth token from localStorage
  removeAuthToken() {
    localStorage.removeItem('token');
  }

  // Authentication methods
  async register(userData) {
    return this.api.post('/api/auth/register', userData);
  }

  async login(credentials) {
    return this.api.post('/api/auth/login', credentials);
  }

  async getProfile() {
    return this.api.get('/api/auth/profile');
  }

  async updateProfile(profileData) {
    return this.api.put('/api/auth/profile', profileData);
  }

  async changePassword(passwordData) {
    return this.api.put('/api/auth/change-password', passwordData);
  }

  async getPurchaseHistory() {
    return this.api.get('/api/auth/purchase-history');
  }

  // Admin methods
  async getAllUsers(page = 1, limit = 10) {
    return this.api.get(`/api/auth/users?page=${page}&limit=${limit}`);
  }

  async getUserById(userId) {
    return this.api.get(`/api/auth/users/${userId}`);
  }

  async toggleUserBlock(userId, isBlocked) {
    return this.api.put(`/api/auth/users/${userId}/block`, { isBlocked });
  }

  async changeUserRole(userId, role) {
    return this.api.put(`/api/auth/users/${userId}/role`, { role });
  }

  async deleteUser(userId) {
    return this.api.delete(`/api/auth/users/${userId}`);
  }

  // Health check
  async healthCheck() {
    return this.api.get('/api/health');
  }
}

export default new ApiService(); 