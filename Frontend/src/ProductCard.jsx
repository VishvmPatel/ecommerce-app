import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, EyeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useCart } from '../../../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    alert(`Added ${product.name} to cart!`);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Quick view:', product.id);
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

  return (
    <div
      className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <Link to={`/product/${product._id || product.id}`}>
          <img
            src={product.images?.[0]?.url || product.image}
            alt={product.name}
            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        
        {(product.discount || product.discountPercentage) && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{product.discount || product.discountPercentage}%
          </div>
        )}
        
        {product.isNew && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            NEW
          </div>
        )}

        <div className={`absolute top-3 right-3 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <button
            onClick={handleWishlistToggle}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200"
          >
            {isWishlisted ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
            )}
          </button>
        </div>

        <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="flex space-x-2">
            <button
              onClick={handleQuickView}
              className="flex-1 bg-white/90 backdrop-blur-sm text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-white transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <EyeIcon className="w-4 h-4" />
              <span>Quick View</span>
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-1"
            >
              <ShoppingBagIcon className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-purple-600 font-medium uppercase tracking-wide">
            {product.category}
          </span>
        </div>
        
        <Link to={`/product/${product._id || product.id}`} className="block group-hover:text-purple-600 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {renderStars(product.rating || product.averageRating || 0)}
          </div>
          <span className="text-xs text-gray-500 ml-2">({product.reviewCount || product.reviews || 0})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className={`text-xs px-2 py-1 rounded-full ${
              product.inStock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
