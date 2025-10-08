import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import { WishlistProvider } from './contexts/WishlistContext'
import Navigation from './customers/components/Navigation/Navigation.jsx'
import HomePage from './customers/pages/HomePage/HomePage.jsx'
import LoginPage from './customers/pages/Auth/LoginPage/LoginPage.jsx'
import SignUpPage from './customers/pages/Auth/SignUpPage/SignUpPage.jsx'
import AboutUs from './customers/pages/AboutUs/AboutUs.jsx'
import ContactUs from './customers/pages/ContactUs/ContactUs.jsx'
import ProductDetail from './customers/pages/ProductDetail/ProductDetail.jsx'
import NewArrivals from './customers/pages/NewArrivals/NewArrivals.jsx'
import WomenSection from './customers/pages/WomenSection/WomenSection.jsx'
import MenSection from './customers/pages/MenSection/MenSection.jsx'
import AccessoriesPage from './customers/pages/AccessoriesPage/AccessoriesPage.jsx'
import SearchResults from './customers/pages/SearchResults/SearchResults.jsx'
import SalesPage from './customers/pages/SalesPage/SalesPage.jsx'
import AllProducts from './customers/pages/AllProducts/AllProducts.jsx'
import Collections from './customers/pages/Collections/Collections.jsx'
import CartPage from './customers/pages/CartPage/CartPage.jsx'
import WishlistPage from './customers/pages/WishlistPage/WishlistPage.jsx'
import ProfilePage from './customers/pages/ProfilePage/ProfilePage.jsx'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 w-full">
              <Navigation />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
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
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  )
}

export default App
