/**
 * Chatbot Routes - Fashion Forward E-commerce
 * 
 * This file handles all chatbot-related API endpoints including
 * message processing, feedback collection, and analytics.
 * 
 * Features:
 * - AI-powered message processing with Google Gemini
 * - Feedback collection for continuous improvement
 * - Analytics and conversation tracking
 * - Knowledge base management
 * 
 * @author Fashion Forward Development Team
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();

// Initialize chatbot service
let chatbotService = null;

try {
  // Try to use enhanced AI service with Google Gemini
  const EnhancedAIService = require('../services/enhancedAIChatbotService');
  chatbotService = new EnhancedAIService();
  console.log('🤖 Using Enhanced AI Chatbot Service with Google Gemini');
} catch (error) {
  console.error('❌ Failed to load chatbot service:', error.message);
  console.log('⚠️ Chatbot functionality will be limited');
}

/**
 * Process Chatbot Message
 * 
 * Handles incoming messages from users and generates AI responses.
 * Uses Google Gemini AI for intelligent conversation.
 * 
 * @route POST /api/chatbot/message
 * @param {string} message - User message
 * @param {string} sessionId - Session identifier
 * @returns {Object} AI response with confidence and suggestions
 */
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

    // Check if chatbot service is available
    if (!chatbotService) {
      return res.status(503).json({
        success: false,
        message: 'Chatbot service is currently unavailable. Please try again later.',
        response: 'I apologize, but I\'m currently experiencing technical difficulties. Please contact our support team for assistance.'
      });
    }

    const response = await chatbotService.generateResponse(message, sessionId, userId);

    res.json({
      success: true,
      response: response.answer,
      confidence: response.confidence,
      intent: response.intent,
      suggestedActions: response.suggestedActions,
      source: response.source || 'gemini-ai'
    });

  } catch (error) {
    console.error('Chatbot message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message',
      error: error.message,
      response: 'I apologize, but I encountered an error processing your message. Please try again.'
    });
  }
});

/**
 * Collect User Feedback
 * 
 * Collects feedback from users about chatbot responses
 * to improve the AI system over time.
 * 
 * @route POST /api/chatbot/feedback
 * @param {string} knowledgeId - Knowledge base entry ID
 * @param {boolean} helpful - Whether the response was helpful
 * @param {number} rating - User rating (1-5)
 * @param {string} comment - Optional user comment
 * @returns {Object} Success confirmation
 */
router.post('/feedback', async (req, res) => {
  try {
    const { knowledgeId, helpful, rating, comment } = req.body;

    if (!knowledgeId || helpful === undefined) {
      return res.status(400).json({
        success: false,
        message: 'KnowledgeId and helpful status are required'
      });
    }

    // Check if chatbot service is available
    if (!chatbotService) {
      return res.status(503).json({
        success: false,
        message: 'Chatbot service is currently unavailable'
      });
    }

    await chatbotService.learnFromFeedback(knowledgeId, {
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

/**
 * Add New Knowledge
 * 
 * Allows adding new knowledge to the chatbot's knowledge base.
 * This is typically used by admins to expand the bot's capabilities.
 * 
 * @route POST /api/chatbot/learn
 * @param {string} question - User question
 * @param {string} answer - Bot answer
 * @param {string} intent - Intent category
 * @param {Array} keywords - Relevant keywords
 * @returns {Object} New knowledge entry
 */
router.post('/learn', async (req, res) => {
  try {
    const { question, answer, intent, keywords } = req.body;

    if (!question || !answer || !intent) {
      return res.status(400).json({
        success: false,
        message: 'Question, answer, and intent are required'
      });
    }

    // Check if chatbot service is available
    if (!chatbotService) {
      return res.status(503).json({
        success: false,
        message: 'Chatbot service is currently unavailable'
      });
    }

    const newKnowledge = await chatbotService.addNewKnowledge(
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

/**
 * Get Chatbot Analytics
 * 
 * Retrieves analytics data about chatbot usage and performance.
 * 
 * @route GET /api/chatbot/analytics
 * @returns {Object} Analytics data
 */
router.get('/analytics', async (req, res) => {
  try {
    // Check if chatbot service is available
    if (!chatbotService) {
      return res.status(503).json({
        success: false,
        message: 'Chatbot service is currently unavailable'
      });
    }

    const analytics = await chatbotService.getAnalytics();

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

/**
 * Get Chatbot Statistics
 * 
 * Provides basic statistics about the chatbot service.
 * 
 * @route GET /api/chatbot/stats
 * @returns {Object} Chatbot statistics
 */
router.get('/stats', async (req, res) => {
  try {
    // Check if chatbot service is available
    if (!chatbotService) {
      return res.json({
        success: true,
        message: 'Chatbot service is currently unavailable',
        analytics: {
          totalMessages: 0,
          totalSessions: 0,
          averageConfidence: 0,
          serviceStatus: 'unavailable'
        }
      });
    }

    const analytics = await chatbotService.getAnalytics();
    res.json({
      success: true,
      message: 'Chatbot is working with Google Gemini AI',
      analytics: {
        ...analytics,
        serviceStatus: 'active'
      }
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

/**
 * Health Check Endpoint
 * 
 * Simple endpoint to check if the chatbot service is running.
 * 
 * @route GET /api/chatbot/health
 * @returns {Object} Service health status
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Chatbot service is running',
    service: chatbotService ? 'Google Gemini AI' : 'Unavailable',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
