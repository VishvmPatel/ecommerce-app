const API_BASE_URL = 'http://localhost:5000/api';

class AuthService {
  // Generic fetch method
  async fetchData(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Auth API Error:', error);
      throw error;
    }
  }

  // Register a new user
  async register(userData) {
    return this.fetchData('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // Login user
  async login(email, password) {
    return this.fetchData('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  // Logout user
  async logout() {
    const token = this.getToken();
    if (!token) {
      return { success: true, message: 'Already logged out' };
    }

    try {
      const result = await this.fetchData('/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Remove token from localStorage regardless of API response
      this.removeToken();
      return result;
    } catch (error) {
      // Even if API call fails, remove token locally
      this.removeToken();
      return { success: true, message: 'Logged out locally' };
    }
  }

  // Get current user
  async getCurrentUser() {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    return this.fetchData('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Update user profile
  async updateProfile(profileData) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    return this.fetchData('/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    return this.fetchData('/auth/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }

  // Token management
  getToken() {
    return localStorage.getItem('authToken');
  }

  setToken(token) {
    localStorage.setItem('authToken', token);
  }

  removeToken() {
    localStorage.removeItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Basic JWT token validation (check if it's not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      // If token is malformed, remove it
      this.removeToken();
      return false;
    }
  }

  // Get user info from token (without API call)
  getUserFromToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user;
    } catch (error) {
      return null;
    }
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePassword(password) {
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers,
      errors: {
        minLength: !minLength ? 'Password must be at least 6 characters' : null,
        hasUpperCase: !hasUpperCase ? 'Password must contain uppercase letter' : null,
        hasLowerCase: !hasLowerCase ? 'Password must contain lowercase letter' : null,
        hasNumbers: !hasNumbers ? 'Password must contain a number' : null
      }
    };
  }

  // Validate phone number
  validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
