/**
 * Recommendation Engine Signals
 * 
 * Lightweight adapters for analytics data sources
 * Swappable implementations for different data sources
 */

import { ProductMeta, UserHistory, ProductSignals } from './types';
import { getAllCatalog } from '../../catalog';

// In-memory cache for product metadata
let productCache: Record<string, ProductMeta> | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get user purchase and view history
 */
export async function getUserHistory(userId: string): Promise<UserHistory> {
  try {
    // In a real implementation, this would query your analytics database
    // For now, we'll use localStorage as a fallback
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`user_history_${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    }
    
    // Fallback: return empty history
    return {
      viewed: [],
      purchased: [],
      carted: [],
      categories: [],
      lastActivity: new Date(),
      totalSpent: 0,
      avgOrderValue: 0,
    };
  } catch (error) {
    console.error('Error fetching user history:', error);
    return {
      viewed: [],
      purchased: [],
      carted: [],
      categories: [],
      lastActivity: new Date(),
      totalSpent: 0,
      avgOrderValue: 0,
    };
  }
}

/**
 * Get products co-viewed with given product
 */
export async function getCoViewCandidates(productId: string): Promise<string[]> {
  try {
    // In a real implementation, this would query session analytics
    // For now, we'll use a simple heuristic based on category
    const catalog = await getCatalog();
    const product = catalog[productId];
    if (!product) return [];
    
    // Find products in the same category
    const sameCategory = Object.values(catalog)
      .filter(p => p.category === product.category && p.id !== productId)
      .map(p => p.id);
    
    return sameCategory.slice(0, 5); // Top 5 co-viewed
  } catch (error) {
    console.error('Error fetching co-view candidates:', error);
    return [];
  }
}

/**
 * Get product catalog with caching
 */
export async function getCatalog(): Promise<Record<string, ProductMeta>> {
  try {
    // Check if cache is still valid
    if (productCache && Date.now() - cacheTimestamp < CACHE_TTL) {
      return productCache;
    }
    
    // Fetch fresh data
    const catalog = getAllCatalog();
    const productMeta: Record<string, ProductMeta> = {};
    
    catalog.forEach(product => {
      productMeta[product.id] = {
        id: product.id,
        title: product.name,
        category: product.category,
        slug: product.slug,
        startingPrice: product.startingPrice,
        image: product.image,
        features: product.features,
        materials: product.materials || [],
        tags: product.tags || [],
        isAvailable: product.isAvailable !== false,
        popular: product.popular || false,
        minSize: product.minSize,
        maxSize: product.maxSize,
      };
    });
    
    // Update cache
    productCache = productMeta;
    cacheTimestamp = Date.now();
    
    return productMeta;
  } catch (error) {
    console.error('Error fetching catalog:', error);
    return {};
  }
}

/**
 * Get top sellers by category (fallback when no personalization)
 */
export async function getTopSellersByCategory(category?: string, k = 8): Promise<string[]> {
  try {
    const catalog = await getCatalog();
    const products = Object.values(catalog);
    
    // Filter by category if specified
    const filtered = category 
      ? products.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === category)
      : products;
    
    // Sort by popularity and price
    const sorted = filtered
      .filter(p => p.isAvailable !== false)
      .sort((a, b) => {
        // Popular products first
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        
        // Then by price (lower first)
        return a.startingPrice - b.startingPrice;
      });
    
    return sorted.slice(0, k).map(p => p.id);
  } catch (error) {
    console.error('Error fetching top sellers:', error);
    return [];
  }
}

/**
 * Get product signals for recommendation scoring
 */
export async function getProductSignals(productId: string): Promise<ProductSignals> {
  try {
    // In a real implementation, this would query analytics data
    // For now, we'll return default signals
    return {
      viewCount: 0,
      cartAdds: 0,
      purchases: 0,
      avgSessionTime: 0,
      coViewProducts: [],
      conversionRate: 0,
      lastViewed: new Date(),
      trendingScore: 0,
    };
  } catch (error) {
    console.error('Error fetching product signals:', error);
    return {
      viewCount: 0,
      cartAdds: 0,
      purchases: 0,
      avgSessionTime: 0,
      coViewProducts: [],
      conversionRate: 0,
      lastViewed: new Date(),
      trendingScore: 0,
    };
  }
}

/**
 * Get user's recent activity for personalization
 */
export async function getUserRecentActivity(userId: string, days = 30): Promise<{
  recentViews: string[];
  recentCarts: string[];
  recentPurchases: string[];
  favoriteCategories: string[];
}> {
  try {
    const history = await getUserHistory(userId);
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    return {
      recentViews: history.viewed.slice(-10), // Last 10 views
      recentCarts: history.carted.slice(-5), // Last 5 cart additions
      recentPurchases: history.purchased.slice(-5), // Last 5 purchases
      favoriteCategories: history.categories.slice(-3), // Top 3 categories
    };
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return {
      recentViews: [],
      recentCarts: [],
      recentPurchases: [],
      favoriteCategories: [],
    };
  }
}

/**
 * Check if user has consent for personalization
 */
export async function hasPersonalizationConsent(userId?: string): Promise<boolean> {
  try {
    if (!userId) return false;
    
    // In a real implementation, this would check your consent management system
    // For now, we'll use localStorage as a fallback
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem(`consent_${userId}`);
      return consent === 'true';
    }
    
    return false;
  } catch (error) {
    console.error('Error checking consent:', error);
    return false;
  }
}

/**
 * Get trending products based on recent activity
 */
export async function getTrendingProducts(k = 8): Promise<string[]> {
  try {
    const catalog = await getCatalog();
    const products = Object.values(catalog);
    
    // Sort by popularity and recent activity
    const trending = products
      .filter(p => p.isAvailable !== false)
      .sort((a, b) => {
        // Popular products first
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        
        // Then by price (lower first for accessibility)
        return a.startingPrice - b.startingPrice;
      });
    
    return trending.slice(0, k).map(p => p.id);
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return [];
  }
}

/**
 * Get similar users based on purchase patterns
 */
export async function getSimilarUsers(userId: string, limit = 10): Promise<string[]> {
  try {
    // In a real implementation, this would use collaborative filtering
    // For now, we'll return empty array
    return [];
  } catch (error) {
    console.error('Error fetching similar users:', error);
    return [];
  }
}
