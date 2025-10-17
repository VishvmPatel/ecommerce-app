const mongoose = require('mongoose');
require('dotenv').config();

const checkEcommerceWithCorrectURI = async () => {
  try {
    // The URI doesn't have a database name, so we need to add it
    const baseURI = 'mongodb+srv://vishusp77_db_user:ecommerce1234@cluster0.8uh7gdh.mongodb.net';
    const ecommerceURI = `${baseURI}/ecommerce?retryWrites=true&w=majority&appName=Cluster0`;
    
    console.log('Connecting to ecommerce database with proper URI...');
    console.log('URI:', ecommerceURI);
    
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

checkEcommerceWithCorrectURI();
