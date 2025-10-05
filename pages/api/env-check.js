// pages/api/env-check.js
import { getRFQProvider } from '../../lib/rfqProvider';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const provider = getRFQProvider();
    
    // Return provider type without exposing sensitive values
    return res.status(200).json({ 
      provider: provider.type === 'hubspot' ? 'hubspot' : 'none'
    });
  } catch (error) {
    console.error('Env check error:', error);
    return res.status(500).json({ 
      provider: 'none',
      error: 'Failed to check environment configuration'
    });
  }
}



