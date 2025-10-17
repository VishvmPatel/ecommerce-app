const mongoose = require('mongoose');
require('dotenv').config();

const checkAllDatabases = async () => {
  try {
    // Get the base MongoDB URI without database name
    const baseURI = process.env.MONGODB_URI.split('/').slice(0, -1).join('/');
    console.log('Base URI:', baseURI);
    
    await mongoose.connect(baseURI);
    console.log('✅ Connected to MongoDB');

    const admin = mongoose.connection.db.admin();
    const databases = await admin.listDatabases();
    
    console.log(`\n🗄️ Checking all databases for products:\n`);
    
    for (const dbInfo of databases.databases) {
      if (dbInfo.name === 'local' || dbInfo.name === 'admin') continue;
      
      console.log(`📊 Database: ${dbInfo.name} (${(dbInfo.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
      
      try {
        const db = mongoose.connection.useDb(dbInfo.name);
        const collections = await db.listCollections().toArray();
        
        for (const collection of collections) {
          if (collection.name.toLowerCase().includes('product')) {
            const count = await db.collection(collection.name).countDocuments();
            console.log(`   📁 ${collection.name}: ${count} documents`);
            
            if (count > 0) {
              const sample = await db.collection(collection.name).findOne();
              if (sample) {
                console.log(`      Sample: ${sample.name || sample.title || 'Unknown'}`);
              }
            }
          }
        }
      } catch (error) {
        console.log(`   ❌ Error accessing ${dbInfo.name}: ${error.message}`);
      }
      console.log('');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking databases:', error);
    process.exit(1);
  }
};

checkAllDatabases();
