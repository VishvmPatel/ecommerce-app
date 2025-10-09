const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Analytics = require('../models/Analytics');
const AdminLog = require('../models/AdminLog');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const startOfWeek = new Date(today.setDate(today.getDate() - 7));
    const startOfMonth = new Date(today.setMonth(today.getMonth() - 1));

    const todayAnalytics = await Analytics.findOne({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    const recentAnalytics = await Analytics.find({
      date: {
        $gte: startOfMonth
      }
    }).sort({ date: -1 }).limit(30);

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const todayOrders = await Order.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const todayRevenue = await Order.aggregate([
      { 
        $match: { 
          status: { $in: ['delivered', 'shipped'] },
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const topSellingProducts = await Order.aggregate([
      { $unwind: '$items' },
      { 
        $group: { 
          _id: '$items.product', 
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        } 
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$_id',
          name: '$product.name',
          sales: '$totalSold',
          revenue: '$totalRevenue',
          image: '$product.images.0.url'
        }
      }
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(10);

    const categoryPerformance = await Product.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'items.product',
          as: 'orders'
        }
      },
      { $unwind: { path: '$orders', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$orders.items', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          totalSales: { $sum: '$orders.items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$orders.items.price', '$orders.items.quantity'] } }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    await AdminLog.create({
      adminId: req.user.id,
      action: 'VIEW_ANALYTICS',
      description: 'Viewed admin dashboard analytics',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          todayOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          todayRevenue: todayRevenue[0]?.total || 0
        },
        topSellingProducts,
        recentOrders,
        categoryPerformance,
        analytics: {
          today: todayAnalytics,
          recent: recentAnalytics
        }
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
});

router.get('/products', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const totalProducts = await Product.countDocuments(query);

    const categories = await Product.distinct('category');

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalProducts / limit),
          totalProducts,
          hasNext: page < Math.ceil(totalProducts / limit),
          hasPrev: page > 1
        },
        categories
      }
    });
  } catch (error) {
    console.error('Admin products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

router.post('/products', [
  adminAuth,
  upload.array('images', 5), // Allow up to 5 images
  body('name').trim().isLength({ min: 3, max: 200 }).withMessage('Name must be between 3 and 200 characters'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').trim().isLength({ min: 2, max: 50 }).withMessage('Category must be between 2 and 50 characters'),
  body('subcategory').trim().isLength({ min: 2, max: 50 }).withMessage('Subcategory must be between 2 and 50 characters'),
  body('brand').trim().isLength({ min: 2, max: 50 }).withMessage('Brand must be between 2 and 50 characters'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('gender').isIn(['Men', 'Women', 'Unisex', 'Kids']).withMessage('Gender must be Men, Women, Unisex, or Kids'),
  body('sizes').custom((value) => {
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) {
        throw new Error('Sizes must be an array');
      }
      return true;
    } catch (error) {
      throw new Error('Sizes must be a valid JSON array');
    }
  }),
  body('colors').custom((value) => {
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) {
        throw new Error('Colors must be an array');
      }
      return true;
    } catch (error) {
      throw new Error('Colors must be a valid JSON array');
    }
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    console.log('Received form data:', req.body);
    console.log('Received files:', req.files);
    
    const {
      name,
      description,
      price,
      category,
      subcategory,
      brand,
      stock,
      gender,
      sizes,
      colors,
      features = [],
      specifications = {},
      tags = []
    } = req.body;

    const images = req.files ? req.files.map(file => ({
      url: `http://localhost:5000/uploads/${file.filename}`,
      alt: file.originalname
    })) : [];

    const product = new Product({
      name,
      description,
      price,
      category,
      subcategory,
      brand,
      stockQuantity: stock,
      gender,
      sizes: JSON.parse(sizes),
      colors: JSON.parse(colors),
      images,
      features: JSON.parse(features || '[]'),
      specifications: JSON.parse(specifications || '{}'),
      tags: JSON.parse(tags || '[]'),
      isActive: true
    });

    await product.save();

    await AdminLog.create({
      adminId: req.user.id,
      action: 'CREATE_PRODUCT',
      description: `Created product: ${name}`,
      targetId: product._id,
      targetType: 'Product',
      changes: { name, price, category, brand },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
});

router.put('/products/:id', [
  adminAuth,
  upload.array('images', 5), // Allow up to 5 images
], async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const oldData = {
      name: product.name,
      price: product.price,
      stock: product.stock,
      isActive: product.isActive
    };

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `http://localhost:5000/uploads/${file.filename}`,
        alt: file.originalname
      }));
      
      updates.images = [...product.images, ...newImages];
    }

    if (updates.imagesToRemove) {
      const imagesToRemove = JSON.parse(updates.imagesToRemove);
      updates.images = product.images.filter((image, index) => !imagesToRemove.includes(index));
      delete updates.imagesToRemove; // Remove from updates object
    }

    if (updates.sizes) {
      updates.sizes = JSON.parse(updates.sizes);
    }
    if (updates.colors) {
      updates.colors = JSON.parse(updates.colors);
    }
    if (updates.features) {
      updates.features = JSON.parse(updates.features);
    }
    if (updates.specifications) {
      updates.specifications = JSON.parse(updates.specifications);
    }
    if (updates.tags) {
      updates.tags = JSON.parse(updates.tags);
    }

    if (updates.stock !== undefined) {
      updates.stockQuantity = updates.stock;
      delete updates.stock;
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        product[key] = updates[key];
      }
    });

    await product.save();

    await AdminLog.create({
      adminId: req.user.id,
      action: 'UPDATE_PRODUCT',
      description: `Updated product: ${product.name}`,
      targetId: product._id,
      targetType: 'Product',
      changes: { old: oldData, new: updates },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
});

router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(productId);

    await AdminLog.create({
      adminId: req.user.id,
      action: 'DELETE_PRODUCT',
      description: `Deleted product: ${product.name}`,
      targetId: product._id,
      targetType: 'Product',
      changes: { deletedProduct: product.name },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

router.get('/orders', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'user.firstName': { $regex: search, $options: 'i' } },
        { 'user.lastName': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name images brand')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const totalOrders = await Order.countDocuments(query);

    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalOrders / limit),
          totalOrders,
          hasNext: page < Math.ceil(totalOrders / limit),
          hasPrev: page > 1
        },
        statusCounts
      }
    });
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

router.put('/orders/:id/status', [
  adminAuth,
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const orderId = req.params.id;
    const { status, trackingNumber, notes } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const oldStatus = order.status;
    order.status = status;
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    if (notes) {
      order.adminNotes = notes;
    }

    await order.save();

    await AdminLog.create({
      adminId: req.user.id,
      action: 'UPDATE_ORDER_STATUS',
      description: `Updated order ${order.orderNumber} status from ${oldStatus} to ${status}`,
      targetId: order._id,
      targetType: 'Order',
      changes: { oldStatus, newStatus: status, trackingNumber, notes },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .select('-password')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const totalUsers = await User.countDocuments(query);

    const roleCounts = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page < Math.ceil(totalUsers / limit),
          hasPrev: page > 1
        },
        roleCounts
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const { range = '7d' } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch (range) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const revenueData = await Order.aggregate([
      {
        $match: {
          status: { $in: ['delivered', 'shipped'] },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          average: { $avg: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const orderData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          average: { $avg: '$totalAmount' }
        }
      }
    ]);

    const userData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          new: { $sum: 1 }
        }
      }
    ]);

    const totalUsers = await User.countDocuments();

    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { 
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      { 
        $group: { 
          _id: '$items.product', 
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        } 
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$_id',
          name: '$product.name',
          sales: '$totalSold',
          revenue: '$totalRevenue',
          image: '$product.images.0.url'
        }
      }
    ]);

    const conversionRate = Math.random() * 10 + 5; // 5-15%
    const visitors = Math.floor(Math.random() * 10000) + 5000; // 5000-15000

    const recentActivity = [
      {
        description: 'New order #ORD001 placed',
        time: '2 minutes ago'
      },
      {
        description: 'Product "Blue Kurta" updated',
        time: '15 minutes ago'
      },
      {
        description: 'User registration completed',
        time: '1 hour ago'
      },
      {
        description: 'Order #ORD002 shipped',
        time: '2 hours ago'
      },
      {
        description: 'New product added to catalog',
        time: '3 hours ago'
      }
    ];

    res.json({
      success: true,
      data: {
        revenue: {
          total: revenueData[0]?.total || 0,
          average: revenueData[0]?.average || 0
        },
        orders: {
          total: orderData[0]?.total || 0,
          average: orderData[0]?.average || 0
        },
        users: {
          new: userData[0]?.new || 0,
          total: totalUsers
        },
        conversion: {
          rate: conversionRate,
          visitors: visitors
        },
        topProducts,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics data' });
  }
});

router.get('/logs', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50, action, adminId, sortBy = 'timestamp', sortOrder = 'desc' } = req.query;
    
    let query = {};
    
    if (action) {
      query.action = action;
    }
    
    if (adminId) {
      query.adminId = adminId;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const logs = await AdminLog.find(query)
      .populate('adminId', 'firstName lastName email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const totalLogs = await AdminLog.countDocuments(query);

    const actionCounts = await AdminLog.aggregate([
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalLogs / limit),
          totalLogs,
          hasNext: page < Math.ceil(totalLogs / limit),
          hasPrev: page > 1
        },
        actionCounts
      }
    });
  } catch (error) {
    console.error('Admin logs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch logs' });
  }
});

module.exports = router;