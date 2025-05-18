// This file is specifically for Netlify deployment
console.log('Starting Netlify deployment script...');

const fs = require('fs');
const path = require('path');

// Ensure the dist directory exists
const distDir = path.resolve(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.log('Creating dist directory...');
  fs.mkdirSync(distDir, { recursive: true });
}

// Create _redirects file directly in the dist folder
const redirectsContent = '/* /index.html 200';
const redirectsPath = path.join(distDir, '_redirects');

console.log('Writing _redirects file to:', redirectsPath);
fs.writeFileSync(redirectsPath, redirectsContent);

console.log('Netlify deployment script completed successfully!');
