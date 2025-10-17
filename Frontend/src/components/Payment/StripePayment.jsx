import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import apiService from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

// Initialize Stripe once and memoize it
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ orderId, amount, currency, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { showSuccess, showError } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [clientSecret, setClientSecret] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Create payment intent when component mounts
  const createPaymentIntent = useCallback(async () => {
    if (!orderId || !amount) {
      console.error('Missing orderId or amount for payment intent:', { orderId, amount });
      setErrorMessage('Missing order details for payment');
      return;
    }

    try {
      console.log('Creating payment intent for:', { orderId, amount, currency });
      console.log('Amount in cents:', amount);
      console.log('Amount in rupees:', amount / 100);
      
      const response = await apiService.createPaymentIntent({ orderId, amount, currency });
      console.log('Payment intent response:', response);
      
      if (response.success && response.clientSecret) {
        setClientSecret(response.clientSecret);
        setIsReady(true);
        console.log('Payment intent created successfully');
      } else {
        console.error('Failed to create payment intent:', response);
        setErrorMessage(response.message || 'Failed to create payment intent');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      console.error('Error details:', error.response?.data || error.message);
      setErrorMessage(`Network error: ${error.message}`);
    }
  }, [orderId, amount, currency]);

  useEffect(() => {
    createPaymentIntent();
  }, [createPaymentIntent]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      console.error('Not ready:', { stripe: !!stripe, elements: !!elements, clientSecret: !!clientSecret });
      
      if (!stripe) {
        showError('Stripe is still loading. Please wait a moment.');
      } else if (!elements) {
        showError('Payment form is still loading. Please wait a moment.');
      } else if (!clientSecret) {
        showError('Payment session is not ready. Please wait a moment.');
      } else {
        showError('Payment system is not ready. Please wait a moment and try again.');
      }
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage('Card input not found. Please refresh and try again.');
      setIsProcessing(false);
      return;
    }

    try {
      console.log('Confirming payment with client secret:', clientSecret);
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        console.error('Stripe payment error:', error);
        setErrorMessage(error.message);
        setPaymentStatus('error');
        onError?.(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        setPaymentStatus('success');
        onSuccess?.(paymentIntent);
      } else {
        setErrorMessage('Payment failed or was not successful.');
        setPaymentStatus('error');
        onError?.('Payment failed or was not successful.');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      setErrorMessage('An unexpected error occurred during payment confirmation.');
      setPaymentStatus('error');
      onError?.('An unexpected error occurred during payment confirmation.');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
        iconColor: '#9e2146',
      },
    },
    hidePostalCode: false,
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

  if (errorMessage && paymentStatus === 'error') {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Error</h3>
        <p className="text-gray-600 mb-4">{errorMessage}</p>
        <button
          onClick={() => {
            setPaymentStatus('idle');
            setErrorMessage('');
            createPaymentIntent();
          }}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
        <CardElement 
          options={cardElementOptions} 
          className="p-3 border border-gray-200 rounded-md focus:ring-purple-500 focus:border-purple-500" 
        />
      </div>

      {errorMessage && paymentStatus === 'error' && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !isReady}
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
        <p>Powered by Stripe</p>
      </div>

      {/* Debug Info */}
      <div className="text-xs text-gray-400 bg-gray-100 p-2 rounded">
        <div>Debug: Ready: {isReady ? 'Yes' : 'No'} | Stripe: {stripe ? 'Yes' : 'No'} | Elements: {elements ? 'Yes' : 'No'} | Client Secret: {clientSecret ? 'Yes' : 'No'}</div>
        <div>Order ID: {orderId || 'None'} | Amount: {amount || 'None'} | Currency: {currency}</div>
        <div>Amount in Rupees: {amount ? (amount / 100).toFixed(2) : 'N/A'}</div>
        {errorMessage && <div className="text-red-600">Error: {errorMessage}</div>}
        {isReady && stripe && elements && clientSecret && (
          <div className="text-green-600 font-medium mt-1">✅ Payment system is ready!</div>
        )}
      </div>
    </form>
  );
};

const StripePayment = ({ orderId, amount, currency = 'inr', onSuccess, onError }) => {
  const { showError } = useToast();
  const [stripeError, setStripeError] = useState(null);

  // Memoize the stripe instance to prevent prop changes
  const memoizedStripePromise = useMemo(() => {
    return stripePromise;
  }, []);

  useEffect(() => {
    // Check if Stripe loaded successfully
    memoizedStripePromise.then(stripe => {
      if (!stripe) {
        setStripeError('Failed to load Stripe payment system');
      }
    }).catch(error => {
      console.error('Stripe loading error:', error);
      setStripeError('Error loading payment system');
    });
  }, [memoizedStripePromise]);

  if (stripeError) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment System Error</h3>
        <p className="text-gray-600 mb-4">{stripeError}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (!orderId || !amount) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Missing Order Information</h3>
        <p className="text-gray-600">Order ID or amount is missing. Please try again.</p>
      </div>
    );
  }

  return (
    <Elements stripe={memoizedStripePromise}>
      <PaymentForm 
        orderId={orderId} 
        amount={amount} 
        currency={currency} 
        onSuccess={onSuccess} 
        onError={onError} 
      />
    </Elements>
  );
};

export default StripePayment;