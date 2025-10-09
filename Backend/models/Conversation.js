const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous users
  },
  sessionId: {
    type: String,
    required: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    intent: {
      type: String,
      required: false // Detected intent (shipping, returns, products, etc.)
    },
    confidence: {
      type: Number,
      required: false // Confidence score for intent detection
    }
  }],
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: false
    },
    comment: {
      type: String,
      required: false
    },
    helpful: {
      type: Boolean,
      required: false
    }
  },
  resolved: {
    type: Boolean,
    default: false
  },
  escalated: {
    type: Boolean,
    default: false
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

conversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ sessionId: 1 });
conversationSchema.index({ 'messages.intent': 1 });

module.exports = mongoose.model('Conversation', conversationSchema);

