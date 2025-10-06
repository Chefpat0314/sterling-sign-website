/**
 * Churn Risk Calculation
 * 
 * Logistic-lite model for churn risk scoring (0-1)
 */

import { ChurnRiskFactors, PersonaType } from '../../types/forecast';

/**
 * Calculate churn risk for a persona
 */
export async function calculateChurnRisk(features: any, persona: PersonaType): Promise<number> {
  try {
    // Extract churn risk factors
    const factors = await extractChurnFactors(features, persona);
    
    // Calculate churn risk score
    const churnRisk = calculateChurnScore(factors);
    
    // Apply persona-specific adjustments
    const adjustedRisk = applyPersonaAdjustments(churnRisk, persona);
    
    return Math.max(0, Math.min(1, adjustedRisk));
    
  } catch (error) {
    console.error('Error calculating churn risk:', error);
    return 0.3; // Default moderate risk on error
  }
}

/**
 * Extract churn risk factors from features
 */
async function extractChurnFactors(features: any, persona: PersonaType): Promise<ChurnRiskFactors> {
  // Recency: Days since last order (inverse relationship)
  const recency = calculateRecency(features);
  
  // Frequency: Orders per month (inverse relationship)
  const frequency = calculateFrequency(features);
  
  // Monetary: Average order value (inverse relationship)
  const monetary = calculateMonetary(features);
  
  // Engagement delta: Change in engagement over time
  const engagementDelta = calculateEngagementDelta(features);
  
  // Persona risk: Base risk for persona type
  const personaRisk = getPersonaRisk(persona);
  
  return {
    recency,
    frequency,
    monetary,
    engagementDelta,
    personaRisk,
  };
}

/**
 * Calculate recency factor (days since last order)
 */
function calculateRecency(features: any): number {
  // TODO: Replace with actual order data
  // For now, use heuristic based on engagement patterns
  
  const emailEngagement = features.emailEngagement || [];
  const siteEngagement = features.siteEngagement || [];
  
  if (emailEngagement.length === 0 || siteEngagement.length === 0) {
    return 30; // Default 30 days
  }
  
  // Estimate recency based on engagement patterns
  const recentEngagement = emailEngagement.slice(-7).reduce((sum, val) => sum + val, 0) / 7;
  const historicalEngagement = emailEngagement.slice(-28, -7).reduce((sum, val) => sum + val, 0) / 21;
  
  if (recentEngagement > historicalEngagement * 1.2) {
    return 7; // High recent engagement = recent activity
  } else if (recentEngagement > historicalEngagement * 0.8) {
    return 14; // Normal engagement = moderate recency
  } else {
    return 30; // Low engagement = older activity
  }
}

/**
 * Calculate frequency factor (orders per month)
 */
function calculateFrequency(features: any): number {
  // TODO: Replace with actual order data
  // For now, use heuristic based on persona mix and product mix
  
  const personaMix = features.personaMix || {};
  const productMix = features.productMix || {};
  
  // Estimate frequency based on persona and product patterns
  let baseFrequency = 2; // Default 2 orders per month
  
  // Adjust based on persona (some personas order more frequently)
  if (personaMix.contractor > 0.3) {
    baseFrequency += 1; // Contractors order more frequently
  }
  if (personaMix.property_manager > 0.3) {
    baseFrequency += 0.5; // Property managers order moderately
  }
  
  // Adjust based on product mix (some products have higher reorder rates)
  if (productMix.banners > 0.4) {
    baseFrequency += 0.5; // Banners have higher reorder rates
  }
  if (productMix.decals > 0.3) {
    baseFrequency += 0.3; // Decals have moderate reorder rates
  }
  
  return Math.max(0.5, baseFrequency); // Minimum 0.5 orders per month
}

/**
 * Calculate monetary factor (average order value)
 */
function calculateMonetary(features: any): number {
  const dailyRevenue = features.dailyRevenue || [];
  const leadVolume = features.leadVolume || [];
  
  if (dailyRevenue.length === 0 || leadVolume.length === 0) {
    return 500; // Default $500 AOV
  }
  
  const totalRevenue = dailyRevenue.reduce((sum, val) => sum + val, 0);
  const totalLeads = leadVolume.reduce((sum, val) => sum + val, 0);
  
  if (totalLeads === 0) return 500;
  
  const avgOrderValue = totalRevenue / totalLeads;
  return Math.max(100, avgOrderValue); // Minimum $100 AOV
}

/**
 * Calculate engagement delta (change in engagement)
 */
function calculateEngagementDelta(features: any): number {
  const emailEngagement = features.emailEngagement || [];
  const siteEngagement = features.siteEngagement || [];
  
  if (emailEngagement.length < 14 || siteEngagement.length < 14) {
    return 0; // No change if insufficient data
  }
  
  // Calculate recent vs historical engagement
  const recentEmail = emailEngagement.slice(-7).reduce((sum, val) => sum + val, 0) / 7;
  const historicalEmail = emailEngagement.slice(-14, -7).reduce((sum, val) => sum + val, 0) / 7;
  
  const recentSite = siteEngagement.slice(-7).reduce((sum, val) => sum + val, 0) / 7;
  const historicalSite = siteEngagement.slice(-14, -7).reduce((sum, val) => sum + val, 0) / 7;
  
  const emailDelta = (recentEmail - historicalEmail) / historicalEmail;
  const siteDelta = (recentSite - historicalSite) / historicalSite;
  
  // Combined engagement delta
  return (emailDelta + siteDelta) / 2;
}

/**
 * Get persona-specific base risk
 */
function getPersonaRisk(persona: PersonaType): number {
  const personaRisks: Record<PersonaType, number> = {
    contractor: 0.3,        // Moderate risk - project-based
    property_manager: 0.2,  // Low risk - recurring needs
    logistics: 0.4,         // Higher risk - cost-sensitive
    healthcare: 0.1,        // Very low risk - compliance-driven
    smb: 0.5,              // Highest risk - price-sensitive
  };
  
  return personaRisks[persona] || 0.3;
}

/**
 * Calculate churn risk score using logistic-lite model
 */
function calculateChurnScore(factors: ChurnRiskFactors): number {
  // Logistic regression coefficients (simplified)
  const coefficients = {
    recency: -0.02,      // Negative: more recent = lower risk
    frequency: -0.1,     // Negative: more frequent = lower risk
    monetary: -0.001,    // Negative: higher AOV = lower risk
    engagementDelta: -0.5, // Negative: positive delta = lower risk
    personaRisk: 1.0,    // Positive: higher persona risk = higher churn
  };
  
  // Calculate linear combination
  const linearCombination = 
    coefficients.recency * factors.recency +
    coefficients.frequency * factors.frequency +
    coefficients.monetary * factors.monetary +
    coefficients.engagementDelta * factors.engagementDelta +
    coefficients.personaRisk * factors.personaRisk;
  
  // Apply logistic function
  const churnRisk = 1 / (1 + Math.exp(-linearCombination));
  
  return churnRisk;
}

/**
 * Apply persona-specific adjustments
 */
function applyPersonaAdjustments(churnRisk: number, persona: PersonaType): number {
  const adjustments: Record<PersonaType, number> = {
    contractor: 1.0,        // No adjustment
    property_manager: 0.8,  // 20% reduction (more stable)
    logistics: 1.2,         // 20% increase (more volatile)
    healthcare: 0.6,        // 40% reduction (very stable)
    smb: 1.3,              // 30% increase (more volatile)
  };
  
  const adjustment = adjustments[persona] || 1.0;
  return churnRisk * adjustment;
}

/**
 * Get churn risk interpretation
 */
export function interpretChurnRisk(churnRisk: number): {
  level: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  recommendations: string[];
} {
  if (churnRisk < 0.3) {
    return {
      level: 'low',
      description: 'Low churn risk - customer is stable and engaged',
      recommendations: [
        'Maintain current customer success initiatives',
        'Focus on upselling and cross-selling opportunities',
        'Monitor for any early warning signs',
      ],
    };
  } else if (churnRisk < 0.5) {
    return {
      level: 'moderate',
      description: 'Moderate churn risk - monitor customer health closely',
      recommendations: [
        'Increase proactive outreach and engagement',
        'Review customer satisfaction and feedback',
        'Identify and address any service issues',
        'Consider retention incentives',
      ],
    };
  } else if (churnRisk < 0.7) {
    return {
      level: 'high',
      description: 'High churn risk - immediate action required',
      recommendations: [
        'Urgent: Schedule customer success call',
        'Review account history for issues',
        'Implement retention strategies',
        'Consider account manager escalation',
        'Offer special incentives or discounts',
      ],
    };
  } else {
    return {
      level: 'critical',
      description: 'Critical churn risk - emergency intervention needed',
      recommendations: [
        'Emergency: Immediate account manager contact',
        'Review all customer touchpoints for issues',
        'Implement aggressive retention strategies',
        'Consider executive involvement',
        'Prepare for potential churn impact',
      ],
    };
  }
}

/**
 * Get churn risk trend analysis
 */
export function analyzeChurnTrend(historicalChurnRisk: number[]): {
  trend: 'improving' | 'stable' | 'worsening';
  change: number;
  description: string;
} {
  if (historicalChurnRisk.length < 2) {
    return {
      trend: 'stable',
      change: 0,
      description: 'Insufficient data for trend analysis',
    };
  }
  
  const recent = historicalChurnRisk.slice(-7); // Last 7 days
  const previous = historicalChurnRisk.slice(-14, -7); // Previous 7 days
  
  if (recent.length === 0 || previous.length === 0) {
    return {
      trend: 'stable',
      change: 0,
      description: 'Insufficient data for trend analysis',
    };
  }
  
  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
  const previousAvg = previous.reduce((sum, val) => sum + val, 0) / previous.length;
  
  const change = recentAvg - previousAvg;
  const changePercent = (change / previousAvg) * 100;
  
  if (change < -0.05) {
    return {
      trend: 'improving',
      change: changePercent,
      description: `Churn risk improving by ${Math.abs(changePercent).toFixed(1)}% over the past week`,
    };
  } else if (change > 0.05) {
    return {
      trend: 'worsening',
      change: changePercent,
      description: `Churn risk worsening by ${changePercent.toFixed(1)}% over the past week`,
    };
  } else {
    return {
      trend: 'stable',
      change: changePercent,
      description: `Churn risk stable with ${changePercent.toFixed(1)}% change over the past week`,
    };
  }
}
