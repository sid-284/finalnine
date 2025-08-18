#!/usr/bin/env node

import fetch from 'node-fetch';

const BACKEND_URL = 'http://localhost:8000';

// This is a test script to debug wishlist functionality
async function testWishlist() {
  console.log('🔍 Testing Wishlist Functionality...\n');
  
  try {
    // First, let's check if there are any products in the database
    console.log('1. Checking available products...');
    const productsResponse = await fetch(`${BACKEND_URL}/api/product/list`);
    const products = await productsResponse.json();
    console.log(`✅ Found ${products.length} products`);
    
    if (products.length > 0) {
      const firstProduct = products[0];
      console.log(`   First product: ${firstProduct.name} (ID: ${firstProduct._id})`);
    }
    
    // Check if there are any users
    console.log('\n2. Checking users...');
    const usersResponse = await fetch(`${BACKEND_URL}/api/auth/test-users`);
    const users = await usersResponse.json();
    console.log(`✅ Found ${users.count} users`);
    
    if (users.users.length > 0) {
      console.log('   Users:', users.users.map(u => ({ name: u.name, email: u.email })));
    }
    
    console.log('\n📝 Manual Testing Steps:');
    console.log('1. Make sure you are logged in to the frontend');
    console.log('2. Go to a product page and click the heart icon');
    console.log('3. Check the browser console for any errors');
    console.log('4. Go to the wishlist page to see if the item appears');
    console.log('5. If it doesn\'t work, check the backend logs for errors');
    
    console.log('\n🔧 Debugging Tips:');
    console.log('- Check if the user is properly authenticated (backendAuthenticated should be true)');
    console.log('- Verify that the product ID is being sent correctly');
    console.log('- Check if the wishlist is being saved to both backend and localStorage');
    console.log('- Make sure the wishlist page is fetching from the correct source');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWishlist(); 