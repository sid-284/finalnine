import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './model/productModel.js';

dotenv.config();

const sampleProducts = [
  {
    name: "Cashmere Wrap Coat",
    image1: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop",
    image2: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
    image3: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    image4: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=500&fit=crop",
    description: "Luxurious cashmere coat with an elegant wrap silhouette, perfect for transitional weather.",
    price: 1280,
    category: "Outerwear",
    subCategory: "Coats",
    sizes: ["XS", "S", "M", "L", "XL"],
    date: Date.now(),
    bestseller: true
  },
  {
    name: "Silk Midi Dress",
    image1: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
    image2: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
    image3: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
    image4: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    description: "Flowing silk dress with delicate pleating and a flattering midi length.",
    price: 680,
    category: "Dresses",
    subCategory: "Midi",
    sizes: ["XS", "S", "M", "L", "XL"],
    date: Date.now(),
    bestseller: false
  },
  {
    name: "Merino Wool Sweater",
    image1: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=500&fit=crop",
    image2: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    image3: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
    image4: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=500&fit=crop",
    description: "Soft merino wool sweater with a relaxed fit and subtle texture details.",
    price: 420,
    category: "Tops",
    subCategory: "Sweaters",
    sizes: ["XS", "S", "M", "L", "XL"],
    date: Date.now(),
    bestseller: true
  },
  {
    name: "Tailored Blazer",
    image1: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
    image2: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop",
    image3: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    image4: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=500&fit=crop",
    description: "Impeccably tailored blazer with structured shoulders and a modern silhouette.",
    price: 890,
    category: "Outerwear",
    subCategory: "Blazers",
    sizes: ["XS", "S", "M", "L", "XL"],
    date: Date.now(),
    bestseller: false
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${insertedProducts.length} products`);

    // Log the product IDs for testing
    insertedProducts.forEach(product => {
      console.log(`Product: ${product.name} - ID: ${product._id}`);
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedProducts(); 