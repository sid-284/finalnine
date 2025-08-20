// Test script to verify CORS configuration
const fetch = require('node-fetch');

const testOrigins = [
  'https://www.9tytwooffical.com',
  'https://9tytwooffical.com',
  'http://localhost:3000',
  'http://localhost:5173',
  'https://finalnine.onrender.com'
];

async function testCORS() {
  console.log('Testing CORS configuration...\n');
  
  for (const origin of testOrigins) {
    try {
      console.log(`Testing origin: ${origin}`);
      
      const response = await fetch('https://finalnine.onrender.com/api/cors-test', {
        method: 'GET',
        headers: {
          'Origin': origin,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ SUCCESS: ${data.message}`);
        console.log(`   Response:`, data);
      } else {
        console.log(`❌ FAILED: HTTP ${response.status}`);
        const errorText = await response.text();
        console.log(`   Error: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    console.log('---');
  }
  
  // Test preflight request
  console.log('Testing preflight request...');
  try {
    const response = await fetch('https://finalnine.onrender.com/api/cors-test', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://www.9tytwooffical.com',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log(`Preflight response status: ${response.status}`);
    console.log(`Access-Control-Allow-Origin: ${response.headers.get('Access-Control-Allow-Origin')}`);
    console.log(`Access-Control-Allow-Credentials: ${response.headers.get('Access-Control-Allow-Credentials')}`);
  } catch (error) {
    console.log(`Preflight error: ${error.message}`);
  }
}

testCORS().catch(console.error);
