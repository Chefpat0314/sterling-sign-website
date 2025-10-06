/**
 * Next-Best-Action API Endpoint
 * 
 * Server endpoint for NBA system
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { getNextBestAction, validateNBARequest } from '../../../lib/ai/nba/NextBestAction';
import { FLAGS } from '../../../config/featureFlags';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if NBA is enabled
  if (!FLAGS.NBA_ENABLED) {
    return res.status(200).json(null);
  }

  try {
    const { context, userId, productId, sessionId } = req.query;
    
    // Validate required parameters
    if (!context || typeof context !== 'string') {
      return res.status(400).json({ error: 'Context is required' });
    }

    // Validate context value
    const validContexts = ['PDP', 'CART', 'CHECKOUT', 'ACCOUNT', 'HOMEPAGE'];
    if (!validContexts.includes(context)) {
      return res.status(400).json({ error: 'Invalid context' });
    }

    // Build NBA request
    const nbaRequest = {
      context: context as any,
      userId: userId as string || undefined,
      productId: productId as string || undefined,
      sessionId: sessionId as string || undefined,
      userState: {
        recentViews: [], // In real implementation, fetch from analytics
        cartItems: [], // In real implementation, fetch from cart
        purchaseHistory: [], // In real implementation, fetch from orders
        lastActivity: new Date(),
        totalSpent: 0,
        avgOrderValue: 0,
      },
      productState: {
        category: 'banners', // In real implementation, fetch from product data
        price: 50,
        popularity: true,
        availability: true,
      },
    };

    // Validate request
    if (!validateNBARequest(nbaRequest)) {
      return res.status(400).json({ error: 'Invalid NBA request' });
    }

    // Get next best action
    const result = await getNextBestAction(nbaRequest);
    
    // Add CORS headers for client-side requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Return action if available
    if (result.action) {
      return res.status(200).json(result.action);
    }
    
    // Return null if no action
    return res.status(200).json(null);
    
  } catch (error) {
    console.error('Error in NBA API:', error);
    
    // Return null on error (fail silently)
    return res.status(200).json(null);
  }
}
