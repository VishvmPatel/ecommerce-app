const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@fashionforward.com' });
    
    if (existingAdmin) {
      console.log('👑 Admin user already exists');
      
      // Update existing admin email if it's the old one
      if (existingAdmin.email === 'admin@fashionstore.com') {
        existingAdmin.email = 'admin@fashionforward.com';
        await existingAdmin.save();
        console.log('✅ Updated admin email to admin@fashionforward.com');
      }
    } else {
      // Create new admin user
      const adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@fashionforward.com',
        password: 'Admin123!',
        phone: '9999999999',
        role: 'admin',
        isEmailVerified: true,
        isActive: true
      });

      await adminUser.save();
      console.log('✅ Created admin user with email: admin@fashionforward.com');
    }

    console.log('🎉 Admin seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
