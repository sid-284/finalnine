import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CheckoutForm = ({ onSubmit, isGuest, onToggleGuest }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
    deliveryInstructions: '',
    createAccount: false,
    saveInfo: false,
    newsletter: false
  });

  const [errors, setErrors] = useState({});

  const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' }
  ];

  const stateOptions = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' },
    { value: 'IL', label: 'Illinois' },
    { value: 'PA', label: 'Pennsylvania' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('CheckoutForm submit clicked');
    console.log('Form data:', formData);
    console.log('Form validation result:', validateForm());
    if (validateForm()) {
      console.log('Form is valid, calling onSubmit');
      onSubmit(formData);
    } else {
      console.log('Form validation failed');
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 card-elevation">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif font-semibold text-foreground">
          {isGuest ? 'Guest Checkout' : 'Shipping Information'}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleGuest}
          className="text-accent hover:text-accent/80"
        >
          {isGuest ? 'Create Account' : 'Guest Checkout'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Contact Information</h3>
          
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder="your@email.com"
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors.phone}
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>

        {/* Shipping Address */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Shipping Address</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              error={errors.firstName}
              placeholder="John"
              required
            />

            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              error={errors.lastName}
              placeholder="Doe"
              required
            />
          </div>

          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            error={errors.address}
            placeholder="123 Main Street"
            required
          />

          <Input
            label="Apartment, suite, etc. (optional)"
            value={formData.apartment}
            onChange={(e) => handleInputChange('apartment', e.target.value)}
            placeholder="Apt 4B"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              error={errors.city}
              placeholder="New York"
              required
            />

            <Input
              label="State"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              error={errors.state}
              placeholder="Enter state"
              required
            />

            <Input
              label="ZIP Code"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              error={errors.zipCode}
              placeholder="10001"
              required
            />
          </div>

          <Input
            label="Country"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            placeholder="Enter country"
            required
          />
        </div>

        {/* Delivery Instructions */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Delivery Preferences</h3>
          
          <Input
            label="Delivery Instructions (optional)"
            value={formData.deliveryInstructions}
            onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
            placeholder="Leave at front door, ring doorbell, etc."
            description="Help our delivery team find you"
          />
        </div>

        {/* Account Options */}
        {isGuest && (
          <div className="space-y-3 pt-4 border-t border-border">
            <Checkbox
              label="Create an account for faster checkout next time"
              checked={formData.createAccount}
              onChange={(e) => handleInputChange('createAccount', e.target.checked)}
              description="Save your information for future purchases"
            />
          </div>
        )}

        <div className="space-y-3">
          <Checkbox
            label="Save this information for next time"
            checked={formData.saveInfo}
            onChange={(e) => handleInputChange('saveInfo', e.target.checked)}
          />

          <Checkbox
            label="Email me with news and offers"
            checked={formData.newsletter}
            onChange={(e) => handleInputChange('newsletter', e.target.checked)}
            description="Be the first to know about new collections and exclusive offers"
          />
        </div>

        {/* Trust Signals */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <Icon name="Shield" size={20} className="text-success" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Secure Checkout</p>
            <p className="text-muted-foreground">Your information is protected with SSL encryption</p>
          </div>
        </div>

        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          className="mt-6"
        >
          Continue to Payment
        </Button>
        
        {/* Test button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          fullWidth
          className="mt-2"
          onClick={() => {
            console.log('Test button clicked');
            alert('Test button works!');
          }}
        >
          Test Button
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;