import React, { useState } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../contexts/ToastContext';

const RazorpayPayment = ({ orderId, amount, currency = 'INR', onSuccess, onError }) => {
  const { showSuccess, showError } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Load Razorpay script
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create order on backend
      const response = await fetch('/api/payments/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          orderId,
          amount: Math.round(amount), // Razorpay expects amount in paise
          currency
        })
      });

      const orderData = await response.json();
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'Your Store',
        description: `Payment for Order #${orderId}`,
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/payments/verify-razorpay-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId
              })
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              setPaymentStatus('success');
              onSuccess?.(response);
            } else {
              throw new Error(verifyData.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentStatus('error');
            setErrorMessage('Payment verification failed');
            onError?.(error.message);
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#8B5CF6'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            setPaymentStatus('idle');
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

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

  if (paymentStatus === 'success') {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
        <CheckCircleIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800">Payment Successful!</h3>
        <p className="text-green-700 mt-2">Your order has been confirmed.</p>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Error</h3>
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
      <div className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Details</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div>Order ID: {orderId}</div>
          <div>Amount: ₹{(amount / 100).toFixed(2)}</div>
          <div>Currency: {currency}</div>
        </div>
      </div>

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
          `Pay ₹${(amount / 100).toFixed(2)}`
        )}
      </button>

      <div className="text-center text-sm text-gray-500">
        <p>Your payment information is secure and encrypted.</p>
        <p>Powered by Razorpay</p>
      </div>

      {/* Debug Info */}
      <div className="text-xs text-gray-400 bg-gray-100 p-2 rounded">
        <div>Debug: Order ID: {orderId || 'None'} | Amount: {amount || 'None'} | Currency: {currency}</div>
        <div>Amount in Rupees: {amount ? (amount / 100).toFixed(2) : 'N/A'}</div>
        {errorMessage && <div className="text-red-600">Error: {errorMessage}</div>}
        <div className="text-green-600 font-medium mt-1">✅ Razorpay payment system ready!</div>
      </div>
    </div>
  );
};

export default RazorpayPayment;
