const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// Additional products to add (without clearing existing ones)
const additionalProducts = [
  {
    name: "Elegant Evening Gown",
    description: "A stunning evening gown perfect for special occasions. Features elegant design and premium fabric.",
    price: 4599,
    originalPrice: 5999,
    images: [
      { url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", alt: "Elegant Evening Gown" }
    ],
    category: "Formal Wear",
    subcategory: "Dresses",
    brand: "Evening Glam",
    gender: "Women",
    sizes: ["S", "M", "L"],
    colors: ["Black", "Navy", "Red"],
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    stockQuantity: 30,
    isNewProduct: true,
    isFeatured: true,
    tags: ["formal", "evening", "elegant", "sophisticated"],
    specifications: {
      "Material": "Polyester Blend",
      "Care Instructions": "Dry clean recommended",
      "Length": "Floor Length"
    },
    careInstructions: "Dry clean recommended. Hand wash in cold water if needed."
  },
  {
    name: "Casual T-Shirt",
    description: "Comfortable cotton t-shirt perfect for everyday wear. Soft and breathable fabric.",
    price: 899,
    originalPrice: 1299,
    images: [
      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", alt: "Casual T-Shirt" }
    ],
    category: "Casual Wear",
    subcategory: "Tops & Tees",
    brand: "Comfort Wear",
    gender: "Men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Blue", "Gray"],
    rating: 4.3,
    reviewCount: 89,
    inStock: true,
    stockQuantity: 75,
    isNewProduct: false,
    isFeatured: false,
    tags: ["casual", "comfortable", "cotton", "everyday"],
    specifications: {
      "Material": "100% Cotton",
      "Care Instructions": "Machine wash cold",
      "Fit": "Regular Fit"
    },
    careInstructions: "Machine wash in cold water. Do not bleach. Tumble dry low."
  },
  {
    name: "Designer Handbag",
    description: "Stylish designer handbag perfect for any occasion. Features premium leather and elegant design.",
    price: 3299,
    originalPrice: 4299,
    images: [
      { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", alt: "Designer Handbag" }
    ],
    category: "Bags",
    subcategory: "Handbags",
    brand: "Luxury Bags",
    gender: "Women",
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Tan"],
    rating: 4.7,
    reviewCount: 203,
    inStock: true,
    stockQuantity: 25,
    isNewProduct: true,
    isFeatured: true,
    tags: ["handbag", "designer", "leather", "luxury"],
    specifications: {
      "Material": "Genuine Leather",
      "Care Instructions": "Clean with leather conditioner",
      "Dimensions": "12x8x6 inches"
    },
    careInstructions: "Clean with leather conditioner. Store in dust bag when not in use."
  }
];

const addProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existingCount = await Product.countDocuments();
    console.log(`📊 Existing products: ${existingCount}`);

    const insertedProducts = await Product.insertMany(additionalProducts);
    console.log(`✅ Added ${insertedProducts.length} new products`);

    const newCount = await Product.countDocuments();
    console.log(`📊 Total products now: ${newCount}`);

    console.log('🎉 Products added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  }
};

addProducts();
