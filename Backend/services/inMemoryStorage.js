class InMemoryStorage {
  constructor() {
    this.conversations = new Map();
    this.knowledgeBase = new Map();
    this.initializeKnowledge();
  }

  initializeKnowledge() {
    const basicKnowledge = [
      {
        id: 'kb1',
        question: "What happens if delivery takes more than 10 days?",
        answer: "If your delivery takes more than 10 days, please contact our support team immediately. We'll investigate the delay and may offer compensation or expedited shipping. You can also track your order status in your account.",
        intent: "shipping",
        keywords: ["delivery", "delay", "late", "more than", "days", "10 days", "delayed delivery"],
        usageCount: 0,
        confidence: 0.9
      },
      {
        id: 'kb2',
        question: "What is your shipping policy?",
        answer: "We offer free shipping on orders over ₹2000. Standard delivery takes 3-5 business days, while express delivery takes 1-2 business days.",
        intent: "shipping",
        keywords: ["shipping", "delivery", "policy"],
        usageCount: 0,
        confidence: 0.8
      },
      {
        id: 'kb3',
        question: "How can I return a product?",
        answer: "You can return products within 30 days of purchase. Visit your order history, select the item you want to return, and follow the return process. We'll provide a prepaid return label.",
        intent: "returns",
        keywords: ["return", "refund", "exchange"],
        usageCount: 0,
        confidence: 0.8
      },
      {
        id: 'kb4',
        question: "How do I track my order?",
        answer: "You can track your order by logging into your account and going to 'My Orders'. You'll receive tracking updates via email and SMS.",
        intent: "shipping",
        keywords: ["track", "tracking", "order status"],
        usageCount: 0,
        confidence: 0.8
      },
      {
        id: 'kb5',
        question: "What payment methods do you accept?",
        answer: "We accept all major credit/debit cards, UPI, net banking, and cash on delivery. All payments are secure and encrypted.",
        intent: "payment",
        keywords: ["payment", "pay", "card", "upi"],
        usageCount: 0,
        confidence: 0.8
      },
      {
        id: 'kb6',
        question: "How do I create an account?",
        answer: "Click on 'Sign Up' in the top right corner, enter your details, and verify your email. You can also sign up using Google for faster registration.",
        intent: "account",
        keywords: ["account", "sign up", "register"],
        usageCount: 0,
        confidence: 0.8
      },
      {
        id: 'kb7',
        question: "Is your website mobile responsive?",
        answer: "Yes, our website is fully responsive and works great on mobile devices. You can shop, track orders, and manage your account from any smartphone or tablet. We're working on a dedicated mobile app for even better mobile experience.",
        intent: "general",
        keywords: ["mobile", "responsive", "website", "app"],
        usageCount: 0,
        confidence: 0.7
      }
    ];

    basicKnowledge.forEach(kb => {
      this.knowledgeBase.set(kb.id, kb);
    });
  }

  saveConversation(sessionId, userId, userMessage, botResponse, intent) {
    if (!this.conversations.has(sessionId)) {
      this.conversations.set(sessionId, {
        sessionId,
        userId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    const conversation = this.conversations.get(sessionId);
    conversation.messages.push({
      role: 'user',
      content: userMessage,
      intent: intent.intent,
      confidence: intent.confidence,
      timestamp: new Date()
    });

    conversation.messages.push({
      role: 'assistant',
      content: botResponse,
      intent: intent.intent,
      confidence: intent.confidence,
      timestamp: new Date()
    });

    conversation.updatedAt = new Date();
  }

  findBestAnswer(message, intent) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('delivery') && lowerMessage.includes('more than') && lowerMessage.includes('days')) {
      const deliveryDelayAnswer = Array.from(this.knowledgeBase.values())
        .find(kb => kb.question.toLowerCase().includes('delivery') && kb.question.toLowerCase().includes('more than'));
      
      if (deliveryDelayAnswer) {
        deliveryDelayAnswer.usageCount++;
        return {
          answer: deliveryDelayAnswer.answer,
          confidence: 0.9,
          source: 'knowledge_base',
          knowledgeId: deliveryDelayAnswer.id
        };
      }
    }

    const matches = Array.from(this.knowledgeBase.values())
      .filter(kb => {
        const questionMatch = kb.question.toLowerCase().includes(lowerMessage);
        const keywordMatch = kb.keywords.some(keyword => lowerMessage.includes(keyword));
        const intentMatch = kb.intent === intent;
        return questionMatch || keywordMatch || intentMatch;
      })
      .sort((a, b) => {
        if (b.confidence !== a.confidence) return b.confidence - a.confidence;
        return b.usageCount - a.usageCount;
      });

    if (matches.length > 0) {
      const bestMatch = matches[0];
      bestMatch.usageCount++;
      return {
        answer: bestMatch.answer,
        confidence: bestMatch.confidence,
        source: 'knowledge_base',
        knowledgeId: bestMatch.id
      };
    }

    return null;
  }

  getAnalytics() {
    const totalConversations = this.conversations.size;
    const totalMessages = Array.from(this.conversations.values())
      .reduce((sum, conv) => sum + conv.messages.length, 0);

    const intentDistribution = {};
    Array.from(this.conversations.values()).forEach(conv => {
      conv.messages.forEach(msg => {
        if (msg.role === 'user' && msg.intent) {
          intentDistribution[msg.intent] = (intentDistribution[msg.intent] || 0) + 1;
        }
      });
    });

    const knowledgeStats = {
      totalKnowledge: this.knowledgeBase.size,
      avgConfidence: Array.from(this.knowledgeBase.values())
        .reduce((sum, kb) => sum + kb.confidence, 0) / this.knowledgeBase.size,
      avgUsage: Array.from(this.knowledgeBase.values())
        .reduce((sum, kb) => sum + kb.usageCount, 0) / this.knowledgeBase.size
    };

    return {
      totalConversations,
      totalMessages,
      intentDistribution: Object.entries(intentDistribution).map(([intent, count]) => ({ _id: intent, count })),
      knowledgeStats
    };
  }
}

module.exports = InMemoryStorage;

