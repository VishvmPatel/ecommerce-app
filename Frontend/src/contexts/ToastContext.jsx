import React, { createContext, useContext, useReducer } from 'react';

const ToastContext = createContext();

const toastReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TOAST':
      return [...state, action.payload];
    case 'REMOVE_TOAST':
      return state.filter(toast => toast.id !== action.payload);
    case 'CLEAR_ALL_TOASTS':
      return [];
    default:
      return state;
  }
};

const initialState = [];

export const ToastProvider = ({ children }) => {
  const [toasts, dispatch] = useReducer(toastReducer, initialState);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      duration: 4000, // Default 4 seconds
      ...toast
    };
    dispatch({ type: 'ADD_TOAST', payload: newToast });
    return id;
  };

  const removeToast = (id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  const clearAllToasts = () => {
    dispatch({ type: 'CLEAR_ALL_TOASTS' });
  };

  // Convenience methods for different toast types
  const showSuccess = (message, title = 'Success!', options = {}) => {
    return addToast({
      type: 'success',
      title,
      message,
      ...options
    });
  };

  const showError = (message, title = 'Error', options = {}) => {
    return addToast({
      type: 'error',
      title,
      message,
      duration: 6000, // Longer duration for errors
      ...options
    });
  };

  const showWarning = (message, title = 'Warning', options = {}) => {
    return addToast({
      type: 'warning',
      title,
      message,
      ...options
    });
  };

  const showInfo = (message, title = 'Info', options = {}) => {
    return addToast({
      type: 'info',
      title,
      message,
      ...options
    });
  };

  const showCartSuccess = (productName, options = {}) => {
    return addToast({
      type: 'cart',
      title: 'Added to Cart! 🛍️',
      message: `${productName} has been added to your cart successfully!`,
      ...options
    });
  };

  const showWishlistSuccess = (productName, options = {}) => {
    return addToast({
      type: 'wishlist',
      title: 'Added to Wishlist! 💖',
      message: `${productName} has been added to your wishlist!`,
      ...options
    });
  };

  const showWishlistRemoved = (productName, options = {}) => {
    return addToast({
      type: 'wishlist',
      title: 'Removed from Wishlist',
      message: `${productName} has been removed from your wishlist.`,
      ...options
    });
  };

  const showCartRemoved = (productName, options = {}) => {
    return addToast({
      type: 'cart',
      title: 'Removed from Cart',
      message: `${productName} has been removed from your cart.`,
      ...options
    });
  };

  const showLoginRequired = (action = 'perform this action', options = {}) => {
    return addToast({
      type: 'warning',
      title: 'Login Required',
      message: `Please log in to ${action}.`,
      duration: 5000,
      ...options
    });
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCartSuccess,
    showWishlistSuccess,
    showWishlistRemoved,
    showCartRemoved,
    showLoginRequired
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};


