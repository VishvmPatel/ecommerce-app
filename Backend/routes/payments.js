const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripeService');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

console.log('Payment routes module loaded successfully');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Payment routes are working!' });
});

// Create payment intent
router.post('/create-payment-intent', auth, [
  body('orderId').isMongoId().withMessage('Valid order ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('currency').optional().isString().withMessage('Currency must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId, amount, currency = 'inr', metadata = {} } = req.body;

    const result = await stripeService.createPaymentIntent(
      orderId, 
      amount, 
      currency, 
      metadata
    );

    if (result.success) {
      res.json({
        success: true,
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
        paymentId: result.paymentId
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Confirm payment
router.post('/confirm-payment', auth, [
  body('paymentIntentId').isString().withMessage('Payment intent ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { paymentIntentId } = req.body;

    const result = await stripeService.confirmPayment(paymentIntentId);

    if (result.success) {
      res.json({
        success: true,
        status: result.status,
        paymentIntent: result.paymentIntent
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Stripe webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.log('⚠️ Stripe webhook secret not configured');
      return res.status(400).send('Webhook secret not configured');
    }

    let event;

    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const result = await stripeService.handleWebhook(event);

    if (result.success) {
      res.json({ received: true });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get payment details
router.get('/payment/:paymentId', auth, async (req, res) => {
  try {
    const { paymentId } = req.params;

    const result = await stripeService.getPaymentDetails(paymentId);

    if (result.success) {
      res.json({
        success: true,
        payment: result.payment
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user payments
router.get('/user-payments', auth, async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query;
    const userId = req.user.id;

    const result = await stripeService.getPaymentsByUser(userId, parseInt(limit), parseInt(skip));

    if (result.success) {
      res.json({
        success: true,
        payments: result.payments,
        total: result.total,
        hasMore: result.hasMore
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create refund
router.post('/refund', auth, [
  body('paymentId').isMongoId().withMessage('Valid payment ID is required'),
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('reason').optional().isString().withMessage('Reason must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { paymentId, amount, reason = 'requested_by_customer' } = req.body;

    const result = await stripeService.createRefund(paymentId, amount, reason);

    if (result.success) {
      res.json({
        success: true,
        refund: result.refund
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Refund creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get payment analytics (admin only)
router.get('/analytics', auth, async (req, res) => {
  try {
    // Check if user is admin (you can implement your own admin check)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const result = await stripeService.getPaymentAnalytics(startDate, endDate);

    if (result.success) {
      res.json({
        success: true,
        analytics: result.analytics,
        totalPayments: result.totalPayments,
        totalRevenue: result.totalRevenue
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Payment analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
