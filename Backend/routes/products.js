const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      subcategory,
      brand,
      gender,
      minPrice,
      maxPrice,
      size,
      color,
      sortBy = 'newest',
      search,
      isNew,
      isFeatured,
      inStock
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (brand) filter.brand = brand;
    if (gender) filter.gender = gender;
    if (isNew !== undefined) filter.isNew = isNew === 'true';
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    if (inStock !== undefined) filter.inStock = inStock === 'true';

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Size filter
    if (size) {
      filter.sizes = { $in: [size] };
    }

    // Color filter
    if (color) {
      filter.colors = { $in: [color] };
    }

    // Search filter
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'price-low-high':
        sort = { price: 1 };
        break;
      case 'price-high-low':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      case 'newest':
      default:
        sort = { createdAt: -1 };
        break;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('reviews.user', 'firstName lastName');

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProducts: total,
          hasNext: skip + products.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'firstName lastName');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 8 } = req.query;

    const products = await Product.find({ category })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
});

// @route   GET /api/products/search/:query
// @desc    Search products
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 12 } = req.query;

    // Use regex search for more precise matching
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { subcategory: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
});

// @route   GET /api/products/sale/items
// @desc    Get products on sale
// @access  Public
router.get('/sale/items', async (req, res) => {
  try {
    const { limit = 12 } = req.query;

    const products = await Product.find({
      originalPrice: { $exists: true, $gt: 0 },
      $expr: { $gt: ['$originalPrice', '$price'] }
    })
      .sort({ discount: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching sale products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sale products',
      error: error.message
    });
  }
});

// @route   GET /api/products/featured/items
// @desc    Get featured products
// @access  Public
router.get('/featured/items', async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
});

// @route   GET /api/products/new/items
// @desc    Get new products
// @access  Public
router.get('/new/items', async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({ isNew: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching new products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching new products',
      error: error.message
    });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Add review to product
// @access  Private (requires authentication)
router.post('/:id/reviews', [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { rating, comment } = req.body;
    const productId = req.params.id;

    // In a real app, you'd get user ID from JWT token
    const userId = req.user?.id || 'guest';

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Add review
    product.reviews.push({
      user: userId,
      rating,
      comment
    });

    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      data: product
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
});

// @route   GET /api/products/filters/options
// @desc    Get filter options (categories, brands, etc.)
// @access  Public
router.get('/filters/options', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const subcategories = await Product.distinct('subcategory');
    const brands = await Product.distinct('brand');
    const genders = await Product.distinct('gender');
    const sizes = await Product.distinct('sizes');
    const colors = await Product.distinct('colors');

    // Get price range
    const priceStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        categories,
        subcategories,
        brands,
        genders,
        sizes: sizes.filter(size => size), // Remove null/empty values
        colors: colors.filter(color => color), // Remove null/empty values
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 0 }
      }
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
});

module.exports = router;