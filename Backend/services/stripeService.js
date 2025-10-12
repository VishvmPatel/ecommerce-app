const Payment = require('../models/Payment');
const Order = require('../models/Order');
const socketService = require('./socketService');

class StripeService {
  constructor() {
    this.stripe = null;
    this.initializeStripe();
  }

  initializeStripe() {
    try {
      if (process.env.STRIPE_SECRET_KEY) {
        const stripe = require('stripe');
        this.stripe = stripe(process.env.STRIPE_SECRET_KEY);
        console.log('✅ Stripe initialized successfully');
      } else {
        console.log('⚠️ Stripe secret key not found. Payment features will be disabled.');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Stripe:', error.message);
    }
  }

  async createPaymentIntent(orderId, amount, currency = 'usd', metadata = {}) {
    try {
      if (!this.stripe) {
        return {
          success: false,
          error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.'
        };
      }

      const order = await Order.findById(orderId).populate('user');
      if (!order) {
        throw new Error('Order not found');
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          orderId: orderId.toString(),
          userId: order.user._id.toString(),
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
        description: `Payment for Order #${order.orderNumber}`,
        receipt_email: order.user.email,
        shipping: {
          name: order.shippingAddress.fullName,
          address: {
            line1: order.shippingAddress.address,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            postal_code: order.shippingAddress.pincode,
            country: order.shippingAddress.country || 'US',
          },
        },
      });

      // Create payment record
      const payment = new Payment({
        orderId,
        userId: order.user._id,
        stripePaymentIntentId: paymentIntent.id,
        amount,
        currency,
        status: 'pending',
        paymentMethod: 'card',
        metadata: {
          orderNumber: order.orderNumber,
          ...metadata
        }
      });

      await payment.save();

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        paymentId: payment._id
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async confirmPayment(paymentIntentId) {
    try {
      if (!this.stripe) {
        return {
          success: false,
          error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.'
        };
      }

      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Update payment record
        const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
        if (payment) {
          payment.status = 'succeeded';
          payment.paymentMethodDetails = {
            card: paymentIntent.charges?.data?.[0]?.payment_method_details?.card,
            billing_details: paymentIntent.charges?.data?.[0]?.billing_details
          };
          payment.receiptUrl = paymentIntent.charges?.data?.[0]?.receipt_url;
          await payment.save();

          // Update order status
          const order = await Order.findById(payment.orderId);
          if (order) {
            order.status = 'confirmed';
            order.paymentStatus = 'paid';
            await order.save();

            // Emit real-time update
            socketService.emitOrderUpdate(order);
          }
        }
      }

      return {
        success: true,
        status: paymentIntent.status,
        paymentIntent
      };
    } catch (error) {
      console.error('Error confirming payment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async handleWebhook(event) {
    try {
      if (!this.stripe) {
        return {
          success: false,
          error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.'
        };
      }

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        case 'payment_intent.canceled':
          await this.handlePaymentCanceled(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error handling webhook:', error);
      return { success: false, error: error.message };
    }
  }

  async handlePaymentSuccess(paymentIntent) {
    const payment = await Payment.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (payment) {
      payment.status = 'succeeded';
      payment.paymentMethodDetails = {
        card: paymentIntent.charges?.data[0]?.payment_method_details?.card,
        billing_details: paymentIntent.charges?.data[0]?.billing_details
      };
      payment.receiptUrl = paymentIntent.charges?.data[0]?.receipt_url;
      await payment.save();

      // Update order
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.status = 'confirmed';
        order.paymentStatus = 'paid';
        await order.save();

        // Emit real-time update
        socketService.emitOrderUpdate(order);
      }
    }
  }

  async handlePaymentFailure(paymentIntent) {
    const payment = await Payment.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (payment) {
      payment.status = 'failed';
      payment.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
      await payment.save();

      // Update order
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.status = 'payment_failed';
        order.paymentStatus = 'failed';
        await order.save();

        // Emit real-time update
        socketService.emitOrderUpdate(order);
      }
    }
  }

  async handlePaymentCanceled(paymentIntent) {
    const payment = await Payment.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (payment) {
      payment.status = 'canceled';
      await payment.save();

      // Update order
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.status = 'canceled';
        order.paymentStatus = 'canceled';
        await order.save();

        // Emit real-time update
        socketService.emitOrderUpdate(order);
      }
    }
  }

  async createRefund(paymentId, amount, reason = 'requested_by_customer') {
    try {
      if (!this.stripe) {
        return {
          success: false,
          error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.'
        };
      }

      const payment = await Payment.findById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      const refundAmount = amount ? Math.round(amount * 100) : undefined;
      
      const refund = await this.stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId,
        amount: refundAmount,
        reason: reason,
        metadata: {
          paymentId: paymentId.toString(),
          orderId: payment.orderId.toString()
        }
      });

      // Add refund to payment record
      payment.refunds.push({
        amount: refund.amount / 100,
        reason: refund.reason,
        status: refund.status,
        stripeRefundId: refund.id
      });

      if (refund.status === 'succeeded') {
        payment.status = 'refunded';
      }

      await payment.save();

      return {
        success: true,
        refund
      };
    } catch (error) {
      console.error('Error creating refund:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPaymentDetails(paymentId) {
    try {
      const payment = await Payment.findById(paymentId)
        .populate('orderId')
        .populate('userId');

      if (!payment) {
        throw new Error('Payment not found');
      }

      return {
        success: true,
        payment
      };
    } catch (error) {
      console.error('Error getting payment details:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPaymentsByUser(userId, limit = 10, skip = 0) {
    try {
      const payments = await Payment.find({ userId })
        .populate('orderId')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      const total = await Payment.countDocuments({ userId });

      return {
        success: true,
        payments,
        total,
        hasMore: skip + limit < total
      };
    } catch (error) {
      console.error('Error getting user payments:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPaymentAnalytics(startDate, endDate) {
    try {
      const matchStage = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };

      const analytics = await Payment.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]);

      const totalPayments = await Payment.countDocuments(matchStage);
      const totalRevenue = await Payment.aggregate([
        { $match: { ...matchStage, status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      return {
        success: true,
        analytics,
        totalPayments,
        totalRevenue: totalRevenue[0]?.total || 0
      };
    } catch (error) {
      console.error('Error getting payment analytics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new StripeService();
