#!/usr/bin/env node

// Test server startup script
console.log('🧪 Testing server startup...');

try {
  // Try to import the server file
  const serverModule = await import('./backend/index.js');
  console.log('✅ Server module imported successfully');
  
  // Check if the app object exists
  if (serverModule.default) {
    console.log('✅ Server app object found');
  } else {
    console.log('⚠️  Server app object not found in default export');
  }
  
  console.log('✅ Server startup test passed!');
  
} catch (error) {
  console.error('❌ Server startup test failed:');
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  
  if (error.message.includes('Missing parameter name')) {
    console.error('🔍 This is a path-to-regexp error - likely a route pattern issue');
  }
  
  process.exit(1);
}
