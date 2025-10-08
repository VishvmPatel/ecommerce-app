import React, { useState, useEffect } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';
import apiService from '../../../services/api';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function renderStars(rating) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <StarIcon
        key={i}
        className={classNames(
          rating > i ? 'text-yellow-400' : 'text-gray-200',
          'h-5 w-5 flex-shrink-0'
        )}
        aria-hidden="true"
      />
    );
  }
  return <div className="flex items-center">{stars}</div>;
}

const CollectionCard = ({ product }) => (
  <div className="group relative bg-white rounded-lg shadow-md overflow-hidden m-2 transform transition-transform duration-300 hover:scale-105">
    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200 lg:aspect-h-8 lg:aspect-w-7">
      <img
        src={product.images?.[0]?.url || product.image}
        alt={product.name}
        className="h-full w-full object-cover object-center group-hover:opacity-75"
      />
      {(product.discount || product.discountPercentage) && (
        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          -{product.discount || product.discountPercentage}%
        </span>
      )}
    </div>
    <div className="p-4">
      <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2">
        <Link to={`/product/${product._id || product.id}`}>
          <span aria-hidden="true" className="absolute inset-0" />
          {product.name}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-gray-500">{product.colors?.[0] || 'Various Colors'}</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-lg font-medium text-gray-900">₹{product.price}</p>
          {product.originalPrice && (
            <p className="text-sm text-gray-500 line-through">₹{product.originalPrice}</p>
          )}
        </div>
        {renderStars(product.rating || product.averageRating || 0)}
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          product.inStock 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
        <button className="text-indigo-600 hover:text-indigo-900 font-medium">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);

const Collections = () => {
  const [womenProducts, setWomenProducts] = useState([]);
  const [menProducts, setMenProducts] = useState([]);
  const [childrenProducts, setChildrenProducts] = useState([]);
  const [accessoriesProducts, setAccessoriesProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const [
          womenResponse,
          menResponse,
          childrenResponse,
          accessoriesResponse,
          saleResponse
        ] = await Promise.all([
          apiService.getProductsByGender('women', 8),
          apiService.getProductsByGender('men', 8),
          apiService.getProductsByGender('unisex', 8),
          apiService.getProductsByCategory('accessories', 8),
          apiService.getSaleProducts(8)
        ]);

        if (womenResponse.success) {
          setWomenProducts(womenResponse.data.products || womenResponse.data);
        }
        if (menResponse.success) {
          setMenProducts(menResponse.data.products || menResponse.data);
        }
        if (childrenResponse.success) {
          setChildrenProducts(childrenResponse.data.products || childrenResponse.data);
        }
        if (accessoriesResponse.success) {
          setAccessoriesProducts(accessoriesResponse.data.products || accessoriesResponse.data);
        }
        if (saleResponse.success) {
          setSaleProducts(saleResponse.data.products || saleResponse.data);
        }
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('Error loading collections');
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 4 },
  };

  const renderCarouselItems = (items) => items.map(product => (
    <CollectionCard key={product._id || product.id} product={product} />
  ));

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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Collections</h2>
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
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
          Explore Our Collections
        </h1>

        {/* Women's Collection */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-4">Women's Collection</h2>
              <p className="text-xl mb-6 max-w-2xl">
                Discover elegance and style with our latest collection for women. From casual wear to evening gowns, find your perfect outfit.
              </p>
              <Link to="/women" className="inline-flex items-center px-6 py-3 bg-white text-purple-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300">
                Shop Women's
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
          {womenProducts.length > 0 && (
            <AliceCarousel
              mouseTracking
              items={renderCarouselItems(womenProducts)}
              responsive={responsive}
              controlsStrategy="alternate"
              autoPlay
              autoPlayInterval={4000}
              infinite
              disableDotsControls
            />
          )}
        </section>

        {/* Men's Collection */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-4">Men's Collection</h2>
              <p className="text-xl mb-6 max-w-2xl">
                Upgrade your wardrobe with our sophisticated men's collection. Perfect for every occasion, from business to casual.
              </p>
              <Link to="/men" className="inline-flex items-center px-6 py-3 bg-white text-indigo-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300">
                Shop Men's
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
          {menProducts.length > 0 && (
            <AliceCarousel
              mouseTracking
              items={renderCarouselItems(menProducts)}
              responsive={responsive}
              controlsStrategy="alternate"
              autoPlay
              autoPlayInterval={4000}
              infinite
              disableDotsControls
            />
          )}
        </section>

        {/* Children's Collection */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-4">Children's Collection</h2>
              <p className="text-xl mb-6 max-w-2xl">
                Fun and comfortable outfits for your little ones. Explore our vibrant and durable children's wear.
              </p>
              <Link to="/all-products?gender=unisex" className="inline-flex items-center px-6 py-3 bg-white text-orange-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300">
                Shop Children's
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
          {childrenProducts.length > 0 && (
            <AliceCarousel
              mouseTracking
              items={renderCarouselItems(childrenProducts)}
              responsive={responsive}
              controlsStrategy="alternate"
              autoPlay
              autoPlayInterval={4000}
              infinite
              disableDotsControls
            />
          )}
        </section>

        {/* Accessories Collection */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-4">Accessories Collection</h2>
              <p className="text-xl mb-6 max-w-2xl">
                Complete your look with our stylish accessories. From statement jewelry to essential bags, find the perfect finishing touch.
              </p>
              <Link to="/accessories" className="inline-flex items-center px-6 py-3 bg-white text-purple-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300">
                Shop Accessories
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
          {accessoriesProducts.length > 0 && (
            <AliceCarousel
              mouseTracking
              items={renderCarouselItems(accessoriesProducts)}
              responsive={responsive}
              controlsStrategy="alternate"
              autoPlay
              autoPlayInterval={4000}
              infinite
              disableDotsControls
            />
          )}
        </section>

        {/* Sale Collection */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-4">Sale Collection</h2>
              <p className="text-xl mb-6 max-w-2xl">
                Don't miss out on our amazing deals! Shop discounted fashion items and refresh your style for less.
              </p>
              <Link to="/sale" className="inline-flex items-center px-6 py-3 bg-white text-red-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300">
                Shop Sale
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
          {saleProducts.length > 0 && (
            <AliceCarousel
              mouseTracking
              items={renderCarouselItems(saleProducts)}
              responsive={responsive}
              controlsStrategy="alternate"
              autoPlay
              autoPlayInterval={4000}
              infinite
              disableDotsControls
            />
          )}
        </section>

        <div className="text-center mt-16">
          <Link to="/all-products" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            View All Products
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Collections;