import User from "../model/userModel.js"
import Product from "../model/productModel.js"


export const getCurrentUser = async (req,res) => {
    try {
        let user = await User.findById(req.userId).select("-password")
        if(!user){
           return res.status(404).json({message:"user is not found"}) 
        }
        return res.status(200).json(user)
    } catch (error) {
         console.log(error)
    return res.status(500).json({message:`getCurrentUser error ${error}`})
    }
}

export const getAdmin = async (req,res) => {
    try {
        let adminEmail = req.adminEmail;
        if(!adminEmail){
            return res.status(404).json({message:"Admin is not found"}) 
        }
        return res.status(201).json({
            email:adminEmail,
            role:"admin"
        })
    } catch (error) {
        console.log(error)
    return res.status(500).json({message:`getAdmin error ${error}`})
    }
}

export const getWishlist = async (req, res) => {
  try {
    console.log('Getting wishlist for user:', req.userId);
    const user = await User.findById(req.userId).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User wishlist:', user.wishlist);
    res.json(user.wishlist || []);
  } catch (error) {
    console.error('getWishlist error:', error);
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    console.log('Adding to wishlist - User:', req.userId, 'Product:', productId);
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    // Find product by MongoDB ObjectId
    const product = await Product.findById(productId);
    
    if (!product) {
      console.log('Product not found for ID:', productId);
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log('Found product:', product.name, 'with ID:', product._id);
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { wishlist: product._id } }, // Use the actual MongoDB _id
      { new: true }
    ).populate('wishlist');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Updated user wishlist:', user.wishlist);
    res.json(user.wishlist || []);
  } catch (error) {
    console.error('addToWishlist error:', error);
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    console.log('Removing from wishlist - User:', req.userId, 'Product:', productId);
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    // Find product by MongoDB ObjectId
    const product = await Product.findById(productId);
    
    if (!product) {
      console.log('Product not found for ID:', productId);
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log('Found product to remove:', product.name, 'with ID:', product._id);
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { wishlist: product._id } }, // Use the actual MongoDB _id
      { new: true }
    ).populate('wishlist');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Updated user wishlist:', user.wishlist);
    res.json(user.wishlist || []);
  } catch (error) {
    console.error('removeFromWishlist error:', error);
    res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (avatar) update.avatar = avatar;
    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};