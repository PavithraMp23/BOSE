// Simple CORS test script
// Run this with: node test-cors.js

const https = require('https');
const http = require('http');

// Test CORS with your dev tunnel URL
const testUrl = 'https://k0sdttf5-5173.inc1.devtunnels.ms';
const backendUrl = 'http://localhost:3002';

console.log('Testing CORS configuration...');
console.log('Frontend URL:', testUrl);
console.log('Backend URL:', backendUrl);

// Test OPTIONS preflight request
const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/auth/login',
  method: 'OPTIONS',
  headers: {
    'Origin': testUrl,
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type, Authorization'
  }
};

const req = http.request(options, (res) => {
  console.log('OPTIONS Response Status:', res.statusCode);
  console.log('CORS Headers:');
  console.log('  Access-Control-Allow-Origin:', res.headers['access-control-allow-origin']);
  console.log('  Access-Control-Allow-Methods:', res.headers['access-control-allow-methods']);
  console.log('  Access-Control-Allow-Headers:', res.headers['access-control-allow-headers']);
  console.log('  Access-Control-Allow-Credentials:', res.headers['access-control-allow-credentials']);
});

req.on('error', (err) => {
  console.error('Request error:', err.message);
});

req.end();
