#!/usr/bin/env node

// Comprehensive CORS test script
const https = require('https');

const testOrigin = 'https://www.9tytwooffical.com';
const baseUrl = 'https://finalnine.onrender.com';

const testEndpoints = [
  '/api/public-test',
  '/api/raw-cors-test',
  '/api/cors-test',
  '/api/health'
];

console.log('🔍 COMPREHENSIVE CORS TEST');
console.log('==========================');
console.log(`Testing origin: ${testOrigin}`);
console.log(`Base URL: ${baseUrl}`);
console.log('');

// Test function
async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    console.log(`📡 Testing: ${endpoint}`);
    
    const req = https.get(`${baseUrl}${endpoint}`, {
      headers: {
        'Origin': testOrigin,
        'User-Agent': 'CORS-Test-Script/1.0'
      }
    }, (res) => {
      console.log(`  Status: ${res.statusCode}`);
      console.log(`  CORS Headers:`);
      console.log(`    Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin'] || 'NOT SET'}`);
      console.log(`    Access-Control-Allow-Credentials: ${res.headers['access-control-allow-credentials'] || 'NOT SET'}`);
      console.log(`    Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods'] || 'NOT SET'}`);
      console.log(`    Access-Control-Allow-Headers: ${res.headers['access-control-allow-headers'] || 'NOT SET'}`);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`  Response: ${jsonData.message || 'No message'}`);
        } catch (e) {
          console.log(`  Response: ${data.substring(0, 100)}...`);
        }
        console.log('');
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.log(`  ❌ Error: ${err.message}`);
      console.log('');
      resolve();
    });
    
    req.setTimeout(10000, () => {
      console.log('  ⏰ Timeout');
      console.log('');
      req.destroy();
      resolve();
    });
  });
}

// Test preflight request
async function testPreflight(endpoint) {
  return new Promise((resolve) => {
    console.log(`🔄 Testing preflight for: ${endpoint}`);
    
    const req = https.request(`${baseUrl}${endpoint}`, {
      method: 'OPTIONS',
      headers: {
        'Origin': testOrigin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    }, (res) => {
      console.log(`  Status: ${res.statusCode}`);
      console.log(`  CORS Headers:`);
      console.log(`    Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin'] || 'NOT SET'}`);
      console.log(`    Access-Control-Allow-Credentials: ${res.headers['access-control-allow-credentials'] || 'NOT SET'}`);
      console.log(`    Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods'] || 'NOT SET'}`);
      console.log(`    Access-Control-Allow-Headers: ${res.headers['access-control-allow-headers'] || 'NOT SET'}`);
      console.log('');
      resolve();
    });
    
    req.on('error', (err) => {
      console.log(`  ❌ Error: ${err.message}`);
      console.log('');
      resolve();
    });
    
    req.setTimeout(10000, () => {
      console.log('  ⏰ Timeout');
      console.log('');
      req.destroy();
      resolve();
    });
    
    req.end();
  });
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting tests...\n');
  
  // Test regular requests
  for (const endpoint of testEndpoints) {
    await testEndpoint(endpoint);
  }
  
  // Test preflight requests
  console.log('🔄 TESTING PREFLIGHT REQUESTS');
  console.log('==============================');
  for (const endpoint of testEndpoints) {
    await testPreflight(endpoint);
  }
  
  console.log('✅ All tests completed!');
  console.log('');
  console.log('📋 SUMMARY:');
  console.log('If you see "NOT SET" for CORS headers, the backend CORS middleware is not working.');
  console.log('If you see CORS headers but still get errors in browser, check the browser console.');
  console.log('If all tests pass but browser still fails, there might be a proxy or CDN issue.');
}

// Run the tests
runTests().catch(console.error);
