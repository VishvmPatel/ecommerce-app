const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    index: true
  },
  questionVariations: [{
    type: String,
    required: false
  }],
  answer: {
    type: String,
    required: true
  },
  intent: {
    type: String,
    required: true,
    enum: ['shipping', 'returns', 'products', 'account', 'payment', 'general', 'technical', 'sizing', 'fashion']
  },
  keywords: [{
    type: String,
    required: false
  }],
  confidence: {
    type: Number,
    default: 0.5,
    min: 0,
    max: 1
  },
  usageCount: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0.5,
    min: 0,
    max: 1
  },
  feedback: {
    positive: {
      type: Number,
      default: 0
    },
    negative: {
      type: Number,
      default: 0
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

knowledgeBaseSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

knowledgeBaseSchema.index({ question: 'text', answer: 'text', keywords: 'text' });
knowledgeBaseSchema.index({ intent: 1, confidence: -1 });
knowledgeBaseSchema.index({ usageCount: -1 });

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
