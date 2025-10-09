import React from 'react';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import AppContent from './components/AppContent/AppContent';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;