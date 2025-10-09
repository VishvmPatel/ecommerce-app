import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { 
  ShoppingBagIcon, 
  TrashIcon, 
  PlusIcon, 
  MinusIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const CartPage = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getCartSubtotal,
    getCartDiscount,
    getCartTax,
    getCartShipping,
    getCartGrandTotal,
    getCartItemsCount
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      alert('Order placed successfully! Redirecting to order confirmation...');
      clearCart();
      setIsCheckingOut(false);
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBagIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-xl text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link 
            to="/all-products"
            className="inline-flex items-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ShoppingBagIcon className="w-6 h-6 mr-2" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-xl text-gray-600">
            {getCartItemsCount()} {getCartItemsCount() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <Link to={`/product/${item.id}`}>
                          <img
                            src={item.images?.[0]?.url || item.image}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </Link>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.id}`} className="block group">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                          <p className="text-sm text-gray-500 mt-1">Brand: {item.brand}</p>
                        </Link>

                        {/* Price */}
                        <div className="mt-2 flex items-center space-x-2">
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.originalPrice}
                            </span>
                          )}
                          <span className="text-lg font-bold text-gray-900">
                            ₹{item.price}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-sm text-green-600 font-medium">
                              Save ₹{item.originalPrice - item.price}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <MinusIcon className="w-4 h-4 text-gray-600" />
                        </button>
                        
                        <span className="w-12 text-center font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <PlusIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{item.price * item.quantity}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-sm text-gray-500">
                            ₹{item.price} × {item.quantity}
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

              {/* Order Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{getCartSubtotal().toFixed(2)}</span>
                </div>

                {getCartDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{getCartDiscount().toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST 18%)</span>
                  <span className="font-semibold">₹{getCartTax().toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {getCartShipping() === 0 ? 'Free' : `₹${getCartShipping()}`}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{getCartGrandTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              {getCartShipping() > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <TruckIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">
                      Add ₹{2000 - getCartSubtotal()} more for free shipping
                    </span>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isCheckingOut ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </>
                )}
              </button>

              {/* Security Features */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <ShieldCheckIcon className="w-4 h-4 mr-2 text-green-600" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <TruckIcon className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Free Delivery on orders above ₹2000</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ArrowPathIcon className="w-4 h-4 mr-2 text-purple-600" />
                  <span>Easy Returns & Exchanges</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link 
            to="/all-products"
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ShoppingBagIcon className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
