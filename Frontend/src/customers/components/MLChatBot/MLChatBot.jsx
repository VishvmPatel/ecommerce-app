import React, { useState, useRef, useEffect } from 'react';
import { 
  XMarkIcon, 
  PaperAirplaneIcon, 
  UserIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import MLChatbotService from '../../../services/mlChatbotService';

const MLChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI assistant with machine learning capabilities. I can help you with orders, shipping, returns, products, and more. I learn from every conversation to provide better assistance! How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      intent: 'general',
      confidence: 1.0
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState([]);
  const [lastMessageId, setLastMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const mlService = useRef(new MLChatbotService());

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

    try {
      const response = await mlService.current.sendMessage(inputMessage);
      
      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: response.message,
          sender: 'bot',
          timestamp: new Date(),
          intent: response.intent,
          confidence: response.confidence,
          knowledgeId: response.knowledgeId
        };

        setMessages(prev => [...prev, botMessage]);
        setSuggestedActions(response.suggestedActions || []);
        setLastMessageId(botMessage.id);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          text: response.message || "I'm sorry, I couldn't process your request. Please try again.",
          sender: 'bot',
          timestamp: new Date(),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm experiencing technical difficulties. Please try again or contact our support team.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedAction = (action) => {
    setInputMessage(action);
    setSuggestedActions([]);
  };

  const handleFeedback = async (messageId, helpful) => {
    try {
      const message = messages.find(m => m.id === messageId);
      if (message && message.knowledgeId) {
        const success = await mlService.current.provideFeedback(
          message.knowledgeId,
          helpful
        );
        
        if (success) {
          setMessages(prev => prev.map(m => 
            m.id === messageId 
              ? { ...m, feedbackRecorded: true, feedbackHelpful: helpful }
              : m
          ));
        }
      }
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (confidence) => {
    if (confidence >= 0.8) return 'High confidence';
    if (confidence >= 0.6) return 'Medium confidence';
    return 'Low confidence';
  };

  return (
    <div className={`fixed inset-0 z-[9999] overflow-hidden ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
              <div>
                <h3 className="text-lg font-semibold">AI Assistant</h3>
                <p className="text-purple-100 text-sm">Powered by Machine Learning</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : message.isError
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <UserIcon className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.text}</p>
                      
                      {/* ML Information */}
                      {message.sender === 'bot' && message.intent && (
                        <div className="mt-2 text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">Intent:</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {message.intent}
                            </span>
                            <span className={`font-medium ${getConfidenceColor(message.confidence)}`}>
                              {getConfidenceText(message.confidence)}
                            </span>
                            {message.isFallback && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                Offline Mode
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Feedback Buttons */}
                      {message.sender === 'bot' && message.knowledgeId && !message.feedbackRecorded && (
                        <div className="mt-2 flex space-x-2">
                          <button
                            onClick={() => handleFeedback(message.id, true)}
                            className="text-xs text-green-600 hover:text-green-800 flex items-center space-x-1"
                          >
                            <HandThumbUpIcon className="w-3 h-3" />
                            <span>Helpful</span>
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, false)}
                            className="text-xs text-red-600 hover:text-red-800 flex items-center space-x-1"
                          >
                            <HandThumbDownIcon className="w-3 h-3" />
                            <span>Not helpful</span>
                          </button>
                        </div>
                      )}
                      
                      {message.feedbackRecorded && (
                        <div className="mt-2 text-xs text-gray-500">
                          ✓ Feedback recorded ({message.feedbackHelpful ? 'Helpful' : 'Not helpful'})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4" />
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

          {/* Suggested Actions */}
          {suggestedActions.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <LightBulbIcon className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Suggested actions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedAction(action)}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
                  >
                    {action}
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLChatBot;
