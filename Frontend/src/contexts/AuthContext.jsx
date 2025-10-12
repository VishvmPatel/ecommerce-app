/**
 * Authentication Context - Fashion Store E-commerce
 * 
 * This context provides authentication state management for the entire application.
 * It handles user login, logout, registration, and maintains authentication state
 * across page reloads using localStorage.
 * 
 * Features:
 * - User authentication state management
 * - JWT token handling
 * - Automatic authentication check on app startup
 * - Login/logout functionality
 * - Password reset functionality
 * - Admin role detection
 * - Persistent authentication across page reloads
 * 
 * @author Fashion Store Development Team
 * @version 1.0.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

// Create authentication context
const AuthContext = createContext();

/**
 * Custom hook to use authentication context
 * 
 * This hook provides access to authentication state and methods.
 * It ensures the hook is only used within an AuthProvider.
 * 
 * @returns {Object} Authentication context value
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * 
 * This component provides authentication state and methods to all child components.
 * It manages user authentication, token storage, and automatic authentication checks.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} AuthProvider component
 */
export const AuthProvider = ({ children }) => {
  // Authentication state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Check Authentication Status on App Startup
   * 
   * This effect runs once when the component mounts to check if the user
   * is already authenticated (has a valid token in localStorage).
   */
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token and get user data
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Remove invalid token
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Login Function
   * 
   * Handles user login with email and password.
   * Stores JWT token and updates authentication state.
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} Login result with success status and admin flag
   */
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.login(email, password);
      
      if (response.success) {
        // Store token and update state
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Check if user is admin and return admin flag
        return { 
          success: true, 
          isAdmin: response.user.role === 'admin',
          user: response.user
        };
      } else {
        setError(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signup Function
   * 
   * Handles user registration with provided user data.
   * Stores JWT token and updates authentication state on success.
   * 
   * @param {Object} userData - User registration data
   * @returns {Object} Signup result with success status
   */
  const signup = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.signup(userData);
      
      if (response.success) {
        // Store token and update state
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        setError(response.message || 'Signup failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle validation errors specifically
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = validationErrors.map(err => err.msg).join(', ');
        setError(errorMessages);
        return { success: false, message: errorMessages };
      }
      
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout Function
   * 
   * Handles user logout by clearing token and resetting authentication state.
   * Calls backend logout endpoint and cleans up local storage.
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear authentication state regardless of backend response
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  };

  /**
   * Update Profile Function
   * 
   * Updates user profile information and refreshes user state.
   * 
   * @param {Object} profileData - Updated profile data
   * @returns {Object} Update result with success status
   */
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.updateProfile(profileData);
      
      if (response.success) {
        setUser(response.user);
        return { success: true };
      } else {
        setError(response.message || 'Profile update failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'Profile update failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change Password Function
   * 
   * Changes user password with current password verification.
   * 
   * @param {string} currentPassword - Current password for verification
   * @param {string} newPassword - New password to set
   * @returns {Object} Password change result with success status
   */
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.changePassword(currentPassword, newPassword);
      
      if (response.success) {
        return { success: true };
      } else {
        setError(response.message || 'Password change failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Password change error:', error);
      const errorMessage = error.response?.data?.message || 'Password change failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update User Function
   * 
   * Manually updates user state (used for external updates).
   * 
   * @param {Object} userData - Updated user data
   */
  const updateUser = (userData) => {
    setUser(userData);
  };

  /**
   * Clear Error Function
   * 
   * Clears any authentication errors.
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Context Value
   * 
   * The value object that will be provided to all consuming components.
   * Contains all authentication state and methods.
   */
  const value = {
    // Authentication state
    user,
    isAuthenticated,
    loading,
    error,
    
    // Authentication methods
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
