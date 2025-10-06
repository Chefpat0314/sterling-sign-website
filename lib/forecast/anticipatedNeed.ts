/**
 * Anticipated Need Calculation
 * 
 * Hazard-style approach for predicting next likely order window
 */

import { AnticipatedNeed, PersonaType } from '../../types/forecast';

/**
 * Calculate anticipated need for a persona
 */
export async function calculateAnticipatedNeed(
  features: any, 
  persona: PersonaType
): Promise<AnticipatedNeed> {
  try {
    // Extract reorder patterns
    const reorderPatterns = extractReorderPatterns(features, persona);
    
    // Calculate next window
    const nextWindow = calculateNextWindow(reorderPatterns, persona);
    
    // Calculate confidence
    const confidence = calculateConfidence(reorderPatterns, persona);
    
    // Identify top signals
    const topSignals = identifyTopSignals(features, persona);
    
    return {
      nextWindowStart: nextWindow.start,
      nextWindowEnd: nextWindow.end,
      confidence,
      topSignals,
    };
    
  } catch (error) {
    console.error('Error calculating anticipated need:', error);
    // Return default window
    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() + 30);
    const defaultEnd = new Date();
    defaultEnd.setDate(defaultEnd.getDate() + 45);
    
    return {
      nextWindowStart: defaultStart.toISOString().split('T')[0],
      nextWindowEnd: defaultEnd.toISOString().split('T')[0],
      confidence: 0.3,
      topSignals: ['Default pattern'],
    };
  }
}

/**
 * Extract reorder patterns from features
 */
function extractReorderPatterns(features: any, persona: PersonaType): {
  intervals: number[];
  avgInterval: number;
  stdInterval: number;
  lastOrder: Date;
  personaPattern: PersonaPattern;
} {
  // Get reorder intervals (days between orders)
  const intervals = features.reorderIntervals || [];
  
  // Calculate statistics
  const avgInterval = intervals.length > 0 
    ? intervals.reduce((sum, val) => sum + val, 0) / intervals.length 
    : getDefaultInterval(persona);
  
  const stdInterval = intervals.length > 1
    ? Math.sqrt(intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length)
    : avgInterval * 0.3; // 30% standard deviation
  
  // Estimate last order date
  const lastOrder = estimateLastOrderDate(features);
  
  // Get persona-specific pattern
  const personaPattern = getPersonaPattern(persona);
  
  return {
    intervals,
    avgInterval,
    stdInterval,
    lastOrder,
    personaPattern,
  };
}

/**
 * Get default interval for persona
 */
function getDefaultInterval(persona: PersonaType): number {
  const defaultIntervals: Record<PersonaType, number> = {
    contractor: 45,        // 45 days - project-based
    property_manager: 60,  // 60 days - recurring needs
    logistics: 30,         // 30 days - frequent orders
    healthcare: 90,        // 90 days - compliance-driven
    smb: 60,              // 60 days - moderate frequency
  };
  
  return defaultIntervals[persona] || 60;
}

/**
 * Estimate last order date from features
 */
function estimateLastOrderDate(features: any): Date {
  // Use engagement patterns to estimate last activity
  const emailEngagement = features.emailEngagement || [];
  const siteEngagement = features.siteEngagement || [];
  
  if (emailEngagement.length === 0 || siteEngagement.length === 0) {
    // Default to 30 days ago
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  }
  
  // Find last high engagement period
  const combinedEngagement = emailEngagement.map((email, i) => 
    email + (siteEngagement[i] || 0)
  );
  
  // Look for last significant engagement
  const threshold = 0.5; // 50% of max engagement
  const maxEngagement = Math.max(...combinedEngagement);
  const minEngagement = maxEngagement * threshold;
  
  let lastHighEngagement = -1;
  for (let i = combinedEngagement.length - 1; i >= 0; i--) {
    if (combinedEngagement[i] >= minEngagement) {
      lastHighEngagement = i;
      break;
    }
  }
  
  if (lastHighEngagement === -1) {
    // No high engagement found, use default
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  }
  
  // Convert to actual date
  const date = new Date();
  date.setDate(date.getDate() - (combinedEngagement.length - lastHighEngagement));
  return date;
}

/**
 * Get persona-specific pattern
 */
function getPersonaPattern(persona: PersonaType): PersonaPattern {
  const patterns: Record<PersonaType, PersonaPattern> = {
    contractor: {
      seasonality: 'project-based',
      urgency: 'medium',
      predictability: 'medium',
      factors: ['project_cycle', 'season', 'workload'],
    },
    property_manager: {
      seasonality: 'monthly',
      urgency: 'low',
      predictability: 'high',
      factors: ['budget_cycle', 'tenant_turnover', 'maintenance_schedule'],
    },
    logistics: {
      seasonality: 'demand-driven',
      urgency: 'high',
      predictability: 'low',
      factors: ['demand_forecast', 'inventory_levels', 'supply_chain'],
    },
    healthcare: {
      seasonality: 'compliance-driven',
      urgency: 'medium',
      predictability: 'high',
      factors: ['compliance_deadlines', 'audit_schedule', 'regulatory_changes'],
    },
    smb: {
      seasonality: 'business_cycle',
      urgency: 'medium',
      predictability: 'medium',
      factors: ['cash_flow', 'growth_stage', 'market_conditions'],
    },
  };
  
  return patterns[persona] || patterns.smb;
}

/**
 * Calculate next window using hazard model
 */
function calculateNextWindow(
  patterns: any, 
  persona: PersonaType
): { start: string; end: string } {
  const { avgInterval, stdInterval, lastOrder } = patterns;
  
  // Calculate next expected order date
  const nextExpected = new Date(lastOrder);
  nextExpected.setDate(nextExpected.getDate() + avgInterval);
  
  // Calculate window based on uncertainty
  const uncertainty = stdInterval * 0.5; // 50% of standard deviation
  const windowStart = new Date(nextExpected);
  windowStart.setDate(windowStart.getDate() - uncertainty);
  
  const windowEnd = new Date(nextExpected);
  windowEnd.setDate(windowEnd.getDate() + uncertainty);
  
  // Apply persona-specific adjustments
  const adjustedWindow = applyPersonaAdjustments(
    { start: windowStart, end: windowEnd },
    persona
  );
  
  return {
    start: adjustedWindow.start.toISOString().split('T')[0],
    end: adjustedWindow.end.toISOString().split('T')[0],
  };
}

/**
 * Apply persona-specific adjustments to window
 */
function applyPersonaAdjustments(
  window: { start: Date; end: Date },
  persona: PersonaType
): { start: Date; end: Date } {
  const adjustments: Record<PersonaType, { start: number; end: number }> = {
    contractor: { start: -7, end: 14 },      // Wider window for project-based
    property_manager: { start: -3, end: 7 },  // Narrower window for predictable
    logistics: { start: -14, end: 21 },     // Wider window for demand-driven
    healthcare: { start: -5, end: 10 },      // Moderate window for compliance
    smb: { start: -7, end: 14 },            // Standard window for business cycle
  };
  
  const adjustment = adjustments[persona] || adjustments.smb;
  
  const adjustedStart = new Date(window.start);
  adjustedStart.setDate(adjustedStart.getDate() + adjustment.start);
  
  const adjustedEnd = new Date(window.end);
  adjustedEnd.setDate(adjustedEnd.getDate() + adjustment.end);
  
  return {
    start: adjustedStart,
    end: adjustedEnd,
  };
}

/**
 * Calculate confidence in the prediction
 */
function calculateConfidence(patterns: any, persona: PersonaType): number {
  const { intervals, avgInterval, stdInterval } = patterns;
  
  // Base confidence on data quality and consistency
  let confidence = 0.5; // Start with 50% confidence
  
  // Adjust based on data quality
  if (intervals.length >= 5) {
    confidence += 0.2; // More data = higher confidence
  }
  
  // Adjust based on consistency (lower std = higher confidence)
  const coefficientOfVariation = stdInterval / avgInterval;
  if (coefficientOfVariation < 0.3) {
    confidence += 0.2; // Very consistent
  } else if (coefficientOfVariation < 0.5) {
    confidence += 0.1; // Moderately consistent
  }
  
  // Adjust based on persona predictability
  const personaConfidence = getPersonaConfidence(persona);
  confidence = (confidence + personaConfidence) / 2;
  
  return Math.max(0.1, Math.min(0.9, confidence));
}

/**
 * Get persona-specific confidence
 */
function getPersonaConfidence(persona: PersonaType): number {
  const personaConfidences: Record<PersonaType, number> = {
    contractor: 0.6,        // Medium confidence - project-based
    property_manager: 0.8,  // High confidence - predictable
    logistics: 0.4,         // Low confidence - demand-driven
    healthcare: 0.7,         // High confidence - compliance-driven
    smb: 0.5,              // Medium confidence - business cycle
  };
  
  return personaConfidences[persona] || 0.5;
}

/**
 * Identify top signals driving the prediction
 */
function identifyTopSignals(features: any, persona: PersonaType): string[] {
  const signals: string[] = [];
  
  // Engagement signals
  const emailEngagement = features.emailEngagement || [];
  const siteEngagement = features.siteEngagement || [];
  
  if (emailEngagement.length > 0) {
    const recentEmail = emailEngagement.slice(-7).reduce((sum, val) => sum + val, 0) / 7;
    const historicalEmail = emailEngagement.slice(-14, -7).reduce((sum, val) => sum + val, 0) / 7;
    
    if (recentEmail > historicalEmail * 1.2) {
      signals.push('Increased email engagement');
    } else if (recentEmail < historicalEmail * 0.8) {
      signals.push('Decreased email engagement');
    }
  }
  
  if (siteEngagement.length > 0) {
    const recentSite = siteEngagement.slice(-7).reduce((sum, val) => sum + val, 0) / 7;
    const historicalSite = siteEngagement.slice(-14, -7).reduce((sum, val) => sum + val, 0) / 7;
    
    if (recentSite > historicalSite * 1.2) {
      signals.push('Increased site engagement');
    } else if (recentSite < historicalSite * 0.8) {
      signals.push('Decreased site engagement');
    }
  }
  
  // Revenue signals
  const dailyRevenue = features.dailyRevenue || [];
  if (dailyRevenue.length > 0) {
    const recentRevenue = dailyRevenue.slice(-7).reduce((sum, val) => sum + val, 0) / 7;
    const historicalRevenue = dailyRevenue.slice(-14, -7).reduce((sum, val) => sum + val, 0) / 7;
    
    if (recentRevenue > historicalRevenue * 1.1) {
      signals.push('Revenue growth trend');
    } else if (recentRevenue < historicalRevenue * 0.9) {
      signals.push('Revenue decline trend');
    }
  }
  
  // Persona-specific signals
  const personaSignals = getPersonaSignals(persona);
  signals.push(...personaSignals);
  
  // Operational signals
  const slaPromiseMet = features.slaPromiseMet || [];
  if (slaPromiseMet.length > 0) {
    const avgSla = slaPromiseMet.reduce((sum, val) => sum + val, 0) / slaPromiseMet.length;
    if (avgSla > 0.95) {
      signals.push('High SLA performance');
    } else if (avgSla < 0.90) {
      signals.push('SLA performance concerns');
    }
  }
  
  return signals.slice(0, 5); // Return top 5 signals
}

/**
 * Get persona-specific signals
 */
function getPersonaSignals(persona: PersonaType): string[] {
  const personaSignals: Record<PersonaType, string[]> = {
    contractor: [
      'Project cycle analysis',
      'Seasonal construction patterns',
      'Workload indicators',
    ],
    property_manager: [
      'Budget cycle timing',
      'Tenant turnover patterns',
      'Maintenance schedule alignment',
    ],
    logistics: [
      'Demand forecast trends',
      'Inventory level indicators',
      'Supply chain disruptions',
    ],
    healthcare: [
      'Compliance deadline tracking',
      'Audit schedule alignment',
      'Regulatory change impacts',
    ],
    smb: [
      'Cash flow indicators',
      'Growth stage analysis',
      'Market condition impacts',
    ],
  };
  
  return personaSignals[persona] || personaSignals.smb;
}

/**
 * Persona pattern interface
 */
interface PersonaPattern {
  seasonality: string;
  urgency: 'low' | 'medium' | 'high';
  predictability: 'low' | 'medium' | 'high';
  factors: string[];
}

/**
 * Get anticipated need interpretation
 */
export function interpretAnticipatedNeed(anticipatedNeed: AnticipatedNeed): {
  level: 'high' | 'medium' | 'low';
  description: string;
  recommendations: string[];
} {
  const { confidence, nextWindowStart, nextWindowEnd } = anticipatedNeed;
  
  // Calculate days until window
  const now = new Date();
  const windowStart = new Date(nextWindowStart);
  const daysUntilWindow = Math.ceil((windowStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (confidence >= 0.7 && daysUntilWindow <= 14) {
    return {
      level: 'high',
      description: 'High confidence in upcoming order window within 2 weeks',
      recommendations: [
        'Prepare proactive outreach materials',
        'Review account for upselling opportunities',
        'Schedule account manager check-in',
        'Prepare personalized proposals',
      ],
    };
  } else if (confidence >= 0.5 && daysUntilWindow <= 30) {
    return {
      level: 'medium',
      description: 'Moderate confidence in upcoming order window within a month',
      recommendations: [
        'Monitor engagement signals closely',
        'Prepare targeted marketing materials',
        'Review account health metrics',
        'Plan follow-up sequence',
      ],
    };
  } else {
    return {
      level: 'low',
      description: 'Lower confidence in upcoming order window',
      recommendations: [
        'Focus on relationship building',
        'Provide value-added content',
        'Monitor for early signals',
        'Maintain regular touchpoints',
      ],
    };
  }
}
