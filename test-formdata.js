#!/usr/bin/env node

import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

const BACKEND_URL = 'http://localhost:8000';

async function testFormData() {
  console.log('🧪 Testing FormData Upload...\n');
  
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
    
    // Test 2: Test FormData without files
    console.log('\n2. Testing FormData without files...');
    const formData = new FormData();
    formData.append('name', 'Test Product');
    formData.append('price', '100');
    formData.append('description', 'Test description');
    formData.append('category', 'Test');
    formData.append('subCategory', 'Test Sub');
    formData.append('sizes', '["XS", "S", "M", "L", "XL"]');
    formData.append('bestseller', 'false');
    
    const response = await fetch(`${BACKEND_URL}/api/product/addproduct`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type - let FormData set it
    });
    
    console.log('FormData response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    } else {
      console.log('✅ FormData upload successful');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFormData(); 