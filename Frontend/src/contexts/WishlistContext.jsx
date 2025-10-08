import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
  const { isAuthenticated, user } = useAuth();

  // Load wishlist when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlist();
    } else {
      dispatch({ type: 'SET_WISHLIST', payload: [] });
    }
  }, [isAuthenticated, user]);

  const loadWishlist = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // For now, we'll use localStorage as a fallback
      // In a real app, this would make an API call
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      if (savedWishlist) {
        const wishlist = JSON.parse(savedWishlist);
        dispatch({ type: 'SET_WISHLIST', payload: wishlist });
      } else {
        dispatch({ type: 'SET_WISHLIST', payload: [] });
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load wishlist' });
    }
  };

  const addToWishlist = async (product) => {
    try {
      if (!isAuthenticated) {
        dispatch({ type: 'SET_ERROR', payload: 'Please log in to add items to wishlist' });
        return { success: false, error: 'Please log in to add items to wishlist' };
      }

      const existingItem = state.wishlist.find(item => item._id === product._id);
      if (existingItem) {
        return { success: false, error: 'Item already in wishlist' };
      }

      const wishlistItem = {
        _id: product._id || product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0]?.url || product.image,
        images: product.images,
        category: product.category,
        brand: product.brand,
        addedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_TO_WISHLIST', payload: wishlistItem });

      // Save to localStorage
      const updatedWishlist = [...state.wishlist, wishlistItem];
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));

      return { success: true };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add to wishlist' });
      return { success: false, error: 'Failed to add to wishlist' };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      if (!isAuthenticated) {
        return { success: false, error: 'Please log in to manage wishlist' };
      }

      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });

      // Update localStorage
      const updatedWishlist = state.wishlist.filter(item => item._id !== productId);
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));

      return { success: true };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove from wishlist' });
      return { success: false, error: 'Failed to remove from wishlist' };
    }
  };

  const isInWishlist = (productId) => {
    return state.wishlist.some(item => item._id === productId);
  };

  const getWishlistCount = () => {
    return state.wishlist.length;
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    addToWishlist,
    removeFromWishlist,
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
