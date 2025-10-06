/**
 * Similarity Index for Content-Based Recommendations
 * 
 * Fast cosine/jaccard similarity on lightweight product vectors
 */

import { ProductMeta } from './types';

/**
 * Create a feature vector from product metadata
 */
function createFeatureVector(product: ProductMeta): Map<string, number> {
  const features = new Map<string, number>();
  
  // Category weight (highest)
  if (product.category) {
    features.set(`category:${product.category.toLowerCase()}`, 3.0);
  }
  
  // Materials weight (high)
  if (product.materials && product.materials.length > 0) {
    product.materials.forEach(material => {
      features.set(`material:${material.toLowerCase()}`, 2.5);
    });
  }
  
  // Tags weight (medium)
  if (product.tags && product.tags.length > 0) {
    product.tags.forEach(tag => {
      features.set(`tag:${tag.toLowerCase()}`, 2.0);
    });
  }
  
  // Features weight (medium)
  if (product.features && product.features.length > 0) {
    product.features.forEach(feature => {
      // Extract key terms from features
      const terms = feature.toLowerCase().split(/\s+/);
      terms.forEach(term => {
        if (term.length > 2) { // Skip short words
          features.set(`feature:${term}`, 1.5);
        }
      });
    });
  }
  
  // Price range weight (low)
  if (product.startingPrice) {
    const priceRange = getPriceRange(product.startingPrice);
    features.set(`price:${priceRange}`, 1.0);
  }
  
  // Size range weight (low)
  if (product.minSize && product.maxSize) {
    const sizeRange = getSizeRange(product.minSize, product.maxSize);
    features.set(`size:${sizeRange}`, 1.0);
  }
  
  return features;
}

/**
 * Get price range category
 */
function getPriceRange(price: number): string {
  if (price < 25) return 'budget';
  if (price < 50) return 'mid';
  if (price < 100) return 'premium';
  return 'luxury';
}

/**
 * Get size range category
 */
function getSizeRange(minSize: string, maxSize: string): string {
  // Extract numeric values from size strings
  const minNum = extractNumericSize(minSize);
  const maxNum = extractNumericSize(maxSize);
  
  if (maxNum < 12) return 'small';
  if (maxNum < 24) return 'medium';
  if (maxNum < 48) return 'large';
  return 'xlarge';
}

/**
 * Extract numeric value from size string
 */
function extractNumericSize(size: string): number {
  const match = size.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * Calculate cosine similarity between two feature vectors
 */
function cosineSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  // Calculate dot product and norms
  for (const [key, valueA] of vecA) {
    const valueB = vecB.get(key) || 0;
    dotProduct += valueA * valueB;
    normA += valueA * valueA;
  }
  
  for (const [, valueB] of vecB) {
    normB += valueB * valueB;
  }
  
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator > 0 ? dotProduct / denominator : 0;
}

/**
 * Calculate Jaccard similarity between two feature vectors
 */
function jaccardSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number {
  const keysA = new Set(vecA.keys());
  const keysB = new Set(vecB.keys());
  
  const intersection = new Set([...keysA].filter(key => keysB.has(key)));
  const union = new Set([...keysA, ...keysB]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Calculate weighted similarity combining multiple methods
 */
function weightedSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number {
  const cosine = cosineSimilarity(vecA, vecB);
  const jaccard = jaccardSimilarity(vecA, vecB);
  
  // Weighted combination: 70% cosine, 30% jaccard
  return 0.7 * cosine + 0.3 * jaccard;
}

/**
 * Calculate similarity between two products
 */
export function calculateSimilarity(productA: ProductMeta, productB: ProductMeta): number {
  const vecA = createFeatureVector(productA);
  const vecB = createFeatureVector(productB);
  
  return weightedSimilarity(vecA, vecB);
}

/**
 * Find most similar products to a given product
 */
export function findSimilarProducts(
  targetProduct: ProductMeta,
  candidateProducts: ProductMeta[],
  minSimilarity = 0.2,
  maxResults = 10
): Array<{ product: ProductMeta; similarity: number }> {
  const similarities = candidateProducts
    .filter(p => p.id !== targetProduct.id)
    .map(product => ({
      product,
      similarity: calculateSimilarity(targetProduct, product)
    }))
    .filter(item => item.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxResults);
  
  return similarities;
}

/**
 * Calculate category similarity
 */
export function calculateCategorySimilarity(categoryA: string, categoryB: string): number {
  const catA = categoryA.toLowerCase().replace(/\s+/g, '-');
  const catB = categoryB.toLowerCase().replace(/\s+/g, '-');
  
  if (catA === catB) return 1.0;
  
  // Define category relationships
  const relationships: Record<string, string[]> = {
    'banners': ['yard-signs', 'decals'],
    'yard-signs': ['banners', 'real-estate'],
    'decals': ['banners', 'vehicle-signs'],
    'ada-signs': ['safety-signs'],
    'safety-signs': ['ada-signs'],
    'trade-show': ['banners'],
    'real-estate': ['yard-signs'],
    'vehicle-signs': ['decals'],
  };
  
  const related = relationships[catA] || [];
  return related.includes(catB) ? 0.5 : 0.0;
}

/**
 * Calculate material similarity
 */
export function calculateMaterialSimilarity(materialsA: string[], materialsB: string[]): number {
  if (!materialsA.length || !materialsB.length) return 0;
  
  const setA = new Set(materialsA.map(m => m.toLowerCase()));
  const setB = new Set(materialsB.map(m => m.toLowerCase()));
  
  const intersection = new Set([...setA].filter(m => setB.has(m)));
  const union = new Set([...setA, ...setB]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Calculate price similarity
 */
export function calculatePriceSimilarity(priceA: number, priceB: number): number {
  const maxPrice = Math.max(priceA, priceB);
  const minPrice = Math.min(priceA, priceB);
  
  if (maxPrice === 0) return 1.0;
  
  const ratio = minPrice / maxPrice;
  return Math.max(0, ratio);
}

/**
 * Calculate comprehensive similarity score
 */
export function calculateComprehensiveSimilarity(
  productA: ProductMeta,
  productB: ProductMeta
): number {
  const weights = {
    content: 0.4,      // Content-based similarity
    category: 0.3,     // Category similarity
    material: 0.2,     // Material similarity
    price: 0.1,        // Price similarity
  };
  
  const contentSim = calculateSimilarity(productA, productB);
  const categorySim = calculateCategorySimilarity(productA.category, productB.category);
  const materialSim = calculateMaterialSimilarity(
    productA.materials || [],
    productB.materials || []
  );
  const priceSim = calculatePriceSimilarity(productA.startingPrice, productB.startingPrice);
  
  return (
    weights.content * contentSim +
    weights.category * categorySim +
    weights.material * materialSim +
    weights.price * priceSim
  );
}
