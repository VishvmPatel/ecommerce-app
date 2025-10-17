const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const checkAllProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const totalProducts = await Product.countDocuments();
    console.log(`\n📦 Total products in database: ${totalProducts}\n`);
    
    if (totalProducts === 0) {
      console.log('❌ No products found in database!');
    } else {
      console.log('📋 Product List:');
      const products = await Product.find({}).sort({ createdAt: -1 });
      
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Price: $${product.price}`);
        console.log(`   Category: ${product.category}`);
        console.log(`   Featured: ${product.isFeatured}`);
        console.log(`   New Product: ${product.isNewProduct}`);
        console.log(`   In Stock: ${product.inStock}`);
        console.log(`   Stock Quantity: ${product.stockQuantity}`);
        console.log(`   Created: ${product.createdAt}`);
        console.log('');
      });

      // Summary statistics
      const featuredCount = await Product.countDocuments({ isFeatured: true });
      const newCount = await Product.countDocuments({ isNewProduct: true });
      const inStockCount = await Product.countDocuments({ inStock: true });
      
      console.log('📊 Summary Statistics:');
      console.log(`   Total Products: ${totalProducts}`);
      console.log(`   Featured Products: ${featuredCount}`);
      console.log(`   New Products: ${newCount}`);
      console.log(`   In Stock: ${inStockCount}`);
      console.log(`   Out of Stock: ${totalProducts - inStockCount}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking products:', error);
    process.exit(1);
  }
};

checkAllProducts();
