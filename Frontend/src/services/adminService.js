import apiService from './api';

class AdminService {
  // Dashboard Statistics
  async getDashboardStats() {
    return apiService.fetchData('/admin/dashboard/stats');
  }

  // User Management
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiService.fetchData(`/admin/users${queryString ? `?${queryString}` : ''}`);
  }

  async updateUserRole(userId, role) {
    return apiService.fetchData(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
  }

  // Product Management
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiService.fetchData(`/admin/products${queryString ? `?${queryString}` : ''}`);
  }

  async createProduct(productData) {
    return apiService.fetchData('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(productId, productData) {
    return apiService.fetchData(`/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }

  async deleteProduct(productId) {
    return apiService.fetchData(`/admin/products/${productId}`, {
      method: 'DELETE'
    });
  }

  // Order Management
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiService.fetchData(`/admin/orders${queryString ? `?${queryString}` : ''}`);
  }

  async updateOrderStatus(orderId, status) {
    return apiService.fetchData(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // Review Management
  async getReviews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiService.fetchData(`/admin/reviews${queryString ? `?${queryString}` : ''}`);
  }

  async updateReviewStatus(reviewId, status) {
    return apiService.fetchData(`/admin/reviews/${reviewId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }
}

const adminService = new AdminService();
export default adminService;
