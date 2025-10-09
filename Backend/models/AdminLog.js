const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN',
      'LOGOUT',
      'CREATE_PRODUCT',
      'UPDATE_PRODUCT',
      'DELETE_PRODUCT',
      'UPDATE_ORDER_STATUS',
      'VIEW_ANALYTICS',
      'MANAGE_USERS',
      'UPDATE_SETTINGS',
      'BACKUP_DATA',
      'EXPORT_DATA'
    ]
  },
  description: {
    type: String,
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  targetType: {
    type: String,
    enum: ['Product', 'Order', 'User', 'Analytics', 'Settings'],
    required: false
  },
  changes: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

adminLogSchema.index({ adminId: 1, timestamp: -1 });
adminLogSchema.index({ action: 1, timestamp: -1 });
adminLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AdminLog', adminLogSchema);

