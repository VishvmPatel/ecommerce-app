const mongoose = require('mongoose');
const Order = require('./models/Order');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const createSampleOrders = async () => {
  try {
    const user = await User.findOne();
    if (!user) {
      console.log('No users found. Please create a user first.');
      return;
    }

    const products = await Product.find().limit(3);
    if (products.length === 0) {
      console.log('No products found. Please add products first.');
      return;
    }

    const sampleOrders = [
      {
        user: user._id,
        items: [
          {
            product: products[0]._id,
            quantity: 2,
            size: 'M',
            color: 'Blue',
            price: products[0].price,
            originalPrice: products[0].originalPrice
          }
        ],
        shippingAddress: {
          type: 'home',
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
          phone: '+91-9876543210'
        },
        billingAddress: {
          type: 'home',
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
          phone: '+91-9876543210'
        },
        payment: {
          method: 'cod',
          status: 'pending'
        },
        pricing: {
          subtotal: products[0].price * 2,
          shipping: 0,
          tax: products[0].price * 2 * 0.18,
          discount: 0,
          total: products[0].price * 2 * 1.18
        },
        status: 'pending',
        timeline: [
          {
            status: 'pending',
            timestamp: new Date(),
            note: 'Order placed successfully'
          }
        ]
      },
      {
        user: user._id,
        items: [
          {
            product: products[1]._id,
            quantity: 1,
            size: 'L',
            color: 'Red',
            price: products[1].price,
            originalPrice: products[1].originalPrice
          }
        ],
        shippingAddress: {
          type: 'home',
          street: '456 Park Avenue',
          city: 'Delhi',
          state: 'Delhi',
          postalCode: '110001',
          country: 'India',
          phone: '+91-9876543211'
        },
        billingAddress: {
          type: 'home',
          street: '456 Park Avenue',
          city: 'Delhi',
          state: 'Delhi',
          postalCode: '110001',
          country: 'India',
          phone: '+91-9876543211'
        },
        payment: {
          method: 'upi',
          status: 'completed',
          transactionId: 'TXN123456789',
          paidAt: new Date()
        },
        pricing: {
          subtotal: products[1].price,
          shipping: 0,
          tax: products[1].price * 0.18,
          discount: 0,
          total: products[1].price * 1.18
        },
        status: 'shipped',
        tracking: {
          carrier: 'BlueDart',
          trackingNumber: 'BD123456789',
          trackingUrl: 'https://www.bluedart.com/track',
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
        },
        timeline: [
          {
            status: 'pending',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            note: 'Order placed successfully'
          },
          {
            status: 'confirmed',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
            note: 'Order confirmed and payment received'
          },
          {
            status: 'processing',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            note: 'Order is being processed and packed'
          },
          {
            status: 'shipped',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            note: 'Order has been shipped'
          }
        ]
      },
      {
        user: user._id,
        items: [
          {
            product: products[2]._id,
            quantity: 1,
            size: 'S',
            color: 'Green',
            price: products[2].price,
            originalPrice: products[2].originalPrice
          }
        ],
        shippingAddress: {
          type: 'work',
          street: '789 Business Park',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
          phone: '+91-9876543212'
        },
        billingAddress: {
          type: 'work',
          street: '789 Business Park',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
          phone: '+91-9876543212'
        },
        payment: {
          method: 'credit_card',
          status: 'completed',
          transactionId: 'TXN987654321',
          paidAt: new Date()
        },
        pricing: {
          subtotal: products[2].price,
          shipping: 0,
          tax: products[2].price * 0.18,
          discount: 0,
          total: products[2].price * 1.18
        },
        status: 'delivered',
        tracking: {
          carrier: 'DTDC',
          trackingNumber: 'DTDC123456789',
          trackingUrl: 'https://www.dtdc.com/track',
          estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        },
        timeline: [
          {
            status: 'pending',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            note: 'Order placed successfully'
          },
          {
            status: 'confirmed',
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
            note: 'Order confirmed and payment received'
          },
          {
            status: 'processing',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            note: 'Order is being processed and packed'
          },
          {
            status: 'shipped',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            note: 'Order has been shipped'
          },
          {
            status: 'delivered',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            note: 'Order delivered successfully'
          }
        ]
      }
    ];

    await Order.deleteMany({ user: user._id });

    for (const orderData of sampleOrders) {
      const order = new Order(orderData);
      await order.save();
      console.log(`Created order: ${order.orderNumber} with status: ${order.status}`);
    }

    console.log('Sample orders created successfully!');
  } catch (error) {
    console.error('Error creating sample orders:', error);
  }
};

const main = async () => {
  await connectDB();
  await createSampleOrders();
  mongoose.connection.close();
};

main();
