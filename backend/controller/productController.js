import uploadOnCloudinary from "../config/cloudinary.js"
import Product from "../model/productModel.js"


export const addProduct = async (req,res) => {
    try {
        let {name,description,price,category,subCategory,sizes,bestseller} = req.body

        // Handle image uploads - only store uploaded images
        let image1 = null;
        let image2 = null;
        let image3 = null;
        let image4 = null;

        if (req.files && req.files.image1 && req.files.image1[0]) {
            image1 = await uploadOnCloudinary(req.files.image1[0].path);
        }
        if (req.files && req.files.image2 && req.files.image2[0]) {
            image2 = await uploadOnCloudinary(req.files.image2[0].path);
        }
        if (req.files && req.files.image3 && req.files.image3[0]) {
            image3 = await uploadOnCloudinary(req.files.image3[0].path);
        }
        if (req.files && req.files.image4 && req.files.image4[0]) {
            image4 = await uploadOnCloudinary(req.files.image4[0].path);
        }

        // Validate that at least one image is provided
        if (!image1 && !image2 && !image3 && !image4) {
            return res.status(400).json({
                message: "At least one product image is required"
            });
        }

        // Ensure image1 is always set (move first available image to image1 if needed)
        if (!image1) {
            if (image2) {
                image1 = image2;
                image2 = null;
            } else if (image3) {
                image1 = image3;
                image3 = null;
            } else if (image4) {
                image1 = image4;
                image4 = null;
            }
        }
        
        // Build product data with only uploaded images
        let productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory: subCategory || category, // Use category as fallback
            sizes: sizes ? JSON.parse(sizes) : ["XS", "S", "M", "L", "XL"],
            bestseller: bestseller === "true" ? true : false,
            date: Date.now()
        }

        // Only add image fields that have actual uploaded images
        if (image1) productData.image1 = image1;
        if (image2) productData.image2 = image2;
        if (image3) productData.image3 = image3;
        if (image4) productData.image4 = image4;

        console.log('Product data being saved:', {
            name: productData.name,
            hasImage1: !!productData.image1,
            hasImage2: !!productData.image2,
            hasImage3: !!productData.image3,
            hasImage4: !!productData.image4,
            imageUrls: {
                image1: productData.image1 || 'NOT_SET',
                image2: productData.image2 || 'NOT_SET',
                image3: productData.image3 || 'NOT_SET',
                image4: productData.image4 || 'NOT_SET'
            }
        });

        const product = await Product.create(productData)

        return res.status(201).json(product)

    } catch (error) {
          console.error("AddProduct error:", error.message)
    return res.status(500).json({message:`AddProduct error: ${error.message}`})
    }
    
}


export const listProduct = async (req,res) => {
     
    try {
        console.log('Fetching all products...');
        const products = await Product.find({});
        console.log(`Found ${products.length} products`);
        return res.status(200).json(products)

    } catch (error) {
        console.log("ListProduct error:", error.message)
    return res.status(500).json({message:`ListProduct error: ${error.message}`})
    }
}

export const removeProduct = async (req,res) => {
    try {
        let {id} = req.params;
        const product = await Product.findByIdAndDelete(id)
         return res.status(200).json(product)
    } catch (error) {
        console.log("RemoveProduct error")
    return res.status(500).json({message:`RemoveProduct error ${error}`})
    }
    
}

export const productDetails = async (req,res) => {
    try {
        let {id} = req.params;
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({message: 'Product not found'})
        }
        return res.status(200).json(product)
    } catch (error) {
        console.log("ProductDetails error")
        return res.status(500).json({message:`ProductDetails error ${error}`})
    }
}

export const updateProduct = async (req,res) => {
    try {
        let {id} = req.params;
        let {name,description,price,category,subCategory,sizes,bestseller} = req.body
        
        let updateData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory: subCategory || category,
            sizes: sizes ? JSON.parse(sizes) : undefined,
            bestseller: bestseller === "true" ? true : (bestseller === "false" ? false : undefined)
        }
        
        // Handle image uploads if provided
        if (req.files && req.files.image1 && req.files.image1[0]) {
            let image1 = await uploadOnCloudinary(req.files.image1[0].path)
            updateData.image1 = image1
        }
        
        if (req.files && req.files.image2 && req.files.image2[0]) {
            let image2 = await uploadOnCloudinary(req.files.image2[0].path)
            updateData.image2 = image2
        }
        
        if (req.files && req.files.image3 && req.files.image3[0]) {
            let image3 = await uploadOnCloudinary(req.files.image3[0].path)
            updateData.image3 = image3
        }
        
        if (req.files && req.files.image4 && req.files.image4[0]) {
            let image4 = await uploadOnCloudinary(req.files.image4[0].path)
            updateData.image4 = image4
        }
        
        const product = await Product.findByIdAndUpdate(id, updateData, {new: true})
        if (!product) {
            return res.status(404).json({message: 'Product not found'})
        }
        return res.status(200).json(product)
    } catch (error) {
        console.log("UpdateProduct error")
        return res.status(500).json({message:`UpdateProduct error ${error}`})
    }
}

export const deleteProduct = async (req,res) => {
    try {
        let {id} = req.params;
        const product = await Product.findByIdAndDelete(id)
        if (!product) {
            return res.status(404).json({message: 'Product not found'})
        }
        return res.status(200).json({message: 'Product deleted successfully'})
    } catch (error) {
        console.log("DeleteProduct error")
        return res.status(500).json({message:`DeleteProduct error ${error}`})
    }
}
