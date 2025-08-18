import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { convertUSDToINR, formatINR } from '../../../utils/currency';

const StyleThis = ({ recommendations }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-semibold text-foreground">Style This</h3>
        <Button variant="ghost" size="sm">
          <span className="text-accent">View All</span>
          <Icon name="ArrowRight" size={16} className="ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="relative bg-muted rounded-lg overflow-hidden mb-3">
              <Image
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Icon name="Heart" size={16} />
              </button>
              <div className="absolute bottom-3 left-3 right-3">
                <Button
                  variant="default"
                  size="sm"
                  fullWidth
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  Quick Add
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{item.brand}</p>
              <h4 className="font-medium text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                {item.name}
              </h4>
              <p className="text-sm font-semibold text-foreground">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Outfit Combinations */}
      <div className="mt-8 pt-6 border-t border-border">
        <h4 className="font-medium text-foreground mb-4">Complete the Look</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 2).map((outfit, index) => (
            <div key={index} className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex -space-x-2">
                  {outfit.items?.slice(0, 3).map((item, itemIndex) => (
                    <div key={itemIndex} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-medium text-foreground">Outfit {index + 1}</p>
                  <p className="text-sm text-muted-foreground">3 items</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Total: {formatINR(convertUSDToINR(outfit.totalPrice || (outfit.price * 3)))}
                </span>
                <Button variant="outline" size="sm">
                  Add All
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StyleThis;