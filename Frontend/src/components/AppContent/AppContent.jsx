import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from '../../customers/components/Navigation/Navigation.jsx';
import HomePage from '../../customers/pages/HomePage/HomePage.jsx';
import LoginPage from '../../customers/pages/Auth/LoginPage/LoginPage.jsx';
import SignUpPage from '../../customers/pages/Auth/SignUpPage/SignUpPage.jsx';
import AboutUs from '../../customers/pages/AboutUs/AboutUs.jsx';
import ContactUs from '../../customers/pages/ContactUs/ContactUs.jsx';
import ProductDetail from '../../customers/pages/ProductDetail/ProductDetail.jsx';
import NewArrivals from '../../customers/pages/NewArrivals/NewArrivals.jsx';
import CategoryPage from '../../customers/pages/CategoryPage/CategoryPage.jsx';
import WomenSection from '../../customers/pages/WomenSection/WomenSection.jsx';
import MenSection from '../../customers/pages/MenSection/MenSection.jsx';
import AccessoriesPage from '../../customers/pages/AccessoriesPage/AccessoriesPage.jsx';
import SearchResults from '../../customers/pages/SearchResults/SearchResults.jsx';
import SalesPage from '../../customers/pages/SalesPage/SalesPage.jsx';
import AllProducts from '../../customers/pages/AllProducts/AllProducts.jsx';
import Collections from '../../customers/pages/Collections/Collections.jsx';
import CartPage from '../../customers/pages/CartPage/CartPage.jsx';
import WishlistPage from '../../customers/pages/WishlistPage/WishlistPage.jsx';
import ProfilePage from '../../customers/pages/ProfilePage/ProfilePage.jsx';
import MyAddresses from '../../customers/pages/MyAddresses/MyAddresses.jsx';
import MyOrders from '../../customers/pages/MyOrders/MyOrders.jsx';
import HelpSupport from '../../customers/pages/HelpSupport/HelpSupport.jsx';
import ForgotPassword from '../../customers/pages/Auth/ForgotPassword/ForgotPassword.jsx';
import ResetPassword from '../../customers/pages/Auth/ResetPassword/ResetPassword.jsx';
import GoogleSignInTest from '../../customers/pages/GoogleSignInTest/GoogleSignInTest';
import GoogleCallback from '../../customers/pages/Auth/GoogleCallback/GoogleCallback';
import GoogleCallbackDebug from '../../customers/pages/Auth/GoogleCallbackDebug/GoogleCallbackDebug';
import GoogleAuthTest from '../../customers/pages/Auth/GoogleAuthTest/GoogleAuthTest';
import GoogleCallbackTest from '../../customers/pages/Auth/GoogleCallbackTest/GoogleCallbackTest';
import ProfileCompletionModal from '../../customers/components/ProfileCompletionModal/ProfileCompletionModal';
import FloatingChatButton from '../../customers/components/FloatingChatButton/FloatingChatButton.jsx';
import ProfileCompletionTest from '../ProfileCompletionTest/ProfileCompletionTest';
import AdminRoutes from '../../admin/AdminRoutes';
import { useProfileCompletion } from '../../hooks/useProfileCompletion';

const AppContent = () => {
  const { showModal, closeModal, handleProfileComplete, user } = useProfileCompletion();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 w-full">
        <Navigation />
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/women" element={<WomenSection />} />
          <Route path="/men" element={<MenSection />} />
          <Route path="/accessories" element={<AccessoriesPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/sale" element={<SalesPage />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/addresses" element={<MyAddresses />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/help" element={<HelpSupport />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/google-test" element={<GoogleSignInTest />} />
          <Route path="/google-callback" element={<GoogleCallback />} />
          <Route path="/google-callback-debug" element={<GoogleCallbackDebug />} />
          <Route path="/google-auth-test" element={<GoogleAuthTest />} />
          <Route path="/google-callback-test" element={<GoogleCallbackTest />} />
          <Route path="/profile-test" element={<ProfileCompletionTest />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </div>
      <FloatingChatButton />
      
      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        isOpen={showModal}
        onClose={closeModal}
        user={user}
        onComplete={handleProfileComplete}
      />
    </Router>
  );
};

export default AppContent;
