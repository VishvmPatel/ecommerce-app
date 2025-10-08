const products = [
  // Women's Products
  {
    _id: "women_1",
    name: "Trendy Crop Top & High-Waist Jeans Set",
    category: "Casual Wear",
    subcategory: "Tops & Tees",
    brand: "Urban Chic",
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    rating: 4.6,
    reviews: 234,
    inStock: true,
    isNew: true,
    isTrending: true,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=left"
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Pink', 'Blue'],
    material: 'Cotton Blend',
    occasion: 'Casual',
    gender: 'women',
    keywords: ['casual', 'crop top', 'jeans', 'trendy', 'women'],
    description: "A trendy crop top and high-waist jeans set perfect for casual outings. Made from comfortable cotton blend fabric with a modern fit.",
    features: ["Cotton Blend Fabric", "Modern Fit", "Comfortable", "Machine Washable"],
    specifications: {
      "Fabric": "Cotton Blend",
      "Care Instructions": "Machine Washable",
      "Fit": "Regular Fit",
      "Occasion": "Casual"
    },
    shipping: {
      "Standard Delivery": "3-5 business days",
      "Express Delivery": "1-2 business days",
      "Free Shipping": "On orders above ₹2000"
    },
    dateAdded: '2024-01-15'
  },
  {
    _id: "women_2",
    name: "Elegant Silk Saree with Designer Blouse",
    category: "Ethnic Wear",
    subcategory: "Sarees",
    brand: "Silk Elegance",
    price: 4599,
    originalPrice: 5999,
    discount: 23,
    rating: 4.8,
    reviews: 189,
    inStock: true,
    isNew: true,
    isTrending: false,
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=right"
    ],
    sizes: ['Free Size'],
    colors: ['Red', 'Gold', 'Purple', 'Green'],
    material: 'Pure Silk',
    occasion: 'Festive',
    gender: 'women',
    keywords: ['ethnic', 'saree', 'silk', 'traditional', 'women'],
    description: "An elegant silk saree with intricate embroidery work and a designer blouse. Perfect for festive occasions and special events.",
    features: ["Pure Silk", "Handcrafted Embroidery", "Designer Blouse", "Traditional Design"],
    specifications: {
      "Fabric": "Pure Silk",
      "Care Instructions": "Dry Clean Only",
      "Origin": "Made in India",
      "Occasion": "Festive, Wedding, Party"
    },
    shipping: {
      "Standard Delivery": "3-5 business days",
      "Express Delivery": "1-2 business days",
      "Free Shipping": "On orders above ₹2000"
    },
    dateAdded: '2024-01-14'
  },

  // Men's Products
  {
    _id: "men_1",
    name: "Premium Cotton Kurta",
    category: "Ethnic Wear",
    subcategory: "Kurtas",
    brand: "Heritage Wear",
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    rating: 4.8,
    reviews: 95,
    inStock: true,
    isNew: true,
    isTrending: true,
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=right"
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Cream', 'Light Blue', 'Beige'],
    material: 'Premium Cotton',
    occasion: 'Festive',
    gender: 'men',
    keywords: ['ethnic', 'kurta', 'cotton', 'men'],
    description: "A classic cotton kurta that combines comfort with style. Perfect for daily wear, festive occasions, and formal events. Made from premium cotton fabric with traditional Indian craftsmanship.",
    features: ["100% Premium Cotton", "Comfortable Fit", "Easy Care", "Traditional Design", "Breathable Fabric", "Durable Construction"],
    specifications: {
      "Fabric": "Premium Cotton",
      "Care Instructions": "Machine Washable",
      "Origin": "Made in India",
      "Sleeve Length": "Full Sleeve",
      "Neckline": "Mandarin Collar",
      "Occasion": "Daily Wear, Festive, Formal"
    },
    shipping: {
      "Standard Delivery": "3-5 business days",
      "Express Delivery": "1-2 business days",
      "Free Shipping": "On orders above ₹2000"
    },
    dateAdded: '2024-01-15'
  },

  // Accessories
  {
    _id: "accessories_1",
    name: "Designer Sunglasses - Aviator Style",
    category: "Eyewear",
    subcategory: "Sunglasses",
    brand: "SunStyle",
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    rating: 4.6,
    reviews: 234,
    inStock: true,
    isNew: true,
    isTrending: true,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=left"
    ],
    colors: ['Black', 'Brown', 'Gold', 'Silver'],
    material: 'Acetate',
    occasion: 'Casual',
    gender: 'unisex',
    keywords: ['accessories', 'sunglasses', 'eyewear', 'aviator'],
    description: "Stylish aviator sunglasses with UV protection and premium acetate frames. Perfect for both men and women who want to make a fashion statement.",
    features: ["UV Protection", "Acetate Frames", "Unisex Design", "Stylish Look"],
    specifications: {
      "Frame Material": "Acetate",
      "Lens Type": "UV Protection",
      "Gender": "Unisex",
      "Style": "Aviator"
    },
    shipping: {
      "Standard Delivery": "3-5 business days",
      "Express Delivery": "1-2 business days",
      "Free Shipping": "On orders above ₹2000"
    },
    dateAdded: '2024-01-15'
  },
  {
    _id: "accessories_2",
    name: "Trendy Baseball Cap",
    category: "Headwear",
    subcategory: "Caps",
    brand: "CapCo",
    price: 899,
    originalPrice: 1299,
    discount: 31,
    rating: 4.4,
    reviews: 189,
    inStock: true,
    isNew: true,
    isTrending: false,
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80&q=80&w=1000&h=1000&fit=crop&crop=right"
    ],
    colors: ['Black', 'White', 'Navy', 'Red'],
    material: 'Cotton',
    occasion: 'Casual',
    gender: 'unisex',
    keywords: ['accessories', 'cap', 'baseball', 'headwear'],
    description: "A trendy baseball cap made from premium cotton with adjustable strap. Perfect for casual outings and sports activities.",
    features: ["Premium Cotton", "Adjustable Strap", "Unisex Design", "Comfortable Fit"],
    specifications: {
      "Material": "Cotton",
      "Adjustable": "Yes",
      "Gender": "Unisex",
      "Style": "Baseball Cap"
    },
    shipping: {
      "Standard Delivery": "3-5 business days",
      "Express Delivery": "1-2 business days",
      "Free Shipping": "On orders above ₹2000"
    },
    dateAdded: '2024-01-14'
  }
];

module.exports = products;
