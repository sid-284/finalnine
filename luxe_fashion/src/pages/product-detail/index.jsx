import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';

import StyleThis from './components/StyleThis';
import CustomerReviews from './components/CustomerReviews';
import RecentlyViewed from './components/RecentlyViewed';
import Icon from '../../components/AppIcon';
import { apiFetch } from '../../utils/api';
import { convertUSDToINR, formatINR } from '../../utils/currency';

const ProductDetail = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  


  // Mock product data for fallback
  const mockProduct = {
    id: 1,
    name: "",
    brand: "",
    price: 0,
    originalPrice: 0,
    discount: 0,
    rating: 0,
    reviewCount: 0,
    description: `.`,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop"
    ],
    colors: [
      { id: 1, name: "Camel", hex: "#C19A6B" },
      { id: 2, name: "Charcoal", hex: "#36454F" },
      { id: 3, name: "Cream", hex: "#F5F5DC" }
    ],
    sizes: [
      { value: "xs", label: "XS", available: true },
      { value: "s", label: "S", available: true },
      { value: "m", label: "M", available: true },
      { value: "l", label: "L", available: false },
      { value: "xl", label: "XL", available: true }
    ],
    features: [
      { icon: "Truck", text: `Free shipping on orders over ${formatINR(convertUSDToINR(200))}` },
      { icon: "RotateCcw", text: "30-day return policy" },
      { icon: "Shield", text: "2-year warranty included" },
      { icon: "Award", text: "Ethically sourced materials" }
    ],
    materials: "70% Cashmere, 25% Wool, 5% Silk lining",
    construction: "Hand-finished seams with French construction techniques. Double-faced fabric with no visible stitching on the exterior.",
    origin: "Crafted in Italy by master tailors with over 30 years of experience",
    fitDescription: "This coat is designed with an oversized, relaxed fit. The model is 5'9\" and wearing size S. For a more fitted look, consider sizing down.",
    sizeChart: [
      { size: "XS", chest: "32-34\"", waist: "24-26\"", length: "42\"" },
      { size: "S", chest: "34-36\"", waist: "26-28\"", length: "43\"" },
      { size: "M", chest: "36-38\"", waist: "28-30\"", length: "44\"" },
      { size: "L", chest: "38-40\"", waist: "30-32\"", length: "45\"" },
      { size: "XL", chest: "40-42\"", waist: "32-34\"", length: "46\"" }
    ],
    careInstructions: [
      { icon: "Droplets", text: "Dry clean only" },
      { icon: "Sun", text: "Avoid direct sunlight when drying" },
      { icon: "Thermometer", text: "Store in cool, dry place" },
      { icon: "Wind", text: "Air out regularly to maintain freshness" }
    ],
    sustainability: {
      impact: "This coat is made from responsibly sourced cashmere and wool, supporting sustainable farming practices and fair trade initiatives.",
      certifications: [
        { icon: "Leaf", name: "Responsible Wool Standard", description: "Certified sustainable wool sourcing" },
        { icon: "Heart", name: "Fair Trade Certified", description: "Supports fair wages and working conditions" },
        { icon: "Recycle", name: "Carbon Neutral", description: "Offset production emissions" }
      ]
    },
    artisanStory: {
      story: "Each coat is meticulously crafted by skilled artisans in a family-owned atelier in Florence, Italy. The workshop has been perfecting their craft for three generations, combining traditional techniques with modern innovation.",
      artisan: "Marco Benedetti",
      location: "Florence, Italy",
      technique: "Hand-finished seams using traditional Florentine tailoring methods passed down through generations."
    }
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        // If no product ID, use mock data
        setProduct(mockProduct);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Try to fetch from backend first
        try {
          const productData = await apiFetch(`/product/details/${productId}`);
          setProduct(productData);
        } catch (backendError) {
          // If backend fails, use mock data based on product ID
          const mockProducts = [
            mockProduct,
            {
              ...mockProduct,
              id: 2,
              name: "",
              designer: "",
              price: 680,
              rating: 4.9,
              reviewCount: 18,
              description: "Flowing silk dress with delicate pleating and a flattering midi length.",
              images: [
                "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
                "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop",
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=800&fit=crop",
                "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop"
              ]
            },
            {
              ...mockProduct,
              id: 3,
              name: "Merino Wool Sweater",
              designer: "Isabella Marchetti",
              price: 420,
              rating: 4.7,
              reviewCount: 32,
              description: "Soft merino wool sweater with a relaxed fit and subtle texture details.",
              images: [
                "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=800&fit=crop",
                "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop",
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=800&fit=crop",
                "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=800&fit=crop",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop"
              ]
            },
            {
              ...mockProduct,
              id: 4,
              name: "Tailored Blazer",
              designer: "Isabella Marchetti",
              price: 890,
              rating: 4.6,
              reviewCount: 15,
              description: "Impeccably tailored blazer with structured shoulders and a modern silhouette.",
              images: [
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=800&fit=crop",
                "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop",
                "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop",
                "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=800&fit=crop",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop"
              ]
            }
          ];
          
          const selectedProduct = mockProducts.find(p => p.id == productId) || mockProduct;
          setProduct(selectedProduct);
        }
      } catch (error) {
        console.error('Error in product fetch:', error);
        setProduct(mockProduct);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Mock recommendations data
  const recommendations = [
    {
      id: 2,
      name: "Silk Blouse",
      brand: "Atelier Moderne",
      price: 185,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
      items: [
        { name: "Silk Blouse", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop" },
        { name: "Tailored Trousers", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop" },
        { name: "Leather Boots", image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=100&h=100&fit=crop" }
      ]
    },
    {
      id: 3,
      name: "Tailored Trousers",
      brand: "Atelier Moderne",
      price: 225,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
      items: [
        { name: "Cashmere Sweater", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop" },
        { name: "Silk Scarf", image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=100&h=100&fit=crop" },
        { name: "Leather Handbag", image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=100&h=100&fit=crop" }
      ]
    },
    {
      id: 4,
      name: "Cashmere Scarf",
      brand: "Atelier Moderne",
      price: 125,
      image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&h=500&fit=crop"
    }
  ];

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: "Sarah M.",
      rating: 5,
      date: "2025-01-05",
      title: "Absolutely stunning coat!",
      comment: `This coat exceeded my expectations in every way. The quality is exceptional - you can feel the luxury in every detail. The cashmere is incredibly soft and the construction is flawless. I've received so many compliments wearing it. The oversized fit is perfect for layering and creates such an elegant silhouette.`,
      size: "S",
      fit: "Perfect",
      verified: true,
      helpful: 24,
      images: [
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=200&h=200&fit=crop"
      ]
    },
    {
      id: 2,
      name: "Emma L.",
      rating: 5,
      date: "2024-12-28",
      title: "Investment piece worth every penny",
      comment: `I was hesitant about the price initially, but this coat is truly an investment piece. The craftsmanship is impeccable and it's clear this will last for years. The camel color is gorgeous and goes with everything in my wardrobe.`,
      size: "M",
      fit: "Slightly loose",
      verified: true,
      helpful: 18
    },
    {
      id: 3,
      name: "Jessica R.",
      rating: 4,
      date: "2024-12-20",
      title: "Beautiful coat, runs large",
      comment: `Gorgeous coat with amazing quality. The only reason I'm giving 4 stars instead of 5 is that it runs quite large. I ordered my usual size M but probably should have gone with S for a more fitted look. Still love it though!`,
      size: "M",
      fit: "Too loose",
      verified: true,
      helpful: 12
    }
  ];

  // Mock recently viewed products
  const recentlyViewed = [
    {
      id: 5,
      name: "Wool Blazer",
      brand: "Atelier Moderne",
      price: 325,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop"
    },
    {
      id: 6,
      name: "Silk Dress",
      brand: "Maison Claire",
      price: 2890,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=400&fit=crop"
    },
    {
      id: 7,
      name: "Cashmere Sweater",
      brand: "Atelier Moderne",
      price: 195,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop"
    },
    {
      id: 8,
      name: "Leather Boots",
      brand: "Artisan Craft",
      price: 425,
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=400&fit=crop"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Product not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-muted/30 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/homepage" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                Home
              </a>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              <a href="/collection-universe" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                Collections
              </a>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <ProductGallery 
                images={
                  Array.isArray(product.images) ? 
                  product.images.filter(img => img && img !== '') : 
                  [product.image1, product.image2, product.image3, product.image4]
                    .filter(img => img && img !== '' && img !== '/assets/images/no_image.png')
                } 
                productName={product.name} 
              />
            </div>

            <div>
              <ProductInfo product={product} />
            </div>
          </div>

          <div className="mt-16">
  
          </div>
        </div>
        
        {/* Mobile bottom spacing */}
        <div className="lg:hidden h-8"></div>
      </main>
    </div>
  );
};

export default ProductDetail;