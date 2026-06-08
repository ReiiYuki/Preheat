import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const indexHtml = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtml)) {
  console.error('index.html not found in dist/');
  process.exit(1);
}

// 1. Copy to 404.html (fallback for any unknown routes)
fs.copyFileSync(indexHtml, path.join(distDir, '404.html'));
console.log('Pre-generated: 404.html (fallback)');

// 2. Pre-generate for known routes to ensure 200 OK on GitHub Pages
const routes = ['dashboard', 'create-project'];

for (const route of routes) {
  const routeDir = path.join(distDir, route);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  fs.copyFileSync(indexHtml, path.join(routeDir, 'index.html'));
  console.log(`Pre-generated: ${route}/index.html`);
}
