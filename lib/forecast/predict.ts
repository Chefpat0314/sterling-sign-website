/**
 * Prediction Pipeline
 * 
 * Main forecasting pipeline with confidence bands and model selection
 */

import { 
  ForecastOutput, 
  ForecastHorizon, 
  PersonaType, 
  ModelConfig,
  RevenueForecastPoint 
} from '../../types/forecast';
import { FeatureStore } from './featureStore';
import { ModelEnsemble, ETSLiteModel, EWMAModel, ARLiteModel } from './models';
import { calculateCFSI } from './cfsi';
import { calculateChurnRisk } from './churn';
import { calculateAnticipatedNeed } from './anticipatedNeed';
import { runCreatorCheck } from './governance';

/**
 * Main prediction pipeline
 */
export class PredictionPipeline {
  private featureStore: FeatureStore;
  private modelConfig: ModelConfig;

  constructor(config: Partial<ModelConfig> = {}) {
    this.featureStore = new FeatureStore();
    this.modelConfig = {
      alpha: 0.3,
      beta: 0.1,
      gamma: 0.1,
      confidenceLevel: 0.8,
      churnThreshold: 0.6,
      lookbackDays: 90,
      minConfidence: 0.3,
      maxWindowDays: 30,
      ...config,
    };
  }

  /**
   * Generate comprehensive forecast
   */
  async generateForecast(
    persona: PersonaType,
    horizons: ForecastHorizon[] = ['14d', '30d', '60d']
  ): Promise<ForecastOutput> {
    const startTime = Date.now();
    
    try {
      // Extract features from data sources
      const features = await this.extractFeatures();
      
      // Generate revenue forecasts for each horizon
      const revenueForecasts: RevenueForecastPoint[] = [];
      for (const horizon of horizons) {
        const forecast = await this.generateRevenueForecast(features, horizon);
        revenueForecasts.push(...forecast);
      }
      
      // Calculate Cash Flow Stability Index
      const cfsi = await calculateCFSI(features);
      
      // Calculate churn risk
      const churnRisk = await calculateChurnRisk(features, persona);
      
      // Calculate anticipated need
      const anticipatedNeed = await calculateAnticipatedNeed(features, persona);
      
      // Generate explanations
      const explanations = this.generateExplanations(features, revenueForecasts, cfsi, churnRisk);
      
      // Run Creator Check
      const creatorCheck = await runCreatorCheck({
        revenueForecast: revenueForecasts,
        cfsi,
        churnRisk,
        anticipatedNeed,
        persona,
      });
      
      const result: ForecastOutput = {
        generatedAt: new Date().toISOString(),
        horizons,
        persona,
        revenueForecast: revenueForecasts,
        cashFlowStabilityIndex: cfsi,
        churnRisk,
        anticipatedNeed,
        explanations,
        creatorCheck,
      };
      
      console.log(`Forecast generated in ${Date.now() - startTime}ms`);
      return result;
      
    } catch (error) {
      console.error('Error generating forecast:', error);
      throw new Error(`Forecast generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract features from data sources
   */
  private async extractFeatures() {
    // TODO: Replace with actual data source integration
    // For now, generate mock data based on typical B2B patterns
    
    const mockRevenueData = this.generateMockRevenueData();
    const mockLeadData = this.generateMockLeadData();
    const mockCustomerData = this.generateMockCustomerData();
    const mockOperationalData = this.generateMockOperationalData();
    const mockEngagementData = this.generateMockEngagementData();
    
    return await this.featureStore.extractFeatures(
      mockRevenueData,
      mockLeadData,
      mockCustomerData,
      mockOperationalData,
      mockEngagementData
    );
  }

  /**
   * Generate revenue forecast using model ensemble
   */
  private async generateRevenueForecast(
    features: any,
    horizon: ForecastHorizon
  ): Promise<RevenueForecastPoint[]> {
    const revenueData = features.dailyRevenue;
    
    if (revenueData.length === 0) {
      throw new Error('No revenue data available for forecasting');
    }
    
    // Select best model based on data characteristics
    const model = this.selectBestModel(revenueData);
    
    try {
      return await model.forecast(revenueData, horizon, this.modelConfig.confidenceLevel);
    } catch (error) {
      console.warn('Primary model failed, falling back to EWMA:', error);
      // Fallback to simple EWMA
      const fallbackModel = new EWMAModel(0.3);
      const fitted = fallbackModel.fit(revenueData);
      return fallbackModel.forecast(fitted.smoothed, fitted.residuals, horizon, this.modelConfig.confidenceLevel);
    }
  }

  /**
   * Select best model based on data characteristics
   */
  private selectBestModel(data: number[]): ModelEnsemble {
    // Analyze data characteristics
    const hasTrend = this.detectTrend(data);
    const hasSeasonality = this.detectSeasonality(data);
    const dataLength = data.length;
    
    // Adjust model weights based on data characteristics
    const config = { ...this.modelConfig };
    
    if (hasSeasonality && dataLength > 14) {
      // Favor ETS for seasonal data
      config.alpha = 0.2;
      config.gamma = 0.3;
    } else if (hasTrend) {
      // Favor EWMA for trending data
      config.alpha = 0.4;
    } else {
      // Favor AR for stationary data
      config.alpha = 0.1;
    }
    
    return new ModelEnsemble(config);
  }

  /**
   * Detect trend in data
   */
  private detectTrend(data: number[]): boolean {
    if (data.length < 7) return false;
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstMean = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondMean = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const trendStrength = Math.abs(secondMean - firstMean) / firstMean;
    return trendStrength > 0.1; // 10% change threshold
  }

  /**
   * Detect seasonality in data
   */
  private detectSeasonality(data: number[]): boolean {
    if (data.length < 14) return false;
    
    // Simple seasonality detection using autocorrelation
    const lag = 7; // Weekly seasonality
    if (data.length < lag * 2) return false;
    
    const autocorr = this.calculateAutocorrelation(data, lag);
    return autocorr > 0.3; // 30% correlation threshold
  }

  /**
   * Calculate autocorrelation at given lag
   */
  private calculateAutocorrelation(data: number[], lag: number): number {
    const n = data.length;
    const mean = data.reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = lag; i < n; i++) {
      numerator += (data[i] - mean) * (data[i - lag] - mean);
    }
    
    for (let i = 0; i < n; i++) {
      denominator += Math.pow(data[i] - mean, 2);
    }
    
    return denominator > 0 ? numerator / denominator : 0;
  }

  /**
   * Generate explanations for forecast
   */
  private generateExplanations(
    features: any,
    revenueForecast: RevenueForecastPoint[],
    cfsi: number,
    churnRisk: number
  ): string[] {
    const explanations: string[] = [];
    
    // Revenue trend explanation
    const recentRevenue = features.dailyRevenue.slice(-7);
    const avgRecent = recentRevenue.reduce((sum, val) => sum + val, 0) / recentRevenue.length;
    const forecastAvg = revenueForecast.slice(0, 7).reduce((sum, point) => sum + point.point, 0) / 7;
    
    if (forecastAvg > avgRecent * 1.1) {
      explanations.push('Revenue forecast shows 10%+ growth trend based on recent performance');
    } else if (forecastAvg < avgRecent * 0.9) {
      explanations.push('Revenue forecast indicates potential decline, monitor closely');
    } else {
      explanations.push('Revenue forecast shows stable growth pattern');
    }
    
    // CFSI explanation
    if (cfsi >= 80) {
      explanations.push('Cash flow stability is excellent, indicating strong operational health');
    } else if (cfsi >= 60) {
      explanations.push('Cash flow stability is good with room for improvement');
    } else {
      explanations.push('Cash flow stability needs attention, consider operational improvements');
    }
    
    // Churn risk explanation
    if (churnRisk >= 0.7) {
      explanations.push('High churn risk detected, immediate customer retention actions recommended');
    } else if (churnRisk >= 0.4) {
      explanations.push('Moderate churn risk, proactive engagement strategies advised');
    } else {
      explanations.push('Low churn risk, maintain current customer success initiatives');
    }
    
    // Seasonality explanation
    const hasSeasonality = this.detectSeasonality(features.dailyRevenue);
    if (hasSeasonality) {
      explanations.push('Weekly seasonality patterns detected in revenue data');
    }
    
    return explanations;
  }

  /**
   * Generate mock revenue data
   */
  private generateMockRevenueData() {
    const data = [];
    const baseRevenue = 5000;
    const trend = 0.02; // 2% daily growth
    const seasonality = 0.1; // 10% weekly variation
    
    for (let i = 0; i < 90; i++) {
      const date = new Date();
      date.setDate(date.getDate() - 90 + i);
      
      const dayOfWeek = date.getDay();
      const seasonalFactor = 1 + seasonality * Math.sin(2 * Math.PI * dayOfWeek / 7);
      const trendFactor = 1 + trend * i;
      const noise = (Math.random() - 0.5) * 0.2; // 20% random variation
      
      const revenue = baseRevenue * trendFactor * seasonalFactor * (1 + noise);
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.max(0, revenue),
        grossMargin: 0.4 + (Math.random() - 0.5) * 0.1, // 35-45% margin
        refunds: Math.random() * 100, // 0-100 refunds
      });
    }
    
    return data;
  }

  /**
   * Generate mock lead data
   */
  private generateMockLeadData() {
    const data = [];
    
    for (let i = 0; i < 90; i++) {
      const date = new Date();
      date.setDate(date.getDate() - 90 + i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        leads: Math.floor(Math.random() * 20) + 10, // 10-30 leads
        rfqSubmissions: Math.floor(Math.random() * 10) + 5, // 5-15 RFQs
        wins: Math.floor(Math.random() * 5) + 2, // 2-7 wins
      });
    }
    
    return data;
  }

  /**
   * Generate mock customer data
   */
  private generateMockCustomerData() {
    const data = [];
    
    for (let i = 0; i < 90; i++) {
      const date = new Date();
      date.setDate(date.getDate() - 90 + i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        reorders: Math.floor(Math.random() * 10) + 5,
        personaMix: {
          contractor: 0.35,
          property_manager: 0.25,
          logistics: 0.20,
          healthcare: 0.15,
          smb: 0.05,
        },
        productMix: {
          'banners': 0.40,
          'yard-signs': 0.25,
          'decals': 0.15,
          'ada-signs': 0.10,
          'safety-signs': 0.10,
        },
      });
    }
    
    return data;
  }

  /**
   * Generate mock operational data
   */
  private generateMockOperationalData() {
    const data = [];
    
    for (let i = 0; i < 90; i++) {
      const date = new Date();
      date.setDate(date.getDate() - 90 + i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        slaMet: 0.95 + Math.random() * 0.05, // 95-100% SLA
        onTime: 0.90 + Math.random() * 0.10, // 90-100% on-time
        cutoffViews: Math.floor(Math.random() * 50) + 10, // 10-60 views
        freightUsage: 0.2 + Math.random() * 0.3, // 20-50% freight
      });
    }
    
    return data;
  }

  /**
   * Generate mock engagement data
   */
  private generateMockEngagementData() {
    const data = [];
    
    for (let i = 0; i < 90; i++) {
      const date = new Date();
      date.setDate(date.getDate() - 90 + i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        emailOpenRate: 0.2 + Math.random() * 0.3, // 20-50% open rate
        emailClickRate: 0.05 + Math.random() * 0.15, // 5-20% click rate
        siteSessions: Math.floor(Math.random() * 100) + 50, // 50-150 sessions
        siteEngagement: 0.3 + Math.random() * 0.4, // 30-70% engagement
      });
    }
    
    return data;
  }
}
