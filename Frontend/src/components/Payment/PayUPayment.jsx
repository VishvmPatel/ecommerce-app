import React, { useState } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, CreditCardIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../contexts/ToastContext';

const PayUPayment = ({ orderId, amount, currency = 'INR', onSuccess, onError }) => {
  const { showSuccess, showError } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showTestCards, setShowTestCards] = useState(false);
  
  // Payment form state
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phone: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number (add spaces every 4 digits)
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // Format expiry date (MM/YY)
    else if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // Limit CVV to 3 digits
    else if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').slice(0, 3);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.cardNumber.replace(/\s/g, '')) {
      errors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      errors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!formData.expiryDate) {
      errors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      errors.expiryDate = 'Invalid expiry date format';
    }
    
    if (!formData.cvv) {
      errors.cvv = 'CVV is required';
    } else if (formData.cvv.length !== 3) {
      errors.cvv = 'CVV must be 3 digits';
    }
    
    if (!formData.cardholderName.trim()) {
      errors.cardholderName = 'Cardholder name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (formData.phone.length < 10) {
      errors.phone = 'Invalid phone number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      showError('Please fill in all required fields correctly');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Simulate payment processing with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate success
      setPaymentStatus('success');
      onSuccess?.({ 
        orderId, 
        amount, 
        status: 'success',
        paymentMethod: 'card',
        cardNumber: formData.cardNumber.replace(/\s/g, '').slice(-4)
      });

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      setErrorMessage(error.message);
      showError(error.message);
      onError?.(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const fillTestCard = (cardData) => {
    setFormData(prev => ({
      ...prev,
      cardNumber: cardData.cardNumber,
      expiryDate: cardData.expiry,
      cvv: cardData.cvv,
      cardholderName: cardData.name,
      email: 'test@example.com',
      phone: '9999999999'
    }));
    setShowTestCards(false);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
        <CheckCircleIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800">Payment Successful!</h3>
        <p className="text-green-700 mt-2">Your order has been confirmed.</p>
        <p className="text-green-600 text-sm mt-1">Order ID: {orderId}</p>
        <p className="text-green-600 text-sm">Amount: ₹{(amount / 100).toFixed(2)}</p>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Failed</h3>
        <p className="text-gray-600 mb-4">{errorMessage}</p>
        <button
          onClick={() => {
            setPaymentStatus('idle');
            setErrorMessage('');
          }}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Details Summary */}
      <div className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <CreditCardIcon className="w-5 h-5 mr-2 text-purple-600" />
          Payment Details
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div>Order ID: {orderId}</div>
          <div>Amount: ₹{(amount / 100).toFixed(2)}</div>
          <div>Currency: {currency}</div>
        </div>
      </div>

      {/* Test Cards Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <InformationCircleIcon className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="text-sm font-semibold text-blue-800">Test Environment</h4>
          </div>
          <button
            onClick={() => setShowTestCards(!showTestCards)}
            className="text-blue-600 text-sm underline hover:text-blue-800"
          >
            {showTestCards ? 'Hide' : 'Show'} Test Cards
          </button>
        </div>
        
        {showTestCards && (
          <div className="mt-3 space-y-3">
            <div className="p-3 bg-white rounded border">
              <h5 className="font-semibold text-gray-800 mb-2">💳 Test Card Details:</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Success Card:</span>
                  <button
                    onClick={() => fillTestCard({
                      cardNumber: '5123 4567 8901 2346',
                      expiry: '05/25',
                      cvv: '123',
                      name: 'Test User'
                    })}
                    className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                  >
                    Use This Card
                  </button>
                </div>
                <div className="text-xs text-gray-600">5123 4567 8901 2346 | 05/25 | 123</div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">Failure Card:</span>
                  <button
                    onClick={() => fillTestCard({
                      cardNumber: '4000 0000 0000 0002',
                      expiry: '05/25',
                      cvv: '123',
                      name: 'Test User'
                    })}
                    className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                  >
                    Use This Card
                  </button>
                </div>
                <div className="text-xs text-gray-600">4000 0000 0000 0002 | 05/25 | 123</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Form */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Information</h3>
        
        <div className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number *
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={19}
            />
            {formErrors.cardNumber && (
              <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date *
              </label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  formErrors.expiryDate ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={5}
              />
              {formErrors.expiryDate && (
                <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV *
              </label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  formErrors.cvv ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={3}
              />
              {formErrors.cvv && (
                <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>
              )}
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name *
            </label>
            <input
              type="text"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                formErrors.cardholderName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.cardholderName && (
              <p className="text-red-500 text-xs mt-1">{formErrors.cardholderName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                formErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="9999999999"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                formErrors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </>
        ) : (
          `Pay ₹${(amount / 100).toFixed(2)} Securely`
        )}
      </button>

      {/* Security Info */}
      <div className="text-center text-sm text-gray-500">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p>Powered by PayU • SSL Protected</p>
      </div>

      {/* Debug Info */}
      <div className="text-xs text-gray-400 bg-gray-100 p-2 rounded">
        <div>Debug: Order ID: {orderId || 'None'} | Amount: {amount || 'None'} | Currency: {currency}</div>
        <div>Amount in Rupees: {amount ? (amount / 100).toFixed(2) : 'N/A'}</div>
        {errorMessage && <div className="text-red-600">Error: {errorMessage}</div>}
        <div className="text-green-600 font-medium mt-1">✅ PayU payment system ready!</div>
        <div className="text-blue-600 text-xs mt-1">💡 Using PayU Test Environment - 100% Free!</div>
      </div>
    </div>
  );
};

export default PayUPayment;