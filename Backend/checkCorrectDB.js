const mongoose = require('mongoose');
require('dotenv').config();

const checkCorrectDatabase = async () => {
  try {
    console.log('🔍 Checking MongoDB URI format...');
    console.log('Full URI:', process.env.MONGODB_URI);
    
    // Parse the URI to understand its structure
    const uriParts = process.env.MONGODB_URI.split('/');
    console.log('URI parts:', uriParts);
    
    // Try to connect to ecommerce database by modifying the URI
    let ecommerceURI;
    if (process.env.MONGODB_URI.includes('/test')) {
      ecommerceURI = process.env.MONGODB_URI.replace('/test', '/ecommerce');
    } else if (process.env.MONGODB_URI.endsWith('@cluster0.8uh7gdh.mongodb.net')) {
      ecommerceURI = process.env.MONGODB_URI + '/ecommerce';
    } else {
      ecommerceURI = process.env.MONGODB_URI;
    }
    
    console.log('Modified URI for ecommerce:', ecommerceURI);
    
    await mongoose.connect(ecommerceURI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    console.log('Current database:', db.databaseName);
    
    // Check products count
    const productCount = await db.collection('products').countDocuments();
    console.log(`📦 Products in ${db.databaseName}: ${productCount}`);
    
    if (productCount > 0) {
      const products = await db.collection('products').find({}).limit(5).toArray();
      console.log('First 5 products:');
      products.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name || product.title || 'Unknown'}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkCorrectDatabase();
