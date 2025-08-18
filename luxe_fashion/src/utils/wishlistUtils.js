// Centralized wishlist utility functions

export const getWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
  } catch {
    return [];
  }
};

export const setWishlist = (list) => {
  localStorage.setItem('wishlist', JSON.stringify(list));
};

export const addToWishlist = (productId) => {
  const wishlist = getWishlist();
  if (!wishlist.some(id => id?.toString() === productId?.toString())) {
    wishlist.push(productId);
    setWishlist(wishlist);
    return true;
  }
  return false;
};

export const removeFromWishlist = (productId) => {
  const wishlist = getWishlist();
  const newWishlist = wishlist.filter(id => id?.toString() !== productId?.toString());
  setWishlist(newWishlist);
  return newWishlist.length !== wishlist.length;
};

export const isInWishlist = (productId) => {
  const wishlist = getWishlist();
  return wishlist.some(id => id?.toString() === productId?.toString());
};

export const clearWishlist = () => {
  localStorage.removeItem('wishlist');
};

// Test function to verify wishlist functionality
export const testWishlistFunctionality = () => {
  console.log('🧪 Testing Wishlist Functionality...');
  
  // Clear wishlist first
  clearWishlist();
  console.log('✅ Cleared wishlist');
  
  // Test adding items
  const testId1 = '1';
  const testId2 = '2';
  
  console.log('Adding test product 1:', addToWishlist(testId1));
  console.log('Adding test product 2:', addToWishlist(testId2));
  console.log('Adding test product 1 again (should be false):', addToWishlist(testId1));
  
  console.log('Current wishlist:', getWishlist());
  console.log('Is product 1 in wishlist:', isInWishlist(testId1));
  console.log('Is product 3 in wishlist:', isInWishlist('3'));
  
  // Test removing items
  console.log('Removing test product 1:', removeFromWishlist(testId1));
  console.log('Current wishlist after removal:', getWishlist());
  
  console.log('✅ Wishlist functionality test complete');
};

// Make test function available globally for browser console
if (typeof window !== 'undefined') {
  window.testWishlistFunctionality = testWishlistFunctionality;
  window.wishlistUtils = {
    getWishlist,
    setWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  };
}
