/**
 * Recommendation Engine Core
 * 
 * Pluggable recommendation strategies with fallbacks
 */

import { 
  RecContext, 
  RecItem, 
  RecStrategy, 
  RecEngineConfig,
  RecRequest,
  RecResponse,
  ProductMeta 
} from './types';
import { 
  getCatalog, 
  getUserHistory, 
  getCoViewCandidates, 
  getTopSellersByCategory,
  getProductSignals,
  getUserRecentActivity,
  hasPersonalizationConsent,
  getTrendingProducts
} from './Signals';
import { calculateSimilarity, findSimilarProducts } from './SimilarityIndex';
import { diversityRank, trustGuard } from './Ranker';

/**
 * Default recommendation engine configuration
 */
const DEFAULT_CONFIG: RecEngineConfig = {
  strategies: ['buy_again', 'co_view', 'content_sim', 'trending', 'fallback'],
  maxPerCategory: 4,
  minScore: 0.1,
  diversityWeight: 0.3,
  recencyWeight: 0.2,
  popularityWeight: 0.5,
};

/**
 * Get recommendations using multiple strategies
 */
export async function getRecs(request: RecRequest): Promise<RecResponse> {
  const startTime = Date.now();
  const { context, config = {}, filters = {} } = request;
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  const k = Math.max(1, context.k ?? 8);
  const catalog = await getCatalog();
  
  // Check consent for personalization
  const hasConsent = await hasPersonalizationConsent(context.userId || undefined);
  const consent = context.consent ?? hasConsent;
  
  // If no consent, use fallback strategy
  if (!consent) {
    const fallbackRecs = await getFallbackRecommendations(catalog, k, filters);
    return {
      recommendations: fallbackRecs,
      strategy: 'fallback',
      fallbackUsed: true,
      processingTime: Date.now() - startTime,
      metadata: {
        totalCandidates: fallbackRecs.length,
        filteredCount: fallbackRecs.length,
        diversityScore: 0.5,
      },
    };
  }
  
  // Collect recommendations from all strategies
  const allRecs: RecItem[] = [];
  
  for (const strategy of finalConfig.strategies) {
    try {
      const strategyRecs = await getStrategyRecommendations(
        strategy,
        context,
        catalog,
        finalConfig,
        filters
      );
      allRecs.push(...strategyRecs);
    } catch (error) {
      console.error(`Error in strategy ${strategy}:`, error);
    }
  }
  
  // Deduplicate by product ID, keeping highest score
  const deduplicated = deduplicateRecommendations(allRecs);
  
  // Apply filters
  const filtered = applyFilters(deduplicated, catalog, filters);
  
  // Apply diversity ranking
  const diversified = diversityRank(filtered, catalog, finalConfig.maxPerCategory);
  
  // Apply trust guard (remove unavailable products)
  const trusted = trustGuard(diversified, catalog);
  
  // Take top k recommendations
  const finalRecs = trusted.slice(0, k);
  
  // Use fallback if no recommendations
  const recommendations = finalRecs.length > 0 ? finalRecs : await getFallbackRecommendations(catalog, k, filters);
  
  return {
    recommendations,
    strategy: finalConfig.strategies[0],
    fallbackUsed: finalRecs.length === 0,
    processingTime: Date.now() - startTime,
    metadata: {
      totalCandidates: allRecs.length,
      filteredCount: filtered.length,
      diversityScore: calculateDiversityScore(recommendations, catalog),
    },
  };
}

/**
 * Get recommendations for a specific strategy
 */
async function getStrategyRecommendations(
  strategy: RecStrategy,
  context: RecContext,
  catalog: Record<string, ProductMeta>,
  config: RecEngineConfig,
  filters: any
): Promise<RecItem[]> {
  switch (strategy) {
    case 'buy_again':
      return await getBuyAgainRecommendations(context, catalog);
    
    case 'co_view':
      return await getCoViewRecommendations(context, catalog);
    
    case 'content_sim':
      return await getContentSimilarityRecommendations(context, catalog);
    
    case 'collaborative':
      return await getCollaborativeRecommendations(context, catalog);
    
    case 'trending':
      return await getTrendingRecommendations(catalog);
    
    case 'fallback':
      return await getFallbackRecommendations(catalog, context.k || 8, filters);
    
    default:
      return [];
  }
}

/**
 * Buy-again recommendations based on purchase history
 */
async function getBuyAgainRecommendations(
  context: RecContext,
  catalog: Record<string, ProductMeta>
): Promise<RecItem[]> {
  if (!context.userId) return [];
  
  const history = await getUserHistory(context.userId);
  const purchased = history.purchased || [];
  
  return purchased.map((productId, index) => ({
    productId,
    reason: 'buy_again' as const,
    score: 0.9 - index * 0.1, // Higher score for more recent purchases
    confidence: 0.8,
  }));
}

/**
 * Co-view recommendations based on session data
 */
async function getCoViewRecommendations(
  context: RecContext,
  catalog: Record<string, ProductMeta>
): Promise<RecItem[]> {
  if (!context.productId) return [];
  
  const coViewProducts = await getCoViewCandidates(context.productId);
  
  return coViewProducts.map((productId, index) => ({
    productId,
    reason: 'co_view' as const,
    score: 0.8 - index * 0.05,
    confidence: 0.7,
  }));
}

/**
 * Content-based similarity recommendations
 */
async function getContentSimilarityRecommendations(
  context: RecContext,
  catalog: Record<string, ProductMeta>
): Promise<RecItem[]> {
  if (!context.productId || !catalog[context.productId]) return [];
  
  const targetProduct = catalog[context.productId];
  const candidates = Object.values(catalog).filter(p => p.id !== context.productId);
  
  const similar = findSimilarProducts(targetProduct, candidates, 0.2, 10);
  
  return similar.map(({ product, similarity }) => ({
    productId: product.id,
    reason: 'content_sim' as const,
    score: Math.min(0.7, similarity),
    confidence: similarity,
  }));
}

/**
 * Collaborative filtering recommendations
 */
async function getCollaborativeRecommendations(
  context: RecContext,
  catalog: Record<string, ProductMeta>
): Promise<RecItem[]> {
  // Placeholder for collaborative filtering
  // In a real implementation, this would use user similarity
  return [];
}

/**
 * Trending products recommendations
 */
async function getTrendingRecommendations(
  catalog: Record<string, ProductMeta>
): Promise<RecItem[]> {
  const trending = await getTrendingProducts(8);
  
  return trending.map((productId, index) => ({
    productId,
    reason: 'trending' as const,
    score: 0.6 - index * 0.05,
    confidence: 0.5,
  }));
}

/**
 * Fallback recommendations (top sellers)
 */
async function getFallbackRecommendations(
  catalog: Record<string, ProductMeta>,
  k: number,
  filters: any
): Promise<RecItem[]> {
  const category = filters.categories?.[0];
  const topSellers = await getTopSellersByCategory(category, k);
  
  return topSellers.map((productId, index) => ({
    productId,
    reason: 'fallback_top' as const,
    score: 0.5 - index * 0.01,
    confidence: 0.3,
  }));
}

/**
 * Deduplicate recommendations by product ID
 */
function deduplicateRecommendations(recs: RecItem[]): RecItem[] {
  const seen = new Map<string, RecItem>();
  
  for (const rec of recs) {
    const existing = seen.get(rec.productId);
    if (!existing || rec.score > existing.score) {
      seen.set(rec.productId, rec);
    }
  }
  
  return Array.from(seen.values());
}

/**
 * Apply filters to recommendations
 */
function applyFilters(
  recs: RecItem[],
  catalog: Record<string, ProductMeta>,
  filters: any
): RecItem[] {
  return recs.filter(rec => {
    const product = catalog[rec.productId];
    if (!product) return false;
    
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      const productCategory = product.category.toLowerCase().replace(/\s+/g, '-');
      if (!filters.categories.includes(productCategory)) return false;
    }
    
    // Price range filter
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      if (product.startingPrice < minPrice || product.startingPrice > maxPrice) return false;
    }
    
    // Material filter
    if (filters.materials && filters.materials.length > 0) {
      const productMaterials = product.materials || [];
      if (!filters.materials.some((material: string) => 
        productMaterials.some(pm => pm.toLowerCase().includes(material.toLowerCase()))
      )) return false;
    }
    
    // Availability filter
    if (filters.availableOnly && product.isAvailable === false) return false;
    
    return true;
  });
}

/**
 * Calculate diversity score for recommendations
 */
function calculateDiversityScore(recs: RecItem[], catalog: Record<string, ProductMeta>): number {
  if (recs.length === 0) return 0;
  
  const categories = new Set(recs.map(rec => catalog[rec.productId]?.category).filter(Boolean));
  const materials = new Set(
    recs.flatMap(rec => catalog[rec.productId]?.materials || []).filter(Boolean)
  );
  
  const categoryDiversity = categories.size / recs.length;
  const materialDiversity = materials.size / Math.max(1, recs.length);
  
  return (categoryDiversity + materialDiversity) / 2;
}
