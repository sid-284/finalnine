// Utility functions to test wishlist functionality

export const testWishlist = () => {
  console.log('🧪 Testing Wishlist Functionality...');
  
  // Test localStorage
  const localStorageWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  console.log('localStorage wishlist:', localStorageWishlist);
  
  // Test if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  console.log('User from localStorage:', user);
  
  // Test if backend is authenticated
  const backendAuth = localStorage.getItem('backendAuthenticated') === 'true';
  console.log('Backend authenticated:', backendAuth);
  
  return {
    localStorageWishlist,
    user,
    backendAuth
  };
};

export const addTestProductToWishlist = (productId) => {
  try {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      console.log('✅ Added test product to wishlist:', productId);
      return true;
    } else {
      console.log('⚠️ Product already in wishlist:', productId);
      return false;
    }
  } catch (error) {
    console.error('❌ Error adding test product:', error);
    return false;
  }
};

export const clearWishlist = () => {
  try {
    localStorage.removeItem('wishlist');
    console.log('🗑️ Cleared wishlist');
    return true;
  } catch (error) {
    console.error('❌ Error clearing wishlist:', error);
    return false;
  }
}; 