import React from 'react';
import { useNavigate } from 'react-router-dom';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const MainCarousel = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/all-products');
  };

  const handleExploreSale = () => {
    navigate('/sale');
  };

  const handleViewCollection = () => {
    navigate('/collections');
  };

  const items = [
    <div className="item" data-value="1">
      <div className="relative h-96 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Fashion Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-purple-900/40 to-pink-900/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">New Fashion Collection</h2>
            <p className="text-xl mb-6 text-gray-200">Discover the latest trends and styles</p>
            <button 
              onClick={handleShopNow}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>,
    <div className="item" data-value="2">
      <div className="relative h-96 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Summer Sale"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/80 via-purple-600/80 to-indigo-600/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent">Summer Sale</h2>
            <p className="text-xl mb-2 text-yellow-200 font-semibold">Up to 50% OFF</p>
            <p className="text-lg mb-6 text-gray-200">On all summer collections</p>
            <button 
              onClick={handleExploreSale}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Explore Sale
            </button>
          </div>
        </div>
      </div>
    </div>,
    <div className="item" data-value="3">
      <div className="relative h-96 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Luxury Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-gray-800/60 to-purple-900/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">Luxury Fashion</h2>
            <p className="text-xl mb-6 text-gray-300">Premium quality meets elegant design</p>
            <button 
              onClick={handleViewCollection}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              View Collection
            </button>
          </div>
        </div>
      </div>
    </div>,
  ];

  const responsive = {
    0: { items: 1 },
    568: { items: 1 },
    1024: { items: 1 },
  };

  return (
    <div className="w-full relative z-10">
      <AliceCarousel
        mouseTracking
        items={items}
        responsive={responsive}
        controlsStrategy="responsive"
        autoPlay
        autoPlayInterval={5000}
        infinite
        disableButtonsControls={true}
        disableDotsControls={false}
        disableSlideInfo={false}
        renderDotsItem={({ isActive }) => (
          <div 
            className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
              isActive 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 scale-125 shadow-lg' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        )}
      />
      <style>{`
        .alice-carousel__dots {
          margin-top: -60px !important;
          z-index: 10;
        }
        .alice-carousel__dots-item {
          margin: 0 6px !important;
        }
        .alice-carousel__prev-btn,
        .alice-carousel__next-btn {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default MainCarousel;
