import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { convertUSDToINR, formatINR } from '../../../utils/currency';

const OrderSummary = ({ cartItems, shippingMethod, onShippingChange, promoCode, onPromoApply }) => {
  const [promoInput, setPromoInput] = useState('');
  const [giftOptions, setGiftOptions] = useState({
    isGift: false,
    message: '',
    packaging: 'standard'
  });

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = promoCode ? subtotal * 0.1 : 0; // 10% discount example
  const shipping = shippingMethod?.price || 0;
  const tax = (subtotal - discount + shipping) * 0.08; // 8% tax
  const total = subtotal - discount + shipping + tax;

  const shippingOptions = [
    { 
      value: 'standard', 
      label: 'Standard Shipping (5-7 business days)', 
      price: 0,
      description: `Free shipping on orders over ${formatINR(convertUSDToINR(100))}`
    }
  ];

  const packagingOptions = [
    { value: 'standard', label: 'Standard Packaging' },
    { value: 'premium', label: `Premium Gift Box (+${formatINR(convertUSDToINR(5.99))})` },
    { value: 'sustainable', label: `Eco-Friendly Packaging (+${formatINR(convertUSDToINR(2.99))})` }
  ];

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    onPromoApply(promoInput);
    setPromoInput('');
  };

  const handleGiftOptionChange = (field, value) => {
    setGiftOptions(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-card rounded-lg p-6 card-elevation sticky top-24">
      <h2 className="text-xl font-serif font-semibold text-foreground mb-6">Order Summary</h2>

      {/* Shipping Options */}
      <div className="space-y-4 mb-6">
        <h3 className="font-medium text-foreground">Shipping Method</h3>
        <div className="space-y-3">
          {shippingOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                shippingMethod?.value === option.value
                  ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
              }`}
            >
              <input
                type="radio"
                name="shipping"
                value={option.value}
                checked={shippingMethod?.value === option.value}
                onChange={() => onShippingChange(option)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-foreground">{option.label}</span>
                  <span className="font-semibold text-foreground">
                    {option.price === 0 ? 'Free' : formatINR(option.price)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Promo Code */}
      <div className="mb-6">
        <form onSubmit={handlePromoSubmit} className="flex gap-2">
          <Input
            placeholder="Enter promo code"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="outline" size="default">
            Apply
          </Button>
        </form>
        {promoCode && (
          <div className="mt-2 p-2 bg-success/10 rounded text-sm text-success flex items-center gap-2">
            <Icon name="Check" size={14} />
            Promo code "{promoCode}" applied
          </div>
        )}
      </div>

      {/* Gift Options */}
      <div className="space-y-4 mb-6 p-4 bg-muted/30 rounded-lg">
        <Checkbox
          label="This is a gift"
          checked={giftOptions.isGift}
          onChange={(e) => handleGiftOptionChange('isGift', e.target.checked)}
        />

        {giftOptions.isGift && (
          <div className="space-y-4 mt-4">
            <Input
              label="Gift Message (optional)"
              value={giftOptions.message}
              onChange={(e) => handleGiftOptionChange('message', e.target.value)}
              placeholder="Write a personal message..."
              description="Maximum 200 characters"
            />

            <Select
              label="Gift Packaging"
              options={packagingOptions}
              value={giftOptions.packaging}
              onChange={(value) => handleGiftOptionChange('packaging', value)}
            />
          </div>
        )}
      </div>

      {/* Order Breakdown */}
      <div className="space-y-3 pb-4 border-b border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
          <span className="text-foreground">{formatINR(convertUSDToINR(subtotal))}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="text-success">-{formatINR(convertUSDToINR(discount))}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-foreground">
            {shipping === 0 ? 'Free' : formatINR(convertUSDToINR(shipping))}
          </span>
        </div>

        {giftOptions.isGift && giftOptions.packaging !== 'standard' && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Gift Packaging</span>
            <span className="text-foreground">
              {formatINR(convertUSDToINR(giftOptions.packaging === 'premium' ? 5.99 : 2.99))}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Gst</span>
          <span className="text-foreground">{formatINR(convertUSDToINR(tax))}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 mb-6">
        <span className="text-lg font-semibold text-foreground">Total</span>
        <span className="text-xl font-bold text-foreground">{formatINR(convertUSDToINR(total))}</span>
      </div>

      {/* Trust Signals */}
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Icon name="RotateCcw" size={16} className="text-success" />
          <span>Free returns within 30 days</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span>2-year warranty included</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Headphones" size={16} className="text-success" />
          <span>24/7 customer support</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Leaf" size={16} className="text-success" />
          <span>Carbon-neutral shipping</span>
        </div>
      </div>

      {/* Customer Service */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-2">Need help?</p>
        <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 p-0">
          <Icon name="MessageCircle" size={16} className="mr-2" />
          Chat with us
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;