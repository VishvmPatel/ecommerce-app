import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircleIcon, HomeIcon, ShoppingBagIcon, EnvelopeIcon, CalendarIcon, MapPinIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Order Not Found
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                We couldn't find the order details. Please check your order history.
              </p>
              <Link
                to="/my-orders"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
              >
                <ShoppingBagIcon className="w-5 h-5 mr-2" />
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircleIcon className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Order Confirmed!
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Thank you for your order! We've received your order and will process it shortly.
              </p>
              <p className="text-sm text-gray-500">
                Order Number: <span className="font-semibold text-gray-900">{order.orderNumber}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">Order Date:</span>
                    <span className="ml-2 font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCardIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="ml-2 font-medium capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium capitalize">
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600">Total:</span>
                    <span className="ml-2 font-bold text-lg">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                          {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p className="text-gray-600">{order.shippingAddress.address}</p>
                      <p className="text-gray-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-600">{order.shippingAddress.country}</p>
                      <p className="text-gray-600 mt-2">{order.shippingAddress.email}</p>
                      <p className="text-gray-600">{order.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">₹{order.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">₹{order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-purple-600">1</span>
                  </div>
                  <span className="text-gray-700">You'll receive an order confirmation email shortly</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-purple-600">2</span>
                  </div>
                  <span className="text-gray-700">We'll prepare your order for shipping</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-purple-600">3</span>
                  </div>
                  <span className="text-gray-700">You'll receive tracking information once shipped</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
              
              <Link
                to="/my-orders"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                <ShoppingBagIcon className="w-5 h-5 mr-2" />
                View My Orders
              </Link>
            </div>

            {/* Contact Information */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Need help with your order?
              </p>
              <div className="flex items-center justify-center text-sm text-purple-600">
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                <a href="mailto:support@fashionforward.com" className="hover:text-purple-700">
                  support@fashionforward.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
