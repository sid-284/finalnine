import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './model/productModel.js';

dotenv.config();

const placeholderUrls = [
    "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=500&fit=crop"
];

const cleanupPlaceholderImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        // Find all products
        const products = await Product.find({});
        console.log(`Found ${products.length} products to check`);

        let updatedCount = 0;

        for (const product of products) {
            let updateData = {};
            let hasChanges = false;

            // Check each image field and remove if it's a placeholder
            ['image2', 'image3', 'image4'].forEach(imageField => {
                if (product[imageField] && placeholderUrls.includes(product[imageField])) {
                    updateData[imageField] = null;
                    hasChanges = true;
                    console.log(`Removing placeholder ${imageField} from product: ${product.name}`);
                }
            });

            // Special handling for image1 - only remove if there are other real images
            if (product.image1 && placeholderUrls.includes(product.image1)) {
                const hasOtherRealImages = ['image2', 'image3', 'image4'].some(field => 
                    product[field] && !placeholderUrls.includes(product[field])
                );
                
                if (hasOtherRealImages) {
                    // Find the first real image and move it to image1
                    for (const field of ['image2', 'image3', 'image4']) {
                        if (product[field] && !placeholderUrls.includes(product[field])) {
                            updateData.image1 = product[field];
                            updateData[field] = null;
                            hasChanges = true;
                            console.log(`Moving ${field} to image1 for product: ${product.name}`);
                            break;
                        }
                    }
                } else {
                    console.log(`Product ${product.name} only has placeholder images - keeping image1 as placeholder`);
                }
            }

            if (hasChanges) {
                // Use $unset to remove fields that should be null
                const unsetFields = {};
                const setFields = {};

                Object.keys(updateData).forEach(key => {
                    if (updateData[key] === null) {
                        unsetFields[key] = "";
                    } else {
                        setFields[key] = updateData[key];
                    }
                });

                const updateQuery = {};
                if (Object.keys(unsetFields).length > 0) {
                    updateQuery.$unset = unsetFields;
                }
                if (Object.keys(setFields).length > 0) {
                    updateQuery.$set = setFields;
                }

                await Product.findByIdAndUpdate(product._id, updateQuery);
                updatedCount++;
            }
        }

        console.log(`Updated ${updatedCount} products`);
        console.log('Cleanup completed successfully!');
        
    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database');
    }
};

cleanupPlaceholderImages();
