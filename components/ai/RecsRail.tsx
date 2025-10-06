/**
 * Recommendation Rail Component
 * 
 * SSR-safe recommendation display with skeleton loading
 */

"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FLAGS } from '../../config/featureFlags';
import { analytics } from '../../lib/metrics';

type RecDto = { 
  productId: string; 
  reason: string; 
  score: number;
  confidence: number;
  metadata?: {
    category?: string;
    price?: number;
    image?: string;
    title?: string;
  };
};

interface RecsRailProps {
  userId?: string | null;
  productId?: string | null;
  category?: string | null;
  title?: string;
  maxItems?: number;
  showReason?: boolean;
}

export function RecsRail({ 
  userId, 
  productId, 
  category,
  title = "Suggested for you",
  maxItems = 8,
  showReason = false
}: RecsRailProps) {
  const [items, setItems] = useState<RecDto[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!FLAGS.RECS_ENABLED) return;
    
    setLoading(true);
    setError(null);
    
    const fetchRecs = async () => {
      try {
        const params = new URLSearchParams();
        if (userId) params.set('userId', userId);
        if (productId) params.set('productId', productId);
        if (category) params.set('category', category);
        params.set('k', maxItems.toString());
        
        const response = await fetch(`/api/ai/recs?${params.toString()}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        setItems(data.recommendations || []);
        
        // Fire analytics event
        analytics.track('recs_viewed', {
          product: productId,
          meta: {
            count: data.recommendations?.length || 0,
            strategy: data.strategy,
            fallbackUsed: data.fallbackUsed,
          }
        });
        
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load recommendations');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecs();
  }, [userId, productId, category, maxItems]);

  // Don't render if feature is disabled
  if (!FLAGS.RECS_ENABLED) return null;
  
  // Show skeleton while loading
  if (loading) {
    return (
      <section aria-label="Recommended products" className="mt-8">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <section aria-label="Recommended products" className="mt-8">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Unable to load recommendations</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-600 hover:text-blue-700 mt-2"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }
  
  // Show empty state
  if (!items || items.length === 0) return null;

  return (
    <section aria-label="Recommended products" className="mt-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <Link
            key={item.productId}
            href={`/products/${item.productId}`}
            className="block rounded-xl border border-gray-200 p-3 hover:shadow-md transition-shadow group"
            onClick={() => {
              analytics.track('recs_cta_click', {
                product: item.productId,
                meta: {
                  reason: item.reason,
                  score: item.score,
                  confidence: item.confidence,
                }
              });
            }}
          >
            <div className="aspect-square bg-gray-50 rounded-lg mb-2 overflow-hidden">
              {item.metadata?.image ? (
                <Image
                  src={item.metadata.image}
                  alt={item.metadata.title || item.productId}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}
            </div>
            
            <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
              {item.metadata?.title || item.productId}
            </div>
            
            {item.metadata?.price && (
              <div className="text-xs text-gray-600 mb-1">
                From ${item.metadata.price}
              </div>
            )}
            
            {showReason && (
              <div className="text-xs text-gray-500">
                {getReasonText(item.reason)}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-blue-600 font-medium">
                View Details
              </span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                <span className="text-xs text-gray-500">
                  {Math.round(item.confidence * 100)}% match
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * Get human-readable reason text
 */
function getReasonText(reason: string): string {
  const reasonMap: Record<string, string> = {
    'buy_again': 'You bought this before',
    'co_view': 'Often bought together',
    'content_sim': 'Similar to what you viewed',
    'trending': 'Popular right now',
    'fallback_top': 'Top seller',
    'similar_user': 'Recommended for you',
  };
  
  return reasonMap[reason] || 'Recommended';
}

export default RecsRail;
