import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from '../../customers/components/Navigation/Navigation.jsx';
import HomePage from '../../customers/pages/HomePage/HomePage.jsx';
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
import CheckoutPage from '../../customers/pages/CheckoutPage/CheckoutPage.jsx';
import OrderConfirmationPage from '../../customers/pages/OrderConfirmation/OrderConfirmationPage.jsx';
import HelpSupport from '../../customers/pages/HelpSupport/HelpSupport.jsx';
import WishlistPage from '../../customers/pages/WishlistPage/WishlistPage.jsx';
import MyOrdersPage from '../../customers/pages/MyOrdersPage/MyOrdersPage.jsx';
import MyAddressesPage from '../../customers/pages/MyAddressesPage/MyAddressesPage.jsx';
import MyProfilePage from '../../customers/pages/MyProfilePage/MyProfilePage.jsx';
import LoginPage from '../../customers/pages/Auth/LoginPage/LoginPage.jsx';
import SignUpPage from '../../customers/pages/Auth/SignUpPage/SignUpPage.jsx';
import ForgotPasswordPage from '../../customers/pages/Auth/ForgotPasswordPage/ForgotPasswordPage.jsx';
import OTPVerificationPage from '../../customers/pages/Auth/OTPVerificationPage/OTPVerificationPage.jsx';
import ResetPasswordPage from '../../customers/pages/Auth/ResetPasswordPage/ResetPasswordPage.jsx';
import FloatingChatButton from '../../customers/components/FloatingChatButton/FloatingChatButton.jsx';
import AdminRouter from '../../admin/AdminRouter.jsx';

const AppContent = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50 w-full">
        <Navigation />
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<HomePage />} />
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
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/help-support" element={<HelpSupport />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/my-addresses" element={<MyAddressesPage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<OTPVerificationPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminRouter />} />
        </Routes>
      </div>
      <FloatingChatButton />
    </>
  );
};

export default AppContent;
