import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const cartItemId = `${action.payload.id}_${action.payload.size || 'default'}_${action.payload.color || 'default'}`;
      
      const existingItem = state.items.find(item => item.cartItemId === cartItemId);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, { 
            ...action.payload, 
            cartItemId,
            quantity: action.payload.quantity || 1 
          }]
        };
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.cartItemId !== action.payload.cartItemId)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.cartItemId === action.payload.cartItemId
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      };

    default:
      return state;
  }
};

const initialState = {
  items: []
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (cartItemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { cartItemId } });
  };

  const updateQuantity = (cartItemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartSubtotal = () => {
    return state.items.reduce((subtotal, item) => {
      return subtotal + (item.price * item.quantity);
    }, 0);
  };

  const getCartDiscount = () => {
    return state.items.reduce((discount, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return discount + ((item.originalPrice - item.price) * item.quantity);
      }
      return discount;
    }, 0);
  };

  const getCartTax = () => {
    const subtotal = getCartSubtotal();
    return subtotal * 0.18; // 18% GST
  };

  const getCartShipping = () => {
    const subtotal = getCartSubtotal();
    return subtotal > 2000 ? 0 : 100; // Free shipping above ₹2000
  };

  const getCartGrandTotal = () => {
    return getCartSubtotal() + getCartTax() + getCartShipping() - getCartDiscount();
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getCartSubtotal,
    getCartDiscount,
    getCartTax,
    getCartShipping,
    getCartGrandTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
