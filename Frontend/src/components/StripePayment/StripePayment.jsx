import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import apiService from '../../services/api';

// Stripe publishable key - HTTP warning is normal for development
const stripePromise = loadStripe('pk_test_51SGkakQef2ETxGAPvAjNDVy5cc30oVq99m4knlsV0vgmaDfkHOtLiV3Qz96XrNTx5cgaFkSEAVC1zngbomdMN24l00HeXDuoGX');

const CheckoutForm = ({ orderId, amount, onSuccess, onError, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await apiService.createPaymentIntent({
          orderId,
          amount,
          currency: 'usd'
        });

        if (response.success) {
          setClientSecret(response.clientSecret);
        } else {
          setError(response.message || 'Failed to create payment intent');
        }
      } catch (err) {
        setError('Failed to initialize payment');
        console.error('Payment intent error:', err);
      }
    };

    if (orderId && amount) {
      createPaymentIntent();
    }
  }, [orderId, amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.name || 'Customer',
            email: user?.email || '',
          },
        }
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        const confirmResponse = await apiService.confirmPayment({
          paymentIntentId: paymentIntent.id
        });

        if (confirmResponse.success) {
          onSuccess(paymentIntent);
        } else {
          setError(confirmResponse.message || 'Payment confirmation failed');
        }
        setProcessing(false);
      }
    } catch (err) {
      setError('Payment processing failed');
      console.error('Payment error:', err);
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-md p-3">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={!stripe || processing || !clientSecret}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

const StripePayment = ({ orderId, amount, onSuccess, onError, onCancel }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        orderId={orderId}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default StripePayment;
