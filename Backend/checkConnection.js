const mongoose = require('mongoose');
require('dotenv').config();

const checkConnectionDetails = async () => {
  try {
    console.log('🔍 Environment Variables Check:');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
    
    if (process.env.MONGODB_URI) {
      console.log('Connection string preview:', process.env.MONGODB_URI.substring(0, 50) + '...');
      
      // Extract database name from URI
      const dbName = process.env.MONGODB_URI.split('/').pop().split('?')[0];
      console.log('Database name:', dbName);
      
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB');
      
      const db = mongoose.connection.db;
      console.log('Current database:', db.databaseName);
      
      const collections = await db.listCollections().toArray();
      console.log(`\n📚 Collections in ${db.databaseName}:`);
      
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`📁 ${collection.name}: ${count} documents`);
      }
      
      // Check if there are other databases
      const admin = db.admin();
      const databases = await admin.listDatabases();
      
      console.log(`\n🗄️ All databases in cluster:`);
      databases.databases.forEach(db => {
        console.log(`📊 ${db.name}: ${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB`);
      });
      
    } else {
      console.log('❌ MONGODB_URI not found in environment variables');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkConnectionDetails();
