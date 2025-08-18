import React, { useState } from 'react';
import ProductCard from './ProductCard';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ProductGrid = ({ products, viewMode, sortBy }) => {
  const [visibleProducts, setVisibleProducts] = useState(12);
  
  const loadMore = () => {
    setVisibleProducts(prev => prev + 12);
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'popular':
        return b.popularity - a.popularity;
      default:
        return 0;
    }
  });

  const displayedProducts = sortedProducts.slice(0, visibleProducts);

  const gridClasses = {
    grid: 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
    masonry: 'columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6',
    list: 'space-y-6'
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Icon name="Search" size={48} className="text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-muted-foreground">
          Showing {displayedProducts.length} of {products.length} products
        </p>
      </div>

      {/* Product Grid */}
      <div className={gridClasses[viewMode]}>
        {displayedProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            viewMode={viewMode}
            index={index}
          />
        ))}
      </div>

      {/* Load More */}
      {visibleProducts < products.length && (
        <div className="flex justify-center pt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            iconName="Plus"
            iconPosition="left"
          >
            Load More Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
