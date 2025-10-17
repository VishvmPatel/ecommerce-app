const mongoose = require('mongoose');
require('dotenv').config();

const checkDatabaseCollections = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(`\n📚 Collections in database: ${collections.length}\n`);
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`📁 ${collection.name}: ${count} documents`);
      
      // If it's a products collection, show some sample data
      if (collection.name.toLowerCase().includes('product')) {
        const sample = await db.collection(collection.name).findOne();
        if (sample) {
          console.log(`   Sample: ${sample.name || sample.title || 'Unknown'}`);
        }
      }
    }

    // Check if there are any other databases
    const admin = db.admin();
    const databases = await admin.listDatabases();
    
    console.log(`\n🗄️ Available databases: ${databases.databases.length}\n`);
    databases.databases.forEach(db => {
      console.log(`📊 ${db.name}: ${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
};

checkDatabaseCollections();
