const fs = require('fs');
const path = require('path');

// Simple placeholder image generator
const generatePlaceholder = (name, filename) => {
  // Create a simple SVG placeholder
  const svg = `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#1e3a8a"/>
  <rect x="50" y="50" width="700" height="500" fill="none" stroke="#ffffff" stroke-width="4" stroke-dasharray="20,10"/>
  <text x="400" y="300" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${name}</text>
  <text x="400" y="350" font-family="Arial, sans-serif" font-size="16" fill="#e5e7eb" text-anchor="middle" dominant-baseline="middle">Sterling Sign Solutions</text>
</svg>`;

  const filePath = path.join(__dirname, '..', 'public', 'images', 'products', `${filename}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`✅ Created placeholder: ${filename}.svg`);
};

// Product images to create
const products = [
  { name: 'Vinyl Banner', filename: 'vinyl-banner-hero' },
  { name: 'Coroplast Sign', filename: 'coroplast-sign-hero' },
  { name: 'Aluminum Sign', filename: 'aluminum-sign-hero' },
  { name: 'ACM Sign', filename: 'acm-sign-hero' },
  { name: 'PVC Sign', filename: 'pvc-sign-hero' },
  { name: 'ADA Sign', filename: 'ada-sign-hero' },
  { name: 'Vinyl Decal', filename: 'vinyl-decal-hero' },
  { name: 'Window Graphic', filename: 'window-graphic-hero' },
  { name: 'Wall Decal', filename: 'wall-decal-hero' },
  { name: 'Magnetic Sign', filename: 'magnetic-sign-hero' },
  { name: 'Floor Graphic', filename: 'floor-graphic-hero' },
  { name: 'Safety Sign', filename: 'safety-sign-hero' },
];

// Generate all placeholders
products.forEach(product => {
  generatePlaceholder(product.name, product.filename);
});

console.log('🎨 All placeholder images generated!');
