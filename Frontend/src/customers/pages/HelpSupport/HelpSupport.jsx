import React, { useState } from 'react';
import { 
  QuestionMarkCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import MLChatBot from '../../components/MLChatBot/MLChatBot';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const faqCategories = [
    {
      id: 'shipping',
      name: 'Shipping & Delivery',
      icon: '🚚',
      faqs: [
        {
          question: 'How long does shipping take?',
          answer: 'We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Free shipping is available on orders over ₹2000.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Currently, we only ship within India. We\'re working on expanding our international shipping options.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Yes! Once your order ships, you\'ll receive a tracking number via email and SMS. You can also track it in your account under "My Orders".'
        },
        {
          question: 'What if my package is damaged?',
          answer: 'If your package arrives damaged, please contact us within 48 hours with photos. We\'ll arrange for a replacement or full refund.'
        }
      ]
    },
    {
      id: 'orders',
      name: 'Orders & Returns',
      icon: '📦',
      faqs: [
        {
          question: 'How do I cancel my order?',
          answer: 'You can cancel your order within 2 hours of placing it. Go to "My Orders" and click "Cancel Order". After 2 hours, please contact our support team.'
        },
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for unused items in original packaging. Returns are free for defective items or wrong products sent.'
        },
        {
          question: 'How do I return an item?',
          answer: 'Go to "My Orders", select the item you want to return, and follow the return process. We\'ll provide a prepaid return label.'
        },
        {
          question: 'When will I get my refund?',
          answer: 'Refunds are processed within 5-7 business days after we receive your returned item. The money will be credited to your original payment method.'
        }
      ]
    },
    {
      id: 'account',
      name: 'Account & Security',
      icon: '👤',
      faqs: [
        {
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your email address.'
        },
        {
          question: 'How do I update my address?',
          answer: 'Go to "My Addresses" in your account dashboard to add, edit, or delete delivery addresses.'
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes! We use industry-standard SSL encryption and never store your payment details. All transactions are processed securely.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'Contact our support team to delete your account. We\'ll process your request within 24 hours.'
        }
      ]
    },
    {
      id: 'products',
      name: 'Products & Sizing',
      icon: '👕',
      faqs: [
        {
          question: 'How do I find the right size?',
          answer: 'Check our size guide on each product page. We also provide detailed measurements and fit recommendations.'
        },
        {
          question: 'Do you have a size exchange policy?',
          answer: 'Yes! You can exchange items for a different size within 30 days. Exchange shipping is free for size exchanges.'
        },
        {
          question: 'What if the color looks different?',
          answer: 'Colors may vary slightly due to monitor settings. If the color is significantly different, you can return it for a full refund.'
        },
        {
          question: 'Do you restock sold-out items?',
          answer: 'We try to restock popular items. Sign up for restock notifications on the product page to be notified when it\'s back in stock.'
        }
      ]
    }
  ];

  const contactMethods = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: ChatBubbleLeftRightIcon,
      action: 'Start Chat',
      available: '24/7',
      color: 'bg-blue-500'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: EnvelopeIcon,
      action: 'Send Email',
      available: '24 hours response',
      color: 'bg-green-500'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our team',
      icon: PhoneIcon,
      action: 'Call Now',
      available: 'Mon-Fri 9AM-6PM',
      color: 'bg-purple-500'
    }
  ];

  const allFAQs = faqCategories.flatMap(category => 
    category.faqs.map(faq => ({ ...faq, category: category.id, categoryName: category.name }))
  );

  const filteredFAQs = selectedCategory === 'all' 
    ? allFAQs 
    : allFAQs.filter(faq => faq.category === selectedCategory);

  const searchResults = searchQuery 
    ? filteredFAQs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredFAQs;

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600">We're here to help you with any questions or concerns</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help topics, questions, or issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
            />
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <method.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
              <p className="text-gray-600 mb-4">{method.description}</p>
              <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                <ClockIcon className="w-4 h-4 mr-1" />
                {method.available}
              </div>
              <button 
                onClick={() => method.title === 'Live Chat' ? setIsChatOpen(true) : null}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
              >
                {method.action}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Topics
            </button>
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {searchResults.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{faq.question}</h3>
                    <p className="text-sm text-gray-500">{faq.categoryName}</p>
                  </div>
                  {expandedFAQ === index ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {searchResults.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <QuestionMarkCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try searching with different keywords or contact our support team.</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-purple-100 mb-6">Our support team is ready to assist you with any questions or issues.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Contact Support
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-200">
              View Order Status
            </button>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Tracking</h3>
            <p className="text-gray-600 text-sm">Track your orders in real-time</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Issue</h3>
            <p className="text-gray-600 text-sm">Report problems with your order</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <InformationCircleIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Size Guide</h3>
            <p className="text-gray-600 text-sm">Find the perfect fit for you</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <QuestionMarkCircleIcon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">More Help</h3>
            <p className="text-gray-600 text-sm">Browse all help topics</p>
          </div>
        </div>
      </div>

      {/* ML ChatBot */}
      <MLChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default HelpSupport;
