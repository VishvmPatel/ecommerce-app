const KnowledgeBase = require('../models/KnowledgeBase');
const Conversation = require('../models/Conversation');

class MLChatbotService {
  constructor() {
    this.intentKeywords = {
      shipping: ['shipping', 'delivery', 'dispatch', 'track', 'courier', 'logistics', 'when will', 'how long', 'delivery time', 'shipping time', 'delayed delivery', 'late delivery', 'delivery delay', 'more than', 'days', 'weeks', 'express', 'standard', 'free shipping', 'shipping cost', 'delivery address', 'tracking number', 'order status', 'shipped', 'out for delivery'],
      returns: ['return', 'refund', 'exchange', 'cancel', 'order cancellation', 'money back', 'send back', 'take back', 'return policy', 'exchange policy', 'return window', 'refund time', 'return label', 'return process', 'damaged item', 'wrong size', 'wrong color', 'defective'],
      products: ['product', 'item', 'size', 'color', 'available', 'stock', 'price', 'cost', 'buy', 'purchase', 'order', 'fashion', 'clothing', 'dress', 'shirt', 'pants', 'shoes', 'accessories', 'kurta', 'saree', 'jeans', 't-shirt', 'jacket', 'coat', 'sweater', 'hoodie', 'shorts', 'skirt', 'blouse', 'top', 'bottom', 'outfit', 'style', 'brand', 'material', 'fabric', 'fit', 'measurement', 'size guide', 'product details', 'specifications', 'features', 'description', 'images', 'photos', 'reviews', 'rating', 'quality'],
      account: ['account', 'profile', 'login', 'password', 'sign up', 'register', 'forgot', 'username', 'email', 'profile picture', 'personal information', 'address', 'phone number', 'account settings', 'privacy', 'security', 'verification', 'email verification', 'phone verification', 'google sign in', 'social login'],
      payment: ['payment', 'pay', 'billing', 'card', 'wallet', 'upi', 'cash on delivery', 'cod', 'credit card', 'debit card', 'net banking', 'razorpay', 'paytm', 'phonepe', 'google pay', 'amazon pay', 'payment gateway', 'billing address', 'payment method', 'transaction', 'invoice', 'receipt', 'payment failed', 'payment success', 'refund', 'chargeback'],
      general: ['hello', 'hi', 'help', 'support', 'contact', 'information', 'website', 'mobile', 'app', 'about', 'company', 'fashion forward', 'store', 'shop', 'browse', 'categories', 'collections', 'new arrivals', 'sale', 'discount', 'offers', 'promotions', 'coupon', 'voucher', 'gift card', 'wishlist', 'favorites', 'recommendations', 'trending', 'popular', 'best sellers'],
      technical: ['bug', 'error', 'issue', 'problem', 'not working', 'broken', 'fix', 'technical', 'slow', 'loading', 'website down', 'page not loading', 'login issue', 'cart issue', 'checkout problem', 'payment error', 'page error', 'server error', 'connection issue', 'browser compatibility', 'mobile responsive', 'app crash', 'performance issue'],
      sizing: ['size', 'sizing', 'measurement', 'fit', 'small', 'large', 'medium', 'xs', 'xl', 'xxl', 'size chart', 'size guide', 'measurements', 'chest', 'waist', 'hip', 'length', 'shoulder', 'sleeve', 'inseam', 'fit guide', 'true to size', 'runs small', 'runs large', 'loose fit', 'tight fit', 'regular fit', 'slim fit', 'relaxed fit'],
      fashion: ['fashion', 'style', 'trend', 'trending', 'outfit', 'look', 'styling', 'fashion advice', 'what to wear', 'occasion wear', 'casual wear', 'formal wear', 'party wear', 'wedding wear', 'office wear', 'summer wear', 'winter wear', 'seasonal', 'color combination', 'matching', 'coordination', 'fashion tips', 'styling tips', 'wardrobe', 'closet']
    };
    
    this.initializeKnowledgeBase();
  }

  async initializeKnowledgeBase() {
    const basicKnowledge = [
      {
        question: "What is your shipping policy?",
        answer: "We offer FREE shipping on all orders above ₹2000! For orders below ₹2000, shipping charges are ₹99. Generally, delivery takes 5-7 business days for most locations. Express delivery (₹199 extra) takes 2-3 business days. We deliver to all major cities and towns across India.",
        intent: "shipping",
        keywords: ["shipping", "delivery", "policy", "free shipping", "shipping cost"]
      },
      {
        question: "How long does delivery take?",
        answer: "Generally, delivery takes 5-7 business days for most locations across India. For metro cities like Mumbai, Delhi, Bangalore, Chennai, delivery is usually 3-5 business days. Express delivery (₹199 extra) takes 2-3 business days. Remote locations may take 7-10 business days.",
        intent: "shipping",
        keywords: ["delivery", "time", "how long", "days", "shipping time", "delivery time"]
      },
      {
        question: "What happens if delivery takes more than 10 days?",
        answer: "If your delivery takes more than 10 days, please contact our support team immediately at support@fashionforward.com or call +91-9876543210. We'll investigate the delay and may offer compensation, expedited shipping, or a full refund. You can also track your order status in your account.",
        intent: "shipping",
        keywords: ["delivery", "delay", "late", "more than", "days", "10 days", "delayed delivery"]
      },
      {
        question: "How can I track my order?",
        answer: "You can track your order by logging into your account and going to 'My Orders'. You'll also receive tracking updates via email and SMS. Once your order is shipped, you'll get a tracking number that you can use on our website or the courier's website.",
        intent: "shipping",
        keywords: ["track", "tracking", "order status", "tracking number"]
      },
      {
        question: "Do you deliver to my city?",
        answer: "We deliver to all major cities and towns across India including Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, and many more. Generally, delivery takes 5-7 business days for most locations. For remote locations, delivery may take 7-10 business days. You can check delivery availability at checkout.",
        intent: "shipping",
        keywords: ["deliver", "city", "location", "area", "pincode", "address"]
      },

      {
        question: "How can I return a product?",
        answer: "You can return products within 30 days of purchase. Visit your order history, select the item you want to return, and follow the return process. We'll provide a prepaid return label. Items must be in original condition with tags attached. Refunds are processed within 5-7 business days.",
        intent: "returns",
        keywords: ["return", "refund", "exchange", "send back", "return policy"]
      },
      {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for all items. Products must be in original condition with tags attached. We provide free return shipping. Refunds are processed within 5-7 business days to your original payment method. Exchanges are also available for size/color changes.",
        intent: "returns",
        keywords: ["return policy", "refund policy", "exchange policy", "return window"]
      },
      {
        question: "Can I exchange for a different size?",
        answer: "Yes! You can exchange items for a different size within 30 days of purchase. Visit your order history, select the item, and choose 'Exchange'. We'll send the new size and provide a prepaid return label for the original item. Size exchanges are free of charge.",
        intent: "returns",
        keywords: ["exchange", "size", "different size", "size change", "wrong size"]
      },

      {
        question: "What products do you sell?",
        answer: "We specialize in fashion-forward clothing for men and women. Our collection includes: Men's - Kurtas, shirts, t-shirts, jeans, jackets, shoes. Women's - Dresses, sarees, tops, jeans, skirts, accessories. We also have accessories like caps, sunglasses, bags, and jewelry. All products are carefully curated for quality and style.",
        intent: "products",
        keywords: ["products", "items", "clothing", "fashion", "collection", "what do you sell"]
      },
      {
        question: "How do I choose the right size?",
        answer: "We provide detailed size charts for each product. Measure your chest, waist, and hip according to our size guide. Most of our products are true to size, but check individual product descriptions for specific fit notes. If unsure, we recommend sizing up for a comfortable fit.",
        intent: "sizing",
        keywords: ["size", "sizing", "measurement", "fit", "size guide", "size chart", "right size"]
      },
      {
        question: "What materials are your clothes made of?",
        answer: "We use high-quality materials including cotton, polyester blends, silk, chiffon, georgette, denim, and more. Each product page shows detailed material composition. We focus on comfort, durability, and style. All materials are skin-friendly and suitable for Indian weather conditions.",
        intent: "products",
        keywords: ["material", "fabric", "cotton", "polyester", "quality", "made of", "composition"]
      },
      {
        question: "Do you have plus sizes?",
        answer: "Yes! We offer sizes from XS to XXL for most products, and some items go up to 3XL. Check individual product pages for available sizes. We're committed to inclusive fashion and regularly add more plus-size options to our collection.",
        intent: "sizing",
        keywords: ["plus size", "large size", "xxl", "3xl", "big size", "inclusive"]
      },

      {
        question: "What payment methods do you accept?",
        answer: "We accept all major payment methods: Credit/Debit cards (Visa, MasterCard, RuPay), UPI (Google Pay, PhonePe, Paytm), Net Banking, Wallets, and Cash on Delivery (COD). All payments are secure and encrypted. COD is available for orders up to ₹5000.",
        intent: "payment",
        keywords: ["payment", "pay", "card", "upi", "cod", "cash on delivery", "payment methods"]
      },
      {
        question: "Is my payment secure?",
        answer: "Absolutely! We use industry-standard SSL encryption and secure payment gateways. We never store your card details. All transactions are processed through trusted partners like Razorpay. Your payment information is completely safe with us.",
        intent: "payment",
        keywords: ["secure", "safe", "encryption", "ssl", "payment security", "card details"]
      },
      {
        question: "Can I pay with UPI?",
        answer: "Yes! We accept all major UPI apps including Google Pay, PhonePe, Paytm, Amazon Pay, and BHIM. Simply select UPI at checkout and follow the instructions. UPI payments are instant and secure.",
        intent: "payment",
        keywords: ["upi", "google pay", "phonepe", "paytm", "amazon pay", "bhim"]
      },

      {
        question: "How do I create an account?",
        answer: "Creating an account is easy! Click 'Sign Up' in the top right corner, enter your details (name, email, phone), and verify your email. You can also sign up using Google for faster registration. Having an account lets you track orders, save addresses, and manage your wishlist.",
        intent: "account",
        keywords: ["account", "sign up", "register", "create account", "new account"]
      },
      {
        question: "I forgot my password",
        answer: "No worries! Click 'Forgot Password' on the login page, enter your email address, and we'll send you a reset link. You can also reset your password through the 'My Account' section if you're already logged in.",
        intent: "account",
        keywords: ["forgot password", "reset password", "password", "login issue"]
      },
      {
        question: "Can I use Google to sign in?",
        answer: "Yes! You can sign in or sign up using your Google account. This is faster and more secure. Click 'Continue with Google' on the login/signup page. We'll only access basic profile information needed for your account.",
        intent: "account",
        keywords: ["google sign in", "google login", "social login", "google account"]
      },

      {
        question: "What's trending in fashion?",
        answer: "Currently trending: Oversized shirts, high-waist jeans, crop tops, statement accessories, pastel colors, and sustainable fashion. Check our 'New Arrivals' and 'Trending' sections for the latest styles. We update our collection regularly with fashion-forward pieces.",
        intent: "fashion",
        keywords: ["trending", "fashion", "style", "trend", "latest", "new", "popular"]
      },
      {
        question: "What should I wear for a party?",
        answer: "For parties, we recommend: Women - Elegant dresses, sarees, or stylish tops with skirts. Men - Smart shirts with jeans or formal kurtas. Check our 'Party Wear' collection for curated options. Don't forget accessories like jewelry, watches, or stylish shoes to complete your look!",
        intent: "fashion",
        keywords: ["party wear", "party", "occasion wear", "dress up", "formal", "elegant"]
      },
      {
        question: "How do I style a kurta?",
        answer: "Kurtas are versatile! Pair with jeans for casual look, with churidar for traditional style, or with palazzo pants for comfort. Add accessories like a watch, bracelet, or traditional jewelry. Choose colors that complement your skin tone. Check our styling tips section for more ideas!",
        intent: "fashion",
        keywords: ["kurta", "styling", "how to wear", "traditional", "indian wear"]
      },

      {
        question: "The website is not loading properly",
        answer: "We're sorry for the inconvenience. Please try: 1) Refresh the page, 2) Clear your browser cache, 3) Try a different browser, 4) Check your internet connection. If the issue persists, contact our technical support at tech@fashionforward.com or call +91-9876543210.",
        intent: "technical",
        keywords: ["website", "not loading", "loading", "slow", "error", "technical issue"]
      },
      {
        question: "I can't add items to cart",
        answer: "Please try: 1) Refresh the page, 2) Clear browser cache, 3) Disable ad blockers, 4) Try incognito mode. If the problem continues, contact support with your browser details. We'll help you resolve this quickly.",
        intent: "technical",
        keywords: ["cart", "add to cart", "cart issue", "not working", "problem"]
      },

      {
        question: "Is your website mobile friendly?",
        answer: "Yes! Our website is fully responsive and optimized for mobile devices. You can shop, browse, track orders, and manage your account seamlessly on smartphones and tablets. We're also working on a dedicated mobile app for an even better experience.",
        intent: "general",
        keywords: ["mobile", "responsive", "website", "app", "phone", "tablet"]
      },
      {
        question: "What is Fashion Forward?",
        answer: "Fashion Forward is your one-stop destination for trendy, affordable fashion. We offer high-quality clothing for men and women, focusing on contemporary Indian and Western wear. Our mission is to make fashion accessible to everyone with great prices and excellent service.",
        intent: "general",
        keywords: ["fashion forward", "company", "about", "brand", "store", "shop"]
      },
      {
        question: "Do you have customer support?",
        answer: "Yes! Our customer support team is available Monday-Saturday, 9 AM to 7 PM. Contact us via: Email - support@fashionforward.com, Phone - +91-9876543210, Live Chat - Available on our website, WhatsApp - +91-9876543210. We're here to help with any questions or concerns!",
        intent: "general",
        keywords: ["support", "customer support", "help", "contact", "assistance"]
      }
    ];

    for (const knowledge of basicKnowledge) {
      const exists = await KnowledgeBase.findOne({ question: knowledge.question });
      if (!exists) {
        await KnowledgeBase.create(knowledge);
      }
    }
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
          const weight = keyword.length > 10 ? 2 : keyword.length > 5 ? 1.5 : 1;
          score += weight;
          matchedKeywords.push(keyword);
        }
      }
      
      if (lowerMessage.includes('delivery') && (lowerMessage.includes('more than') || lowerMessage.includes('late') || lowerMessage.includes('delay'))) {
        if (intent === 'shipping') score += 4;
      }
      
      if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('exchange')) {
        if (intent === 'returns') score += 3;
      }
      
      if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card') || lowerMessage.includes('upi')) {
        if (intent === 'payment') score += 3;
      }
      
      if (lowerMessage.includes('size') || lowerMessage.includes('fit') || lowerMessage.includes('measurement')) {
        if (intent === 'sizing') score += 3;
      }
      
      if (lowerMessage.includes('fashion') || lowerMessage.includes('style') || lowerMessage.includes('trend') || lowerMessage.includes('outfit')) {
        if (intent === 'fashion') score += 3;
      }
      
      if (lowerMessage.includes('account') || lowerMessage.includes('login') || lowerMessage.includes('password') || lowerMessage.includes('sign up')) {
        if (intent === 'account') score += 3;
      }
      
      if (lowerMessage.includes('product') || lowerMessage.includes('item') || lowerMessage.includes('clothing') || lowerMessage.includes('kurta') || lowerMessage.includes('dress')) {
        if (intent === 'products') score += 3;
      }
      
      if (lowerMessage.includes('not working') || lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('issue')) {
        if (intent === 'technical') score += 3;
      }
      
      intentScores[intent] = {
        score,
        matchedKeywords,
        confidence: Math.min(score / 5, 1) // Normalize confidence
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
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
        bestIntent = 'general';
        maxScore = 1;
      }
    }

    return {
      intent: bestIntent,
      confidence: Math.min(maxScore / 5, 1),
      scores: intentScores
    };
  }

  async findBestAnswer(message, intent) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('delivery') && lowerMessage.includes('more than') && lowerMessage.includes('days')) {
      const deliveryDelayAnswer = await KnowledgeBase.findOne({
        question: { $regex: /delivery.*more than.*days/i }
      });
      if (deliveryDelayAnswer) {
        await KnowledgeBase.findByIdAndUpdate(deliveryDelayAnswer._id, {
          $inc: { usageCount: 1 }
        });
        return {
          answer: deliveryDelayAnswer.answer,
          confidence: 0.9,
          source: 'knowledge_base',
          knowledgeId: deliveryDelayAnswer._id
        };
      }
    }
    
    let matches = await KnowledgeBase.find({
      $or: [
        { question: { $regex: lowerMessage, $options: 'i' } },
        { keywords: { $in: lowerMessage.split(' ') } },
        { intent: intent }
      ]
    }).sort({ confidence: -1, usageCount: -1 });

    if (matches.length === 0) {
      matches = await KnowledgeBase.find({ intent: intent })
        .sort({ confidence: -1, usageCount: -1 });
    }

    if (matches.length > 0) {
      const bestMatch = matches[0];
      
      await KnowledgeBase.findByIdAndUpdate(bestMatch._id, {
        $inc: { usageCount: 1 }
      });

      return {
        answer: bestMatch.answer,
        confidence: bestMatch.confidence,
        source: 'knowledge_base',
        knowledgeId: bestMatch._id
      };
    }

    return null;
  }

  async generateResponse(message, sessionId, userId = null) {
    const intent = this.detectIntent(message);
    
    const knowledgeAnswer = await this.findBestAnswer(message, intent.intent);
    
    let response;
    let confidence = 0.5;

    if (knowledgeAnswer) {
      response = knowledgeAnswer.answer;
      confidence = knowledgeAnswer.confidence;
    } else {
      response = this.generateContextualResponse(message, intent.intent);
      confidence = intent.confidence;
    }

    await this.saveConversation(sessionId, userId, message, response, intent);

    return {
      answer: response,
      confidence: confidence,
      intent: intent.intent,
      suggestedActions: this.getSuggestedActions(intent.intent)
    };
  }

  generateContextualResponse(message, intent) {
    const responses = {
      shipping: "I understand you're asking about shipping and delivery. Generally, delivery takes 5-7 business days for most locations across India. We offer FREE shipping on orders above ₹2000, with express delivery (₹199 extra) taking 2-3 business days. For specific delivery questions, please contact our support team at support@fashionforward.com or call +91-9876543210.",
      returns: "I can help you with returns and exchanges. We offer a 30-day return policy with free return shipping. You can initiate returns through your account or contact support for assistance. For detailed return information, visit our Returns page.",
      products: "I'd be happy to help you find the perfect products! We offer a wide range of fashion items for men and women. You can browse our categories, use the search function, or check our New Arrivals section. If you need specific product recommendations, please let me know your preferences!",
      account: "I can help you with account-related questions. You can manage your account settings, view order history, update personal information, or contact support for account issues. For login problems, try the 'Forgot Password' option.",
      payment: "For payment-related questions, we accept all major payment methods including cards, UPI, net banking, and COD. All payments are secure and encrypted. If you're experiencing payment issues, please contact our billing support team.",
      sizing: "I can help you with sizing questions! We provide detailed size charts for each product. Most items are true to size, but check individual product descriptions for specific fit notes. If you're unsure, we recommend sizing up for comfort.",
      fashion: "I'd love to help with fashion and styling advice! We offer trendy clothing for all occasions. Check our collections for party wear, casual wear, and traditional Indian wear. For styling tips, browse our Fashion Guide section.",
      technical: "I understand you're experiencing a technical issue. Please try refreshing the page, clearing your browser cache, or using a different browser. If the problem persists, contact our technical support at tech@fashionforward.com or call +91-9876543210.",
      general: "I'm here to help! I can assist you with orders, products, shipping, returns, payments, sizing, and fashion advice. Could you please provide more details about what you're looking for? You can also browse our Help Center for detailed guides."
    };

    return responses[intent] || responses.general;
  }

  getSuggestedActions(intent) {
    const actions = {
      shipping: ["Track Order", "Shipping Policy", "Contact Support", "Delivery Status"],
      returns: ["Return Policy", "Start Return", "Exchange Item", "Contact Support"],
      products: ["Browse Products", "Search Items", "View Categories", "New Arrivals"],
      account: ["My Account", "Order History", "Update Profile", "Contact Support"],
      payment: ["Payment Methods", "Billing Support", "Transaction History", "Contact Support"],
      sizing: ["Size Guide", "Size Chart", "Fit Guide", "Contact Support"],
      fashion: ["Browse Collections", "Fashion Guide", "Styling Tips", "New Arrivals"],
      technical: ["Contact Support", "Report Issue", "Help Center", "Technical Support"],
      general: ["Browse Products", "Contact Support", "Help Center", "About Us"]
    };

    return actions[intent] || actions.general;
  }

  async saveConversation(sessionId, userId, userMessage, botResponse, intent) {
    try {
      let conversation = await Conversation.findOne({ sessionId });
      
      if (!conversation) {
        conversation = new Conversation({
          sessionId,
          userId,
          messages: []
        });
      }

      conversation.messages.push({
        role: 'user',
        content: userMessage,
        intent: intent.intent,
        confidence: intent.confidence
      });

      conversation.messages.push({
        role: 'assistant',
        content: botResponse,
        intent: intent.intent,
        confidence: intent.confidence
      });

      await conversation.save();
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  async learnFromFeedback(knowledgeId, feedback) {
    try {
      const knowledge = await KnowledgeBase.findById(knowledgeId);
      if (!knowledge) return;

      if (feedback.helpful) {
        knowledge.feedback.positive += 1;
        knowledge.successRate = Math.min(knowledge.successRate + 0.1, 1);
      } else {
        knowledge.feedback.negative += 1;
        knowledge.successRate = Math.max(knowledge.successRate - 0.1, 0);
      }

      knowledge.confidence = knowledge.successRate;
      
      await knowledge.save();
    } catch (error) {
      console.error('Error learning from feedback:', error);
    }
  }

  async addNewKnowledge(question, answer, intent, keywords = []) {
    try {
      const newKnowledge = new KnowledgeBase({
        question,
        answer,
        intent,
        keywords,
        confidence: 0.7, // Start with medium confidence
        usageCount: 1
      });

      await newKnowledge.save();
      return newKnowledge;
    } catch (error) {
      console.error('Error adding new knowledge:', error);
      return null;
    }
  }

  async getAnalytics() {
    try {
      const totalConversations = await Conversation.countDocuments();
      const totalMessages = await Conversation.aggregate([
        { $unwind: '$messages' },
        { $count: 'total' }
      ]);

      const intentDistribution = await Conversation.aggregate([
        { $unwind: '$messages' },
        { $match: { 'messages.role': 'user' } },
        { $group: { _id: '$messages.intent', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      const knowledgeStats = await KnowledgeBase.aggregate([
        {
          $group: {
            _id: null,
            totalKnowledge: { $sum: 1 },
            avgConfidence: { $avg: '$confidence' },
            avgUsage: { $avg: '$usageCount' }
          }
        }
      ]);

      return {
        totalConversations,
        totalMessages: totalMessages[0]?.total || 0,
        intentDistribution,
        knowledgeStats: knowledgeStats[0] || {}
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return null;
    }
  }
}

module.exports = new MLChatbotService();
