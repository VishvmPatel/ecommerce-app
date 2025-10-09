const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@fashionforward.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('📧 Email: admin@fashionforward.com');
      console.log('🔑 Password: admin123');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@fashionforward.com',
      password: hashedPassword,
      phone: '9876543210',
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@fashionforward.com');
    console.log('🔑 Password: admin123');
    console.log('🔐 Role: admin');
    console.log('');
    console.log('🌐 You can now access the admin panel at: http://localhost:5173/admin');
    console.log('📝 Please change the password after first login for security.');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

createAdminUser();
