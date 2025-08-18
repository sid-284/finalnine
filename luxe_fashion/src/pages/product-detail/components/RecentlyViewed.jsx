import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import { convertUSDToINR, formatINR } from '../../../utils/currency';
import Button from '../../../components/ui/Button';

const RecentlyViewed = ({ products }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-semibold text-foreground">Recently Viewed</h3>
        <Button variant="ghost" size="sm">
          <span className="text-accent">Clear All</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="relative bg-muted rounded-lg overflow-hidden mb-3">
              <Image
                src={product.image}
                alt={product.name}
                className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button className="absolute top-2 right-2 w-6 h-6 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Icon name="Heart" size={12} />
              </button>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
              <h4 className="text-sm font-medium text-foreground mb-1 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                {product.name}
              </h4>
                              <p className="text-sm font-semibold text-foreground">{formatINR(convertUSDToINR(product.price))}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;