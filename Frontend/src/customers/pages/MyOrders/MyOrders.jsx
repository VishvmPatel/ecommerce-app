import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  TruckIcon, 
  HomeIcon,
  XCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  PrinterIcon,
  CalendarIcon,
  MapPinIcon,
  CreditCardIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import apiService from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const MyOrders = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, filterStatus]);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  }, [location.state]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const response = await apiService.getOrders(params);
      
      if (response.success) {
        setOrders(response.data.orders || []);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId, reason) => {
    try {
      const response = await apiService.cancelOrder(orderId, reason);
      if (response.success) {
        fetchOrders(); // Refresh orders
        setShowOrderDetails(false);
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
  };

  const getOrderStatusConfig = (status) => {
    const statusConfig = {
      pending: {
        label: 'Order Placed',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        icon: ClockIcon,
        description: 'Your order has been placed and is being processed'
      },
      confirmed: {
        label: 'Order Confirmed',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        icon: CheckCircleIcon,
        description: 'Your order has been confirmed and is being prepared'
      },
      processing: {
        label: 'Processing',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        icon: ArrowPathIcon,
        description: 'Your order is being packed and prepared for shipping'
      },
      shipped: {
        label: 'Shipped',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100',
        icon: TruckIcon,
        description: 'Your order has been shipped and is on its way'
      },
      delivered: {
        label: 'Delivered',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: CheckCircleSolidIcon,
        description: 'Your order has been delivered successfully'
      },
      cancelled: {
        label: 'Cancelled',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: XCircleIcon,
        description: 'Your order has been cancelled'
      },
      returned: {
        label: 'Returned',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        icon: ArrowPathIcon,
        description: 'Your order has been returned'
      }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const getOrderProgress = (status) => {
    const progressMap = {
      pending: 1,
      confirmed: 2,
      processing: 3,
      shipped: 4,
      delivered: 5,
      cancelled: 0,
      returned: 0
    };
    return progressMap[status] || 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to view your orders</p>
          <Link
            to="/login"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Orders</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchOrders}
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track your orders and view order history
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircleSolidIcon className="h-5 w-5 text-green-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  {successMessage}
                </h3>
                {location.state?.orderNumber && (
                  <p className="text-sm text-green-600 mt-1">
                    Order Number: #{location.state.orderNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Orders' },
              { key: 'pending', label: 'Pending' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'processing', label: 'Processing' },
              { key: 'shipped', label: 'Shipped' },
              { key: 'delivered', label: 'Delivered' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === filter.key
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-4">
              {filterStatus === 'all' 
                ? "You haven't placed any orders yet. Start shopping to see your orders here."
                : `No ${filterStatus} orders found.`
              }
            </p>
            {filterStatus === 'all' && (
              <Link
                to="/"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusConfig = getOrderStatusConfig(order.status);
              const progress = getOrderProgress(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${statusConfig.bgColor}`}>
                          <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(order.pricing.total)}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Progress */}
                  <div className="p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-900">Order Progress</h4>
                      <span className="text-sm text-gray-500">{progress}/5</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {[
                        { label: 'Ordered', icon: ClockIcon },
                        { label: 'Confirmed', icon: CheckCircleIcon },
                        { label: 'Processing', icon: ArrowPathIcon },
                        { label: 'Shipped', icon: TruckIcon },
                        { label: 'Delivered', icon: HomeIcon }
                      ].map((step, index) => {
                        const StepIcon = step.icon;
                        const isCompleted = index < progress;
                        const isCurrent = index === progress - 1;
                        
                        return (
                          <div key={index} className="flex items-center flex-1">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                              isCompleted 
                                ? 'bg-green-500 text-white' 
                                : isCurrent 
                                ? 'bg-purple-500 text-white' 
                                : 'bg-gray-300 text-gray-600'
                            }`}>
                              <StepIcon className="h-4 w-4" />
                            </div>
                            <div className="ml-2 flex-1">
                              <p className={`text-xs font-medium ${
                                isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {step.label}
                              </p>
                            </div>
                            {index < 4 && (
                              <div className={`flex-1 h-0.5 mx-2 ${
                                isCompleted ? 'bg-green-500' : 'bg-gray-300'
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <img
                            src={item.product?.images?.[0]?.url || '/placeholder-image.jpg'}
                            alt={item.product?.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {item.product?.name}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Qty: {item.quantity}</span>
                              {item.size && <span>Size: {item.size}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <p className="text-xs text-gray-500 line-through">
                                {formatCurrency(item.originalPrice * item.quantity)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700"
                        >
                          <EyeIcon className="h-4 w-4" />
                          <span>View Details</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700">
                          <PrinterIcon className="h-4 w-4" />
                          <span>Print Invoice</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleCancelOrder(order._id, 'Cancelled by customer')}
                            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50"
                          >
                            Cancel Order
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <button className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-300 rounded-lg hover:bg-green-50">
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Details - #{selectedOrder.orderNumber}
                  </h2>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Status</h3>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getOrderStatusConfig(selectedOrder.status).bgColor}`}>
                      {React.createElement(getOrderStatusConfig(selectedOrder.status).icon, {
                        className: `h-5 w-5 ${getOrderStatusConfig(selectedOrder.status).color}`
                      })}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {getOrderStatusConfig(selectedOrder.status).label}
                      </p>
                      <p className="text-sm text-gray-500">
                        {getOrderStatusConfig(selectedOrder.status).description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedOrder.shippingAddress.street}
                        </p>
                        <p className="text-gray-600">
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}
                        </p>
                        <p className="text-gray-600">
                          {selectedOrder.shippingAddress.country}
                        </p>
                        {selectedOrder.shippingAddress.phone && (
                          <p className="text-gray-600 flex items-center mt-1">
                            <PhoneIcon className="h-4 w-4 mr-1" />
                            {selectedOrder.shippingAddress.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCardIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Payment Method: {selectedOrder.payment.method.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {selectedOrder.payment.status}
                        </p>
                        {selectedOrder.payment.transactionId && (
                          <p className="text-sm text-gray-500">
                            Transaction ID: {selectedOrder.payment.transactionId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Timeline */}
                {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Timeline</h3>
                    <div className="space-y-3">
                      {selectedOrder.timeline.map((event, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {event.status.replace('_', ' ').toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(event.timestamp)}
                            </p>
                            {event.note && (
                              <p className="text-sm text-gray-600 mt-1">
                                {event.note}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(selectedOrder.pricing.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">{formatCurrency(selectedOrder.pricing.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">{formatCurrency(selectedOrder.pricing.tax)}</span>
                    </div>
                    {selectedOrder.pricing.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-medium text-green-600">-{formatCurrency(selectedOrder.pricing.discount)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 pt-2 flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(selectedOrder.pricing.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
