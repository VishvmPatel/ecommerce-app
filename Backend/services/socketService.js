class SocketService {
  constructor() {
    this.io = null;
  }

  setIO(io) {
    this.io = io;
  }

  emitToAdmin(event, data) {
    if (this.io) {
      this.io.to('admin-room').emit(event, {
        ...data,
        timestamp: new Date().toISOString()
      });
      console.log(`📡 Emitted ${event} to admin room:`, data);
    }
  }

  emitNewOrder(order) {
    this.emitToAdmin('new-order', {
      type: 'order',
      action: 'created',
      data: {
        orderId: order._id,
        customerName: order.shippingAddress?.name || 'Unknown',
        totalAmount: order.pricing?.total || 0,
        status: order.status,
        items: order.items?.length || 0
      }
    });
  }

  emitOrderUpdate(order) {
    this.emitToAdmin('order-updated', {
      type: 'order',
      action: 'updated',
      data: {
        orderId: order._id,
        status: order.status,
        customerName: order.shippingAddress?.name || 'Unknown',
        totalAmount: order.pricing?.total || 0
      }
    });
  }

  emitNewUser(user) {
    this.emitToAdmin('new-user', {
      type: 'user',
      action: 'registered',
      data: {
        userId: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        registrationDate: user.createdAt
      }
    });
  }

  emitProductView(productId, userId = null) {
    this.emitToAdmin('product-viewed', {
      type: 'product',
      action: 'viewed',
      data: {
        productId,
        userId,
        timestamp: new Date().toISOString()
      }
    });
  }

  emitCartActivity(userId, action, productName) {
    this.emitToAdmin('cart-activity', {
      type: 'cart',
      action: action,
      data: {
        userId,
        productName,
        timestamp: new Date().toISOString()
      }
    });
  }

  emitWishlistActivity(userId, action, productName) {
    this.emitToAdmin('wishlist-activity', {
      type: 'wishlist',
      action: action,
      data: {
        userId,
        productName,
        timestamp: new Date().toISOString()
      }
    });
  }

  emitReviewActivity(userId, productId, rating) {
    this.emitToAdmin('review-activity', {
      type: 'review',
      action: 'created',
      data: {
        userId,
        productId,
        rating,
        timestamp: new Date().toISOString()
      }
    });
  }

  emitSearchActivity(searchTerm, resultsCount) {
    this.emitToAdmin('search-activity', {
      type: 'search',
      action: 'performed',
      data: {
        searchTerm,
        resultsCount,
        timestamp: new Date().toISOString()
      }
    });
  }

  emitActivity(type, action, data) {
    this.emitToAdmin('general-activity', {
      type,
      action,
      data: {
        ...data,
        timestamp: new Date().toISOString()
      }
    });
  }
}

module.exports = new SocketService();
