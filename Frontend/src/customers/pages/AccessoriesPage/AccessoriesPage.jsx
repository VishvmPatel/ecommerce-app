import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, FunnelIcon, ChevronDownIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import apiService from '../../../services/api';
import { useCart } from '../../../contexts/CartContext';
import { useWishlist } from '../../../contexts/WishlistContext';
import { useAuth } from '../../../contexts/AuthContext';

const AccessoriesPage = () => {
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
    colors: [],
    materials: []
  });
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceRange: '',
    color: '',
    material: '',
    occasion: '',
    sortBy: 'trending'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [eyewearResponse, headwearResponse, filterOptionsResponse] = await Promise.all([
          apiService.getProductsByCategory('Eyewear', 20),
          apiService.getProductsByCategory('Headwear', 20),
          apiService.getFilterOptions()
        ]);

        let allProducts = [];
        
        if (eyewearResponse.success) {
          allProducts = [...allProducts, ...eyewearResponse.data];
        }
        
        if (headwearResponse.success) {
          allProducts = [...allProducts, ...headwearResponse.data];
        }

        setProducts(allProducts);

        if (filterOptionsResponse.success) {
          setFilterOptions(filterOptionsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error loading accessories');
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
      if (filters.color && product.colors && !product.colors.includes(filters.color)) return false;
      if (filters.material && product.materials && !product.materials.includes(filters.material)) return false;
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
      case 'trending':
      default:
        return filtered.sort((a, b) => (b.rating || b.averageRating || 0) - (a.rating || a.averageRating || 0));
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
      color: '',
      material: '',
      occasion: '',
      sortBy: 'trending'
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading accessories...</p>
        </div>
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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-4">
            ✨ Accessories Collection
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Fashion Accessories</h1>
          <p className="text-gray-600">
            Complete your look with our stylish accessories. From eyewear to jewelry, find the perfect finishing touch for any outfit.
          </p>
        </div>

        {/* Accessory Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Eyewear</h3>
              <p className="text-purple-100 mb-4">Sunglasses & glasses</p>
              <Link to="/accessories?category=Eyewear" className="inline-flex items-center text-sm font-semibold hover:text-purple-200 transition-colors">
                Shop Now
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-red-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Headwear</h3>
              <p className="text-pink-100 mb-4">Caps & hats</p>
              <Link to="/accessories?category=Headwear" className="inline-flex items-center text-sm font-semibold hover:text-pink-200 transition-colors">
                Shop Now
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Bags</h3>
              <p className="text-indigo-100 mb-4">Handbags & backpacks</p>
              <Link to="/accessories?category=Bags" className="inline-flex items-center text-sm font-semibold hover:text-indigo-200 transition-colors">
                Shop Now
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Jewelry</h3>
              <p className="text-green-100 mb-4">Necklaces & rings</p>
              <Link to="/accessories?category=Jewelry" className="inline-flex items-center text-sm font-semibold hover:text-green-200 transition-colors">
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
                className="text-sm text-purple-600 hover:text-purple-700"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">All Categories</option>
                    {filterOptions.categories && filterOptions.categories.map(category => (
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">All Brands</option>
                    {filterOptions.brands && filterOptions.brands.map(brand => (
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="trending">Trending</option>
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
              Try adjusting your filters or check back later for new accessories.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-purple-600 transition-colors duration-200">
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

                  <div className="mt-3">
                    <Link
                      to={`/product/${product._id || product.id}`}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-center block"
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

export default AccessoriesPage;