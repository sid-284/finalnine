#!/usr/bin/env node

import fetch from 'node-fetch';

const BACKEND_URL = 'http://localhost:8000';

async function checkBackend() {
  console.log('🔍 Checking Backend Status...\n');
  
  try {
    // Check health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BACKEND_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Check auth test endpoint
    console.log('\n2. Testing auth test endpoint...');
    const authResponse = await fetch(`${BACKEND_URL}/api/auth/test-users`);
    const authData = await authResponse.json();
    console.log('✅ Auth test:', authData);
    
    console.log('\n🎉 Backend is working correctly!');
    
  } catch (error) {
    console.error('❌ Backend check failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure your backend is running: cd backend && npm run dev');
    console.log('2. Check if port 8000 is available');
    console.log('3. Verify your .env file has all required variables');
    console.log('4. Check MongoDB connection');
  }
}

checkBackend(); 