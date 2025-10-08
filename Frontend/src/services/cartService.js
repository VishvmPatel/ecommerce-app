const API_BASE_URL = 'http://localhost:5000/api';

class CartService {
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
      console.error('Cart API Error:', error);
      throw error;
    }
  }

  // Add item to cart (for logged-in users)
  async addToCart(productId, quantity = 1, token) {
    return this.fetchData('/cart/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity })
    });
  }

  // Get user's cart
  async getCart(token) {
    return this.fetchData('/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Update cart item quantity
  async updateCartItem(productId, quantity, token) {
    return this.fetchData(`/cart/items/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });
  }

  // Remove item from cart
  async removeFromCart(productId, token) {
    return this.fetchData(`/cart/items/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Clear entire cart
  async clearCart(token) {
    return this.fetchData('/cart/clear', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Sync local cart with server (for logged-in users)
  async syncCart(localCartItems, token) {
    return this.fetchData('/cart/sync', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items: localCartItems })
    });
  }

  // Calculate cart totals
  calculateCartTotals(items) {
    const subtotal = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    const discount = items.reduce((total, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return total + ((item.originalPrice - item.price) * item.quantity);
      }
      return total;
    }, 0);

    const tax = subtotal * 0.18; // 18% GST
    const shipping = subtotal > 2000 ? 0 : 100; // Free shipping above ₹2000
    const grandTotal = subtotal + tax + shipping - discount;

    return {
      subtotal: subtotal,
      discount: discount,
      tax: tax,
      shipping: shipping,
      grandTotal: grandTotal
    };
  }

  // Validate cart items (check stock, prices, etc.)
  async validateCartItems(items) {
    return this.fetchData('/cart/validate', {
      method: 'POST',
      body: JSON.stringify({ items })
    });
  }
}

// Create and export a singleton instance
const cartService = new CartService();
export default cartService;
