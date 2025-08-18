import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import { convertUSDToINR, formatINR } from '../../../utils/currency';
import Button from '../../../components/ui/Button';

const CartReview = ({ cartItems, onUpdateQuantity, onRemove, onAddStyling }) => {
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="bg-card rounded-lg p-6 card-elevation">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif font-semibold text-foreground">Your Cart</h2>
        <span className="text-sm text-muted-foreground">{cartItems.length} items</span>
      </div>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 pb-6 border-b border-border last:border-b-0 last:pb-0">
            <div className="w-20 h-24 rounded-lg overflow-hidden bg-muted">
              <Image
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.brand}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(item.id, item.size, item.color)}
                  className="text-muted-foreground hover:text-error"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span>Size: {item.size}</span>
                <span>Color: {item.color && item.color.name ? item.color.name : (typeof item.color === 'string' ? item.color : '')}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8"
                  >
                    <Icon name="Minus" size={14} />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                    className="w-8 h-8"
                  >
                    <Icon name="Plus" size={14} />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{formatINR(convertUSDToINR(item.price * item.quantity))}</p>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <p className="text-xs text-muted-foreground line-through">
                      {formatINR(convertUSDToINR(item.originalPrice * item.quantity))}
                    </p>
                  )}
                </div>
              </div>

              {item.stylingOptions && (
                <div className="mt-3 pt-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddStyling(item.id)}
                    className="text-accent hover:text-accent/80"
                  >
                    <Icon name="Palette" size={14} className="mr-2" />
                    Add styling suggestions
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Subtotal</span>
          <span>₹{calculateSubtotal().toFixed(2)}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Shipping and taxes calculated at checkout
        </p>
      </div>
    </div>
  );
};

export default CartReview;