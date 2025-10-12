import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XMarkIcon, ShoppingBagIcon, HeartIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300); // Match animation duration
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />;
      case 'info':
        return <InformationCircleIcon className="w-6 h-6 text-blue-600" />;
      case 'cart':
        return <ShoppingBagIcon className="w-6 h-6 text-purple-600" />;
      case 'wishlist':
        return <HeartIcon className="w-6 h-6 text-pink-600" />;
      default:
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'cart':
        return 'bg-purple-50 border-purple-200';
      case 'wishlist':
        return 'bg-pink-50 border-pink-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      case 'cart':
        return 'text-purple-800';
      case 'wishlist':
        return 'text-pink-800';
      default:
        return 'text-green-800';
    }
  };

  return (
    <div
      className={`
        fixed top-20 right-4 z-[9999] max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
        ${getBackgroundColor()}
        border rounded-xl shadow-lg backdrop-blur-sm
        ${toast.duration ? 'cursor-pointer' : ''}
      `}
      onClick={toast.duration ? handleRemove : undefined}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            {toast.title && (
              <h3 className={`text-sm font-semibold ${getTextColor()}`}>
                {toast.title}
              </h3>
            )}
            <p className={`text-sm ${getTextColor()} ${toast.title ? 'mt-1' : ''}`}>
              {toast.message}
            </p>
            {toast.action && (
              <div className="mt-2">
                {toast.action}
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleRemove}
              className={`
                inline-flex rounded-md p-1.5 
                ${getTextColor()} 
                hover:bg-black hover:bg-opacity-5 
                focus:outline-none focus:ring-2 focus:ring-offset-2 
                transition-colors duration-200
              `}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar for auto-dismiss */}
      {toast.duration && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-10 rounded-b-xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-b-xl transition-all ease-linear"
            style={{
              animation: `shrink ${toast.duration}ms linear forwards`
            }}
          />
        </div>
      )}
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
