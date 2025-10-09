const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

let mlChatbotService;
try {
  mlChatbotService = require('../services/mlChatbotService');
  console.log('📊 Using MongoDB-based ML Chatbot Service');
} catch (error) {
  console.error('❌ Failed to load MongoDB chatbot service:', error.message);
  process.exit(1);
}

router.post('/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user?.id || null; // Optional user ID

    if (!message || !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Message and sessionId are required'
      });
    }

    const response = await mlChatbotService.generateResponse(message, sessionId, userId);

    res.json({
      success: true,
      response: response.answer,
      confidence: response.confidence,
      intent: response.intent,
      suggestedActions: response.suggestedActions
    });

  } catch (error) {
    console.error('Chatbot message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message',
      error: error.message
    });
  }
});

router.post('/feedback', async (req, res) => {
  try {
    const { knowledgeId, helpful, rating, comment } = req.body;

    if (!knowledgeId || helpful === undefined) {
      return res.status(400).json({
        success: false,
        message: 'KnowledgeId and helpful status are required'
      });
    }

    await mlChatbotService.learnFromFeedback(knowledgeId, {
      helpful,
      rating,
      comment
    });

    res.json({
      success: true,
      message: 'Feedback recorded successfully'
    });

  } catch (error) {
    console.error('Chatbot feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record feedback',
      error: error.message
    });
  }
});

router.post('/learn', auth, async (req, res) => {
  try {
    const { question, answer, intent, keywords } = req.body;

    if (!question || !answer || !intent) {
      return res.status(400).json({
        success: false,
        message: 'Question, answer, and intent are required'
      });
    }

    const newKnowledge = await mlChatbotService.addNewKnowledge(
      question,
      answer,
      intent,
      keywords
    );

    if (newKnowledge) {
      res.json({
        success: true,
        message: 'New knowledge added successfully',
        knowledge: newKnowledge
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to add new knowledge'
      });
    }

  } catch (error) {
    console.error('Chatbot learn error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add knowledge',
      error: error.message
    });
  }
});

router.get('/analytics', auth, async (req, res) => {
  try {
    const analytics = await mlChatbotService.getAnalytics();

    res.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('Chatbot analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics',
      error: error.message
    });
  }
});

router.get('/conversations/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await Conversation.findOne({ sessionId })
      .select('messages createdAt updatedAt')
      .sort({ 'messages.timestamp': 1 });

    if (!conversation) {
      return res.json({
        success: true,
        messages: []
      });
    }

    res.json({
      success: true,
      messages: conversation.messages,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversations',
      error: error.message
    });
  }
});

router.get('/knowledge', auth, async (req, res) => {
  try {
    const { intent, limit = 50, page = 1 } = req.query;
    
    const query = intent ? { intent } : {};
    const skip = (page - 1) * limit;

    const knowledge = await KnowledgeBase.find(query)
      .sort({ usageCount: -1, confidence: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await KnowledgeBase.countDocuments(query);

    res.json({
      success: true,
      knowledge,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get knowledge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get knowledge base',
      error: error.message
    });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const analytics = await mlChatbotService.getAnalytics();
    res.json({
      success: true,
      message: 'Chatbot is working with in-memory storage',
      analytics
    });
  } catch (error) {
    console.error('Chatbot stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get stats',
      error: error.message
    });
  }
});

module.exports = router;
