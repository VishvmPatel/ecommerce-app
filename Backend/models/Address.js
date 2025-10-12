const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['shipping', 'billing', 'both'],
    default: 'both'
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number']
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  city: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  state: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10
  },
  country: {
    type: String,
    required: true,
    default: 'India',
    trim: true,
    maxlength: 50
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
AddressSchema.index({ user: 1, isActive: 1 });
AddressSchema.index({ user: 1, isDefault: 1 });

// Pre-save middleware to update updatedAt
AddressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to set default address
AddressSchema.statics.setDefaultAddress = async function(userId, addressId) {
  // Remove default from all addresses
  await this.updateMany(
    { user: userId },
    { isDefault: false }
  );
  
  // Set the specified address as default
  await this.findByIdAndUpdate(addressId, { isDefault: true });
};

// Instance method to get full name
AddressSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Instance method to get full address
AddressSchema.methods.getFullAddress = function() {
  return `${this.address}, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
};

const Address = mongoose.model('Address', AddressSchema);

module.exports = Address;


