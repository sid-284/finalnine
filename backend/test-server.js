import { createServer } from 'http';
import { spawn } from 'child_process';

const testServer = async () => {
  try {
    console.log('Testing server startup...');
    
    // Start the server
    const server = spawn('node', ['index.js'], {
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    let output = '';
    let errorOutput = '';
    
    server.stdout.on('data', (data) => {
      output += data.toString();
      console.log('Server output:', data.toString());
    });
    
    server.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error('Server error:', data.toString());
    });
    
    // Wait a bit for server to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if server started successfully
    if (errorOutput.includes('path-to-regexp') || errorOutput.includes('Missing parameter name')) {
      console.error('❌ Server still has path-to-regexp error');
      console.error('Error output:', errorOutput);
    } else if (output.includes('Server running on port 8000')) {
      console.log('✅ Server started successfully without path-to-regexp errors');
    } else {
      console.log('⚠️  Server output unclear, checking for errors...');
      if (errorOutput) {
        console.error('Error output:', errorOutput);
      }
    }
    
    // Kill the server
    server.kill();
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testServer();
