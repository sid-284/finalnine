import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'


const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    try {
        if(!filePath){
            console.log('No file path provided for Cloudinary upload');
            return null;
        }
        
        console.log('Uploading to Cloudinary:', filePath);
        const uploadResult = await cloudinary.uploader.upload(filePath);
        console.log('Cloudinary upload successful:', uploadResult.secure_url);
        
        // Clean up the temporary file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        return uploadResult.secure_url;
        
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        
        // Clean up the temporary file even if upload failed
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        return null;
    }
}
export default uploadOnCloudinary