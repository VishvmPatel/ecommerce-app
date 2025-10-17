const mongoose = require('mongoose');
require('dotenv').config();

const checkFashionStoreDatabase = async () => {
  try {
    // Connect to the fashionstore database instead of ecommerce
    const fashionStoreURI = process.env.MONGODB_URI.replace('/ecommerce', '/fashionstore');
    await mongoose.connect(fashionStoreURI);
    console.log('✅ Connected to FashionStore database');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(`\n📚 Collections in FashionStore database: ${collections.length}\n`);
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`📁 ${collection.name}: ${count} documents`);
      
      // If it's a products collection, show some sample data
      if (collection.name.toLowerCase().includes('product')) {
        const sample = await db.collection(collection.name).findOne();
        if (sample) {
          console.log(`   Sample: ${sample.name || sample.title || 'Unknown'}`);
        }
        
        // Show first 5 products
        const products = await db.collection(collection.name).find({}).limit(5).toArray();
        console.log(`   First 5 products:`);
        products.forEach((product, index) => {
          console.log(`     ${index + 1}. ${product.name || product.title || 'Unknown'}`);
        });
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking FashionStore database:', error);
    process.exit(1);
  }
};

checkFashionStoreDatabase();
