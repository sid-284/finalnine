import dotenv from 'dotenv';
import razorpay from 'razorpay';

dotenv.config();

const testRazorpay = async () => {
  try {
    console.log('Testing Razorpay configuration...');
    console.log('Key ID:', process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing');
    console.log('Key Secret:', process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing');
    
    const razorpayInstance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    
    // Test creating a minimal order
    const testOrder = await razorpayInstance.orders.create({
      amount: 100, // 1 rupee in paise
      currency: 'INR',
      receipt: 'test_order_' + Date.now()
    });
    
    console.log('Razorpay test order created successfully:', testOrder.id);
    console.log('Razorpay configuration is working!');
    
  } catch (error) {
    console.error('Razorpay test failed:', error);
  }
};

testRazorpay(); 