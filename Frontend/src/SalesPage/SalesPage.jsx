import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, HeartIcon as HeartSolidIcon, ShoppingBagIcon, FunnelIcon, XMarkIcon, FireIcon } from '@heroicons/react/24/outline';
import apiService from '../../../services/api';
import { useCart } from '../../../contexts/CartContext';

const SalesPage = () => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleWishlistToggle = (productId) => {
    setIsWishlisted(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
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
    alert(`Added ${product.name} to cart!`);
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-orange-100 text-red-800 text-sm font-medium mb-6">
            🔥 Hot Sale
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Sale Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't miss out on our amazing deals! Shop discounted fashion items and refresh your style for less.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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

        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">All Categories</option>
                    {filterOptions.categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Brand</h3>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">All Brands</option>
                    {filterOptions.brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">All Prices</option>
                    <option value="0-1000">Under ₹1,000</option>
                    <option value="1000-2000">₹1,000 - ₹2,000</option>
                    <option value="2000-3000">₹2,000 - ₹3,000</option>
                    <option value="3000-5000">₹3,000 - ₹5,000</option>
                    <option value="5000">Above ₹5,000</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
                  <select
                    value={filters.size}
                    onChange={(e) => handleFilterChange('size', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">All Sizes</option>
                    {filterOptions.sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                  <select
                    value={filters.color}
                    onChange={(e) => handleFilterChange('color', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">All Colors</option>
                    {filterOptions.colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <FunnelIcon className="w-5 h-5" />
                  <span>Filters</span>
                </button>
                <p className="text-gray-600">
                  Showing {filteredAndSortedProducts.length} of {products.length} products
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="highest-discount">Highest Discount</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <div key={product._id || product.id} className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <Link to={`/product/${product._id || product.id}`}>
                      <img
                        src={product.images?.[0]?.url || product.image}
                        alt={product.name}
                        className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </Link>
                    
                    {(product.discount || product.discountPercentage) && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <FireIcon className="w-3 h-3 mr-1" />
                        -{product.discount || product.discountPercentage}%
                      </div>
                    )}
                    
                    {product.isNew && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        NEW
                      </div>
                    )}

                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleWishlistToggle(product._id || product.id)}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200"
                      >
                        {isWishlisted[product._id || product.id] ? (
                          <HeartSolidIcon className="w-5 h-5 text-red-500" />
                        ) : (
                          <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
                        )}
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-red-700 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-1"
                      >
                        <ShoppingBagIcon className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-red-600 font-medium uppercase tracking-wide">
                        {product.category}
                      </span>
                    </div>
                    
                    <Link to={`/product/${product._id || product.id}`} className="block group-hover:text-red-600 transition-colors duration-200">
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

                    {product.originalPrice && (
                      <div className="mt-2">
                        <span className="text-sm text-green-600 font-semibold">
                          Save ₹{product.originalPrice - product.price}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-red-600 hover:text-red-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;