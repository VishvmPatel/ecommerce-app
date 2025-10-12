const express = require('express');
const { body, validationResult } = require('express-validator');
const Address = require('../models/Address');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/addresses
// @desc    Get all addresses for authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const addresses = await Address.find({ 
      user: req.user._id, 
      isActive: true 
    }).sort({ isDefault: -1, createdAt: -1 });

    res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching addresses'
    });
  }
});

// @route   POST /api/addresses
// @desc    Create a new address
// @access  Private
router.post('/', auth, [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be less than 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be less than 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian mobile number'),
  body('address')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Address is required and must be less than 200 characters'),
  body('city')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('City is required and must be less than 50 characters'),
  body('state')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('State is required and must be less than 50 characters'),
  body('zipCode')
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('ZIP code is required and must be less than 10 characters'),
  body('country')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Country must be less than 50 characters'),
  body('type')
    .optional()
    .isIn(['shipping', 'billing', 'both'])
    .withMessage('Type must be shipping, billing, or both'),
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean value')
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

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country = 'India',
      type = 'both',
      isDefault = false
    } = req.body;

    // If setting as default, remove default from other addresses
    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id },
        { isDefault: false }
      );
    }

    const newAddress = new Address({
      user: req.user._id,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      type,
      isDefault
    });

    await newAddress.save();

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: newAddress
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating address'
    });
  }
});

// @route   PUT /api/addresses/:id
// @desc    Update an address
// @access  Private
router.put('/:id', auth, [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be less than 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be less than 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian mobile number'),
  body('address')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Address must be less than 200 characters'),
  body('city')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('City must be less than 50 characters'),
  body('state')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('State must be less than 50 characters'),
  body('zipCode')
    .optional()
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('ZIP code must be less than 10 characters'),
  body('country')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Country must be less than 50 characters'),
  body('type')
    .optional()
    .isIn(['shipping', 'billing', 'both'])
    .withMessage('Type must be shipping, billing, or both'),
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean value')
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

    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const updateData = { ...req.body };

    // If setting as default, remove default from other addresses
    if (updateData.isDefault) {
      await Address.updateMany(
        { user: req.user._id, _id: { $ne: req.params.id } },
        { isDefault: false }
      );
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: updatedAddress
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating address'
    });
  }
});

// @route   DELETE /api/addresses/:id
// @desc    Delete an address (soft delete)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Soft delete by setting isActive to false
    await Address.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting address'
    });
  }
});

// @route   PUT /api/addresses/:id/default
// @desc    Set an address as default
// @access  Private
router.put('/:id/default', auth, async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Remove default from all addresses
    await Address.updateMany(
      { user: req.user._id },
      { isDefault: false }
    );

    // Set the specified address as default
    await Address.findByIdAndUpdate(req.params.id, { isDefault: true });

    res.json({
      success: true,
      message: 'Default address updated successfully'
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while setting default address'
    });
  }
});

// @route   GET /api/addresses/default
// @desc    Get default address for authenticated user
// @access  Private
router.get('/default', auth, async (req, res) => {
  try {
    const defaultAddress = await Address.findOne({
      user: req.user._id,
      isDefault: true,
      isActive: true
    });

    res.json({
      success: true,
      data: defaultAddress
    });
  } catch (error) {
    console.error('Error fetching default address:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching default address'
    });
  }
});

module.exports = router;