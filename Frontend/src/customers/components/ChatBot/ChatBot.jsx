import React, { useState, useRef, useEffect } from 'react';
import { 
  XMarkIcon, 
  PaperAirplaneIcon, 
  UserIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const ChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI assistant. I can help you with common questions about orders, shipping, returns, and account issues. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const botResponses = {
    'order': {
      keywords: ['order', 'track', 'status', 'shipped', 'delivery', 'when will my order arrive'],
      response: "To track your order, please go to 'My Orders' in your account dashboard. You'll find tracking information and delivery updates there. Orders typically take 5-7 business days for standard shipping."
    },
    'cancel': {
      keywords: ['cancel', 'cancel order', 'cancel my order'],
      response: "You can cancel your order within 2 hours of placing it. Go to 'My Orders' and click 'Cancel Order'. After 2 hours, please contact our support team for assistance."
    },
    'return': {
      keywords: ['return', 'refund', 'exchange', 'send back', 'return policy'],
      response: "We offer a 30-day return policy for unused items in original packaging. Go to 'My Orders', select the item, and follow the return process. Returns are free for defective items."
    },
    'shipping': {
      keywords: ['shipping', 'delivery', 'how long', 'shipping time', 'express', 'free shipping'],
      response: "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Free shipping is available on orders over ₹2000. International shipping is not currently available."
    },
    'payment': {
      keywords: ['payment', 'pay', 'card', 'secure', 'refund', 'money back'],
      response: "We accept all major credit/debit cards, UPI, and net banking. All payments are processed securely with SSL encryption. Refunds are processed within 5-7 business days after we receive returned items."
    },
    'account': {
      keywords: ['account', 'login', 'password', 'sign up', 'profile', 'address'],
      response: "For account issues, you can reset your password using 'Forgot Password' on the login page. To update your address, go to 'My Addresses' in your account dashboard."
    },
    'size': {
      keywords: ['size', 'sizing', 'fit', 'measurements', 'size guide'],
      response: "Check our size guide on each product page for detailed measurements. If you need a different size, you can exchange items within 30 days. Exchange shipping is free for size exchanges."
    },
    'product': {
      keywords: ['product', 'item', 'out of stock', 'restock', 'color', 'available'],
      response: "For product availability and restock notifications, check the product page. You can sign up for restock alerts. If you have specific product questions, I recommend contacting our support team."
    },
    'wishlist': {
      keywords: ['wishlist', 'save', 'favorite', 'heart'],
      response: "You can add items to your wishlist by clicking the heart icon on any product. View your saved items in 'My Wishlist' from your account menu."
    },
    'cart': {
      keywords: ['cart', 'add to cart', 'checkout', 'buy now'],
      response: "Add items to your cart and proceed to checkout. Make sure to select size and color before adding to cart. You can view your cart anytime by clicking the cart icon."
    },
    'color': {
      keywords: ['color', 'colour', 'select color', 'choose color', 'color options', 'different colors', 'color selection', 'what colors available', 'color choice', 'how to select color'],
      response: "To select a color, click on the color swatches on the product page. Each color option shows a preview of how the item will look. Colors may vary slightly due to monitor settings, but we try to show accurate representations. If the color is significantly different, you can return it for a full refund."
    },
    'discount': {
      keywords: ['discount', 'coupon', 'promo code', 'offer', 'sale', 'deal', 'save money', 'discount code', 'voucher', 'promotion'],
      response: "We regularly offer discounts and promotions. Check our 'Sales' page for current offers. You can apply promo codes at checkout. Sign up for our newsletter to receive exclusive discount codes and early access to sales."
    },
    'quality': {
      keywords: ['quality', 'material', 'fabric', 'durable', 'long lasting', 'good quality', 'premium', 'authentic', 'material quality'],
      response: "We source high-quality materials and work with trusted manufacturers. All products undergo quality checks before shipping. We offer detailed product descriptions including materials used. If you're not satisfied with quality, our 30-day return policy applies."
    },
    'care': {
      keywords: ['care', 'washing', 'washing instructions', 'how to wash', 'maintenance', 'care instructions', 'dry clean', 'how to care'],
      response: "Care instructions are provided on each product page and on the garment label. Most items can be machine washed on gentle cycle. For delicate items, we recommend hand washing or dry cleaning. Following care instructions helps maintain product quality."
    },
    'gift': {
      keywords: ['gift', 'gift wrap', 'present', 'gift card', 'surprise', 'gift options', 'gift packaging', 'gift wrapping'],
      response: "We offer gift wrapping services for special occasions. You can add gift wrap at checkout. We also offer gift cards that can be purchased and sent to recipients. Gift receipts are available for easy returns."
    },
    'international': {
      keywords: ['international', 'overseas', 'outside india', 'global shipping', 'worldwide', 'export', 'ship abroad'],
      response: "Currently, we only ship within India. We're working on expanding our international shipping options. For international customers, we recommend using package forwarding services. We'll announce international shipping when it becomes available."
    },
    'bulk': {
      keywords: ['bulk', 'wholesale', 'large order', 'multiple items', 'business order', 'corporate', 'quantity discount', 'bulk purchase'],
      response: "For bulk orders or wholesale inquiries, please contact our business team at business@fashionforward.com. We offer special pricing for large quantities and can arrange custom solutions for corporate clients."
    },
    'new': {
      keywords: ['new arrivals', 'latest', 'new products', 'recently added', 'new collection', 'latest fashion', 'new items'],
      response: "Check our 'New Arrivals' page for the latest products and collections. We add new items regularly. You can also filter products by 'New' to see recently added items. Follow us on social media for early access to new collections."
    },
    'brand': {
      keywords: ['brand', 'brands', 'which brand', 'brand names', 'popular brands', 'brand quality', 'branded products'],
      response: "We carry various fashion brands known for quality and style. You can filter products by brand on our product pages. Each brand has its own unique style and quality standards. Check individual product pages for specific brand information."
    },
    'seasonal': {
      keywords: ['season', 'seasonal', 'winter', 'summer', 'monsoon', 'weather', 'seasonal collection', 'weather appropriate'],
      response: "We offer seasonal collections for different weather conditions. Check our seasonal categories for weather-appropriate clothing. We update our collections based on seasons and current fashion trends."
    },
    'measurement': {
      keywords: ['measurement', 'measure', 'how to measure', 'body measurements', 'size measurement', 'measuring guide', 'how to take measurements'],
      response: "For accurate measurements, use a soft measuring tape. Measure your chest, waist, hips, and inseam. Compare these measurements with our size chart. We provide detailed measurement guides on each product page for the best fit."
    },
    'exchange': {
      keywords: ['exchange', 'swap', 'change size', 'change color', 'exchange policy', 'size exchange', 'color exchange', 'how to exchange'],
      response: "You can exchange items within 30 days of purchase. Exchanges are free for size and color changes. Go to 'My Orders' and select the exchange option. We'll send you a prepaid return label and process your exchange quickly."
    },
    'delivery': {
      keywords: ['delivery', 'delivery address', 'change address', 'delivery time', 'delivery options', 'home delivery', 'delivery location'],
      response: "We deliver to all major cities in India. You can update your delivery address in 'My Addresses'. Delivery times vary by location - metro cities get faster delivery. You can track your delivery in real-time using the tracking number."
    },
    'customer': {
      keywords: ['customer service', 'support', 'help', 'assistance', 'contact', 'customer care', 'service', 'get help'],
      response: "Our customer service team is available 24/7 via chat, email, and phone. You can reach us at support@fashionforward.com or call +91-8000-123-456. We're here to help with any questions or concerns you may have."
    },
    'website': {
      keywords: ['website', 'site', 'navigation', 'how to use', 'how to navigate', 'website features', 'how to shop'],
      response: "Our website is designed for easy navigation. Use the search bar to find specific products, browse categories in the navigation menu, and filter products by size, color, price, and brand. Create an account to save your preferences and track orders."
    },
    'mobile': {
      keywords: ['mobile', 'phone', 'app', 'mobile site', 'mobile version', 'smartphone', 'tablet'],
      response: "Our website is fully responsive and works great on mobile devices. You can shop, track orders, and manage your account from any smartphone or tablet. We're working on a dedicated mobile app for even better mobile experience."
    },
    'security': {
      keywords: ['security', 'safe', 'secure', 'privacy', 'data protection', 'personal information', 'secure payment'],
      response: "We take security seriously. All payments are processed through secure SSL encryption. We never store your payment details. Your personal information is protected and never shared with third parties. We use industry-standard security measures."
    },
    'reviews': {
      keywords: ['reviews', 'ratings', 'feedback', 'customer reviews', 'product reviews', 'rating', 'testimonials'],
      response: "Customer reviews help you make informed decisions. You can read reviews and ratings on each product page. After purchase, you can leave your own review to help other customers. We moderate all reviews to ensure authenticity."
    },
    'newsletter': {
      keywords: ['newsletter', 'email updates', 'notifications', 'subscribe', 'email alerts', 'promotional emails'],
      response: "Subscribe to our newsletter for exclusive offers, new arrivals, and fashion tips. You can unsubscribe anytime. We respect your privacy and never spam. Newsletter subscribers get early access to sales and special discounts."
    },
    'social': {
      keywords: ['social media', 'instagram', 'facebook', 'twitter', 'follow', 'social', 'social networks'],
      response: "Follow us on social media for fashion inspiration, behind-the-scenes content, and exclusive offers. We're active on Instagram, Facebook, and Twitter. Social media is also a great way to get style tips and see how others wear our products."
    }
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    for (const [category, data] of Object.entries(botResponses)) {
      for (const keyword of data.keywords) {
        if (message.includes(keyword)) {
          return data.response;
        }
      }
    }

    const complexQueries = [
      'complaint', 'problem', 'issue', 'not working', 'broken', 'defective',
      'wrong item', 'damaged', 'missing', 'lost', 'stolen', 'fraud',
      'legal', 'lawsuit', 'sue', 'compensation', 'refund policy details',
      'bulk order', 'wholesale', 'business', 'corporate', 'partnership',
      'custom', 'personalized', 'made to order', 'special order',
      'technical', 'bug', 'error', 'website not working', 'page not loading',
      'complaint', 'unhappy', 'dissatisfied', 'poor quality', 'bad experience',
      'refund immediately', 'urgent', 'asap', 'emergency', 'critical'
    ];

    const isComplexQuery = complexQueries.some(query => message.includes(query));

    if (isComplexQuery) {
      return "I understand you have a more complex issue. For detailed assistance, I recommend contacting our support team directly. You can email us at support@fashionforward.com or call us at +91-8000-123-456 (Mon-Fri 9AM-6PM). Our human support team will be better equipped to help you with this matter.";
    }

    return "I'm not sure I understand your question completely. Could you please rephrase it or be more specific? For complex issues, I recommend contacting our support team at support@fashionforward.com or calling +91-8000-123-456.";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "How do I track my order?",
    "What's your return policy?",
    "How long does shipping take?",
    "How do I select color?",
    "How do I choose the right size?",
    "How do I cancel an order?",
    "Is my payment secure?",
    "How do I exchange an item?",
    "Do you offer discounts?",
    "How do I add to wishlist?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-auto mt-20 h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-xs text-purple-100">Online now</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {message.sender === 'user' ? (
                    <UserIcon className="w-5 h-5" />
                  ) : (
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  )}
                </div>
                <div className={`rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors duration-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </div>
          
          {/* Support Info */}
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <InformationCircleIcon className="w-4 h-4 mr-1" />
            <span>For complex issues, contact our support team</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
