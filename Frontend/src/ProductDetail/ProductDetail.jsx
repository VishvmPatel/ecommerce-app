import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HeartIcon, HeartIcon as HeartSolidIcon, ShoppingBagIcon, MinusIcon, PlusIcon, StarIcon, TruckIcon, ShieldCheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import apiService from '../../../services/api';
import { useCart } from '../../../contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProduct(id);
        if (response.success) {
          setProduct(response.data);
          if (response.data.sizes && response.data.sizes.length > 0) {
            setSelectedSize(response.data.sizes[0]);
          }
          if (response.data.colors && response.data.colors.length > 0) {
            setSelectedColor(response.data.colors[0]);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error loading product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const staticProducts = {
    "women_1": {
      id: "women_1",
      name: "Trendy Crop Top & High-Waist Jeans Set",
      category: "Casual Wear",
      brand: "Urban Chic",
      price: 1899,
      originalPrice: 2499,
      discount: 24,
      rating: 4.6,
      reviews: 234,
      inStock: true,
      isNew: true,
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=left"
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Pink', 'Blue'],
      description: "A trendy crop top and high-waist jeans set perfect for casual outings. Made from comfortable cotton blend fabric with a modern fit.",
      features: ["Cotton Blend Fabric", "Modern Fit", "Comfortable", "Machine Washable"],
      specifications: {
        "Fabric": "Cotton Blend",
        "Care Instructions": "Machine Washable",
        "Fit": "Regular Fit",
        "Occasion": "Casual"
      },
      shipping: {
        "Standard Delivery": "3-5 business days",
        "Express Delivery": "1-2 business days",
        "Free Shipping": "On orders above ₹2000"
      }
    },
    "women_2": {
      id: "women_2",
      name: "Elegant Silk Saree with Designer Blouse",
      category: "Ethnic Wear",
      brand: "Silk Elegance",
      price: 4599,
      originalPrice: 5999,
      discount: 23,
      rating: 4.8,
      reviews: 189,
      inStock: true,
      isNew: true,
      images: [
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=right"
      ],
      sizes: ['Free Size'],
      colors: ['Red', 'Gold', 'Purple', 'Green'],
      description: "An elegant silk saree with intricate embroidery work and a designer blouse. Perfect for festive occasions and special events.",
      features: ["Pure Silk", "Handcrafted Embroidery", "Designer Blouse", "Traditional Design"],
      specifications: {
        "Fabric": "Pure Silk",
        "Care Instructions": "Dry Clean Only",
        "Origin": "Made in India",
        "Occasion": "Festive, Wedding, Party"
      },
      shipping: {
        "Standard Delivery": "3-5 business days",
        "Express Delivery": "1-2 business days",
        "Free Shipping": "On orders above ₹2000"
      }
    },
    "men_1": {
      id: "men_1",
      name: "Premium Cotton Kurta",
      category: "Ethnic Wear",
      brand: "Heritage Wear",
      price: 1899,
      originalPrice: 2499,
      discount: 24,
      rating: 4.8,
      reviews: 95,
      inStock: true,
      isNew: true,
      images: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=right"
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Cream', 'Light Blue', 'Beige'],
      description: "A classic cotton kurta that combines comfort with style. Perfect for daily wear, festive occasions, and formal events. Made from premium cotton fabric with traditional Indian craftsmanship.",
      features: ["100% Premium Cotton", "Comfortable Fit", "Easy Care", "Traditional Design", "Breathable Fabric", "Durable Construction"],
      specifications: {
        "Fabric": "Premium Cotton",
        "Care Instructions": "Machine Washable",
        "Origin": "Made in India",
        "Sleeve Length": "Full Sleeve",
        "Neckline": "Mandarin Collar",
        "Occasion": "Daily Wear, Festive, Formal"
      },
      shipping: {
        "Standard Delivery": "3-5 business days",
        "Express Delivery": "1-2 business days",
        "Free Shipping": "On orders above ₹2000"
      }
    },
    "accessories_1": {
      id: "accessories_1",
      name: "Designer Sunglasses - Aviator Style",
      category: "Eyewear",
      brand: "SunStyle",
      price: 1299,
      originalPrice: 1899,
      discount: 32,
      rating: 4.6,
      reviews: 234,
      inStock: true,
      isNew: true,
      images: [
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=left"
      ],
      colors: ['Black', 'Brown', 'Gold', 'Silver'],
      description: "Stylish aviator sunglasses with UV protection and premium acetate frames. Perfect for both men and women who want to make a fashion statement.",
      features: ["UV Protection", "Acetate Frames", "Unisex Design", "Stylish Look"],
      specifications: {
        "Frame Material": "Acetate",
        "Lens Type": "UV Protection",
        "Gender": "Unisex",
        "Style": "Aviator"
      },
      shipping: {
        "Standard Delivery": "3-5 business days",
        "Express Delivery": "1-2 business days",
        "Free Shipping": "On orders above ₹2000"
      }
    },
    "accessories_2": {
      id: "accessories_2",
      name: "Trendy Baseball Cap",
      category: "Headwear",
      brand: "CapCo",
      price: 899,
      originalPrice: 1299,
      discount: 31,
      rating: 4.4,
      reviews: 189,
      inStock: true,
      isNew: true,
      images: [
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=right"
      ],
      colors: ['Black', 'White', 'Navy', 'Red'],
      description: "A trendy baseball cap made from premium cotton with adjustable strap. Perfect for casual outings and sports activities.",
      features: ["Premium Cotton", "Adjustable Strap", "Unisex Design", "Comfortable Fit"],
      specifications: {
        "Material": "Cotton",
        "Adjustable": "Yes",
        "Gender": "Unisex",
        "Style": "Baseball Cap"
      },
      shipping: {
        "Standard Delivery": "3-5 business days",
        "Express Delivery": "1-2 business days",
        "Free Shipping": "On orders above ₹2000"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Add multiple quantities to cart
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[selectedImage]?.url || product.image,
        images: product.images,
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        size: selectedSize,
        color: selectedColor
      });
    }
    alert(`Added ${quantity} item(s) to cart!`);
  };

  const handleBuyNow = () => {
    console.log('Buy now:', {
      product: product._id || product.id,
      quantity,
      size: selectedSize,
      color: selectedColor
    });
    alert('Redirecting to checkout...');
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : index < rating
            ? 'text-yellow-300 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-purple-600">Home</Link>
          <span>/</span>
          <Link to="/" className="hover:text-purple-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images?.[selectedImage]?.url || product.images?.[selectedImage] || product.images?.[0]?.url || product.images?.[0]}
                alt={product.name}
                className={`w-full h-96 lg:h-[500px] object-cover rounded-lg cursor-zoom-in transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : ''
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
              {(product.discount || product.discountPercentage) && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{product.discount || product.discountPercentage}%
                </div>
              )}
              {product.isNew && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  NEW
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {(product.images || []).map((image, index) => (
                <img
                  key={index}
                  src={image?.url || image}
                  alt={`${product.name} ${index + 1}`}
                  className={`w-full h-24 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? 'border-purple-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-purple-600 font-medium uppercase tracking-wide">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating || product.averageRating || 0)}
                </div>
                <span className="text-sm text-gray-500">({product.reviewCount || product.reviews || 0} reviews)</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="flex items-center space-x-3 mb-6">
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price}
                </span>
                {product.discount && (
                  <span className="text-sm text-green-600 font-semibold">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
              <div className="flex space-x-2 mb-6">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      selectedSize === size
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
              <div className="flex space-x-3 mb-6">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color.name
                        ? 'border-purple-500 scale-110'
                        : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3 mb-6">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="w-16 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
              >
                Buy Now
              </button>
              <button
                onClick={handleWishlistToggle}
                className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartIcon className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <TruckIcon className="w-5 h-5 text-green-600" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ArrowPathIcon className="w-5 h-5 text-purple-600" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <ul className="space-y-2">
              {(product.features || product.tags || []).map((feature, index) => (
                <li key={index} className="flex items-center space-x-2 text-gray-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="space-y-3">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-900">{key}</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Care Instructions</h3>
            <p className="text-gray-600">{product.careInstructions || 'Please follow the care instructions on the product label.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
