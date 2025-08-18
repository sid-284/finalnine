import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { convertUSDToINR, formatINR } from '../../../utils/currency';
import Image from '../../../components/AppImage';

const OrderConfirmation = ({ orderData, onContinueShopping }) => {
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Check" size={32} className="text-success" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order #{orderData.orderNumber} has been confirmed.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-card rounded-lg p-6 card-elevation mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-serif font-semibold text-foreground mb-1">
              Order #{orderData.orderNumber}
            </h2>
            <p className="text-sm text-muted-foreground">
              Placed on {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Icon name="Download" size={16} className="mr-2" />
            Download Receipt
          </Button>
        </div>

        {/* Delivery Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium text-foreground mb-3">Delivery Information</h3>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">Estimated Delivery</p>
              <p className="font-medium text-foreground">
                {estimatedDelivery.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Icon name="MapPin" size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground">
                  {orderData.shippingAddress.address}, {orderData.shippingAddress.city}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-3">Payment Method</h3>
            <div className="flex items-center gap-3">
              <Icon name="CreditCard" size={20} className="text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium text-foreground">•••• •••• •••• {orderData.payment.last4}</p>
                <p className="text-muted-foreground">{orderData.payment.brand} ending in {orderData.payment.last4}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Items Ordered</h3>
          {orderData.items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="w-16 h-20 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{item.name}</h4>
                <p className="text-sm text-muted-foreground">{item.brand}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span>Size: {item.size}</span>
                  <span>Qty: {item.quantity}</span>
                  <span className="font-semibold text-foreground">{formatINR(convertUSDToINR(item.price * item.quantity))}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Total */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-foreground">Total Paid</span>
            <span className="text-xl font-bold text-foreground">₹{orderData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Care Instructions & Styling Tips */}
      <div className="bg-card rounded-lg p-6 card-elevation mb-6">
        <h3 className="font-serif font-semibold text-foreground mb-4">Care Instructions & Styling Tips</h3>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <Icon name="Droplets" size={20} className="text-accent mt-1" />
            <div>
              <h4 className="font-medium text-foreground">Care Instructions</h4>
              <p className="text-sm text-muted-foreground">
                Machine wash cold with like colors. Tumble dry low. Do not bleach. Iron on low heat if needed.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Icon name="Palette" size={20} className="text-accent mt-1" />
            <div>
              <h4 className="font-medium text-foreground">Styling Suggestions</h4>
              <p className="text-sm text-muted-foreground">
                Pair with neutral accessories for a timeless look. Layer with our signature blazers for professional settings.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Icon name="Star" size={20} className="text-accent mt-1" />
            <div>
              <h4 className="font-medium text-foreground">Exclusive Content</h4>
              <p className="text-sm text-muted-foreground">
                Access our styling masterclass and seasonal lookbooks in your account dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-card rounded-lg p-6 card-elevation mb-6">
        <h3 className="font-serif font-semibold text-foreground mb-4">What's Next?</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Icon name="Mail" size={20} className="text-accent" />
            <div>
              <p className="font-medium text-foreground">Order Confirmation Email</p>
              <p className="text-sm text-muted-foreground">Sent to {orderData.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Icon name="Package" size={20} className="text-accent" />
            <div>
              <p className="font-medium text-foreground">Shipping Notification</p>
              <p className="text-sm text-muted-foreground">You'll receive tracking info when your order ships</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Icon name="MessageCircle" size={20} className="text-accent" />
            <div>
              <p className="font-medium text-foreground">Customer Support</p>
              <p className="text-sm text-muted-foreground">Available 24/7 for any questions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="default"
          size="lg"
          onClick={onContinueShopping}
          className="flex-1"
        >
          Continue Shopping
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
        >
          <Icon name="User" size={16} className="mr-2" />
          View Order Status
        </Button>
      </div>

      {/* Customer Service Contact */}
      <div className="text-center mt-8 p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">Questions about your order?</p>
        <div className="flex justify-center gap-4">
          <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
            <Icon name="MessageCircle" size={16} className="mr-2" />
            Live Chat
          </Button>
          <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
            <Icon name="Phone" size={16} className="mr-2" />
            Call Us
          </Button>
          <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
            <Icon name="Mail" size={16} className="mr-2" />
            Email Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;