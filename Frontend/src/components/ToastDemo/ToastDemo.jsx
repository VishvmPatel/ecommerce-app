import React from 'react';
import { useToast } from '../../contexts/ToastContext';

const ToastDemo = () => {
  const { 
    showCartSuccess, 
    showWishlistSuccess, 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo 
  } = useToast();

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Toast Notification Demo</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={() => showCartSuccess('Designer Sunglasses')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Cart Success
        </button>
        
        <button
          onClick={() => showWishlistSuccess('Premium Watch')}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          Wishlist Success
        </button>
        
        <button
          onClick={() => showSuccess('Operation completed successfully!')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Success
        </button>
        
        <button
          onClick={() => showError('Something went wrong!')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Error
        </button>
        
        <button
          onClick={() => showWarning('Please check your input')}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Warning
        </button>
        
        <button
          onClick={() => showInfo('Here is some useful information')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Info
        </button>
      </div>
    </div>
  );
};

export default ToastDemo;

