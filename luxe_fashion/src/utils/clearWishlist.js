// Utility to clear wishlist and start fresh

export const clearWishlist = () => {
  try {
    localStorage.removeItem('wishlist');
    console.log('🗑️ Cleared localStorage wishlist');
    return true;
  } catch (error) {
    console.error('❌ Error clearing wishlist:', error);
    return false;
  }
};

export const resetWishlist = () => {
  try {
    // Clear localStorage
    localStorage.removeItem('wishlist');
    
    // Reload the page to reset all components
    window.location.reload();
    
    console.log('🔄 Wishlist reset complete');
    return true;
  } catch (error) {
    console.error('❌ Error resetting wishlist:', error);
    return false;
  }
};

// Run this in browser console to clear wishlist
if (typeof window !== 'undefined') {
  window.clearWishlist = clearWishlist;
  window.resetWishlist = resetWishlist;
  console.log('🧹 Wishlist utilities loaded. Use clearWishlist() or resetWishlist()');
} 