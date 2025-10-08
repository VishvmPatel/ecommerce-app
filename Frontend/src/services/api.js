const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Product APIs
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetchData(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id) {
    return this.fetchData(`/products/${id}`);
  }

  async getProductsByCategory(category, limit = 8) {
    return this.fetchData(`/products/category/${category}?limit=${limit}`);
  }

  async getProductsByGender(gender, limit = 8) {
    return this.fetchData(`/products?gender=${gender}&limit=${limit}`);
  }

  async searchProducts(query, limit = 12) {
    return this.fetchData(`/products/search/${encodeURIComponent(query)}?limit=${limit}`);
  }

  async getSaleProducts(limit = 12) {
    return this.fetchData(`/products/sale/items?limit=${limit}`);
  }

  async getFeaturedProducts(limit = 8) {
    return this.fetchData(`/products/featured/items?limit=${limit}`);
  }

  async getNewProducts(limit = 8) {
    return this.fetchData(`/products/new/items?limit=${limit}`);
  }

  async getFilterOptions() {
    return this.fetchData('/products/filters/options');
  }

  async addProductReview(productId, reviewData) {
    return this.fetchData(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  // User APIs
  async registerUser(userData) {
    return this.fetchData('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async loginUser(credentials) {
    return this.fetchData('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async getUserProfile(token) {
    return this.fetchData('/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async updateUserProfile(profileData, token) {
    return this.fetchData('/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
  }

  async addToWishlist(productId, token) {
    return this.fetchData(`/users/wishlist/${productId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async removeFromWishlist(productId, token) {
    return this.fetchData(`/users/wishlist/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Order APIs
  async createOrder(orderData, token) {
    return this.fetchData('/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
  }

  async getUserOrders(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetchData(`/orders${queryString ? `?${queryString}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async getOrder(orderId, token) {
    return this.fetchData(`/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async cancelOrder(orderId, reason, token) {
    return this.fetchData(`/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reason })
    });
  }

  // Health check
  async healthCheck() {
    return this.fetchData('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
