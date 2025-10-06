/**
 * Feature Store for Predictive Analytics
 * 
 * Centralized feature definitions and transforms for forecasting models
 */

import { FeatureStoreData, PersonaType } from '../../types/forecast';

/**
 * Feature store configuration
 */
export interface FeatureConfig {
  lookbackDays: number;
  seasonalityWindow: number;
  ewmaAlpha: number;
  coldStartDays: number;
}

const DEFAULT_CONFIG: FeatureConfig = {
  lookbackDays: 90,
  seasonalityWindow: 28,
  ewmaAlpha: 0.3,
  coldStartDays: 7,
};

/**
 * Raw data interfaces (from existing analytics)
 */
interface RawRevenueData {
  date: string;
  revenue: number;
  grossMargin: number;
  refunds: number;
}

interface RawLeadData {
  date: string;
  leads: number;
  rfqSubmissions: number;
  wins: number;
}

interface RawCustomerData {
  date: string;
  reorders: number;
  personaMix: Record<PersonaType, number>;
  productMix: Record<string, number>;
}

interface RawOperationalData {
  date: string;
  slaMet: number;
  onTime: number;
  cutoffViews: number;
  freightUsage: number;
}

interface RawEngagementData {
  date: string;
  emailOpenRate: number;
  emailClickRate: number;
  siteSessions: number;
  siteEngagement: number;
}

/**
 * Feature extraction from raw data
 */
export class FeatureStore {
  private config: FeatureConfig;

  constructor(config: Partial<FeatureConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Extract features from raw analytics data
   */
  async extractFeatures(
    revenueData: RawRevenueData[],
    leadData: RawLeadData[],
    customerData: RawCustomerData[],
    operationalData: RawOperationalData[],
    engagementData: RawEngagementData[]
  ): Promise<FeatureStoreData> {
    const dates = this.getDateRange();
    
    return {
      // Revenue features
      dailyRevenue: this.extractDailyRevenue(revenueData, dates),
      grossMargin: this.extractGrossMargin(revenueData, dates),
      refunds: this.extractRefunds(revenueData, dates),
      
      // Lead features
      leadVolume: this.extractLeadVolume(leadData, dates),
      rfqToWinRate: this.extractRfqToWinRate(leadData, dates),
      
      // Customer features
      reorderIntervals: this.extractReorderIntervals(customerData),
      personaMix: this.extractPersonaMix(customerData),
      productMix: this.extractProductMix(customerData),
      
      // Operational features
      slaPromiseMet: this.extractSlaPromiseMet(operationalData, dates),
      onTimePercentage: this.extractOnTimePercentage(operationalData, dates),
      cutoffTimerViews: this.extractCutoffTimerViews(operationalData, dates),
      freightUsage: this.extractFreightUsage(operationalData, dates),
      
      // Engagement features
      emailEngagement: this.extractEmailEngagement(engagementData, dates),
      siteEngagement: this.extractSiteEngagement(engagementData, dates),
      
      // Metadata
      dates,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Get date range for feature extraction
   */
  private getDateRange(): string[] {
    const dates: string[] = [];
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - this.config.lookbackDays);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    
    return dates;
  }

  /**
   * Extract daily revenue with EWMA smoothing
   */
  private extractDailyRevenue(data: RawRevenueData[], dates: string[]): number[] {
    const revenueMap = new Map(data.map(d => [d.date, d.revenue]));
    const smoothed = this.applyEWMA(
      dates.map(date => revenueMap.get(date) || 0),
      this.config.ewmaAlpha
    );
    
    return this.handleColdStart(smoothed);
  }

  /**
   * Extract gross margin percentage
   */
  private extractGrossMargin(data: RawRevenueData[], dates: string[]): number[] {
    const marginMap = new Map(data.map(d => [d.date, d.grossMargin]));
    return dates.map(date => marginMap.get(date) || 0.4); // Default 40% margin
  }

  /**
   * Extract refund amounts
   */
  private extractRefunds(data: RawRevenueData[], dates: string[]): number[] {
    const refundMap = new Map(data.map(d => [d.date, d.refunds]));
    return dates.map(date => refundMap.get(date) || 0);
  }

  /**
   * Extract lead volume
   */
  private extractLeadVolume(data: RawLeadData[], dates: string[]): number[] {
    const leadMap = new Map(data.map(d => [d.date, d.leads]));
    return dates.map(date => leadMap.get(date) || 0);
  }

  /**
   * Extract RFQ to win rate
   */
  private extractRfqToWinRate(data: RawLeadData[], dates: string[]): number[] {
    const winRateMap = new Map(
      data.map(d => [d.date, d.rfqSubmissions > 0 ? d.wins / d.rfqSubmissions : 0])
    );
    return dates.map(date => winRateMap.get(date) || 0.15); // Default 15% win rate
  }

  /**
   * Extract reorder intervals (days between orders)
   */
  private extractReorderIntervals(data: RawCustomerData[]): number[] {
    // TODO: Implement from actual order data
    // For now, return mock data based on typical B2B patterns
    return [30, 45, 60, 90, 120]; // Days between reorders
  }

  /**
   * Extract persona mix percentages
   */
  private extractPersonaMix(data: RawCustomerData[]): Record<PersonaType, number> {
    if (data.length === 0) {
      return {
        contractor: 0.35,
        property_manager: 0.25,
        logistics: 0.20,
        healthcare: 0.15,
        smb: 0.05,
      };
    }
    
    // Calculate from recent data
    const recent = data.slice(-7); // Last 7 days
    const total = recent.reduce((sum, d) => sum + Object.values(d.personaMix).reduce((s, v) => s + v, 0), 0);
    
    if (total === 0) {
      return {
        contractor: 0.35,
        property_manager: 0.25,
        logistics: 0.20,
        healthcare: 0.15,
        smb: 0.05,
      };
    }
    
    const mix: Record<PersonaType, number> = {
      contractor: 0,
      property_manager: 0,
      logistics: 0,
      healthcare: 0,
      smb: 0,
    };
    
    recent.forEach(d => {
      Object.entries(d.personaMix).forEach(([persona, count]) => {
        mix[persona as PersonaType] += count;
      });
    });
    
    // Normalize to percentages
    Object.keys(mix).forEach(key => {
      mix[key as PersonaType] = mix[key as PersonaType] / total;
    });
    
    return mix;
  }

  /**
   * Extract product mix percentages
   */
  private extractProductMix(data: RawCustomerData[]): Record<string, number> {
    if (data.length === 0) {
      return {
        'banners': 0.40,
        'yard-signs': 0.25,
        'decals': 0.15,
        'ada-signs': 0.10,
        'safety-signs': 0.10,
      };
    }
    
    // Calculate from recent data
    const recent = data.slice(-7);
    const total = recent.reduce((sum, d) => sum + Object.values(d.productMix).reduce((s, v) => s + v, 0), 0);
    
    if (total === 0) {
      return {
        'banners': 0.40,
        'yard-signs': 0.25,
        'decals': 0.15,
        'ada-signs': 0.10,
        'safety-signs': 0.10,
      };
    }
    
    const mix: Record<string, number> = {};
    
    recent.forEach(d => {
      Object.entries(d.productMix).forEach(([product, count]) => {
        mix[product] = (mix[product] || 0) + count;
      });
    });
    
    // Normalize to percentages
    Object.keys(mix).forEach(key => {
      mix[key] = mix[key] / total;
    });
    
    return mix;
  }

  /**
   * Extract SLA promise met percentage
   */
  private extractSlaPromiseMet(data: RawOperationalData[], dates: string[]): number[] {
    const slaMap = new Map(data.map(d => [d.date, d.slaMet]));
    return dates.map(date => slaMap.get(date) || 0.97); // Default 97% SLA
  }

  /**
   * Extract on-time percentage
   */
  private extractOnTimePercentage(data: RawOperationalData[], dates: string[]): number[] {
    const onTimeMap = new Map(data.map(d => [d.date, d.onTime]));
    return dates.map(date => onTimeMap.get(date) || 0.95); // Default 95% on-time
  }

  /**
   * Extract cutoff timer views
   */
  private extractCutoffTimerViews(data: RawOperationalData[], dates: string[]): number[] {
    const cutoffMap = new Map(data.map(d => [d.date, d.cutoffViews]));
    return dates.map(date => cutoffMap.get(date) || 0);
  }

  /**
   * Extract freight usage percentage
   */
  private extractFreightUsage(data: RawOperationalData[], dates: string[]): number[] {
    const freightMap = new Map(data.map(d => [d.date, d.freightUsage]));
    return dates.map(date => freightMap.get(date) || 0.3); // Default 30% freight
  }

  /**
   * Extract email engagement (open + click rate)
   */
  private extractEmailEngagement(data: RawEngagementData[], dates: string[]): number[] {
    const engagementMap = new Map(
      data.map(d => [d.date, (d.emailOpenRate + d.emailClickRate) / 2])
    );
    return dates.map(date => engagementMap.get(date) || 0.25); // Default 25% engagement
  }

  /**
   * Extract site engagement (sessions with meaningful interaction)
   */
  private extractSiteEngagement(data: RawEngagementData[], dates: string[]): number[] {
    const engagementMap = new Map(data.map(d => [d.date, d.siteEngagement]));
    return dates.map(date => engagementMap.get(date) || 0.4); // Default 40% engagement
  }

  /**
   * Apply EWMA (Exponentially Weighted Moving Average) smoothing
   */
  private applyEWMA(data: number[], alpha: number): number[] {
    if (data.length === 0) return [];
    
    const smoothed = [data[0]];
    
    for (let i = 1; i < data.length; i++) {
      smoothed.push(alpha * data[i] + (1 - alpha) * smoothed[i - 1]);
    }
    
    return smoothed;
  }

  /**
   * Handle cold start with default values
   */
  private handleColdStart(data: number[]): number[] {
    if (data.length === 0) return [];
    
    const hasData = data.some(val => val > 0);
    if (hasData) return data;
    
    // Cold start: use average of non-zero values or default
    const avg = data.reduce((sum, val) => sum + val, 0) / data.length;
    const defaultValue = avg > 0 ? avg : 1000; // Default $1000 daily revenue
    
    return data.map(val => val === 0 ? defaultValue : val);
  }

  /**
   * Calculate rolling window statistics
   */
  calculateRollingStats(data: number[], window: number): {
    mean: number[];
    std: number[];
    variance: number[];
  } {
    const mean: number[] = [];
    const std: number[] = [];
    const variance: number[] = [];
    
    for (let i = window - 1; i < data.length; i++) {
      const windowData = data.slice(i - window + 1, i + 1);
      const windowMean = windowData.reduce((sum, val) => sum + val, 0) / window;
      const windowVariance = windowData.reduce((sum, val) => sum + Math.pow(val - windowMean, 2), 0) / window;
      const windowStd = Math.sqrt(windowVariance);
      
      mean.push(windowMean);
      std.push(windowStd);
      variance.push(windowVariance);
    }
    
    return { mean, std, variance };
  }

  /**
   * Detect seasonality patterns
   */
  detectSeasonality(data: number[], period: number = 7): {
    hasSeasonality: boolean;
    seasonalStrength: number;
    seasonalIndices: number[];
  } {
    if (data.length < period * 2) {
      return {
        hasSeasonality: false,
        seasonalStrength: 0,
        seasonalIndices: new Array(period).fill(1),
      };
    }
    
    // Calculate seasonal indices
    const seasonalIndices = new Array(period).fill(0);
    const seasonalCounts = new Array(period).fill(0);
    
    for (let i = 0; i < data.length; i++) {
      const dayOfWeek = i % period;
      seasonalIndices[dayOfWeek] += data[i];
      seasonalCounts[dayOfWeek]++;
    }
    
    // Normalize indices
    for (let i = 0; i < period; i++) {
      if (seasonalCounts[i] > 0) {
        seasonalIndices[i] /= seasonalCounts[i];
      }
    }
    
    // Calculate seasonal strength
    const overallMean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const seasonalVariance = seasonalIndices.reduce((sum, val) => sum + Math.pow(val - overallMean, 2), 0) / period;
    const totalVariance = data.reduce((sum, val) => sum + Math.pow(val - overallMean, 2), 0) / data.length;
    
    const seasonalStrength = totalVariance > 0 ? seasonalVariance / totalVariance : 0;
    const hasSeasonality = seasonalStrength > 0.1; // Threshold for seasonality
    
    return {
      hasSeasonality,
      seasonalStrength,
      seasonalIndices,
    };
  }
}
