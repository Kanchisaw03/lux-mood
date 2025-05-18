import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Read the _redirects file from public
const redirectsContent = fs.readFileSync(
  path.join(__dirname, 'public', '_redirects'),
  'utf8'
);

// Write to dist folder
fs.writeFileSync(
  path.join(__dirname, 'dist', '_redirects'),
  redirectsContent
);

console.log('Successfully copied _redirects file to dist folder');
