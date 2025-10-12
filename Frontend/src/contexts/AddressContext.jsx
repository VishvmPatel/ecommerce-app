import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';
import { useAuth } from './AuthContext';

const AddressContext = createContext();

const addressReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ADDRESSES':
      return {
        ...state,
        addresses: action.payload || [],
        loading: false
      };
    case 'ADD_ADDRESS':
      return {
        ...state,
        addresses: [action.payload, ...state.addresses]
      };
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map(address =>
          address._id === action.payload._id ? action.payload : address
        )
      };
    case 'DELETE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.filter(address => address._id !== action.payload)
      };
    case 'SET_DEFAULT_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map(address => ({
          ...address,
          isDefault: address._id === action.payload
        }))
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

const initialState = {
  addresses: [],
  loading: true,
  error: null
};

export const AddressProvider = ({ children }) => {
  const [state, dispatch] = useReducer(addressReducer, initialState);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadAddresses();
    } else {
      dispatch({ type: 'SET_ADDRESSES', payload: [] });
    }
  }, [isAuthenticated]);

  const loadAddresses = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.getAddresses();
      if (response.success) {
        dispatch({ type: 'SET_ADDRESSES', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to load addresses' });
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load addresses' });
    }
  };

  const addAddress = async (addressData) => {
    try {
      const response = await apiService.addAddress(addressData);
      if (response.success) {
        dispatch({ type: 'ADD_ADDRESS', payload: response.data });
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message || 'Failed to add address' };
      }
    } catch (error) {
      console.error('Error adding address:', error);
      return { success: false, error: 'Failed to add address' };
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      const response = await apiService.updateAddress(addressId, addressData);
      if (response.success) {
        dispatch({ type: 'UPDATE_ADDRESS', payload: response.data });
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message || 'Failed to update address' };
      }
    } catch (error) {
      console.error('Error updating address:', error);
      return { success: false, error: 'Failed to update address' };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const response = await apiService.deleteAddress(addressId);
      if (response.success) {
        dispatch({ type: 'DELETE_ADDRESS', payload: addressId });
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Failed to delete address' };
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      return { success: false, error: 'Failed to delete address' };
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const response = await apiService.setDefaultAddress(addressId);
      if (response.success) {
        dispatch({ type: 'SET_DEFAULT_ADDRESS', payload: addressId });
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Failed to set default address' };
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      return { success: false, error: 'Failed to set default address' };
    }
  };

  const getDefaultAddress = () => {
    return state.addresses.find(address => address.isDefault) || null;
  };

  const getAddressById = (addressId) => {
    return state.addresses.find(address => address._id === addressId) || null;
  };

  const value = {
    addresses: state.addresses,
    loading: state.loading,
    error: state.error,
    loadAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
    getAddressById
  };

  return (
    <AddressContext.Provider value={value}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};

