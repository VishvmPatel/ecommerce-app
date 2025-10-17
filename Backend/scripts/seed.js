const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

const products = [
  {
    name: "Trendy Crop Top & High-Waist Jeans Set",
    description: "A stylish combination of a trendy crop top and high-waist jeans perfect for casual outings. Made from premium cotton blend for comfort and style.",
    price: 1899,
    originalPrice: 2499,
    images: [
      { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", alt: "Trendy Crop Top & High-Waist Jeans Set" }
    ],
    category: "Casual Wear",
    subcategory: "Tops & Tees",
    brand: "Urban Chic",
    gender: "Women",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Pink", "Blue"],
    rating: 4.6,
    reviewCount: 234,
    inStock: true,
    stockQuantity: 50,
    isNewProduct: true,
    isFeatured: true,
    tags: ["casual", "trendy", "comfortable"],
    specifications: {
      "Material": "Cotton Blend",
      "Care Instructions": "Machine wash cold",
      "Fit": "Regular Fit"
    },
    careInstructions: "Machine wash in cold water. Do not bleach. Tumble dry low. Iron on low heat."
  },
  {
    name: "Elegant Silk Saree with Designer Blouse",
    description: "A beautiful silk saree with intricate designs and a matching designer blouse. Perfect for special occasions and festivals.",
    price: 4599,
    originalPrice: 5999,
    images: [
      { url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", alt: "Elegant Silk Saree with Designer Blouse" }
    ],
    category: "Ethnic Wear",
    subcategory: "Sarees",
    brand: "Silk Elegance",
    gender: "Women",
    sizes: ["Free Size"],
    colors: ["Red", "Gold", "Purple", "Green"],
    rating: 4.8,
    reviewCount: 189,
    inStock: true,
    stockQuantity: 25,
    isNewProduct: true,
    isFeatured: true,
    tags: ["ethnic", "silk", "festive", "elegant"],
    specifications: {
      "Material": "Pure Silk",
      "Care Instructions": "Dry clean only",
      "Length": "5.5 meters"
    },
    careInstructions: "Dry clean only. Store in a cool, dry place. Use padded hangers."
  },
  {
    name: "Chic Midi Dress for Evening",
    description: "A sophisticated midi dress perfect for evening events and formal occasions. Features elegant design and premium fabric.",
    price: 3299,
    originalPrice: 4299,
    images: [
      { url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", alt: "Chic Midi Dress for Evening" }
    ],
    category: "Formal Wear",
    subcategory: "Dresses",
    brand: "Evening Glam",
    gender: "Women",
    sizes: ["S", "M", "L"],
    colors: ["Black", "Navy", "Red"],
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    stockQuantity: 30,
    isNewProduct: true,
    isFeatured: false,
    tags: ["formal", "evening", "elegant", "sophisticated"],
    specifications: {
      "Material": "Polyester Blend",
      "Care Instructions": "Dry clean recommended",
      "Length": "Midi"
    },
    careInstructions: "Dry clean recommended. Hand wash in cold water if needed."
  },

  {
    name: "Premium Cotton Kurta",
    description: "A comfortable and stylish cotton kurta perfect for traditional occasions. Features intricate embroidery and premium cotton fabric.",
    price: 1899,
    originalPrice: 2499,
    images: [
      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", alt: "Premium Cotton Kurta" }
    ],
    category: "Ethnic Wear",
    subcategory: "Kurtas",
    brand: "Heritage Wear",
    gender: "Men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Cream", "Light Blue", "Beige"],
    rating: 4.8,
    reviewCount: 95,
    inStock: true,
    stockQuantity: 40,
    isNewProduct: true,
    isFeatured: true,
    tags: ["ethnic", "cotton", "traditional", "comfortable"],
    specifications: {
      "Material": "100% Cotton",
      "Care Instructions": "Machine wash cold",
      "Fit": "Regular Fit"
    },
    careInstructions: "Machine wash in cold water. Do not bleach. Air dry."
  },
  {
    name: "Classic Denim Jacket",
    description: "A timeless denim jacket that never goes out of style. Perfect for layering and adding a casual touch to any outfit.",
    price: 1899,
    originalPrice: 2499,
    images: [
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", alt: "Classic Denim Jacket" }
    ],
    category: "Casual Wear",
    subcategory: "Outerwear",
    brand: "Denim Co.",
    gender: "Men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black", "Light Blue"],
    rating: 4.3,
    reviewCount: 98,
    inStock: true,
    stockQuantity: 35,
    isNewProduct: false,
    isFeatured: false,
    tags: ["denim", "casual", "jacket", "timeless"],
    specifications: {
      "Material": "100% Cotton Denim",
      "Care Instructions": "Machine wash cold",
      "Fit": "Regular Fit"
    },
    careInstructions: "Machine wash in cold water. Turn inside out. Air dry."
  },

  {
    name: "Cute Kids T-Shirt Set",
    description: "Comfortable and colorful t-shirt set for kids. Made from soft cotton fabric that's gentle on children's skin.",
    price: 599,
    originalPrice: 899,
    images: [
      { url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", alt: "Cute Kids T-Shirt Set" }
    ],
    category: "Kids Wear",
    subcategory: "Tops",
    brand: "Little Stars",
    gender: "Kids",
    sizes: ["2Y", "3Y", "4Y", "5Y", "6Y"],
    colors: ["Blue", "Pink", "Yellow", "Green"],
    rating: 4.5,
    reviewCount: 145,
    inStock: true,
    stockQuantity: 60,
    isNewProduct: true,
    isFeatured: true,
    tags: ["kids", "comfortable", "colorful", "soft"],
    specifications: {
      "Material": "100% Cotton",
      "Care Instructions": "Machine wash cold",
      "Age Range": "2-6 years"
    },
    careInstructions: "Machine wash in cold water. Use mild detergent. Air dry."
  },

  {
    name: "Designer Sunglasses - Aviator Style",
    description: "Stylish aviator-style sunglasses with UV protection. Perfect for sunny days and outdoor activities.",
    price: 1299,
    originalPrice: 1899,
    images: [
      { url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", alt: "Designer Sunglasses - Aviator Style" }
    ],
    category: "Eyewear",
    subcategory: "Sunglasses",
    brand: "SunStyle",
    gender: "Unisex",
    colors: ["Black", "Brown", "Gold", "Silver"],
    rating: 4.6,
    reviewCount: 234,
    inStock: true,
    stockQuantity: 45,
    isNewProduct: true,
    isFeatured: true,
    tags: ["sunglasses", "aviator", "UV protection", "stylish"],
    specifications: {
      "UV Protection": "100% UV400",
      "Frame Material": "Metal",
      "Lens Material": "Polycarbonate"
    },
    careInstructions: "Clean with lens cleaning solution. Store in protective case."
  },
  {
    name: "Trendy Baseball Cap",
    description: "A trendy baseball cap perfect for casual wear and outdoor activities. Features adjustable strap for perfect fit.",
    price: 899,
    originalPrice: 1299,
    images: [
      { url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", alt: "Trendy Baseball Cap" }
    ],
    category: "Headwear",
    subcategory: "Caps",
    brand: "CapCo",
    gender: "Unisex",
    colors: ["Black", "White", "Navy", "Red"],
    rating: 4.4,
    reviewCount: 189,
    inStock: true,
    stockQuantity: 55,
    isNewProduct: true,
    isFeatured: false,
    tags: ["cap", "baseball", "casual", "adjustable"],
    specifications: {
      "Material": "Cotton Blend",
      "Adjustable": "Yes",
      "Style": "Baseball Cap"
    },
    careInstructions: "Hand wash in cold water. Air dry. Do not machine wash."
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Insert products
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    // Create admin user if it doesn't exist
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

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();