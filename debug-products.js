#!/usr/bin/env node

import fetch from 'node-fetch';

const BACKEND_URL = 'http://localhost:8000';

async function debugProducts() {
  console.log('🔍 Debugging Products in Database...\n');
  
  try {
    // Get all products
    console.log('1. Fetching all products...');
    const response = await fetch(`${BACKEND_URL}/api/product/list`);
    const products = await response.json();
    
    console.log(`✅ Found ${products.length} products`);
    
    if (products.length > 0) {
      console.log('\n📋 Product Details:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   _id: ${product._id}`);
        console.log(`   id: ${product.id || 'undefined'}`);
        console.log(`   price: ₹${product.price}`);
        console.log('   ---');
      });
    }
    
    // Test wishlist endpoints
    console.log('\n2. Testing wishlist endpoints...');
    console.log('   (This will show if the endpoints are working)');
    
    // Test with a sample product ID
    if (products.length > 0) {
      const testProduct = products[0];
      console.log(`\n   Testing with product: ${testProduct.name} (ID: ${testProduct._id})`);
      
      // Note: This would require authentication, so just showing the structure
      console.log(`   Wishlist add URL: POST ${BACKEND_URL}/api/user/wishlist/add`);
      console.log(`   Body: { "productId": "${testProduct._id}" }`);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugProducts();