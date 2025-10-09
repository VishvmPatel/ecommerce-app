const InMemoryStorage = require('./inMemoryStorage');

class MLChatbotServiceFallback {
  constructor() {
    this.storage = new InMemoryStorage();
    this.intentKeywords = {
      shipping: ['shipping', 'delivery', 'dispatch', 'track', 'courier', 'logistics', 'when will', 'how long', 'delivery time', 'shipping time', 'delayed delivery', 'late delivery', 'delivery delay', 'more than', 'days', 'weeks'],
      returns: ['return', 'refund', 'exchange', 'cancel', 'order cancellation', 'money back', 'send back', 'take back'],
      products: ['product', 'item', 'size', 'color', 'available', 'stock', 'price', 'cost', 'buy', 'purchase', 'order'],
      account: ['account', 'profile', 'login', 'password', 'sign up', 'register', 'forgot', 'username', 'email'],
      payment: ['payment', 'pay', 'billing', 'card', 'wallet', 'upi', 'cash on delivery', 'cod', 'credit card', 'debit card'],
      general: ['hello', 'hi', 'help', 'support', 'contact', 'information', 'website', 'mobile', 'app'],
      technical: ['bug', 'error', 'issue', 'problem', 'not working', 'broken', 'fix', 'technical', 'slow', 'loading']
    };
  }

  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    let bestIntent = 'general';
    let maxScore = 0;
    let intentScores = {};

    for (const [intent, keywords] of Object.entries(this.intentKeywords)) {
      let score = 0;
      let matchedKeywords = [];
      
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          score += 1;
          matchedKeywords.push(keyword);
        }
      }
      
      if (lowerMessage.includes('delivery') && lowerMessage.includes('more than')) {
        if (intent === 'shipping') score += 3;
      }
      
      if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
        if (intent === 'returns') score += 2;
      }
      
      if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
        if (intent === 'payment') score += 2;
      }
      
      intentScores[intent] = {
        score,
        matchedKeywords,
        confidence: Math.min(score / 3, 1)
      };
      
      if (score > maxScore) {
        maxScore = score;
        bestIntent = intent;
      }
    }

    if (maxScore === 0) {
      if (lowerMessage.includes('mobile') || lowerMessage.includes('app') || lowerMessage.includes('responsive')) {
        bestIntent = 'general';
        maxScore = 1;
      }
    }

    return {
      intent: bestIntent,
      confidence: Math.min(maxScore / 3, 1),
      scores: intentScores
    };
  }

  findBestAnswer(message, intent) {
    return this.storage.findBestAnswer(message, intent);
  }

  async generateResponse(message, sessionId, userId = null) {
    const intent = this.detectIntent(message);
    
    const knowledgeAnswer = this.findBestAnswer(message, intent.intent);
    
    let response;
    let confidence = 0.5;

    if (knowledgeAnswer) {
      response = knowledgeAnswer.answer;
      confidence = knowledgeAnswer.confidence;
    } else {
      response = this.generateContextualResponse(message, intent.intent);
      confidence = intent.confidence;
    }

    this.storage.saveConversation(sessionId, userId, message, response, intent);

    return {
      answer: response,
      confidence: confidence,
      intent: intent.intent,
      suggestedActions: this.getSuggestedActions(intent.intent),
      knowledgeId: knowledgeAnswer?.knowledgeId
    };
  }

  generateContextualResponse(message, intent) {
    const responses = {
      shipping: "I understand you're asking about shipping. For detailed shipping information, please check our shipping policy or contact our support team at support@fashionforward.com.",
      returns: "I can help you with returns and exchanges. You can initiate a return through your account or contact our support team for assistance.",
      products: "I'd be happy to help you find products. You can browse our categories or use the search function. If you need specific product information, please let me know!",
      account: "I can help you with account-related questions. You can manage your account settings, view order history, or contact support for account issues.",
      payment: "For payment-related questions, please check our payment methods page or contact our billing support team.",
      general: "I'm here to help! Could you please provide more details about what you're looking for? I can assist with orders, products, shipping, returns, and more.",
      technical: "I understand you're experiencing a technical issue. Please contact our technical support team at tech@fashionforward.com for immediate assistance."
    };

    return responses[intent] || responses.general;
  }

  getSuggestedActions(intent) {
    const actions = {
      shipping: ["Track Order", "Shipping Policy", "Contact Support"],
      returns: ["Return Policy", "Start Return", "Contact Support"],
      products: ["Browse Products", "Search", "View Categories"],
      account: ["My Account", "Order History", "Contact Support"],
      payment: ["Payment Methods", "Billing Support", "Contact Support"],
      general: ["Browse Products", "Contact Support", "Help Center"],
      technical: ["Contact Support", "Report Issue", "Help Center"]
    };

    return actions[intent] || actions.general;
  }

  async learnFromFeedback(knowledgeId, feedback) {
    console.log(`Learning from feedback: ${knowledgeId}, helpful: ${feedback.helpful}`);
    return true;
  }

  async getAnalytics() {
    return this.storage.getAnalytics();
  }
}

module.exports = new MLChatbotServiceFallback();

