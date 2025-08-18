import React, { useEffect, useState } from 'react';
import Header from '../components/ui/Header';
import Footer from './homepage/components/Footer';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useUser } from '../context/UserContext';
import { convertUSDToINR, formatINR } from '../utils/currency';

// Mock products data (same as in collection-universe)
const mockProducts = [
  {
    _id: "65f1a1b2c3d4e5f6a7b8c9d0", // MongoDB-like ObjectId format
    id: 1,
    name: "Cashmere Wrap Coat",
    designer: "Isabella Marchetti",
    price: 1280,
    originalPrice: 1600,
    rating: 4.8,
    reviews: 24,
    description: "Luxurious cashmere coat with an elegant wrap silhouette, perfect for transitional weather.",
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop"
    ],
    image1: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop",
    sizes: [
      { size: 'XS', available: true },
      { size: 'S', available: true },
      { size: 'M', available: false },
      { size: 'L', available: true },
      { size: 'XL', available: true }
    ],
    isNew: true,
    onSale: true,
    sustainability: true,
    isWishlisted: false,
    popularity: 95,
    createdAt: "2024-07-10"
  },
  {
    _id: "65f1a1b2c3d4e5f6a7b8c9d1", // MongoDB-like ObjectId format
    id: 2,
    name: "Silk Midi Dress",
    designer: "Isabella Marchetti",
    price: 680,
    rating: 4.9,
    reviews: 18,
    description: "Flowing silk dress with delicate pleating and a flattering midi length.",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop"
    ],
    image1: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
    sizes: [
      { size: 'XS', available: true },
      { size: 'S', available: true },
      { size: 'M', available: true },
      { size: 'L', available: true },
      { size: 'XL', available: false }
    ],
    isNew: true,
    sustainability: true,
    isWishlisted: true,
    popularity: 88,
    createdAt: "2024-07-08"
  },
  {
    _id: 3,
    id: 3,
    name: "Merino Wool Sweater",
    designer: "Isabella Marchetti",
    price: 420,
    rating: 4.7,
    reviews: 32,
    description: "Soft merino wool sweater with a relaxed fit and subtle texture details.",
    images: [
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop"
    ],
    image1: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=500&fit=crop",
    sizes: [
      { size: 'XS', available: false },
      { size: 'S', available: true },
      { size: 'M', available: true },
      { size: 'L', available: true },
      { size: 'XL', available: true }
    ],
    sustainability: true,
    isWishlisted: false,
    popularity: 76,
    createdAt: "2024-07-05"
  },
  {
    _id: 4,
    id: 4,
    name: "Tailored Blazer",
    designer: "Isabella Marchetti",
    price: 890,
    rating: 4.6,
    reviews: 15,
    description: "Impeccably tailored blazer with structured shoulders and a modern silhouette.",
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop"
    ],
    image1: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
    sizes: [
      { size: 'XS', available: true },
      { size: 'S', available: true },
      { size: 'M', available: true },
      { size: 'L', available: false },
      { size: 'XL', available: true }
    ],
    sustainability: true,
    isWishlisted: false,
    popularity: 82,
    createdAt: "2024-06-28"
  },
  {
    _id: 5,
    id: 5,
    name: "Wide-Leg Trousers",
    designer: "Isabella Marchetti",
    price: 320,
    rating: 4.5,
    reviews: 19,
    description: "Sophisticated wide-leg trousers with a high waist and flowing silhouette.",
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop"
    ],
    image1: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
    sizes: [
      { size: 'XS', available: true },
      { size: 'S', available: true },
      { size: 'M', available: true },
      { size: 'L', available: true },
      { size: 'XL', available: false }
    ],
    isWishlisted: false,
    popularity: 73,
    createdAt: "2024-06-25"
  },
  {
    _id: 6,
    id: 6,
    name: "Silk Blouse",
    designer: "Isabella Marchetti",
    price: 480,
    rating: 4.7,
    reviews: 26,
    description: "Elegant silk blouse with subtle draping and mother-of-pearl buttons.",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop"
    ],
    image1: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
    sizes: [
      { size: 'XS', available: false },
      { size: 'S', available: true },
      { size: 'M', available: true },
      { size: 'L', available: true },
      { size: 'XL', available: true }
    ],
    sustainability: true,
    isWishlisted: true,
    popularity: 86,
    createdAt: "2024-06-22"
  }
];

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

const Wishlist = () => {
  const { user, backendAuthenticated } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setLoading(true);
      console.log('=== WISHLIST PAGE DEBUG ===');
      console.log('User:', user ? 'Logged in' : 'Not logged in');
      console.log('Backend authenticated:', backendAuthenticated);
      
      try {
        let ids = [];
        
        // Use backend if authenticated, otherwise use localStorage
        if (user && backendAuthenticated) {
          try {
            console.log('🔄 Fetching wishlist from backend...');
            const backendWishlist = await apiFetch('/user/wishlist');
            console.log('Backend wishlist response:', backendWishlist);
            ids = backendWishlist.map(p => p._id || p.id);
            console.log('Backend wishlist IDs:', ids);
          } catch (error) {
            console.log('❌ Backend wishlist failed, using localStorage:', error);
            ids = getWishlist();
            console.log('localStorage wishlist IDs:', ids);
          }
        } else {
          console.log('💾 Using localStorage wishlist (backend not authenticated)');
          ids = getWishlist();
          console.log('localStorage wishlist IDs:', ids);
        }
        
        // Try to fetch from backend first, fallback to mock products
        try {
          console.log('🔄 Fetching all products from backend...');
          const all = await apiFetch('/product/list');
          console.log('All products from backend:', all.length);
          
          // Only use MongoDB ObjectIds
          console.log('Wishlist IDs to find:', ids);
          
          const filteredProducts = all.filter(p => {
            // Check if product ID (either _id or id) is in the wishlist
            const productId = p._id || p.id;
            // Convert all IDs to strings for consistent comparison
            const isInWishlist = ids.some(id => id && (id.toString() === productId?.toString()));
            console.log(`Product ${p.name}: _id=${p._id}, id=${p.id}, in wishlist: ${isInWishlist}`);
            return isInWishlist;
          });
          
          console.log('✅ Backend products found:', filteredProducts.length);
          console.log('Filtered products:', filteredProducts.map(p => ({ name: p.name, id: p._id || p.id })));
          
          if (filteredProducts.length > 0) {
            setProducts(filteredProducts);
          } else {
            // If no products found in backend, try to find them in mock products
            console.log('No products found in backend, checking mock products...');
            const filteredMockProducts = mockProducts.filter(p => {
              const productId = p._id || p.id;
              return ids.includes(productId);
            });
            console.log('✅ Mock products found:', filteredMockProducts.length);
            setProducts(filteredMockProducts);
          }
        } catch (error) {
          console.log('❌ Backend products failed, using mock products:', error);
          // Use mock products as fallback
          const filteredMockProducts = mockProducts.filter(p => ids.includes(p._id || p.id));
          console.log('✅ Mock products found:', filteredMockProducts.length);
          setProducts(filteredMockProducts);
        }
      } catch (error) {
        console.log('❌ Wishlist fetch failed, using mock products:', error);
        // Use mock products as fallback
        const ids = getWishlist();
        setProducts(mockProducts.filter(p => ids.includes(p._id || p.id)));
      }
      setLoading(false);
      console.log('=== END WISHLIST PAGE DEBUG ===');
    };
    fetchWishlistProducts();
    // eslint-disable-next-line
  }, [user, backendAuthenticated]);

  const removeFromWishlist = async (id) => {
    // Use backend if authenticated, otherwise use localStorage
    if (user && backendAuthenticated) {
      try {
        await apiFetch('/user/wishlist/remove', {
          method: 'POST',
          body: JSON.stringify({ productId: id }),
        });
      } catch (error) {
        console.log('Backend remove failed, using localStorage:', error);
      }
    }
    
    const ids = getWishlist().filter(pid => pid?.toString() !== id?.toString());
    setWishlist(ids);
    setProducts(products.filter(p => {
      const productId = p._id || p.id;
      return productId !== id;
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-card rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
            <div className="flex justify-center mb-4">
              <svg className="animate-spin h-8 w-8 text-accent" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
            </div>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">Loading your Wishlist...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center py-16 px-4">
        <div className="bg-card rounded-lg shadow-lg p-8 max-w-4xl w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Icon name="Heart" size={32} className="text-accent" />
              <h2 className="text-2xl font-serif font-semibold text-foreground">Your Wishlist</h2>
            </div>
            <Button variant="outline" onClick={() => navigate('/collection-universe')}>
              Continue Shopping
            </Button>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-6">You haven't added any favourites yet. Start exploring and add products you love!</p>
              <Button variant="primary" asChild>
                <Link to="/collection-universe">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product._id || product.id} className="bg-muted rounded-lg p-4 flex flex-col items-center">
                  <img
                    src={product.image1 || product.images?.[0] || '/assets/images/no_image.png'}
                    alt={product.name}
                    className="w-28 h-36 object-cover rounded mb-3 border border-border bg-card"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                  <div className="font-medium text-foreground text-center mb-1">{product.name}</div>
                  <div className="text-sm text-muted-foreground mb-2">{product.brand || product.category}</div>
                  <div className="font-semibold text-accent mb-2">{formatINR(convertUSDToINR(product.price))}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromWishlist(product._id || product.id)}
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Remove
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    asChild
                    className="mt-2"
                  >
                    <Link to={`/product?id=${product._id || product.id}`}>
                      View Product
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;