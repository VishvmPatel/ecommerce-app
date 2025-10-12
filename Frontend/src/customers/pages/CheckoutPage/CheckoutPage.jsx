import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useAddress } from '../../../contexts/AddressContext';
import { useToast } from '../../../contexts/ToastContext';
import AddressSelector from '../../../components/AddressSelector/AddressSelector';
import AddressForm from '../../../components/AddressForm/AddressForm';
import PayUPayment from '../../../components/Payment/PayUPayment';
import apiService from '../../../services/api';
import {
  CreditCardIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  LockClosedIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getCartSubtotal, getCartTax, getCartShipping, getCartGrandTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { getDefaultAddress } = useAddress();
  const { showSuccess, showError } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    // Address Information
    shippingAddress: null,
    billingAddress: null,
    sameAsShipping: true,
    // Payment Information - Only Stripe
    paymentMethod: 'card',
    // Order Information
    orderNotes: '',
    agreeToTerms: false
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    // Load default address
    const defaultAddress = getDefaultAddress();
    if (defaultAddress) {
      setFormData(prev => ({
        ...prev,
        shippingAddress: defaultAddress
      }));
    }
  }, [isAuthenticated, items.length, navigate, getDefaultAddress]);

  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      // Validate shipping address
      if (!formData.shippingAddress) {
        errors.shippingAddress = 'Please select a shipping address';
      }
    }

    if (step === 2) {
      // Validate billing address
      if (!formData.sameAsShipping && !formData.billingAddress) {
        errors.billingAddress = 'Please select a billing address';
      }
    }

    if (step === 3) {
      // Payment method validation - only Stripe
      if (!formData.paymentMethod) {
        errors.paymentMethod = 'Please select a payment method';
      }
      
      if (!formData.agreeToTerms) {
        errors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    
    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          product: item.id,
          quantity: item.quantity,
          size: item.size || null,
          color: item.color || null
        })),
        shippingAddress: {
          firstName: formData.shippingAddress?.firstName || '',
          lastName: formData.shippingAddress?.lastName || '',
          email: formData.shippingAddress?.email || '',
          phone: formData.shippingAddress?.phone || '',
          address: formData.shippingAddress?.address || '',
          city: formData.shippingAddress?.city || '',
          state: formData.shippingAddress?.state || '',
          zipCode: formData.shippingAddress?.zipCode || '',
          country: formData.shippingAddress?.country || 'India'
        },
        billingAddress: formData.sameAsShipping ? {
          firstName: formData.shippingAddress?.firstName || '',
          lastName: formData.shippingAddress?.lastName || '',
          email: formData.shippingAddress?.email || '',
          phone: formData.shippingAddress?.phone || '',
          address: formData.shippingAddress?.address || '',
          city: formData.shippingAddress?.city || '',
          state: formData.shippingAddress?.state || '',
          zipCode: formData.shippingAddress?.zipCode || '',
          country: formData.shippingAddress?.country || 'India'
        } : {
          firstName: formData.billingAddress?.firstName || '',
          lastName: formData.billingAddress?.lastName || '',
          email: formData.billingAddress?.email || '',
          phone: formData.billingAddress?.phone || '',
          address: formData.billingAddress?.address || '',
          city: formData.billingAddress?.city || '',
          state: formData.billingAddress?.state || '',
          zipCode: formData.billingAddress?.zipCode || '',
          country: formData.billingAddress?.country || 'India'
        },
        paymentMethod: formData.paymentMethod,
        subtotal: getCartSubtotal(),
        shipping: getCartShipping(),
        tax: getCartTax(),
        total: getCartGrandTotal(),
        orderNotes: formData.orderNotes
      };

      // Create the order
      const response = await apiService.createOrder(orderData);
      
      if (response.success) {
        setCreatedOrder(response.data);
        
        // Always go to Stripe payment
        setCurrentStep(4);
      } else {
        showError(response.message || 'Failed to place order. Please try again.');
      }
      
    } catch (error) {
      console.error('Order placement error:', error);
      showError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    showSuccess('Payment successful! Order confirmed.');
    clearCart();
    navigate('/order-confirmation', { 
      state: { order: createdOrder } 
    });
  };

  const handlePaymentError = (error) => {
    showError(error || 'Payment failed. Please try again.');
  };

  const steps = [
    { id: 1, name: 'Shipping Address', icon: MapPinIcon },
    { id: 2, name: 'Billing Address', icon: UserIcon },
    { id: 3, name: 'Payment Information', icon: CreditCardIcon },
    { id: 4, name: 'Complete Payment', icon: LockClosedIcon }
  ];

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Progress Steps */}
              <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        currentStep >= step.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        <step.icon className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${
                          currentStep >= step.id ? 'text-purple-600' : 'text-gray-500'
                        }`}>
                          {step.name}
                        </p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-0.5 mx-4 ${
                          currentStep > step.id ? 'bg-purple-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6">
                {/* Step 1: Shipping Address */}
                {currentStep === 1 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <MapPinIcon className="w-6 h-6 text-purple-600 mr-3" />
                      <h2 className="text-2xl font-semibold text-gray-900">Shipping Address</h2>
                    </div>

                    {formData.shippingAddress ? (
                      <div className="mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <h3 className="font-medium text-gray-900 mb-2">
                            {formData.shippingAddress.firstName} {formData.shippingAddress.lastName}
                          </h3>
                          <p className="text-gray-600">{formData.shippingAddress.address}</p>
                          <p className="text-gray-600">
                            {formData.shippingAddress.city}, {formData.shippingAddress.state} {formData.shippingAddress.zipCode}
                          </p>
                          <p className="text-gray-600">{formData.shippingAddress.country}</p>
                          <p className="text-gray-600">Phone: {formData.shippingAddress.phone}</p>
                        </div>
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Change Address
                        </button>
                      </div>
                    ) : (
                      <div className="mb-6">
                        <p className="text-gray-600 mb-4">Please select or add a shipping address</p>
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Add Address
                        </button>
                      </div>
                    )}

                    {formErrors.shippingAddress && (
                      <p className="text-red-600 text-sm mb-4">{formErrors.shippingAddress}</p>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={() => setCurrentStep(2)}
                        disabled={!formData.shippingAddress}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue to Billing
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Billing Address */}
                {currentStep === 2 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <UserIcon className="w-6 h-6 text-purple-600 mr-3" />
                      <h2 className="text-2xl font-semibold text-gray-900">Billing Address</h2>
                    </div>

                    <div className="mb-6">
                      <label className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          checked={formData.sameAsShipping}
                          onChange={(e) => setFormData(prev => ({ ...prev, sameAsShipping: e.target.checked }))}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="ml-3 text-gray-700">Same as shipping address</span>
                      </label>

                      {!formData.sameAsShipping && (
                        <div>
                          {formData.billingAddress ? (
                            <div className="bg-gray-50 p-4 rounded-lg border">
                              <h3 className="font-medium text-gray-900 mb-2">
                                {formData.billingAddress.firstName} {formData.billingAddress.lastName}
                              </h3>
                              <p className="text-gray-600">{formData.billingAddress.address}</p>
                              <p className="text-gray-600">
                                {formData.billingAddress.city}, {formData.billingAddress.state} {formData.billingAddress.zipCode}
                              </p>
                              <p className="text-gray-600">{formData.billingAddress.country}</p>
                              <p className="text-gray-600">Phone: {formData.billingAddress.phone}</p>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowAddressForm(true)}
                              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              Add Billing Address
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {formErrors.billingAddress && (
                      <p className="text-red-600 text-sm mb-4">{formErrors.billingAddress}</p>
                    )}

                    <div className="flex justify-between">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Back to Shipping
                      </button>
                      <button
                        onClick={() => setCurrentStep(3)}
                        disabled={!formData.sameAsShipping && !formData.billingAddress}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Information */}
                {currentStep === 3 && (
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      <CreditCardIcon className="w-6 h-6 text-purple-600 mr-3" />
                      <h2 className="text-2xl font-semibold text-gray-900">Payment Information</h2>
                    </div>

                    {/* Payment Method Info */}
                    <div className="mb-6">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <CreditCardIcon className="w-8 h-8 text-purple-600 mr-3" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Credit/Debit Card Payment</h3>
                            <p className="text-gray-600">Secure payment powered by Stripe</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <ShieldCheckIcon className="w-4 h-4 mr-2 text-green-600" />
                            <span>256-bit SSL encryption</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <LockClosedIcon className="w-4 h-4 mr-2 text-green-600" />
                            <span>PCI DSS compliant</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <CheckCircleIcon className="w-4 h-4 mr-2 text-green-600" />
                            <span>Instant confirmation</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Notes */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        value={formData.orderNotes}
                        onChange={(e) => setFormData(prev => ({ ...prev, orderNotes: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 resize-none"
                        rows="3"
                        placeholder="Any special instructions for your order..."
                      />
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mb-6">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          I agree to the{' '}
                          <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                            Terms and Conditions
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                      {formErrors.agreeToTerms && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.agreeToTerms}</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Back to Billing
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing Order...
                          </>
                        ) : (
                          <>
                            <LockClosedIcon className="w-5 h-5 mr-2" />
                            Proceed to Payment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Complete Payment */}
                {currentStep === 4 && createdOrder && (
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      <LockClosedIcon className="w-6 h-6 text-purple-600 mr-3" />
                      <h2 className="text-2xl font-semibold text-gray-900">Complete Payment</h2>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <ShieldCheckIcon className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-blue-800 font-medium">Secure Payment</span>
                      </div>
                      <p className="text-blue-700 text-sm mt-1">
                        Your payment information is encrypted and secure. We use PayU for secure payment processing.
                      </p>
                    </div>

                    <PayUPayment
                      orderId={createdOrder._id}
                      amount={Math.round(createdOrder.total * 100)}
                      currency="INR"
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />

                    <div className="mt-6 flex justify-between">
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Back to Payment Method
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={item.image || '/images/default-product.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                      {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{getCartSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">₹{getCartShipping().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">₹{getCartTax().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{getCartGrandTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Form Modal */}
        {showAddressForm && (
          <AddressForm
            isOpen={showAddressForm}
            onClose={() => {
              setShowAddressForm(false);
              setEditingAddress(null);
            }}
            onSave={(address) => {
              if (editingAddress) {
                // Handle address update
              } else {
                if (currentStep === 1) {
                  setFormData(prev => ({ ...prev, shippingAddress: address }));
                } else if (currentStep === 2) {
                  setFormData(prev => ({ ...prev, billingAddress: address }));
                }
              }
              setShowAddressForm(false);
              setEditingAddress(null);
            }}
            address={editingAddress}
            title={currentStep === 1 ? 'Shipping Address' : 'Billing Address'}
          />
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;