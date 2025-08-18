import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CartReview from './components/CartReview';
import CheckoutForm from './components/CheckoutForm';
import PaymentSection from './components/PaymentSection';
import OrderSummary from './components/OrderSummary';
import OrderConfirmation from './components/OrderConfirmation';
import ProgressIndicator from './components/ProgressIndicator';
import { useCart } from '../../context/CartContext';

const CheckoutExperience = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGuest, setIsGuest] = useState(true);
  const [shippingMethod, setShippingMethod] = useState({ value: 'standard', label: 'Standard Shipping', price: 0 });
  const [promoCode, setPromoCode] = useState('');
  const [orderData, setOrderData] = useState(null);
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();

  const steps = [
    { id: 'cart', title: 'Cart Review', subtitle: 'Verify your items' },
    { id: 'shipping', title: 'Shipping', subtitle: 'Delivery information' },
    { id: 'payment', title: 'Payment', subtitle: 'Secure checkout' },
    { id: 'confirmation', title: 'Confirmation', subtitle: 'Order complete' }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log('Checkout page loaded');
    console.log('Current cart:', cart);
    console.log('Cart length:', cart.length);
    console.log('Current step:', currentStep);
    
    // Redirect if cart is empty
    if (cart.length === 0) {
      console.log('Cart is empty, redirecting to collections');
      navigate('/collection-universe');
    }
  }, [currentStep, cart, navigate]);

  const handleUpdateQuantity = (itemId, newQuantity, size, color) => {
    updateQuantity(itemId, size, color, newQuantity);
  };

  const handleRemoveItem = (itemId, size, color) => {
    removeFromCart(itemId, size, color);
  };

  const handleAddStyling = (itemId) => {
    // In a real app, this would open styling suggestions
    console.log(`Add styling suggestions for item ${itemId}`);
  };

  const handleShippingSubmit = (formData) => {
    console.log('Shipping form submitted:', formData);
    console.log('Current cart:', cart);
    console.log('Cart length:', cart.length);
    setCurrentStep(3);
  };

  const handlePaymentSubmit = (paymentData) => {
    console.log('Payment submitted:', paymentData);
    // Simulate order processing
    const newOrderData = {
      orderNumber: `LF${Date.now().toString().slice(-6)}`,
      email: 'customer@example.com',
      items: cart,
      total: calculateTotal(),
      shippingAddress: {
        address: '123 Main Street',
        city: 'New York'
      },
      payment: {
        brand: 'Visa',
        last4: '4242'
      }
    };
    console.log('Order data created:', newOrderData);
    clearCart();
    setOrderData(newOrderData);
    setCurrentStep(4);
  };

  const handlePromoApply = (code) => {
    if (code.toLowerCase() === 'welcome10') {
      setPromoCode(code);
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = promoCode ? subtotal * 0.1 : 0;
    const shipping = shippingMethod.price;
    const tax = (subtotal - discount + shipping) * 0.08;
    return subtotal - discount + shipping + tax;
  };

  const handleContinueShopping = () => {
    navigate('/collection-universe');
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (currentStep === 4 && orderData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <OrderConfirmation 
              orderData={orderData}
              onContinueShopping={handleContinueShopping}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              Secure Checkout
            </h1>
            <p className="text-muted-foreground">
              Complete your purchase with confidence
            </p>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator currentStep={currentStep} steps={steps} />

          {/* Back Button */}
          {currentStep > 1 && (
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={handleBackStep}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Back to {steps[currentStep - 2]?.title}
              </Button>
            </div>
          )}

          {/* Checkout Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {currentStep === 1 && (
                <div>
                  <CartReview
                    cartItems={cart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    onAddStyling={handleAddStyling}
                  />
                  <div className="mt-6">
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => setCurrentStep(2)}
                      className="w-full sm:w-auto"
                      disabled={cart.length === 0}
                    >
                      Continue to Shipping
                      <Icon name="ArrowRight" size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <CheckoutForm
                  onSubmit={handleShippingSubmit}
                  isGuest={isGuest}
                  onToggleGuest={() => setIsGuest(!isGuest)}
                />
              )}

              {currentStep === 3 && (
                <PaymentSection
                  onPaymentSubmit={handlePaymentSubmit}
                  orderTotal={calculateTotal()}
                  cartItems={cart}
                  shippingAddress={{ address: '123 Main Street', city: 'New York' }}
                />
              )}
            </div>

            {/* Order Summary Sidebar */}
            {currentStep < 4 && (
              <div className="lg:col-span-1">
                <OrderSummary
                  cartItems={cart}
                  shippingMethod={shippingMethod}
                  onShippingChange={setShippingMethod}
                  promoCode={promoCode}
                  onPromoApply={handlePromoApply}
                />
              </div>
            )}
          </div>

          {/* Trust Signals Footer */}
          {currentStep < 4 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <Icon name="Shield" size={24} className="text-success mb-2" />
                  <h3 className="font-medium text-foreground mb-1">Secure Payment</h3>
                  <p className="text-sm text-muted-foreground">SSL encrypted checkout</p>
                </div>
                <div className="flex flex-col items-center">
                  <Icon name="RotateCcw" size={24} className="text-success mb-2" />
                  <h3 className="font-medium text-foreground mb-1">Easy Returns</h3>
                  <p className="text-sm text-muted-foreground">30-day return policy</p>
                </div>
                <div className="flex flex-col items-center">
                  <Icon name="Truck" size={24} className="text-success mb-2" />
                  <h3 className="font-medium text-foreground mb-1">Fast Shipping</h3>
                  <p className="text-sm text-muted-foreground">Free on orders ₹8,300+</p>
                </div>
                <div className="flex flex-col items-center">
                  <Icon name="Headphones" size={24} className="text-success mb-2" />
                  <h3 className="font-medium text-foreground mb-1">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">Always here to help</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer with Security Info */}
      
    </div>
  );
};

export default CheckoutExperience;
