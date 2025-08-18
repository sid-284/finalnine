import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { convertUSDToINR, formatINR } from '../../utils/currency';

// Dummy data from collection-universe/index.jsx
const productsData = [
  {
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
    id: 2,
    name: "Silk Midi Dress",
    designer: "Isabella Marchetti",
    price: 680,
    rating: 4.9,
    reviews: 18,
    description: "Flowing silk dress with delicate pleating and a flattering midi length.",
    images: [
      "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?w=400&h=500&fit=crop",
      "https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg?w=400&h=500&fit=crop"
    ],
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
    id: 3,
    name: "Merino Wool Sweater",
    designer: "Isabella Marchetti",
    price: 420,
    rating: 4.7,
    reviews: 32,
    description: "Soft merino wool sweater with a relaxed fit and subtle texture details.",
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop"
    ],
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
    id: 4,
    name: "Tailored Blazer",
    designer: "Isabella Marchetti",
    price: 890,
    rating: 4.6,
    reviews: 15,
    description: "Impeccably tailored blazer with structured shoulders and a modern silhouette.",
    images: [
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?w=400&h=500&fit=crop",
      "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?w=400&h=500&fit=crop"
    ],
    sizes: [
      { size: 'XS', available: true },
      { size: 'S', available: true },
      { size: 'M', available: true },
      { size: 'L', available: false },
      { size: 'XL', available: true }
    ],
    isWishlisted: false,
    popularity: 82,
    createdAt: "2024-07-03"
  },
  {
    id: 5,
    name: "Pleated Midi Skirt",
    designer: "Isabella Marchetti",
    price: 520,
    rating: 4.8,
    reviews: 28,
    description: "Elegant pleated skirt in luxurious fabric with a timeless midi length.",
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop",
      "https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg?w=400&h=500&fit=crop"
    ],
    sizes: [
      { size: 'XS', available: true },
      { size: 'S', available: true },
      { size: 'M', available: true },
      { size: 'L', available: true },
      { size: 'XL', available: true }
    ],
    sustainability: true,
    isWishlisted: true,
    popularity: 91,
    createdAt: "2024-07-01"
  },
  {
    id: 6,
    name: "Cashmere Turtleneck",
    designer: "Isabella Marchetti",
    price: 380,
    rating: 4.9,
    reviews: 41,
    description: "Ultra-soft cashmere turtleneck in a classic fit, perfect for layering.",
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop"
    ],
    sizes: [
      { size: 'XS', available: true },
      { size: 'S', available: false },
      { size: 'M', available: true },
      { size: 'L', available: true },
      { size: 'XL', available: true }
    ],
    sustainability: true,
    isWishlisted: false,
    popularity: 94,
    createdAt: "2024-06-28"
  },
  {
    id: 7,
    name: "Wide-Leg Trousers",
    designer: "Isabella Marchetti",
    price: 620,
    rating: 4.5,
    reviews: 19,
    description: "Sophisticated wide-leg trousers with a high waist and flowing silhouette.",
    images: [
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop"
    ],
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
    id: 8,
    name: "Silk Blouse",
    designer: "Isabella Marchetti",
    price: 480,
    rating: 4.7,
    reviews: 26,
    description: "Elegant silk blouse with subtle draping and mother-of-pearl buttons.",
    images: [
      "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?w=400&h=500&fit=crop",
      "https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg?w=400&h=500&fit=crop"
    ],
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

const SearchModal = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [open]);

  // Escape key closes modal
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setLoading(true);
      apiFetch('/product/list')
        .then(data => {
          // Merge backend and dummy data, remove duplicates by id
          const backendProducts = Array.isArray(data) ? data : [];
          const merged = [...productsData, ...backendProducts.filter(p => !productsData.some(d => (d.id || d._id) === (p.id || p._id)) )];
          setAllProducts(merged);
          setLoading(false);
        })
        .catch(() => {
          setAllProducts(productsData);
          setLoading(false);
        });
    }
  }, [open]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    setResults(
      allProducts.filter(
        p =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.designer && p.designer.toLowerCase().includes(q))
      )
    );
  }, [query, allProducts]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      {/* Backdrop Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 animate-fadeIn" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl mx-auto animate-slideDown">
        {/* Modal Content */}
        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-background to-background/95">
            <h2 className="text-xl font-serif font-semibold text-foreground">Search 9tytwo</h2>
            <button
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
              onClick={onClose}
              aria-label="Close search"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Search Input */}
          <div className="p-6 border-b border-border">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg text-base placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background transition-all duration-200"
                placeholder="Search for products, brands, or categories..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center space-x-2 text-accent">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm font-medium">Searching...</span>
                </div>
              </div>
            ) : query && results.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-2">
                  <svg className="mx-auto h-12 w-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-3V7a3 3 0 00-6 0v2M5 12h14l-1 7H6l-1-7z" />
                  </svg>
                </div>
                <p className="text-muted-foreground text-sm">No products found for "{query}"</p>
                <p className="text-muted-foreground text-xs mt-1">Try adjusting your search terms</p>
              </div>
            ) : results.length > 0 ? (
              <div className="divide-y divide-border">
                {results.slice(0, 8).map(product => (
                  <div
                    key={product._id || product.id}
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors duration-200 group"
                    onClick={() => {
                      onClose();
                      navigate(`/product?id=${product._id || product.id}`);
                    }}
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={product.image1 || product.images?.[0] || '/assets/images/no_image.png'}
                        alt={product.name}
                        className="w-14 h-18 object-cover rounded-lg border border-border bg-muted group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate group-hover:text-accent transition-colors duration-200">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {product.brand || product.category || product.designer}
                      </p>
                      {product.rating && (
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({product.reviews || 0})
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <div className="font-semibold text-accent text-right">
                        {formatINR(convertUSDToINR(product.price))}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-sm text-muted-foreground line-through">
                          {formatINR(convertUSDToINR(product.originalPrice))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {results.length > 8 && (
                  <div className="p-4 text-center border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Showing 8 of {results.length} results
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-2">
                  <svg className="mx-auto h-12 w-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-muted-foreground text-sm">Start typing to search our luxury collection</p>
                <p className="text-muted-foreground text-xs mt-1">Find products, brands, and categories</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        .animate-fadeIn { 
          animation: fadeIn 0.3s ease-out; 
        }
        @keyframes slideDown { 
          from { 
            transform: translateY(-2rem); 
            opacity: 0;
            scale: 0.95;
          } 
          to { 
            transform: translateY(0); 
            opacity: 1;
            scale: 1;
          } 
        }
        .animate-slideDown { 
          animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
        }
      `}</style>
    </div>
  );
};

export default SearchModal;
