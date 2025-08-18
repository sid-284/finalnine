#!/usr/bin/env node

import fetch from 'node-fetch';

const BACKEND_URL = 'http://localhost:8000';

async function testAdminAuth() {
  console.log('🧪 Testing Admin Authentication...\n');
  
  try {
    // Test 1: Check if server is running
    console.log('1. Testing server health...');
    const healthResponse = await fetch(`${BACKEND_URL}/api/health`);
    if (healthResponse.ok) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server is not responding');
      return;
    }
    
    // Test 2: Test admin login
    console.log('\n2. Testing admin login...');
    const loginResponse = await fetch(`${BACKEND_URL}/api/auth/adminlogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin_9twoofficialinfo',
        password: 'admin921992'
      })
    });
    
    console.log('Admin login response status:', loginResponse.status);
    
    if (loginResponse.ok) {
      console.log('✅ Admin login successful');
      
      // Get cookies from response
      const cookies = loginResponse.headers.get('set-cookie');
      console.log('Cookies received:', cookies ? 'Yes' : 'No');
      
      // Test 3: Test admin access to product list
      console.log('\n3. Testing admin access to products...');
      const productsResponse = await fetch(`${BACKEND_URL}/api/product/list`, {
        headers: {
          'Cookie': cookies || ''
        }
      });
      
      console.log('Products response status:', productsResponse.status);
      if (productsResponse.ok) {
        const products = await productsResponse.json();
        console.log(`✅ Found ${products.length} products`);
      }
      
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Admin login failed:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminAuth(); 