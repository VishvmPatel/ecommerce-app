const express = require('express');
const router = express.Router();

console.log('Payment routes module loaded successfully');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Payment routes are working!' });
});

// Simple create payment intent route (without validation for now)
router.post('/create-payment-intent', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Payment intent endpoint reached',
    data: req.body 
  });
});

module.exports = router;


