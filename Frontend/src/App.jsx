/**
 * Fashion Store E-commerce - Main App Component
 * 
 * This is the root component of the Fashion Store React application.
 * It sets up the application structure with all necessary providers
 * and routing configuration.
 * 
 * Features:
 * - React Router for navigation
 * - Context providers for global state management
 * - Toast notifications system
 * - Authentication state management
 * - Shopping cart and wishlist functionality
 * - Address management
 * 
 * @author Fashion Store Development Team
 * @version 1.0.0
 */

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Context providers for global state management
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { AuthProvider } from './contexts/AuthContext';
import { AddressProvider } from './contexts/AddressContext';
import { ToastProvider } from './contexts/ToastContext';

// Components
import ToastContainer from './components/Toast/ToastContainer';
import AppContent from './components/AppContent/AppContent';
import './App.css';

/**
 * Main App Component
 * 
 * This component wraps the entire application with necessary providers
 * and sets up the routing structure. The provider hierarchy ensures
 * that all child components have access to the required context.
 * 
 * Provider Hierarchy (outer to inner):
 * 1. ToastProvider - Global toast notifications
 * 2. AuthProvider - User authentication state
 * 3. AddressProvider - User address management
 * 4. WishlistProvider - User wishlist functionality
 * 5. CartProvider - Shopping cart state
 * 
 * @returns {JSX.Element} The main application component
 */
function App() {
  return (
    <Router>
      {/* Toast notifications provider - outermost for global access */}
      <ToastProvider>
        {/* Authentication provider - manages user login state */}
        <AuthProvider>
          {/* Address provider - manages user addresses */}
          <AddressProvider>
            {/* Wishlist provider - manages user wishlist */}
            <WishlistProvider>
              {/* Cart provider - manages shopping cart */}
              <CartProvider>
                {/* Main application content with routing */}
                <AppContent />
                {/* Toast notification container */}
                <ToastContainer />
              </CartProvider>
            </WishlistProvider>
          </AddressProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;