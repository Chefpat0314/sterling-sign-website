/**
 * Shared utilities for product pages
 */

/**
 * Format size string for display
 * @param {string|number} width - Width in inches
 * @param {string|number} height - Height in inches
 * @returns {string} Formatted size string
 */
export function formatSize(width, height) {
  if (!width || !height) return '';
  return `${width}" x ${height}"`;
}

/**
 * Build RFQ URL with query parameters
 * @param {string} productName - Name of the product
 * @param {string} size - Size string (e.g., "24x36" or "24\" x 36\"")
 * @param {string} notes - Additional notes (optional)
 * @returns {string} Complete RFQ URL with encoded parameters
 */
export function buildRFQUrl(productName, size = '', notes = '') {
  const params = new URLSearchParams();
  
  if (productName) {
    params.set('product', productName);
  }
  
  if (size) {
    params.set('size', size);
  }
  
  if (notes) {
    params.set('notes', notes);
  }
  
  return `/request-a-quote?${params.toString()}`;
}

/**
 * Get size string from custom dimensions or preset
 * @param {boolean} useCustomSize - Whether using custom dimensions
 * @param {string} customWidth - Custom width value
 * @param {string} customHeight - Custom height value
 * @param {string} selectedPreset - Selected preset size name
 * @returns {string} Size string for RFQ
 */
export function getSizeForRFQ(useCustomSize, customWidth, customHeight, selectedPreset) {
  if (useCustomSize && customWidth && customHeight) {
    return formatSize(customWidth, customHeight);
  }
  
  if (selectedPreset) {
    return selectedPreset;
  }
  
  return 'Size TBD';
}

/**
 * Product data for all PDPs
 */
export const PRODUCTS = {
  '13oz-vinyl-banner': {
    name: '13oz Vinyl Banner',
    description: 'Durable, vibrant vinyl banners for promotions, events, and job sites. Hemmed edges and nickel grommets withstand wind and daily use.',
    heroImage: '/images/products/banner-hero.jpg',
    features: [
      '13oz scrim vinyl, full-color UV print',
      'Heat-welded hems, grommets every 24"',
      'Indoor/outdoor rated; weather & fade resistant',
      'Optional pole pockets or wind slits'
    ],
    sizePresets: [
      { name: '18" x 24"', width: 18, height: 24 },
      { name: '24" x 36"', width: 24, height: 36 },
      { name: '36" x 72"', width: 36, height: 72 },
      { name: '48" x 96"', width: 48, height: 96 },
    ],
    basePricing: [
      { size: '18" x 24"', price: 35 },
      { size: '24" x 36"', price: 55 },
      { size: '36" x 72"', price: 125 },
      { size: '48" x 96"', price: 185 },
    ]
  },
  'aluminum-sign': {
    name: 'Aluminum Sign',
    description: 'Long-lasting aluminum panels for parking, safety, and facility signage. Clean, professional look with excellent rigidity.',
    heroImage: '/images/products/aluminum-hero.jpg',
    features: [
      '.040 / .063 / .080 aluminum options',
      'Direct-print UV or laminated vinyl',
      'Pre-drilled holes; radius corners available',
      'Reflective upgrades (Engineer-Grade / HIP)'
    ],
    sizePresets: [
      { name: '18" x 24"', width: 18, height: 24 },
      { name: '24" x 36"', width: 24, height: 36 },
      { name: '36" x 72"', width: 36, height: 72 },
    ],
    basePricing: [
      { size: '18" x 24"', price: 45 },
      { size: '24" x 36"', price: 75 },
      { size: '36" x 72"', price: 165 },
    ]
  },
  'door-hours-vinyl': {
    name: 'Door Hours Decal',
    description: 'Professional business hours on storefront glass using premium vinyl for crisp readability and clean install.',
    heroImage: '/images/products/door-hours-hero.jpg',
    features: [
      'Cut vinyl or printed/laminated white',
      'Standard colors: white, black, silver',
      'Inside-glass (reverse) or outside application',
      'Includes install or shipped with application tape'
    ],
    sizePresets: [
      { name: '18" x 24"', width: 18, height: 24 },
      { name: '24" x 36"', width: 24, height: 36 },
      { name: '36" x 72"', width: 36, height: 72 },
    ],
    basePricing: [
      { size: '18" x 24"', price: 35 },
      { size: '24" x 36"', price: 55 },
      { size: '36" x 72"', price: 85 },
    ]
  }
};
