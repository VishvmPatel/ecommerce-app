const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

console.log('PayU payment routes module loaded successfully');

// PayU Test Credentials (Free for testing)
const PAYU_CONFIG = {
  merchantKey: process.env.PAYU_MERCHANT_KEY || 'gtKFFx',
  merchantSalt: process.env.PAYU_MERCHANT_SALT || 'eCwWELxi',
  testMode: true // Always true for testing
};

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'PayU payment routes are working!' });
});

// Generate PayU hash (without auth for testing)
router.post('/generate-payu-hash', async (req, res) => {
  try {
    const { txnid, amount, productinfo, firstname, email, orderId } = req.body;

    if (!txnid || !amount || !productinfo || !firstname || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters for hash generation'
      });
    }

    // Generate hash string
    const hashString = `${PAYU_CONFIG.merchantKey}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_CONFIG.merchantSalt}`;
    
    // Generate SHA512 hash
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    res.json({
      success: true,
      hash: hash,
      txnid: txnid,
      amount: amount
    });

  } catch (error) {
    console.error('Error generating PayU hash:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate payment hash'
    });
  }
});

// PayU success callback
router.post('/payu-success', async (req, res) => {
  try {
    const { 
      txnid, 
      amount, 
      productinfo, 
      firstname, 
      email, 
      status, 
      hash,
      orderId 
    } = req.body;

    // Verify hash
    const hashString = `${PAYU_CONFIG.merchantSalt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}`;
    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

    if (calculatedHash !== hash) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hash verification'
      });
    }

    if (status === 'success') {
      // Update order status
      const order = await Order.findById(orderId);
      if (order) {
        order.status = 'confirmed';
        order.paymentStatus = 'paid';
        order.paymentMethod = 'payu';
        order.paymentDetails = {
          txnid,
          amount,
          status,
          hash
        };
        await order.save();
      }

      res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      res.json({
        success: false,
        message: 'Payment failed'
      });
    }

  } catch (error) {
    console.error('Error processing PayU success:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment'
    });
  }
});

// PayU failure callback
router.post('/payu-failure', async (req, res) => {
  try {
    const { 
      txnid, 
      amount, 
      productinfo, 
      firstname, 
      email, 
      status, 
      hash,
      orderId 
    } = req.body;

    // Update order status to failed
    const order = await Order.findById(orderId);
    if (order) {
      order.status = 'payment_failed';
      order.paymentStatus = 'failed';
      order.paymentMethod = 'payu';
      order.paymentDetails = {
        txnid,
        amount,
        status,
        hash
      };
      await order.save();
    }

    res.json({
      success: false,
      message: 'Payment failed'
    });

  } catch (error) {
    console.error('Error processing PayU failure:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment failure'
    });
  }
});

// Get PayU test cards
router.get('/test-cards', (req, res) => {
  res.json({
    success: true,
    testCards: [
      {
        cardNumber: '5123456789012346',
        expiry: '05/25',
        cvv: '123',
        name: 'Test Card',
        type: 'Success'
      },
      {
        cardNumber: '4000000000000002',
        expiry: '05/25',
        cvv: '123',
        name: 'Test Card',
        type: 'Failure'
      }
    ],
    upi: [
      {
        upiId: 'test@payu',
        type: 'Success'
      }
    ],
    netbanking: [
      {
        bank: 'Test Bank',
        type: 'Success'
      }
    ]
  });
});

module.exports = router;
