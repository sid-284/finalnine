import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const testCloudinary = async () => {
  try {
    console.log('Testing Cloudinary configuration...');
    console.log('Cloud Name:', process.env.CLOUDINARY_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing');
    console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing');
    
    cloudinary.config({ 
      cloud_name: process.env.CLOUDINARY_NAME, 
      api_key: process.env.CLOUDINARY_API_KEY, 
      api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    
    // Test the configuration by trying to get account info
    const result = await cloudinary.api.ping();
    console.log('Cloudinary connection successful:', result);
    
  } catch (error) {
    console.error('Cloudinary test failed:', error);
  }
};

testCloudinary();