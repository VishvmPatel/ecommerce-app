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
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqCategories = [
    { id: 'all', name: 'All Topics', count: 24 },
    { id: 'orders', name: 'Orders & Shipping', count: 8 },
    { id: 'returns', name: 'Returns & Exchanges', count: 6 },
    { id: 'account', name: 'Account & Billing', count: 5 },
    { id: 'products', name: 'Products & Sizing', count: 5 }
  ];

  const faqs = [
    {
      id: 1,
      category: 'orders',
      question: 'How long does shipping take?',
      answer: 'We offer free shipping on orders over ₹2000. Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days.',
      helpful: 156
    },
    {
      id: 2,
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'You can return items within 30 days of purchase. Items must be unworn, with tags attached, and in original packaging. We offer free return shipping.',
      helpful: 203
    },
    {
      id: 3,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page, enter your email address, and we\'ll send you a reset link. Check your spam folder if you don\'t see the email.',
      helpful: 89
    },
    {
      id: 4,
      category: 'products',
      question: 'How do I find my size?',
      answer: 'Check our size guide on each product page. We provide detailed measurements for each item. If you\'re between sizes, we recommend sizing up.',
      helpful: 134
    },
    {
      id: 5,
      category: 'orders',
      question: 'Can I track my order?',
      answer: 'Yes! Once your order ships, you\'ll receive a tracking number via email. You can also track your order in your account dashboard.',
      helpful: 98
    },
    {
      id: 6,
      category: 'returns',
      question: 'How do I exchange an item?',
      answer: 'Start a return in your account dashboard, select "Exchange" as the reason, and choose your new size or color. We\'ll process the exchange once we receive your return.',
      helpful: 76
    }
  ];

  const contactMethods = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'AI Chatbot',
      description: 'Get instant help from our AI assistant',
      availability: 'Available 24/7',
      action: 'Start Chat',
      color: 'from-blue-500 to-blue-600',
      onClick: () => {
        // Dispatch custom event to open chatbot
        const event = new CustomEvent('openChatbot');
        window.dispatchEvent(event);
      }
    },
    {
      icon: PhoneIcon,
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      availability: 'Mon-Fri, 9AM-6PM',
      action: 'Call Now',
      color: 'from-green-500 to-green-600',
      onClick: () => {
        window.open('tel:+911234567890', '_self');
      }
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'Response within 24 hours',
      action: 'Send Email',
      color: 'from-purple-500 to-purple-600',
      onClick: () => {
        window.open('mailto:support@fashionforward.com?subject=Support Request', '_blank');
      }
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
            <QuestionMarkCircleIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Help & Support
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help! Find answers to common questions or get in touch with our support team.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
            />
          </div>
        </div>

        {/* AI Chatbot Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12 border border-blue-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Try Our AI Assistant</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Get instant answers to your questions with our intelligent chatbot. Available 24/7 to help with orders, products, and general inquiries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  // Dispatch custom event to open chatbot
                  const event = new CustomEvent('openChatbot');
                  window.dispatchEvent(event);
                }}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6 mr-3" />
                Start AI Chat
              </button>
              <button
                onClick={() => {
                  // Scroll to FAQ section
                  document.querySelector('#faq-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center px-8 py-4 border-2 border-blue-500 text-blue-600 text-lg font-semibold rounded-full hover:bg-blue-50 transition-all duration-300"
              >
                Browse FAQs Instead
              </button>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl mb-4`}>
                <method.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
              <p className="text-gray-600 mb-3">{method.description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <ClockIcon className="w-4 h-4 mr-2" />
                {method.availability}
              </div>
              <button 
                onClick={method.onClick}
                className={`w-full py-2 px-4 bg-gradient-to-r ${method.color} text-white rounded-lg hover:opacity-90 transition-opacity duration-200 font-medium`}
              >
                {method.action}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Categories */}
        <div id="faq-section" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="flex flex-wrap gap-3 mb-8">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-500 hover:text-purple-600'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                  <div className="ml-4 flex items-center text-sm text-gray-500">
                    <CheckCircleIcon className="w-4 h-4 mr-1 text-green-500" />
                    {faq.helpful} found helpful
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms or browse different categories.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Additional Help */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Our support team is ready to assist you with any questions or concerns you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Contact Support
              </button>
              <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-200">
                Browse All Topics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;