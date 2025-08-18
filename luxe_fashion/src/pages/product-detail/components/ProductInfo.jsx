import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { convertUSDToINR, formatINR } from '../../../utils/currency';
import { useCart } from '../../../context/CartContext';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../utils/api';
import { getWishlist, setWishlist } from '../../../utils/wishlistUtils';

const ProductInfo = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.colors && product.colors.length > 0 ? product.colors[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [showLoginMsg, setShowLoginMsg] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const { addToCart } = useCart();
  const { user, backendAuthenticated } = useUser();
  const navigate = useNavigate();

  console.log('Product sizes:', product.sizes);
  const sizeOptions = product.sizes ? product.sizes.map(size => {
    // Ensure size has the correct structure
    if (typeof size === 'object' && size.value && size.label) {
      return {
        value: size.value,
        label: size.label,
        disabled: size.available === false
      };
    } else if (typeof size === 'string') {
      // Handle case where size is just a string
      return {
        value: size.toLowerCase(),
        label: size,
        disabled: false
      };
    }
    return null;
  }).filter(Boolean) : [];
  
  // Initialize wishlist state
  useEffect(() => {
    const wishlist = getWishlist();
    const pid = product.id || product._id;
    const isInWishlist = wishlist.some(id => id && (id.toString() === pid?.toString()));
    console.log(`Product ${product.name} (${pid}) wishlist state:`, isInWishlist);
    setIsWishlisted(isInWishlist);
  }, [product.id, product._id, product.name]);

  // Initialize selectedSize with first available size if exists
  useEffect(() => {
    console.log('Initial product sizes for useEffect:', product.sizes);
    if (product.sizes && product.sizes.length > 0) {
      // Handle different size formats
      if (typeof product.sizes[0] === 'object' && 'available' in product.sizes[0]) {
        // Object format with availability
        const firstAvailableSize = product.sizes.find(size => size.available !== false);
        if (firstAvailableSize) {
          setSelectedSize(firstAvailableSize.value);
          console.log('Setting initial size to:', firstAvailableSize.value);
        }
      } else if (typeof product.sizes[0] === 'object' && 'value' in product.sizes[0]) {
        // Object format without availability
        setSelectedSize(product.sizes[0].value);
        console.log('Setting initial size to:', product.sizes[0].value);
      } else if (typeof product.sizes[0] === 'string') {
        // String format
        setSelectedSize(product.sizes[0].toLowerCase());
        console.log('Setting initial size to:', product.sizes[0].toLowerCase());
      }
    }
  }, [product.sizes]);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginMsg(true);
      setTimeout(() => setShowLoginMsg(false), 3000);
      return;
    }

    if (!selectedSize) {
      setShowSuccessMsg('Please select a size');
      setTimeout(() => setShowSuccessMsg(''), 3000);
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image1 || product.images?.[0] || '/assets/images/no_image.png',
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    };

    console.log('Attempting to add to cart with selectedSize:', selectedSize);
    addToCart(cartItem);
    setShowSuccessMsg('Added to cart!');
    setTimeout(() => setShowSuccessMsg(''), 3000);
  };

  const handleWishlistToggle = async () => {
    const pid = product.id || product._id;

    if (!pid) {
      console.error('Product ID not found');
      return;
    }

    setWishlistLoading(true);

    try {
      // Use backend if authenticated, otherwise use localStorage
      if (user && backendAuthenticated) {
        if (isWishlisted) {
          console.log('🗑️ Removing from wishlist (backend)');
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
    } catch (error) {
      console.error('❌ Backend wishlist failed, using localStorage fallback:', error);
      // fallback to localStorage if backend fails
      let wishlist = getWishlist();
      if (isWishlisted) {
        wishlist = wishlist.filter(id => id !== pid);
        setIsWishlisted(false);
        setShowSuccessMsg('Removed from wishlist!');
      } else {
        wishlist.push(pid);
        setIsWishlisted(true);
        setShowSuccessMsg('Added to wishlist!');
      }
      setWishlist(wishlist);
      setTimeout(() => setShowSuccessMsg(''), 2000);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand & Title */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-2">
          {product.name}
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-semibold text-foreground">
            {formatINR(convertUSDToINR(product.price))}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-muted-foreground line-through">
              {formatINR(convertUSDToINR(product.originalPrice))}
            </span>
          )}
          {product.discount && (
            <span className="bg-error text-error-foreground px-2 py-1 rounded text-sm font-medium">
              -{product.discount}%
            </span>
          )}
        </div>
      </div>

      {/* Rating & Reviews */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Icon
              key={i}
              name="Star"
              size={16}
              className={i < Math.floor(product.rating) ? 'text-accent fill-current' : 'text-muted-foreground'}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-2">
            {product.rating} ({product.reviewCount} reviews)
          </span>
        </div>
        <button className="text-sm text-accent hover:underline">
          Read Reviews
        </button>
      </div>

      {/* Description */}
      <div>
        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">
            Color: {selectedColor?.name || ''}
          </h3>
          <div className="flex space-x-2">
            {product.colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-colors duration-300 ${
                  selectedColor?.id === color.id
                    ? 'border-accent' :'border-muted-foreground/30 hover:border-muted-foreground'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">Size</h3>
          <button className="text-sm text-accent hover:underline">
            <span>Size Guide</span>
          </button>
        </div>
        
        {/* Direct size buttons instead of dropdown */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          {sizeOptions.map((size) => (
            <button
              key={size.value}
              onClick={() => {
                console.log('Size button clicked:', size.value);
                setSelectedSize(size.value);
                console.log('Selected size after click:', size.value);
              }}
              disabled={size.disabled}
              className={`py-2 px-3 border rounded-md transition-all ${selectedSize === size.value 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-background text-foreground border-border hover:border-foreground'} 
                ${size.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-selected={selectedSize === size.value}
              title={size.disabled ? 'Size not available' : `Select size ${size.label}`}
            >
              {size.label}
            </button>
          ))}
        </div>
        
        {/* Size dropdown */}
        <Select
          options={sizeOptions}
          value={selectedSize}
          onChange={(value) => {
            console.log('Size selected from dropdown:', value);
            setSelectedSize(value);
          }}
          placeholder="Select size"
          className="w-full"
          clearable={false}
        />
        
        {selectedSize && (
          <div className="mt-2 text-sm text-success font-medium">
            Selected size: {sizeOptions.find(opt => opt.value === selectedSize)?.label || selectedSize}
          </div>
        )}
      </div>

      {/* Quantity */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Quantity</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={decreaseQuantity}
            className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors duration-300"
          >
            <Icon name="Minus" size={16} />
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={increaseQuantity}
            className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors duration-300"
          >
            <Icon name="Plus" size={16} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="default"
          fullWidth
          disabled={!selectedSize}
          className="h-12"
          onClick={handleAddToCart}
        >
          Add to Cart - {formatINR(convertUSDToINR(product.price * quantity))}
        </Button>
        {showLoginMsg && (
          <div className="text-center text-sm text-error">
            Please login to add items to cart
          </div>
        )}
        {showSuccessMsg && (
          <div className="text-center text-sm text-success">
            {showSuccessMsg}
          </div>
        )}
        <Button
          variant="outline"
          fullWidth
          className="h-12"
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
        >
          <Icon
            name="Heart"
            size={18}
            className={`mr-2 ${isWishlisted ? 'text-red-500 fill-current' : ''}`}
          />
          {wishlistLoading ? 'Loading...' : (isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist')}
        </Button>
      </div>

      {/* Product Features */}
      {product.features && product.features.length > 0 && (
        <div className="border-t border-border pt-6">
          <div className="space-y-3">
            {product.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Icon name={feature.icon} size={16} className="text-accent" />
                <span className="text-sm text-muted-foreground">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Share</span>
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors duration-300 flex items-center justify-center">
              <Icon name="Facebook" size={16} />
            </button>
            <button className="w-8 h-8 rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors duration-300 flex items-center justify-center">
              <Icon name="Twitter" size={16} />
            </button>
            <button className="w-8 h-8 rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors duration-300 flex items-center justify-center">
              <Icon name="Instagram" size={16} />
            </button>
            <button className="w-8 h-8 rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors duration-300 flex items-center justify-center">
              <Icon name="Share2" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;