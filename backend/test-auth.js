import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const testAuth = async () => {
  try {
    console.log('Testing authentication system...');
    
    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing from environment variables');
      return;
    }
    console.log('JWT_SECRET is configured');
    
    // Test token generation
    const testUserId = 'test_user_id_123';
    const token = jwt.sign({ userId: testUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Test token generated successfully');
    
    // Test token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully:', decoded);
    
    if (decoded.userId === testUserId) {
      console.log('✅ Authentication system is working correctly!');
    } else {
      console.error('❌ Token verification failed - userId mismatch');
    }
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
  }
};

testAuth();
