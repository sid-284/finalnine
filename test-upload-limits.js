#!/usr/bin/env node

import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

const BACKEND_URL = 'http://localhost:8000';

async function testUploadLimits() {
  console.log('🧪 Testing Upload Limits...\n');
  
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
    
    // Test 2: Test with a small payload
    console.log('\n2. Testing small payload...');
    const smallData = {
      name: 'Test Product',
      price: 100,
      description: 'Test description',
      category: 'Test'
    };
    
    const smallResponse = await fetch(`${BACKEND_URL}/api/product/addproduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(smallData)
    });
    
    console.log('Small payload response status:', smallResponse.status);
    
    // Test 3: Test with a large payload (should fail)
    console.log('\n3. Testing large payload...');
    const largeData = {
      name: 'Test Product',
      price: 100,
      description: 'A'.repeat(1000000), // 1MB of data
      category: 'Test'
    };
    
    const largeResponse = await fetch(`${BACKEND_URL}/api/product/addproduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(largeData)
    });
    
    console.log('Large payload response status:', largeResponse.status);
    
    console.log('\n📋 Upload Limits Summary:');
    console.log('- JSON payload limit: 50MB');
    console.log('- File size limit: 10MB per file');
    console.log('- Maximum files: 10');
    console.log('- Supported file types: Images only');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testUploadLimits(); 