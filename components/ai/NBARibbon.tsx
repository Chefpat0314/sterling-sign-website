/**
 * Next-Best-Action Ribbon Component
 * 
 * Contextual nudges for personalized user guidance
 */

"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FLAGS } from '../../config/featureFlags';
import { analytics } from '../../lib/metrics';

type NBAAction = { 
  id: string; 
  label: string; 
  description?: string;
  href: string; 
  variant: 'info' | 'success' | 'warning' | 'error';
  priority: number;
};

interface NBARibbonProps {
  context: 'PDP' | 'CART' | 'CHECKOUT' | 'ACCOUNT' | 'HOMEPAGE';
  userId?: string | null;
  productId?: string | null;
  sessionId?: string | null;
  className?: string;
}

export function NBARibbon({ 
  context, 
  userId, 
  productId, 
  sessionId,
  className = ""
}: NBARibbonProps) {
  const [nba, setNba] = useState<NBAAction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!FLAGS.NBA_ENABLED) return;
    
    setLoading(true);
    setError(null);
    
    const fetchNBA = async () => {
      try {
        const params = new URLSearchParams({ context });
        if (userId) params.set('userId', userId);
        if (productId) params.set('productId', productId);
        if (sessionId) params.set('sessionId', sessionId);
        
        const response = await fetch(`/api/ai/nba?${params.toString()}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        setNba(data);
        
        // Fire analytics event if action is shown
        if (data) {
          analytics.track('nba_impression', {
            meta: {
              actionId: data.id,
              context,
              priority: data.priority,
            }
          });
        }
        
      } catch (err) {
        console.error('Error fetching NBA:', err);
        setError(err instanceof Error ? err.message : 'Failed to load recommendation');
        setNba(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNBA();
  }, [context, userId, productId, sessionId]);

  // Don't render if feature is disabled
  if (!FLAGS.NBA_ENABLED) return null;
  
  // Show loading state
  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-12 bg-gray-100 rounded-lg"></div>
      </div>
    );
  }
  
  // Show error state (silently fail)
  if (error) return null;
  
  // Show empty state
  if (!nba) return null;

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = (variant: string) => {
    switch (variant) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getVariantStyles(nba.variant)} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon(nba.variant)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {nba.label}
              </p>
              {nba.description && (
                <p className="text-xs mt-1 opacity-90">
                  {nba.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Link
                href={nba.href}
                className="text-sm font-semibold underline hover:no-underline"
                onClick={() => {
                  analytics.track('nba_click', {
                    meta: {
                      actionId: nba.id,
                      context,
                      priority: nba.priority,
                    }
                  });
                }}
              >
                Continue
              </Link>
              
              <button
                onClick={() => setNba(null)}
                className="text-xs opacity-75 hover:opacity-100"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NBARibbon;
