const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  getAuthToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  async fetchData(endpoint, options = {}) {
    try {
      const token = this.getAuthToken();
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers,
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

  async createOrder(orderData) {
    return this.fetchData('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetchData(`/orders${queryString ? `?${queryString}` : ''}`);
  }

  async getOrder(orderId) {
    return this.fetchData(`/orders/${orderId}`);
  }

  async cancelOrder(orderId, reason) {
    return this.fetchData(`/orders/${orderId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
  }

  async getAddresses() {
    return this.fetchData('/addresses');
  }

  async addAddress(addressData) {
    return this.fetchData('/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData)
    });
  }

  async updateAddress(addressId, addressData) {
    return this.fetchData(`/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData)
    });
  }

  async deleteAddress(addressId) {
    return this.fetchData(`/addresses/${addressId}`, {
      method: 'DELETE'
    });
  }

  async setDefaultAddress(addressId) {
    return this.fetchData(`/addresses/${addressId}/default`, {
      method: 'PUT'
    });
  }

  async get(endpoint, options = {}) {
    return this.fetchData(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint, data, options = {}) {
    return this.fetchData(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  async put(endpoint, data, options = {}) {
    return this.fetchData(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  async delete(endpoint, options = {}) {
    return this.fetchData(endpoint, { method: 'DELETE', ...options });
  }

  async healthCheck() {
    return this.fetchData('/health');
  }
}

const apiService = new ApiService();
export default apiService;
