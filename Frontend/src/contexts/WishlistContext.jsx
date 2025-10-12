import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'SET_WISHLIST':
      return {
        ...state,
        wishlist: action.payload,
        loading: false,
        error: null
      };

    case 'ADD_TO_WISHLIST':
      const existingItem = state.wishlist.find(item => item._id === action.payload._id);
      if (existingItem) {
        return state; // Already in wishlist
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item._id !== action.payload)
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

const initialState = {
  wishlist: [],
  loading: false,
  error: null
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { isAuthenticated } = useAuth();
  const { showWishlistSuccess, showWishlistRemoved, showLoginRequired } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      // Clear wishlist when user logs out
      dispatch({ type: 'SET_WISHLIST', payload: [] });
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    if (!isAuthenticated) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await apiService.getWishlist();
      if (response.success) {
        // Transform the data to match frontend expectations
        const wishlistItems = response.data.map(item => ({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          originalPrice: item.product.originalPrice,
          image: item.product.images?.[0]?.url,
          images: item.product.images,
          category: item.product.category,
          brand: item.product.brand,
          inStock: item.product.inStock,
          rating: item.product.rating,
          reviewCount: item.product.reviewCount,
          addedAt: item.addedAt
        }));
        dispatch({ type: 'SET_WISHLIST', payload: wishlistItems });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to load wishlist' });
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load wishlist' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToWishlist = async (product) => {
    if (!isAuthenticated) {
      showLoginRequired('add items to wishlist');
      return { success: false, error: 'Please log in to add items to wishlist' };
    }

    try {
      const existingItem = state.wishlist.find(item => item._id === product._id);
      if (existingItem) {
        return { success: false, error: 'Item already in wishlist' };
      }

      const response = await apiService.addToWishlist(product._id);
      if (response.success) {
        // Transform the added item to match frontend expectations
        const wishlistItem = {
          _id: product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images?.[0]?.url,
          images: product.images,
          category: product.category,
          brand: product.brand,
          inStock: product.inStock,
          rating: product.rating,
          reviewCount: product.reviewCount,
          addedAt: new Date().toISOString()
        };
        
        dispatch({ type: 'ADD_TO_WISHLIST', payload: wishlistItem });
        
        // Show success toast
        showWishlistSuccess(product.name || 'Product', {
          action: (
            <button 
              onClick={() => navigate('/wishlist')}
              className="text-pink-600 hover:text-pink-700 font-medium underline"
            >
              View Wishlist
            </button>
          )
        });
        
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Failed to add to wishlist' };
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, error: 'Failed to add to wishlist' };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please log in to manage wishlist' };
    }

    try {
      // Get product name before removing
      const item = state.wishlist.find(item => item._id === productId);
      const productName = item?.name || 'Product';
      
      const response = await apiService.removeFromWishlist(productId);
      if (response.success) {
        dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
        
        // Show removal toast
        showWishlistRemoved(productName);
        
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Failed to remove from wishlist' };
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, error: 'Failed to remove from wishlist' };
    }
  };

  const isInWishlist = (productId) => {
    return state.wishlist.some(item => item._id === productId);
  };

  const getWishlistCount = () => {
    return state.wishlist.length;
  };

  const clearWishlist = async () => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please log in to manage wishlist' };
    }

    try {
      const response = await apiService.clearWishlist();
      if (response.success) {
        dispatch({ type: 'SET_WISHLIST', payload: [] });
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Failed to clear wishlist' };
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return { success: false, error: 'Failed to clear wishlist' };
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    wishlistItems: state.wishlist, // Alias for compatibility
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistCount,
    clearError,
    loadWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
