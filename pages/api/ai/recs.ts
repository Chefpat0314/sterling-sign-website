/**
 * AI Recommendations API Endpoint
 * 
 * Server endpoint for recommendation engine
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { getRecs } from '../../../lib/ai/recs/RecEngine';
import { FLAGS } from '../../../config/featureFlags';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if recommendations are enabled
  if (!FLAGS.RECS_ENABLED) {
    return res.status(200).json({
      recommendations: [],
      strategy: 'disabled',
      fallbackUsed: true,
      processingTime: 0,
      metadata: {
        totalCandidates: 0,
        filteredCount: 0,
        diversityScore: 0,
      },
    });
  }

  try {
    const { userId, productId, category, k = '8' } = req.query;
    
    // Validate parameters
    const kNum = parseInt(k as string, 10);
    if (isNaN(kNum) || kNum < 1 || kNum > 20) {
      return res.status(400).json({ error: 'Invalid k parameter' });
    }

    // Check consent (simplified for demo)
    const consent = true; // In real implementation, check user consent
    
    // Build request context
    const request = {
      context: {
        userId: userId as string || null,
        productId: productId as string || null,
        category: category as string || null,
        k: kNum,
        consent,
        sessionId: req.headers['x-session-id'] as string || null,
      },
      config: {
        strategies: ['buy_again', 'co_view', 'content_sim', 'trending', 'fallback'],
        maxPerCategory: 4,
        minScore: 0.1,
        diversityWeight: 0.3,
        recencyWeight: 0.2,
        popularityWeight: 0.5,
      },
      filters: {
        categories: category ? [category as string] : undefined,
        availableOnly: true,
      },
    };

    // Get recommendations
    const result = await getRecs(request);
    
    // Add CORS headers for client-side requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Error in recommendations API:', error);
    
    // Return fallback recommendations on error
    return res.status(200).json({
      recommendations: [],
      strategy: 'error_fallback',
      fallbackUsed: true,
      processingTime: 0,
      metadata: {
        totalCandidates: 0,
        filteredCount: 0,
        diversityScore: 0,
      },
    });
  }
}
