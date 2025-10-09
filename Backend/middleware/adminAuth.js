const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const userId = decoded.user?.id || decoded.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Token is not valid' });
    }
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Token is not valid' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
    }

    req.user = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

module.exports = adminAuth;
