import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, FunnelIcon, ChevronDownIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import apiService from '../../../services/api';
import { useCart } from '../../../contexts/CartContext';
import { useWishlist } from '../../../contexts/WishlistContext';
import { useAuth } from '../../../contexts/AuthContext';

const SalesPage = () => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    brands: [],
    sizes: [],
    colors: []
  });
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceRange: '',
    size: '',
    color: '',
    occasion: '',
    sortBy: 'highest-discount'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, filterOptionsResponse] = await Promise.all([
          apiService.getSaleProducts(20),
          apiService.getFilterOptions()
        ]);

        if (productsResponse.success) {
          setProducts(productsResponse.data.products || productsResponse.data);
        } else {
          setError('Failed to fetch sale products');
        }

        if (filterOptionsResponse.success) {
          setFilterOptions(filterOptionsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error loading sale products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.brand && product.brand !== filters.brand) return false;
      if (filters.size && product.sizes && !product.sizes.includes(filters.size)) return false;
      if (filters.color && !product.colors.includes(filters.color)) return false;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max) {
          if (product.price < min || product.price > max) return false;
        } else {
          if (product.price < min) return false;
        }
      }
      return true;
    });

    switch (filters.sortBy) {
      case 'price-low-high':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return filtered.sort((a, b) => b.price - a.price);
      case 'rating':
        return filtered.sort((a, b) => (b.rating || b.averageRating || 0) - (a.rating || a.averageRating || 0));
      case 'highest-discount':
      default:
        return filtered.sort((a, b) => (b.discount || b.discountPercentage || 0) - (a.discount || a.discountPercentage || 0));
    }
  }, [products, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      priceRange: '',
      size: '',
      color: '',
      occasion: '',
      sortBy: 'highest-discount'
    });
  };

  const handleWishlistToggle = async (product) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    const productId = product._id || product.id;
    setWishlistLoading(prev => ({ ...prev, [productId]: true }));

    try {
      const isCurrentlyWishlisted = isInWishlist(productId);

      if (isCurrentlyWishlisted) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddToCart = (product) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-medium mb-4">
            🔥 Hot Sale
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sale Collection</h1>
          <p className="text-gray-600">
            Don't miss out on our amazing deals! Shop discounted fashion items and refresh your style for less.
          </p>
        </div>

        {/* Sale Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Up to 50% Off</h3>
              <p className="text-red-100 mb-4">Selected items</p>
              <Link to="/sale?discount=50" className="inline-flex items-center text-sm font-semibold hover:text-red-200 transition-colors">
                Shop Now
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Flash Sale</h3>
              <p className="text-orange-100 mb-4">Limited time offers</p>
              <Link to="/sale?flash=true" className="inline-flex items-center text-sm font-semibold hover:text-orange-200 transition-colors">
                Shop Now
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Clearance</h3>
              <p className="text-yellow-100 mb-4">Final reductions</p>
              <Link to="/sale?clearance=true" className="inline-flex items-center text-sm font-semibold hover:text-yellow-200 transition-colors">
                Shop Now
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5" />
              Filters
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {Array.isArray(filteredAndSortedProducts) ? filteredAndSortedProducts.length : 0} products found
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">All Categories</option>
                    {filterOptions.categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">All Brands</option>
                    {filterOptions.brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">All Prices</option>
                    <option value="0-1000">Under ₹1,000</option>
                    <option value="1000-3000">₹1,000 - ₹3,000</option>
                    <option value="3000-5000">₹3,000 - ₹5,000</option>
                    <option value="5000+">Above ₹5,000</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="highest-discount">Highest Discount</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {!Array.isArray(filteredAndSortedProducts) || filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or check back later for new sales.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.isArray(filteredAndSortedProducts) && filteredAndSortedProducts.map((product) => (
              <div key={product._id || product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 group">
                <div className="relative">
                  <Link to={`/product/${product._id || product.id}`}>
                    <img
                      src={product.images?.[0]?.url || product.image || '/placeholder-image.jpg'}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  
                  <button
                    onClick={() => handleWishlistToggle(product)}
                    disabled={wishlistLoading[product._id || product.id]}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
                  >
                    {isInWishlist(product._id || product.id) ? (
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
                    )}
                  </button>

                  {(product.discount || product.discountPercentage) && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                      -{product.discount || product.discountPercentage}%
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {product.brand}
                    </span>
                  </div>
                  
                  <Link to={`/product/${product._id || product.id}`}>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-red-600 transition-colors duration-200">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.averageRating || product.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviewCount || product.reviews || 0})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {product.gender}
                    </div>
                  </div>

                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="mt-2">
                      <span className="text-sm text-green-600 font-semibold">
                        Save ₹{product.originalPrice - product.price}
                      </span>
                    </div>
                  )}

                  <div className="mt-3">
                    <Link
                      to={`/product/${product._id || product.id}`}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 text-center block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPage;