// Simple build script for Netlify deployment
const fs = require('fs');
const path = require('path');

// Files to copy from public to dist
const filesToCopy = ['_redirects', '_headers', '404.html'];

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.log('Creating dist directory...');
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy each file
filesToCopy.forEach(file => {
  const sourcePath = path.join(__dirname, 'public', file);
  const destPath = path.join(__dirname, 'dist', file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Successfully copied ${file} to dist folder`);
  } else {
    console.warn(`Warning: ${file} does not exist in public folder`);
  }
});

console.log('Netlify build script completed successfully!');
