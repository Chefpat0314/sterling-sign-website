/**
 * Recommendation Engine Types
 * 
 * Type definitions for the AI recommendation system
 */

export type ProductMeta = {
  id: string;
  title: string;
  category: string;
  slug: string;
  startingPrice: number;
  image: string;
  features: string[];
  materials?: string[];
  tags?: string[];
  isAvailable?: boolean;
  popular?: boolean;
  minSize: string;
  maxSize: string;
};

export type RecContext = {
  userId?: string | null;
  productId?: string | null;
  category?: string | null;
  k?: number; // top-k recommendations
  consent?: boolean; // true if personalization allowed
  sessionId?: string;
};

export type RecItem = {
  productId: string;
  reason: "buy_again" | "co_view" | "content_sim" | "fallback_top" | "trending" | "similar_user";
  score: number; // normalized 0..1
  confidence: number; // 0..1
  metadata?: {
    category?: string;
    price?: number;
    image?: string;
    title?: string;
  };
};

export type RecStrategy = 
  | "buy_again"
  | "co_view" 
  | "content_sim"
  | "collaborative"
  | "trending"
  | "fallback";

export type RecEngineConfig = {
  strategies: RecStrategy[];
  maxPerCategory: number;
  minScore: number;
  diversityWeight: number;
  recencyWeight: number;
  popularityWeight: number;
};

export type UserHistory = {
  viewed: string[];
  purchased: string[];
  carted: string[];
  categories: string[];
  lastActivity: Date;
  totalSpent: number;
  avgOrderValue: number;
};

export type ProductSignals = {
  viewCount: number;
  cartAdds: number;
  purchases: number;
  avgSessionTime: number;
  coViewProducts: string[];
  conversionRate: number;
  lastViewed: Date;
  trendingScore: number;
};

export type RecRequest = {
  context: RecContext;
  config?: Partial<RecEngineConfig>;
  filters?: {
    categories?: string[];
    priceRange?: [number, number];
    materials?: string[];
    availableOnly?: boolean;
  };
};

export type RecResponse = {
  recommendations: RecItem[];
  strategy: RecStrategy;
  fallbackUsed: boolean;
  processingTime: number;
  metadata: {
    totalCandidates: number;
    filteredCount: number;
    diversityScore: number;
  };
};

export type RecAnalytics = {
  recsViewed: number;
  recsClicked: number;
  recsConverted: number;
  ctr: number;
  conversionRate: number;
  assistedRevenue: number;
  strategyPerformance: Record<RecStrategy, {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    conversionRate: number;
  }>;
};

export type RecEngineMetrics = {
  totalRequests: number;
  avgResponseTime: number;
  cacheHitRate: number;
  errorRate: number;
  strategiesUsed: Record<RecStrategy, number>;
  userSatisfaction: number;
  businessImpact: {
    revenue: number;
    orders: number;
    aov: number;
  };
};
