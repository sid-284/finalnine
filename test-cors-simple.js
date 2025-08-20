// Simple CORS test script
const https = require('https');

const testOrigin = 'https://www.9tytwooffical.com';
const testUrl = 'https://finalnine.onrender.com/api/public-test';

console.log(`Testing CORS for origin: ${testOrigin}`);
console.log(`Testing URL: ${testUrl}`);
console.log('---');

// Test 1: Simple GET request
console.log('Test 1: Simple GET request');
const getReq = https.get(testUrl, {
  headers: {
    'Origin': testOrigin
  }
}, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log('Response headers:');
  console.log(`  Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin']}`);
  console.log(`  Access-Control-Allow-Credentials: ${res.headers['access-control-allow-credentials']}`);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response body:', data);
    console.log('---');
  });
});

getReq.on('error', (err) => {
  console.error('GET request error:', err.message);
});

// Test 2: Preflight OPTIONS request
console.log('Test 2: Preflight OPTIONS request');
const optionsReq = https.request(testUrl, {
  method: 'OPTIONS',
  headers: {
    'Origin': testOrigin,
    'Access-Control-Request-Method': 'GET',
    'Access-Control-Request-Headers': 'Content-Type'
  }
}, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log('Response headers:');
  console.log(`  Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin']}`);
  console.log(`  Access-Control-Allow-Credentials: ${res.headers['access-control-allow-credentials']}`);
  console.log(`  Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods']}`);
  console.log(`  Access-Control-Allow-Headers: ${res.headers['access-control-allow-headers']}`);
});

optionsReq.on('error', (err) => {
  console.error('OPTIONS request error:', err.message);
});

optionsReq.end();
