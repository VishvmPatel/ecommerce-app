const API_BASE_URL = 'http://localhost:5000/api';

class AuthService {
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

  async register(userData) {
    return this.fetchData('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(email, password) {
    return this.fetchData('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

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
      
      this.removeToken();
      return result;
    } catch (error) {
      this.removeToken();
      return { success: true, message: 'Logged out locally' };
    }
  }

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

  getToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  setToken(token, rememberMe = false) {
    if (rememberMe) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('rememberMe', 'true');
    } else {
      sessionStorage.setItem('authToken', token);
      localStorage.removeItem('rememberMe');
    }
  }

  removeToken() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('rememberMe');
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      this.removeToken();
      return false;
    }
  }

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

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

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

  validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
  }
}

const authService = new AuthService();
export default authService;
