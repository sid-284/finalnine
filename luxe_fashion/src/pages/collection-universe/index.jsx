  import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../../components/ui/Header';
import FilterSidebar from './components/FilterSidebar';
import SortAndView from './components/SortAndView';
import ProductGrid from './components/ProductGrid';
import StyleItSection from './components/StyleItSection';
import SustainabilityInfo from './components/SustainabilityInfo';
import { convertUSDToINR } from '../../utils/currency';
import { apiFetch } from '../../utils/api';

const CollectionUniverse = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: [],
    size: [],
    color: [],
    price: [],
    sustainability: []
  });
  
  // State for backend products
  const [backendProducts, setBackendProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Polling interval reference
  const pollingIntervalRef = useRef(null);

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/product/list');
      setBackendProducts(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      setBackendProducts([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and setup polling for auto-updates
  useEffect(() => {
    fetchProducts();
    
    // Set up polling to check for new products every 30 seconds
    pollingIntervalRef.current = setInterval(() => {
      fetchProducts();
    }, 30000);
    
    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [fetchProducts]);

  // Apply filters when filters or backend products change
  useEffect(() => {
    if (!Array.isArray(backendProducts)) {
      setFilteredProducts([]);
      return;
    }

    // Start with the backend products
    let filtered = backendProducts.map(product => ({
      ...product,
      id: product._id || product.id, // Ensure id is available for consistency
      images: [
        product.image1, 
        product.image2, 
        product.image3, 
        product.image4
      ].filter(Boolean), // Handle multiple images from backend
      sizes: product.sizes ?
        (Array.isArray(product.sizes) ?
          product.sizes.map(size =>
            typeof size === 'string' ?
              { size: size, available: true } :
              size
          ) :
          [{ size: 'S', available: true }, { size: 'M', available: true }, { size: 'L', available: true }]
        ) :
        [{ size: 'S', available: true }, { size: 'M', available: true }, { size: 'L', available: true }], // Default sizes if not provided
      category: product.category || '', // Ensure category is available for filtering
      sustainability: product.sustainability || false,
      popularity: product.popularity || 50,
      createdAt: product.createdAt || new Date().toISOString()
    }));

    // Apply filters
    Object.keys(filters).forEach(filterType => {
      if (filters[filterType].length > 0) {
        filtered = filtered.filter(product => {
          switch (filterType) {
            case 'category':
              // Check if product has a category field, otherwise fallback to name
              if (product.category) {
                return filters[filterType].some(cat => 
                  product.category.toLowerCase() === cat.toLowerCase()
                );
              } else {
                // Fallback to name-based filtering if category is not available
                return filters[filterType].some(cat => 
                  product.name && product.name.toLowerCase().includes(cat.toLowerCase())
                );
              }
            case 'size':
              if (!product.sizes || !Array.isArray(product.sizes)) return false;

              return product.sizes.some(size => {
                // Handle both string format ["XS", "S", "M"] and object format [{size: "XS", available: true}]
                const sizeValue = typeof size === 'string' ? size : size.size;
                const isAvailable = typeof size === 'string' ? true : size.available;

                return sizeValue && isAvailable && filters[filterType].some(selectedSize =>
                  selectedSize && selectedSize.toLowerCase() === sizeValue.toLowerCase()
                );
              });
            case 'color':
              // Mock color filtering logic
              return true; // Simplified for demo
            case 'price':
              return filters[filterType].some(priceRange => {
                const priceInINR = convertUSDToINR(product.price || 0);
                switch (priceRange) {
                  case 'under-100':
                    return priceInINR < convertUSDToINR(100);
                  case '100-250':
                    return priceInINR >= convertUSDToINR(100) && priceInINR <= convertUSDToINR(250);
                  case '250-500':
                    return priceInINR >= convertUSDToINR(250) && priceInINR <= convertUSDToINR(500);
                  case '500-1000':
                    return priceInINR >= convertUSDToINR(500) && priceInINR <= convertUSDToINR(1000);
                  case 'over-1000':
                    return priceInINR > convertUSDToINR(1000);
                  default:
                    return true;
                }
              });
            case 'sustainability':
              return filters[filterType].length === 0 || product.sustainability;
            default:
              return true;
          }
        });
      }
    });

    console.log('Applied filters:', filters);
    console.log('Filtered products count:', filtered.length);
    setFilteredProducts(filtered);
  }, [filters, backendProducts]);

  const handleFilterChange = (filterType, value, checked) => {
    console.log('Filter change:', { filterType, value, checked });

    if (filterType === 'clear') {
      setFilters({
        category: [],
        size: [],
        color: [],
        price: [],
        sustainability: []
      });
      return;
    }

    setFilters(prev => ({
      ...prev,
      [filterType]: checked
        ? [...prev[filterType], value]
        : prev[filterType].filter(item => item !== value)
    }));
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Layout Container */}
      <div className="flex">
        {/* Filter Sidebar - Fixed positioning */}
        <div className="hidden lg:block">
          <FilterSidebar
            isOpen={true} // Always open on desktop
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Mobile Filter Sidebar - Overlay */}
        <div className="lg:hidden">
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Main Content - Takes remaining width */}
        <div className="flex-1 w-full">
          {/* Products Section */}
          <div className="pt-20">
            {/* Sort and View Controls */}
            <SortAndView
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onFilterToggle={toggleFilter}
              totalProducts={filteredProducts.length}
            />

            {/* Product Grid with proper spacing */}
            <div className="px-4 lg:px-6 pb-8 pt-6">
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading products...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{error}</p>
                  <button 
                    onClick={fetchProducts}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <ProductGrid
                  products={filteredProducts}
                  viewMode={viewMode}
                  sortBy={sortBy}
                />
              )}
            </div>
          </div>

          {/* Sustainability Info */}
          <SustainabilityInfo />
        </div>
      </div>
    </div>
  );
};

export default CollectionUniverse;
