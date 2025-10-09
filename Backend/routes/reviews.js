const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sortBy = 'newest', rating } = req.query;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let query = { product: productId, status: 'approved' };
    if (rating) {
      query.rating = parseInt(rating);
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      case 'oldest':
        sortOptions.createdAt = 1;
        break;
      case 'highest':
        sortOptions.rating = -1;
        break;
      case 'lowest':
        sortOptions.rating = 1;
        break;
      case 'mostHelpful':
        sortOptions.helpful = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    const reviews = await Review.find(query)
      .populate('user', 'firstName lastName profilePicture')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const totalReviews = await Review.countDocuments(query);

    const ratingStats = await Review.getAverageRating(productId);
    const ratingDistribution = await Review.getRatingDistribution(productId);

    const ratingDistributionObj = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistribution.forEach(item => {
      ratingDistributionObj[item._id] = item.count;
    });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          hasNext: page < Math.ceil(totalReviews / limit),
          hasPrev: page > 1
        },
        statistics: {
          averageRating: ratingStats[0]?.averageRating || 0,
          totalReviews: ratingStats[0]?.totalReviews || 0,
          ratingDistribution: ratingDistributionObj
        }
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

router.post('/', [
  auth,
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters')
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

    const { productId, rating, title, comment, images = [] } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const existingReview = await Review.findOne({ product: productId, user: userId });
    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this product' 
      });
    }

    const verifiedPurchase = false; // TODO: Implement order checking

    const review = new Review({
      product: productId,
      user: userId,
      rating,
      title,
      comment,
      images,
      verifiedPurchase
    });

    await review.save();

    await review.populate('user', 'firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ success: false, message: 'Failed to create review' });
  }
});

router.put('/:reviewId', [
  auth,
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('comment').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters')
], async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found or you are not authorized to edit it' });
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        review[key] = updates[key];
      }
    });

    await review.save();
    await review.populate('user', 'firstName lastName profilePicture');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ success: false, message: 'Failed to update review' });
  }
});

router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found or you are not authorized to delete it' });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

router.post('/:reviewId/helpful', [
  auth,
  body('helpful').isBoolean().withMessage('Helpful must be a boolean value')
], async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { helpful } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }


    if (helpful) {
      review.helpful += 1;
    } else {
      review.notHelpful += 1;
    }

    await review.save();

    res.json({
      success: true,
      message: helpful ? 'Marked as helpful' : 'Marked as not helpful',
      data: {
        helpful: review.helpful,
        notHelpful: review.notHelpful
      }
    });
  } catch (error) {
    console.error('Helpful vote error:', error);
    res.status(500).json({ success: false, message: 'Failed to vote on review' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ user: userId, status: 'approved' })
      .populate('product', 'name price images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalReviews = await Review.countDocuments({ user: userId, status: 'approved' });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          hasNext: page < Math.ceil(totalReviews / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user reviews' });
  }
});

module.exports = router;
