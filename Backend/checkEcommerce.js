const mongoose = require('mongoose');
require('dotenv').config();

const checkEcommerceDatabase = async () => {
  try {
    // Connect to the ecommerce database specifically
    const ecommerceURI = process.env.MONGODB_URI.replace('/test', '/ecommerce');
    console.log('Connecting to ecommerce database...');
    
    await mongoose.connect(ecommerceURI);
    console.log('✅ Connected to ecommerce database');

    const db = mongoose.connection.db;
    console.log('Current database:', db.databaseName);
    
    const collections = await db.listCollections().toArray();
    console.log(`\n📚 Collections in ${db.databaseName}:`);
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`📁 ${collection.name}: ${count} documents`);
      
      // If it's a products collection, show some sample data
      if (collection.name.toLowerCase().includes('product')) {
        const sample = await db.collection(collection.name).findOne();
        if (sample) {
          console.log(`   Sample: ${sample.name || sample.title || 'Unknown'}`);
        }
        
        // Show first 10 products
        const products = await db.collection(collection.name).find({}).limit(10).toArray();
        console.log(`   First 10 products:`);
        products.forEach((product, index) => {
          console.log(`     ${index + 1}. ${product.name || product.title || 'Unknown'}`);
        });
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking ecommerce database:', error);
    process.exit(1);
  }
};

checkEcommerceDatabase();
