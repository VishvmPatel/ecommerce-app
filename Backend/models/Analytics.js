const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  metrics: {
    totalUsers: {
      type: Number,
      default: 0
    },
    newUsers: {
      type: Number,
      default: 0
    },
    activeUsers: {
      type: Number,
      default: 0
    },
    
    totalProducts: {
      type: Number,
      default: 0
    },
    productsAdded: {
      type: Number,
      default: 0
    },
    productsUpdated: {
      type: Number,
      default: 0
    },
    
    totalOrders: {
      type: Number,
      default: 0
    },
    ordersToday: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    revenueToday: {
      type: Number,
      default: 0
    },
    
    pageViews: {
      type: Number,
      default: 0
    },
    uniqueVisitors: {
      type: Number,
      default: 0
    },
    bounceRate: {
      type: Number,
      default: 0
    },
    
    topSellingProducts: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      name: String,
      sales: Number,
      revenue: Number
    }],
    
    categoryPerformance: [{
      category: String,
      sales: Number,
      revenue: Number,
      products: Number
    }],
    
    averageSessionDuration: {
      type: Number,
      default: 0
    },
    cartAbandonmentRate: {
      type: Number,
      default: 0
    },
    
    chatbotInteractions: {
      type: Number,
      default: 0
    },
    chatbotSatisfaction: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

analyticsSchema.index({ date: -1 });
analyticsSchema.index({ 'metrics.totalRevenue': -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);

