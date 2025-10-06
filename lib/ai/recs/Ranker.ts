/**
 * Ranking and Trust Guards for Recommendations
 * 
 * Ensures diversity, quality, and compliance in recommendations
 */

import { RecItem, ProductMeta } from './types';

/**
 * Apply diversity ranking to prevent category over-representation
 */
export function diversityRank(
  items: RecItem[],
  catalog: Record<string, ProductMeta>,
  maxPerCategory = 4
): RecItem[] {
  const ranked: RecItem[] = [];
  const categoryCount = new Map<string, number>();
  
  // Sort by score first
  const sorted = [...items].sort((a, b) => b.score - a.score);
  
  for (const item of sorted) {
    const product = catalog[item.productId];
    if (!product) continue;
    
    const category = product.category;
    const currentCount = categoryCount.get(category) || 0;
    
    if (currentCount < maxPerCategory) {
      ranked.push(item);
      categoryCount.set(category, currentCount + 1);
    }
  }
  
  return ranked;
}

/**
 * Trust guard to filter out unavailable or inappropriate products
 */
export function trustGuard(
  items: RecItem[],
  catalog: Record<string, ProductMeta>
): RecItem[] {
  return items.filter(item => {
    const product = catalog[item.productId];
    if (!product) return false;
    
    // Filter out unavailable products
    if (product.isAvailable === false) return false;
    
    // Filter out products without required metadata
    if (!product.title || !product.category) return false;
    
    // Filter out products with invalid prices
    if (product.startingPrice <= 0) return false;
    
    return true;
  });
}

/**
 * Apply recency boost to recent products
 */
export function applyRecencyBoost(
  items: RecItem[],
  catalog: Record<string, ProductMeta>,
  boostFactor = 0.1
): RecItem[] {
  return items.map(item => {
    const product = catalog[item.productId];
    if (!product) return item;
    
    // Simple recency boost based on product ID (in real implementation, use actual dates)
    const isRecent = product.id.includes('NEW') || product.popular;
    const boost = isRecent ? boostFactor : 0;
    
    return {
      ...item,
      score: Math.min(1.0, item.score + boost),
    };
  });
}

/**
 * Apply popularity boost to popular products
 */
export function applyPopularityBoost(
  items: RecItem[],
  catalog: Record<string, ProductMeta>,
  boostFactor = 0.05
): RecItem[] {
  return items.map(item => {
    const product = catalog[item.productId];
    if (!product) return item;
    
    const boost = product.popular ? boostFactor : 0;
    
    return {
      ...item,
      score: Math.min(1.0, item.score + boost),
    };
  });
}

/**
 * Apply price sensitivity adjustment
 */
export function applyPriceSensitivity(
  items: RecItem[],
  catalog: Record<string, ProductMeta>,
  userPricePreference?: 'budget' | 'mid' | 'premium'
): RecItem[] {
  if (!userPricePreference) return items;
  
  return items.map(item => {
    const product = catalog[item.productId];
    if (!product) return item;
    
    const price = product.startingPrice;
    let adjustment = 0;
    
    switch (userPricePreference) {
      case 'budget':
        adjustment = price < 25 ? 0.1 : price > 50 ? -0.1 : 0;
        break;
      case 'mid':
        adjustment = price >= 25 && price <= 50 ? 0.1 : 0;
        break;
      case 'premium':
        adjustment = price > 50 ? 0.1 : price < 25 ? -0.1 : 0;
        break;
    }
    
    return {
      ...item,
      score: Math.max(0, Math.min(1.0, item.score + adjustment)),
    };
  });
}

/**
 * Apply category affinity boost
 */
export function applyCategoryAffinity(
  items: RecItem[],
  catalog: Record<string, ProductMeta>,
  userCategories: string[]
): RecItem[] {
  if (!userCategories.length) return items;
  
  return items.map(item => {
    const product = catalog[item.productId];
    if (!product) return item;
    
    const productCategory = product.category.toLowerCase().replace(/\s+/g, '-');
    const hasAffinity = userCategories.some(cat => 
      cat.toLowerCase().replace(/\s+/g, '-') === productCategory
    );
    
    const boost = hasAffinity ? 0.05 : 0;
    
    return {
      ...item,
      score: Math.min(1.0, item.score + boost),
    };
  });
}

/**
 * Apply material preference boost
 */
export function applyMaterialPreference(
  items: RecItem[],
  catalog: Record<string, ProductMeta>,
  userMaterials: string[]
): RecItem[] {
  if (!userMaterials.length) return items;
  
  return items.map(item => {
    const product = catalog[item.productId];
    if (!product || !product.materials) return item;
    
    const hasPreferredMaterial = product.materials.some(material =>
      userMaterials.some(userMaterial =>
        material.toLowerCase().includes(userMaterial.toLowerCase())
      )
    );
    
    const boost = hasPreferredMaterial ? 0.03 : 0;
    
    return {
      ...item,
      score: Math.min(1.0, item.score + boost),
    };
  });
}

/**
 * Comprehensive ranking with all adjustments
 */
export function applyComprehensiveRanking(
  items: RecItem[],
  catalog: Record<string, ProductMeta>,
  options: {
    maxPerCategory?: number;
    recencyBoost?: boolean;
    popularityBoost?: boolean;
    priceSensitivity?: 'budget' | 'mid' | 'premium';
    userCategories?: string[];
    userMaterials?: string[];
  } = {}
): RecItem[] {
  let ranked = [...items];
  
  // Apply diversity ranking
  ranked = diversityRank(ranked, catalog, options.maxPerCategory);
  
  // Apply trust guard
  ranked = trustGuard(ranked, catalog);
  
  // Apply recency boost
  if (options.recencyBoost) {
    ranked = applyRecencyBoost(ranked, catalog);
  }
  
  // Apply popularity boost
  if (options.popularityBoost) {
    ranked = applyPopularityBoost(ranked, catalog);
  }
  
  // Apply price sensitivity
  if (options.priceSensitivity) {
    ranked = applyPriceSensitivity(ranked, catalog, options.priceSensitivity);
  }
  
  // Apply category affinity
  if (options.userCategories?.length) {
    ranked = applyCategoryAffinity(ranked, catalog, options.userCategories);
  }
  
  // Apply material preference
  if (options.userMaterials?.length) {
    ranked = applyMaterialPreference(ranked, catalog, options.userMaterials);
  }
  
  // Final sort by adjusted score
  return ranked.sort((a, b) => b.score - a.score);
}

/**
 * Calculate recommendation quality score
 */
export function calculateQualityScore(
  items: RecItem[],
  catalog: Record<string, ProductMeta>
): number {
  if (items.length === 0) return 0;
  
  const scores = items.map(item => item.score);
  const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  const categories = new Set(items.map(item => catalog[item.productId]?.category).filter(Boolean));
  const diversityScore = categories.size / items.length;
  
  const confidenceScores = items.map(item => item.confidence);
  const avgConfidence = confidenceScores.reduce((sum, conf) => sum + conf, 0) / confidenceScores.length;
  
  return (avgScore + diversityScore + avgConfidence) / 3;
}

/**
 * Filter recommendations by minimum quality threshold
 */
export function filterByQuality(
  items: RecItem[],
  catalog: Record<string, ProductMeta>,
  minQuality = 0.3
): RecItem[] {
  return items.filter(item => {
    const product = catalog[item.productId];
    if (!product) return false;
    
    const qualityScore = item.score * item.confidence;
    return qualityScore >= minQuality;
  });
}
