import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../../contexts/WishlistContext';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import {
  HeartIcon,
  HeartIcon as HeartSolidIcon,
  ShoppingBagIcon,
  EyeIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [addingToCart, setAddingToCart] = useState({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      alert('Please log in to add items to cart.');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    try {
      addToCart({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0]?.url || product.image,
        images: product.images,
        category: product.category,
        brand: product.brand,
        inStock: product.inStock
      });
      
      // Remove from wishlist after adding to cart
      removeFromWishlist(product.id);
      
      alert(`${product.name} added to cart and removed from wishlist!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  const handleClearWishlist = () => {
    setShowClearConfirm(true);
  };

  const confirmClearWishlist = () => {
    clearWishlist();
    setShowClearConfirm(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < Math.floor(rating)
            ? 'text-yellow-400'
            : index < rating
            ? 'text-yellow-300'
            : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-12 rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 hover:scale-105">
          <div className="relative mb-8">
            <HeartIcon className="w-32 h-32 text-purple-300 mx-auto animate-pulse" />
            <StarIcon className="w-8 h-8 text-pink-500 absolute top-4 right-4 animate-bounce" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Your Wishlist is Empty
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Start adding items you love to your wishlist! They'll be saved here for you to revisit later.
          </p>
          <div className="space-y-4">
            <Link
              to="/all-products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-full shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
            >
              <HeartIcon className="w-6 h-6 mr-3" />
              Start Shopping
            </Link>
            <div className="text-sm text-gray-500">
              <p>💡 Tip: Click the heart icon on any product to add it to your wishlist!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            My Wishlist
          </h1>
          <p className="text-xl text-gray-700">
            You have <span className="font-bold text-purple-700">{wishlistItems.length}</span> {wishlistItems.length === 1 ? 'item' : 'items'} saved for later.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <HeartSolidIcon className="w-8 h-8 text-red-500" />
              <span className="text-lg font-semibold text-gray-900">
                {wishlistItems.length} Items in Wishlist
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/all-products"
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
              >
                <ArrowRightIcon className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
              <button
                onClick={handleClearWishlist}
                className="inline-flex items-center px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <Link to={`/product/${item._id || item.id}`}>
                  <img
                    src={item.images?.[0]?.url || item.image}
                    alt={item.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>
                
                {/* Discount Badge */}
                {(item.discount || item.discountPercentage) && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    -{item.discount || item.discountPercentage}%
                  </div>
                )}
                
                {/* New Badge */}
                {item.isNew && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    NEW
                  </div>
                )}

                {/* Remove from Wishlist */}
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200 group-hover:opacity-100 opacity-0"
                >
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
              </div>

              {/* Product Details */}
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs text-purple-600 font-medium uppercase tracking-wide">
                    {item.category}
                  </span>
                </div>
                
                <Link to={`/product/${item._id || item.id}`} className="block group-hover:text-purple-600 transition-colors duration-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {renderStars(item.rating || item.averageRating || 0)}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    ({item.reviewCount || item.reviews || 0})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.originalPrice}
                      </span>
                    )}
                    <span className="text-xl font-bold text-gray-900">
                      ₹{item.price}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link
                    to={`/product/${item._id || item.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-1"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>View</span>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={addingToCart[item.id] || !item.inStock}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
                      !item.inStock
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : addingToCart[item.id]
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    }`}
                  >
                    {addingToCart[item.id] ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBagIcon className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clear Wishlist Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center">
                <TrashIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Clear Wishlist</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to remove all items from your wishlist? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmClearWishlist}
                    className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
