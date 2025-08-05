const BACKEND_API = import.meta.env.VITE_BACKEND_API || 'http://localhost:3000';

class ApiService {
  constructor() {
    this.baseURL = BACKEND_API;
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

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async getProfile() {
    return this.request('/api/auth/profile');
  }

  async updateProfile(profileData) {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async changePassword(passwordData) {
    return this.request('/api/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  }

  async getPurchaseHistory() {
    return this.request('/api/auth/purchase-history');
  }

  // Admin methods
  async getAllUsers(page = 1, limit = 10) {
    return this.request(`/api/auth/users?page=${page}&limit=${limit}`);
  }

  async getUserById(userId) {
    return this.request(`/api/auth/users/${userId}`);
  }

  async toggleUserBlock(userId, isBlocked) {
    return this.request(`/api/auth/users/${userId}/block`, {
      method: 'PUT',
      body: JSON.stringify({ isBlocked })
    });
  }

  async changeUserRole(userId, role) {
    return this.request(`/api/auth/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
  }

  async deleteUser(userId) {
    return this.request(`/api/auth/users/${userId}`, {
      method: 'DELETE'
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }
}

export default new ApiService(); 