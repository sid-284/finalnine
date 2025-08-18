import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useUser } from '../../../context/UserContext';
import { useCart } from '../../../context/CartContext';
import { apiFetch } from '../../../utils/api';
import { convertUSDToINR, formatINR } from '../../../utils/currency';

const getWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
  } catch {
    return [];
  }
};
const setWishlist = (list) => {
  localStorage.setItem('wishlist', JSON.stringify(list));
};

const ProductCard = ({ product, viewMode, index }) => {
  const { user, backendAuthenticated } = useUser();
  const { addToCart } = useCart();
  // Use MongoDB _id if available, otherwise fall back to numeric id
  const pid = product._id || product.id;
  console.log(`ProductCard: ${product.name} - _id: ${product._id}, id: ${product.id}, using pid: ${pid}`);
  
  if (!pid) {
    console.error(`❌ Product ${product.name} has no _id or id field! Please ensure products have either _id or id.`);
  }
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showLoginMsg, setShowLoginMsg] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showQuickView, setShowQuickView] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize wishlist state
  useEffect(() => {
    const wishlist = getWishlist();
    const isInWishlist = wishlist.some(id => id && (id.toString() === pid?.toString()));
    console.log(`Product ${product.name} (${pid}) wishlist state:`, isInWishlist);
    console.log('Current wishlist from localStorage:', wishlist);
    setIsWishlisted(isInWishlist);
  }, [pid, product.name]);

  // Sync with backend wishlist when authenticated
  useEffect(() => {
    const syncWithBackend = async () => {
      if (user && backendAuthenticated) {
        try {
          console.log('Syncing wishlist with backend...');
          const backendWishlist = await apiFetch('/user/wishlist');
          const backendIds = backendWishlist.map(p => p._id || p.id);
          console.log('Backend wishlist IDs:', backendIds);
          
          // Update localStorage with backend data
          setWishlist(backendIds);
          
          // Update current product's wishlist state
          const isInBackendWishlist = backendIds.some(id => id && (id.toString() === pid?.toString()));
          console.log(`Product ${product.name} in backend wishlist:`, isInBackendWishlist);
          setIsWishlisted(isInBackendWishlist);
        } catch (error) {
          console.error('Failed to sync with backend wishlist:', error);
        }
      }
    };
    
    syncWithBackend();
  }, [user, backendAuthenticated, pid, product.name]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add to cart clicked for product:', product.name);
    console.log('Event target:', e.target);
    console.log('Event currentTarget:', e.currentTarget);
    
    if (!user) {
      console.log('User not logged in, showing login message');
      setShowLoginMsg(true);
      setTimeout(() => setShowLoginMsg(false), 1500);
      return;
    }
    
    const cartItem = {
      id: pid,
      name: product.name,
      price: product.price,
      image: product.image1 || product.images?.[0] || product.image || '/assets/images/no_image.png',
      size: 'M', // Default size
      color: 'Default', // Default color
      quantity: 1
    };
    
    console.log('Adding item to cart:', cartItem);
    addToCart(cartItem);
    setShowSuccessMsg('Added to cart!');
    setTimeout(() => setShowSuccessMsg(''), 2000);
  };



  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('=== WISHLIST TOGGLE DEBUG ===');
    console.log('Product:', product.name);
    console.log('Product ID:', pid);
    console.log('Current wishlist state:', isWishlisted);
    console.log('User authenticated:', !!user);
    console.log('Backend authenticated:', backendAuthenticated);
    
    if (!user) {
      console.log('User not logged in, showing login message');
      setShowLoginMsg(true);
      setTimeout(() => setShowLoginMsg(false), 1500);
      return;
    }
    
    setLoading(true);
    
    // Use backend if authenticated, otherwise use localStorage
    if (backendAuthenticated) {
      try {
        if (isWishlisted) {
          console.log('🔄 Removing from wishlist (backend)');
          const response = await apiFetch('/user/wishlist/remove', {
            method: 'POST',
            body: JSON.stringify({ productId: pid }),
          });
          console.log('Backend remove response:', response);
          setIsWishlisted(false);
          // Update localStorage
          let wishlist = getWishlist();
          wishlist = wishlist.filter(id => id?.toString() !== pid?.toString());
          setWishlist(wishlist);
          setShowSuccessMsg('Removed from wishlist!');
          setTimeout(() => setShowSuccessMsg(''), 2000);
        } else {
          console.log('➕ Adding to wishlist (backend)');
          const response = await apiFetch('/user/wishlist/add', {
            method: 'POST',
            body: JSON.stringify({ productId: pid }),
          });
          console.log('Backend add response:', response);
          setIsWishlisted(true);
          // Update localStorage
          let wishlist = getWishlist();
          // Check if ID already exists before adding
          if (!wishlist.some(id => id?.toString() === pid?.toString())) {
            wishlist.push(pid);
          }
          setWishlist(wishlist);
          setShowSuccessMsg('Added to wishlist!');
          setTimeout(() => setShowSuccessMsg(''), 2000);
        }
      } catch (error) {
        console.error('❌ Backend wishlist failed, using localStorage fallback:', error);
        // fallback to localStorage if backend fails
        let wishlist = getWishlist();
        if (isWishlisted) {
          wishlist = wishlist.filter(id => id !== pid);
          setIsWishlisted(false);
        } else {
          wishlist.push(pid);
          setIsWishlisted(true);
        }
        setWishlist(wishlist);
        setShowSuccessMsg(isWishlisted ? 'Removed from wishlist!' : 'Added to wishlist!');
        setTimeout(() => setShowSuccessMsg(''), 2000);
      }
    } else {
      // Use localStorage when backend is not authenticated
      console.log('💾 Using localStorage for wishlist (backend not authenticated)');
      let wishlist = getWishlist();
      if (isWishlisted) {
        console.log('🗑️ Removing from wishlist (localStorage)');
        wishlist = wishlist.filter(id => id?.toString() !== pid?.toString());
        setIsWishlisted(false);
        setShowSuccessMsg('Removed from wishlist!');
      } else {
        console.log('💖 Adding to wishlist (localStorage)');
        // Check if ID already exists before adding
        if (!wishlist.some(id => id?.toString() === pid?.toString())) {
          wishlist.push(pid);
        }
        setIsWishlisted(true);
        setShowSuccessMsg('Added to wishlist!');
      }
      setWishlist(wishlist);
      setTimeout(() => setShowSuccessMsg(''), 2000);
    }
    setLoading(false);
    console.log('=== END WISHLIST TOGGLE DEBUG ===');
  };

  // Ensure product.images is always an array and only include images that exist
  const productImages = Array.isArray(product.images) ? product.images : 
    [
      product.image1, 
      product.image2, 
      product.image3, 
      product.image4, 
      product.image
    ].filter(img => img && img !== '' && img !== '/assets/images/no_image.png');

  const nextImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const getSizeAvailability = () => {
    if (!product.sizes) return 0;
    const availableSizes = Array.isArray(product.sizes) 
      ? product.sizes.filter(size => typeof size === 'object' ? size.available : true)
      : [];
    return availableSizes.length;
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-80 h-64 md:h-auto">
            <Link to={`/product?id=${pid}`}>
              <Image
                src={productImages[currentImageIndex] || '/assets/images/no_image.png'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </Link>
            
            {productImages.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevImage}
                  className="bg-white/80 hover:bg-white"
                >
                  <Icon name="ChevronLeft" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  className="bg-white/80 hover:bg-white"
                >
                  <Icon name="ChevronRight" size={16} />
                </Button>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleWishlist}
              className={`absolute top-2 right-2 bg-white/80 hover:bg-white cursor-pointer transition-all duration-200 ${
                isWishlisted ? 'ring-2 ring-red-500' : ''
              }`}
              loading={loading}
              type="button"
            >
              <Icon 
                name={isWishlisted ? "Heart" : "Heart"} 
                size={16} 
                className={`transition-all duration-200 ${
                  isWishlisted 
                    ? "fill-red-500 text-red-500 scale-110" 
                    : "text-muted-foreground hover:text-red-500"
                }`}
              />
            </Button>
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-sans font-semibold text-foreground mb-1">
                  <Link to={`/product?id=${pid}`} className="hover:text-accent transition-colors">
                    {product.name}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">{product.designer}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{formatINR(convertUSDToINR(product.price))}</p>
                {product.originalPrice && (
                  <p className="text-sm text-muted-foreground line-through">
                    {formatINR(convertUSDToINR(product.originalPrice))}
                  </p>
                )}
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Icon name="Package" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {getSizeAvailability()} sizes
                  </span>
                </div>
              </div>
              
              {product.sustainability && (
                <div className="flex items-center space-x-1">
                  <Icon name="Leaf" size={14} className="text-success" />
                  <span className="text-xs text-success">Sustainable</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 cursor-pointer"
                onClick={handleAddToCart}
                type="button"
              >
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowQuickView(true)}
                className="cursor-pointer"
                type="button"
              >
                Quick View
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid and Masonry view
  const cardHeight = viewMode === 'masonry' ? 
    (index % 3 === 0 ? 'h-96' : index % 3 === 1 ? 'h-80' : 'h-88') : 
    'h-96';

  return (
    <div className={`bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-all duration-300 group ${viewMode === 'masonry' ? 'break-inside-avoid mb-6' : ''}`}>
      <div className={`relative ${cardHeight}`}>
        <Link to={`/product?id=${pid}`}>
          <Image
            src={productImages[currentImageIndex] || '/assets/images/no_image.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        
        {/* Image Navigation */}
        {productImages.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              className="bg-white/80 hover:bg-white"
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              className="bg-white/80 hover:bg-white"
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        )}
        
        {/* Always visible Wishlist button */}
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleWishlist}
            className={`bg-white/80 hover:bg-white cursor-pointer transition-all duration-200 ${
              isWishlisted ? 'ring-2 ring-red-500' : ''
            }`}
            loading={loading}
            type="button"
          >
            <Icon 
              name="Heart" 
              size={16} 
              className={`transition-all duration-200 ${
                isWishlisted 
                  ? "fill-red-500 text-red-500 scale-110" 
                  : "text-muted-foreground hover:text-red-500"
              }`}
            />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="absolute top-2 right-12 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowQuickView(true)}
            className="bg-white/80 hover:bg-white cursor-pointer"
            type="button"
          >
            <Icon name="Eye" size={16} />
          </Button>
        </div>
        
        {/* Always visible Add to Cart button */}
        <div className="absolute bottom-2 right-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleAddToCart}
            className="bg-white/90 hover:bg-white text-foreground shadow-lg cursor-pointer"
            type="button"
          >
            Add to Cart
          </Button>
        </div>
        

        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.isNew && (
            <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded">
              New
            </span>
          )}
          {product.onSale && (
            <span className="px-2 py-1 bg-error text-error-foreground text-xs font-medium rounded">
              Sale
            </span>
          )}
          {product.sustainability && (
            <span className="px-2 py-1 bg-success text-success-foreground text-xs font-medium rounded">
              Eco
            </span>
          )}
        </div>
        
        {/* Image Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
        {showLoginMsg && (
          <div className="absolute top-10 right-2 bg-card border border-border rounded px-3 py-1 text-xs text-error shadow-lg z-20">
            Please log in to add items to cart or wishlist
          </div>
        )}
        {showSuccessMsg && (
          <div className="absolute top-10 right-2 bg-success text-success-foreground rounded px-3 py-1 text-xs shadow-lg z-20">
            {showSuccessMsg}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
              <Link to={`/product-detail?id=${pid}`} className="hover:text-accent transition-colors">
                {product.name}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground">{product.designer}</p>
          </div>
          <div className="text-right ml-2">
            <p className="font-semibold text-foreground">{formatINR(convertUSDToINR(product.price))}</p>
            {product.originalPrice && (
              <p className="text-sm text-muted-foreground line-through">
                {formatINR(convertUSDToINR(product.originalPrice))}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-end mb-3">
          <div className="flex items-center space-x-1">
            <Icon name="Package" size={14} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {getSizeAvailability()} sizes
            </span>
          </div>
        </div>
        
        <Button 
          variant="default" 
          size="sm" 
          className="w-full cursor-pointer"
          onClick={handleAddToCart}
          type="button"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;