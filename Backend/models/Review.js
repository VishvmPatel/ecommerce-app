const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  notHelpful: {
    type: Number,
    default: 0
  },
  images: [{
    type: String, // URLs to uploaded images
    validate: {
      validator: function(v) {
        return v.length <= 5; // Max 5 images per review
      },
      message: 'Maximum 5 images allowed per review'
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  moderationNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });

reviewSchema.virtual('helpfulnessScore').get(function() {
  const total = this.helpful + this.notHelpful;
  return total > 0 ? (this.helpful / total) * 100 : 0;
});

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre('save', function(next) {
  if (this.rating < 1 || this.rating > 5) {
    next(new Error('Rating must be between 1 and 5'));
  } else {
    next();
  }
});

reviewSchema.statics.getAverageRating = function(productId) {
  return this.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId), status: 'approved' } },
    { $group: { _id: null, averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
  ]);
};

reviewSchema.statics.getRatingDistribution = function(productId) {
  return this.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId), status: 'approved' } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } }
  ]);
};

module.exports = mongoose.model('Review', reviewSchema);
