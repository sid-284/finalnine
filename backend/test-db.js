import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./model/productModel.js";

dotenv.config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connected successfully");
        return true;
    } catch (error) {
        console.log("DB connection error:", error.message);
        return false;
    }
};

const addSampleProducts = async () => {
    try {
        // Check if products already exist
        const existingProducts = await Product.find({});
        console.log(`Found ${existingProducts.length} existing products`);
        
        if (existingProducts.length > 0) {
            console.log("Products already exist, skipping creation");
            return existingProducts;
        }
        
        // Create sample products
        const sampleProducts = [
            {
                name: "Cashmere Wrap Coat",
                image1: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop",
                image2: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
                image3: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
                image4: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
                description: "Luxurious cashmere coat with an elegant wrap silhouette, perfect for transitional weather.",
                price: 1280,
                category: "Outerwear",
                subCategory: "Coats",
                sizes: [
                    { size: 'XS', available: true },
                    { size: 'S', available: true },
                    { size: 'M', available: false },
                    { size: 'L', available: true },
                    { size: 'XL', available: true }
                ],
                date: Date.now(),
                bestseller: true
            },
            {
                name: "Silk Midi Dress",
                image1: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
                image2: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
                image3: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop",
                image4: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
                description: "Flowing silk dress with delicate pleating and a flattering midi length.",
                price: 680,
                category: "Dresses",
                subCategory: "Midi",
                sizes: [
                    { size: 'XS', available: true },
                    { size: 'S', available: true },
                    { size: 'M', available: true },
                    { size: 'L', available: true },
                    { size: 'XL', available: false }
                ],
                date: Date.now(),
                bestseller: false
            },
            {
                name: "Merino Wool Sweater",
                image1: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=500&fit=crop",
                image2: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
                image3: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
                image4: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
                description: "Soft merino wool sweater with a relaxed fit and subtle texture details.",
                price: 420,
                category: "Sweaters",
                subCategory: "Pullovers",
                sizes: [
                    { size: 'XS', available: false },
                    { size: 'S', available: true },
                    { size: 'M', available: true },
                    { size: 'L', available: true },
                    { size: 'XL', available: true }
                ],
                date: Date.now(),
                bestseller: true
            }
        ];
        
        const createdProducts = await Product.insertMany(sampleProducts);
        console.log(`Created ${createdProducts.length} sample products`);
        return createdProducts;
    } catch (error) {
        console.log("Error adding sample products:", error.message);
        return [];
    }
};

const main = async () => {
    const connected = await connectDb();
    if (!connected) {
        console.log("Failed to connect to database");
        process.exit(1);
    }
    
    const products = await addSampleProducts();
    console.log("Sample products:", products.map(p => ({ id: p._id, name: p.name })));
    
    await mongoose.disconnect();
    console.log("Disconnected from database");
};

main().catch(console.error); 