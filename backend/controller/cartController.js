import User from "../model/userModel.js";

export const addToCart = async (req, res) => {
  try {
    const { id, size, color, quantity = 1, name, price, image1 } = req.body;

    const userData = await User.findById(req.userId);

    // Check if user exists
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure cartData is initialized as an array
    let cartData = userData.cartData || { items: [] };

    // Find existing item with same id, size, and color
    const existingItemIndex = cartData.items.findIndex(
      item => item.id === id && item.size === size && item.color === color
    );

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      cartData.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cartData.items.push({
        id,
        size,
        color,
        quantity,
        name,
        price,
        image1
      });
    }

    await User.findByIdAndUpdate(req.userId, { cartData });

    return res.status(201).json({ message: "Added to cart", cart: cartData });
  } catch (error) {
    console.error("addToCart error:", error);
    return res.status(500).json({ message: "addToCart error" });
  }
};

export const UpdateCart = async (req, res) => {
  try {
    const { action, itemId, size, color, quantity } = req.body;
    const userData = await User.findById(req.userId);
    
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    let cartData = userData.cartData || { items: [] };

    switch (action) {
      case 'update':
        // Update item quantity
        const updateIndex = cartData.items.findIndex(
          item => item.id === itemId && item.size === size && item.color === color
        );
        if (updateIndex !== -1) {
          if (quantity <= 0) {
            cartData.items.splice(updateIndex, 1);
          } else {
            cartData.items[updateIndex].quantity = quantity;
          }
        }
        break;

      case 'remove':
        // Remove specific item
        cartData.items = cartData.items.filter(
          item => !(item.id === itemId && item.size === size && item.color === color)
        );
        break;

      case 'clear':
        // Clear entire cart
        cartData.items = [];
        break;

      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    await User.findByIdAndUpdate(req.userId, { cartData });

    return res.status(200).json({ message: "Cart updated", cart: cartData });
  } catch (error) {
    console.error("updateCart error:", error);
    return res.status(500).json({ message: "updateCart error" });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const userData = await User.findById(req.userId);
    
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartData = userData.cartData || { items: [] };

    return res.status(200).json(cartData);
  } catch (error) {
    console.error("getUserCart error:", error);
    return res.status(500).json({ message: "getUserCart error" });
  }
};