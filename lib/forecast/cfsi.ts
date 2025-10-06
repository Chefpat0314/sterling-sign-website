/**
 * Cash Flow Stability Index (CFSI)
 * 
 * Composite metric (0-100) for cash flow stability assessment
 */

import { CFSIComponents } from '../../types/forecast';

/**
 * Calculate Cash Flow Stability Index
 */
export async function calculateCFSI(features: any): Promise<number> {
  try {
    // Extract CFSI components
    const components = await extractCFSIComponents(features);
    
    // Calculate weighted CFSI score
    const cfsi = calculateWeightedCFSI(components);
    
    // Apply normalization and bounds
    return Math.max(0, Math.min(100, cfsi));
    
  } catch (error) {
    console.error('Error calculating CFSI:', error);
    return 50; // Default neutral score on error
  }
}

/**
 * Extract CFSI components from features
 */
async function extractCFSIComponents(features: any): Promise<CFSIComponents> {
  // Revenue volatility (σ) - lower is better
  const revenueVolatility = calculateRevenueVolatility(features.dailyRevenue);
  
  // AR aging proxy - days to payment (heuristic)
  const arAging = calculateARAging(features);
  
  // Refund rate - lower is better
  const refundRate = calculateRefundRate(features);
  
  // Method mix risk - freight share (higher freight = higher risk)
  const methodMixRisk = calculateMethodMixRisk(features);
  
  // Dependency risk - top client concentration
  const dependencyRisk = calculateDependencyRisk(features);
  
  // OTIF percentage - higher is better
  const otifPercentage = calculateOTIFPercentage(features);
  
  return {
    revenueVolatility,
    arAging,
    refundRate,
    methodMixRisk,
    dependencyRisk,
    otifPercentage,
  };
}

/**
 * Calculate revenue volatility (0-100, lower is better)
 */
function calculateRevenueVolatility(dailyRevenue: number[]): number {
  if (dailyRevenue.length < 7) return 50; // Default if insufficient data
  
  const mean = dailyRevenue.reduce((sum, val) => sum + val, 0) / dailyRevenue.length;
  const variance = dailyRevenue.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / dailyRevenue.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / mean;
  
  // Convert to 0-100 scale (lower CV = higher score)
  // CV of 0.1 = 90 points, CV of 0.5 = 50 points, CV of 1.0 = 0 points
  const score = Math.max(0, 100 - (coefficientOfVariation * 100));
  return Math.min(100, score);
}

/**
 * Calculate AR aging proxy (0-100, lower is better)
 */
function calculateARAging(features: any): number {
  // Heuristic: based on payment method mix and historical patterns
  const freightUsage = features.freightUsage || [];
  const avgFreightUsage = freightUsage.length > 0 
    ? freightUsage.reduce((sum, val) => sum + val, 0) / freightUsage.length 
    : 0.3;
  
  // Higher freight usage typically means longer payment terms
  // Freight: 30-60 days, Ground: 15-30 days, Rush: 7-14 days
  const estimatedDays = 15 + (avgFreightUsage * 45); // 15-60 days range
  
  // Convert to 0-100 scale (lower days = higher score)
  const score = Math.max(0, 100 - (estimatedDays * 1.5));
  return Math.min(100, score);
}

/**
 * Calculate refund rate (0-100, lower is better)
 */
function calculateRefundRate(features: any): number {
  const dailyRevenue = features.dailyRevenue || [];
  const refunds = features.refunds || [];
  
  if (dailyRevenue.length === 0 || refunds.length === 0) return 80; // Default good score
  
  const totalRevenue = dailyRevenue.reduce((sum, val) => sum + val, 0);
  const totalRefunds = refunds.reduce((sum, val) => sum + val, 0);
  
  if (totalRevenue === 0) return 80;
  
  const refundRate = totalRefunds / totalRevenue;
  
  // Convert to 0-100 scale (lower refund rate = higher score)
  // 0% refunds = 100 points, 5% refunds = 50 points, 10% refunds = 0 points
  const score = Math.max(0, 100 - (refundRate * 1000));
  return Math.min(100, score);
}

/**
 * Calculate method mix risk (0-100, lower freight = higher score)
 */
function calculateMethodMixRisk(features: any): number {
  const freightUsage = features.freightUsage || [];
  
  if (freightUsage.length === 0) return 70; // Default moderate score
  
  const avgFreightUsage = freightUsage.reduce((sum, val) => sum + val, 0) / freightUsage.length;
  
  // Convert to 0-100 scale (lower freight usage = higher score)
  // 0% freight = 100 points, 50% freight = 50 points, 100% freight = 0 points
  const score = 100 - (avgFreightUsage * 100);
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate dependency risk (0-100, lower concentration = higher score)
 */
function calculateDependencyRisk(features: any): number {
  // Heuristic: based on persona mix diversity
  const personaMix = features.personaMix || {};
  const personas = Object.values(personaMix) as number[];
  
  if (personas.length === 0) return 60; // Default moderate score
  
  // Calculate Herfindahl-Hirschman Index (HHI) for concentration
  const hhi = personas.reduce((sum, share) => sum + Math.pow(share, 2), 0);
  
  // Convert HHI to 0-100 scale (lower HHI = higher score)
  // HHI of 0.2 (diverse) = 100 points, HHI of 0.5 (moderate) = 50 points, HHI of 1.0 (concentrated) = 0 points
  const score = Math.max(0, 100 - (hhi * 100));
  return Math.min(100, score);
}

/**
 * Calculate OTIF percentage (0-100, higher is better)
 */
function calculateOTIFPercentage(features: any): number {
  const slaPromiseMet = features.slaPromiseMet || [];
  const onTimePercentage = features.onTimePercentage || [];
  
  if (slaPromiseMet.length === 0 || onTimePercentage.length === 0) return 85; // Default good score
  
  const avgSlaMet = slaPromiseMet.reduce((sum, val) => sum + val, 0) / slaPromiseMet.length;
  const avgOnTime = onTimePercentage.reduce((sum, val) => sum + val, 0) / onTimePercentage.length;
  
  // Combined OTIF score (weighted average)
  const otifScore = (avgSlaMet * 0.6 + avgOnTime * 0.4) * 100;
  
  return Math.max(0, Math.min(100, otifScore));
}

/**
 * Calculate weighted CFSI score
 */
function calculateWeightedCFSI(components: CFSIComponents): number {
  // Weightings based on business impact
  const weights = {
    revenueVolatility: 0.25,    // 25% - Revenue stability is critical
    arAging: 0.20,             // 20% - Cash flow timing
    refundRate: 0.15,          // 15% - Quality and customer satisfaction
    methodMixRisk: 0.15,       // 15% - Operational risk
    dependencyRisk: 0.15,      // 15% - Customer concentration risk
    otifPercentage: 0.10,     // 10% - Operational excellence
  };
  
  const weightedSum = 
    components.revenueVolatility * weights.revenueVolatility +
    components.arAging * weights.arAging +
    components.refundRate * weights.refundRate +
    components.methodMixRisk * weights.methodMixRisk +
    components.dependencyRisk * weights.dependencyRisk +
    components.otifPercentage * weights.otifPercentage;
  
  return weightedSum;
}

/**
 * Get CFSI interpretation
 */
export function interpretCFSI(cfsi: number): {
  level: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  description: string;
  recommendations: string[];
} {
  if (cfsi >= 90) {
    return {
      level: 'excellent',
      description: 'Cash flow stability is excellent with strong operational health',
      recommendations: [
        'Maintain current operational excellence',
        'Consider expansion opportunities',
        'Monitor for any emerging risks',
      ],
    };
  } else if (cfsi >= 75) {
    return {
      level: 'good',
      description: 'Cash flow stability is good with minor areas for improvement',
      recommendations: [
        'Focus on reducing revenue volatility',
        'Optimize payment terms and methods',
        'Strengthen customer diversification',
      ],
    };
  } else if (cfsi >= 60) {
    return {
      level: 'fair',
      description: 'Cash flow stability is fair with several improvement opportunities',
      recommendations: [
        'Implement revenue smoothing strategies',
        'Review and optimize operational processes',
        'Strengthen customer relationships',
        'Diversify customer base',
      ],
    };
  } else if (cfsi >= 40) {
    return {
      level: 'poor',
      description: 'Cash flow stability is poor and requires immediate attention',
      recommendations: [
        'Urgent: Implement cash flow management strategies',
        'Review and reduce operational risks',
        'Strengthen customer retention programs',
        'Consider financial restructuring',
      ],
    };
  } else {
    return {
      level: 'critical',
      description: 'Cash flow stability is critical and requires emergency intervention',
      recommendations: [
        'Emergency: Implement immediate cash flow controls',
        'Review all operational processes',
        'Consider emergency funding options',
        'Engage financial advisors immediately',
      ],
    };
  }
}

/**
 * Get CFSI trend analysis
 */
export function analyzeCFSITrend(historicalCFSI: number[]): {
  trend: 'improving' | 'stable' | 'declining';
  change: number;
  description: string;
} {
  if (historicalCFSI.length < 2) {
    return {
      trend: 'stable',
      change: 0,
      description: 'Insufficient data for trend analysis',
    };
  }
  
  const recent = historicalCFSI.slice(-7); // Last 7 days
  const previous = historicalCFSI.slice(-14, -7); // Previous 7 days
  
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
  
  if (change > 5) {
    return {
      trend: 'improving',
      change: changePercent,
      description: `CFSI improving by ${changePercent.toFixed(1)}% over the past week`,
    };
  } else if (change < -5) {
    return {
      trend: 'declining',
      change: changePercent,
      description: `CFSI declining by ${Math.abs(changePercent).toFixed(1)}% over the past week`,
    };
  } else {
    return {
      trend: 'stable',
      change: changePercent,
      description: `CFSI stable with ${changePercent.toFixed(1)}% change over the past week`,
    };
  }
}
