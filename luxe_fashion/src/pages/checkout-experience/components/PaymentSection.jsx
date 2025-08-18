import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { apiFetch } from '../../../utils/api';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentSection = ({ onPaymentSubmit, orderTotal, cartItems, shippingAddress }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    name: '',
  });
  const [installmentPlan, setInstallmentPlan] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'CreditCard' },
    { id: 'paypal', name: 'PayPal', icon: 'Wallet' },
    { id: 'apple', name: 'Apple Pay', icon: 'Smartphone' },
    { id: 'google', name: 'Google Pay', icon: 'Smartphone' },
    { id: 'upi', name: 'UPI', icon: 'Smartphone' },
    { id: 'gift', name: 'Gift Card', icon: 'Gift' }
  ];

  const installmentOptions = [
    { value: '', label: 'Pay in full' },
    { value: '3', label: `3 payments of ₹${(orderTotal / 3).toFixed(2)}` },
    { value: '6', label: `6 payments of ₹${(orderTotal / 6).toFixed(2)}` },
    { value: '12', label: `12 payments of ₹${(orderTotal / 12).toFixed(2)}` }
  ];

  const validatePayment = () => {
    const newErrors = {};
    if (paymentMethod === 'card') {
      if (!cardData.name) newErrors.name = 'Cardholder name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardInputChange = (field, value) => {
    setCardData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!validatePayment()) return;
    setLoading(true);
    // Razorpay integration
    try {
      console.log('Loading Razorpay script...');
      await loadRazorpayScript();
      console.log('Razorpay script loaded successfully');
      
      console.log('Creating order on backend...');
      console.log('Order data:', {
        items: cartItems,
        amount: orderTotal,
        address: shippingAddress,
        paymentMethod: paymentMethod
      });
      
      // Create order on backend
      const order = await apiFetch('/order/razorpay', {
        method: 'POST',
        body: JSON.stringify({
          items: cartItems,
          amount: orderTotal,
          address: shippingAddress,
          paymentMethod: paymentMethod
        }),
      });
      
      console.log('Backend order created:', order);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID', // Use environment variable
        amount: Math.round(orderTotal * 100), // Convert to paise and ensure it's an integer
        currency: 'INR',
        name: 'Luxe Fashion',
        description: 'Order Payment',
        order_id: order.id,
        
        // Enable all payment methods
        config: {
          display: {
            blocks: {
              banks: {
                name: "Pay using UPI",
                instruments: [
                  {
                    method: "upi"
                  }
                ]
              },
              gpay: {
                name: "Pay using",
                instruments: [
                  {
                    method: "gpay"
                  }
                ]
              },
              other: {
                name: "Other Payment methods",
                instruments: [
                  {
                    method: "card"
                  },
                  {
                    method: "netbanking"
                  },
                  {
                    method: "wallet"
                  }
                ]
              }
            },
            sequence: ["block.banks", "block.gpay", "block.other"],
            preferences: {
              show_default_blocks: false
            }
          }
        },
        
        // UPI specific configuration
        upi: {
          flow: 'collect',
          vpa: 'suhas855@oksbi'
        },
        
        // Google Pay configuration
        gpay: {
          flow: 'intent'
        },
        
        // Prefill customer details
        prefill: {
          name: cardData.name,
          email: 'customer@example.com',
          contact: '+919999999999'
        },
        
        // Notes for the order
        notes: {
          address: 'Luxe Fashion Store',
          merchant_order_id: order.id
        },
        
        // Theme configuration
        theme: {
          color: '#D4AF37',
          backdrop_color: '#000000'
        },
        
        // Handler for payment success
        handler: async function (response) {
          try {
            await apiFetch('/order/verifyrazorpay', {
              method: 'POST',
              body: JSON.stringify({ razorpay_order_id: response.razorpay_order_id }),
            });
            onPaymentSubmit({ method: 'razorpay', paymentId: response.razorpay_payment_id });
          } catch (err) {
            setErrorMsg('Payment verification failed.');
          }
          setLoading(false);
        },
        
        // Modal configuration
        modal: {
          ondismiss: function() {
            setLoading(false);
          },
          confirm_close: true,
          escape: false
        },
        
        // Enable all payment methods
        method: {
          upi: {
            flow: 'collect',
            vpa: 'suhas855@oksbi'
          },
          card: {
            name: 'Credit/Debit Card'
          },
          netbanking: {
            name: 'Net Banking'
          },
          wallet: {
            name: 'Wallet'
          },
          gpay: {
            flow: 'intent'
          }
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      if (err.message && err.message.includes('Razorpay')) {
        setErrorMsg('Payment gateway error. Please check your Razorpay configuration.');
      } else if (err.message && err.message.includes('order')) {
        setErrorMsg('Failed to create payment order. Please try again.');
      } else {
        setErrorMsg('Payment failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 card-elevation">
      <h2 className="text-xl font-serif font-semibold text-foreground mb-6">Payment Method</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                paymentMethod === method.id
                  ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <Icon name={method.icon} size={20} className="text-muted-foreground" />
              <span className="font-medium text-foreground">{method.name}</span>
              {paymentMethod === method.id && (
                <Icon name="Check" size={16} className="text-accent ml-auto" />
              )}
            </label>
          ))}
        </div>
        {paymentMethod === 'card' && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <Input
              label="Cardholder Name"
              value={cardData.name}
              onChange={(e) => handleCardInputChange('name', e.target.value)}
              error={errors.name}
              placeholder="John Doe"
              required
            />
          </div>
        )}
        {/* Security Features */}
        <div className="space-y-3 p-4 bg-success/5 rounded-lg border border-success/20">
          <div className="flex items-center gap-3">
            <Icon name="Shield" size={20} className="text-success" />
            <div>
              <p className="font-medium text-foreground">Secure Payment</p>
              <p className="text-sm text-muted-foreground">256-bit SSL encryption protects your data</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Icon name="Lock" size={20} className="text-success" />
            <div>
              <p className="font-medium text-foreground">PCI Compliant</p>
              <p className="text-sm text-muted-foreground">Your payment information is never stored</p>
            </div>
          </div>
        </div>
        {errorMsg && <div className="text-error text-sm text-center">{errorMsg}</div>}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          className="mt-6"
          loading={loading}
        >
          <Icon name="Lock" size={16} className="mr-2" />
          Pay with Razorpay - ₹{orderTotal.toFixed(2)}
        </Button>
      </form>
    </div>
  );
};

export default PaymentSection;