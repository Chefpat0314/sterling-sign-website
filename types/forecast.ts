/**
 * Forecast Types & JSON Schema Export
 * 
 * Shared TypeScript types for the predictive analytics system
 */

export type ForecastHorizon = '14d' | '30d' | '60d';
export type PersonaType = 'contractor' | 'property_manager' | 'logistics' | 'healthcare' | 'smb';

export interface RevenueForecastPoint {
  date: string; // ISO date string
  point: number; // Forecast value
  ciLow: number; // 80% confidence interval lower bound
  ciHigh: number; // 80% confidence interval upper bound
}

export interface AnticipatedNeed {
  nextWindowStart: string; // ISO date string
  nextWindowEnd: string; // ISO date string
  confidence: number; // 0-1 confidence score
  topSignals: string[]; // Key signals driving the prediction
}

export interface CreatorCheck {
  passed: boolean;
  notes: string[];
}

export interface ForecastOutput {
  generatedAt: string; // ISO datetime string
  horizons: ForecastHorizon[];
  persona: PersonaType;
  revenueForecast: RevenueForecastPoint[];
  cashFlowStabilityIndex: number; // 0-100
  churnRisk: number; // 0-1
  anticipatedNeed: AnticipatedNeed;
  explanations: string[];
  creatorCheck: CreatorCheck;
}

export interface FeatureStoreData {
  // Revenue metrics
  dailyRevenue: number[];
  grossMargin: number[];
  refunds: number[];
  
  // Lead metrics
  leadVolume: number[];
  rfqToWinRate: number[];
  
  // Customer metrics
  reorderIntervals: number[];
  personaMix: Record<PersonaType, number>;
  productMix: Record<string, number>;
  
  // Operational metrics
  slaPromiseMet: number[];
  onTimePercentage: number[];
  cutoffTimerViews: number[];
  freightUsage: number[];
  
  // Engagement metrics
  emailEngagement: number[];
  siteEngagement: number[];
  
  // Metadata
  dates: string[];
  lastUpdated: string;
}

export interface ModelConfig {
  // ETS parameters
  alpha: number; // Level smoothing
  beta: number; // Trend smoothing
  gamma: number; // Seasonal smoothing
  
  // Confidence intervals
  confidenceLevel: number; // 0.8 or 0.95
  
  // Churn model
  churnThreshold: number; // 0.6 default
  lookbackDays: number; // 90 default
  
  // Anticipated need
  minConfidence: number; // 0.3 default
  maxWindowDays: number; // 30 default
}

export interface CFSIComponents {
  revenueVolatility: number; // 0-100
  arAging: number; // 0-100 (days to payment)
  refundRate: number; // 0-100
  methodMixRisk: number; // 0-100 (freight share)
  dependencyRisk: number; // 0-100 (top client concentration)
  otifPercentage: number; // 0-100
}

export interface ChurnRiskFactors {
  recency: number; // Days since last order
  frequency: number; // Orders per month
  monetary: number; // Average order value
  engagementDelta: number; // Change in engagement
  personaRisk: number; // Persona-specific risk
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'email' | 'hubspot' | 'webhook';
  enabled: boolean;
}

export interface ForecastValidation {
  date: string;
  horizon: ForecastHorizon;
  actualRevenue: number;
  predictedRevenue: number;
  error: number;
  errorPercentage: number;
  withinConfidence: boolean;
}

export interface ModelMetrics {
  mape: number; // Mean Absolute Percentage Error
  rmse: number; // Root Mean Square Error
  mae: number; // Mean Absolute Error
  r2: number; // R-squared
  lastValidation: string;
}

// JSON Schema export for validation
export const FORECAST_SCHEMA = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Sterling Forecast IO",
  "type": "object",
  "properties": {
    "generatedAt": {"type": "string", "format": "date-time"},
    "horizons": {"type": "array", "items": {"enum": ["14d", "30d", "60d"]}},
    "persona": {"type": "string", "enum": ["contractor", "property_manager", "logistics", "healthcare", "smb"]},
    "revenueForecast": {"type": "array", "items": {
      "type": "object",
      "properties": {
        "date": {"type": "string", "format": "date"},
        "point": {"type": "number"},
        "ciLow": {"type": "number"},
        "ciHigh": {"type": "number"}
      },
      "required": ["date", "point", "ciLow", "ciHigh"]
    }},
    "cashFlowStabilityIndex": {"type": "number", "minimum": 0, "maximum": 100},
    "churnRisk": {"type": "number", "minimum": 0, "maximum": 1},
    "anticipatedNeed": {
      "type": "object",
      "properties": {
        "nextWindowStart": {"type": "string", "format": "date"},
        "nextWindowEnd": {"type": "string", "format": "date"},
        "confidence": {"type": "number", "minimum": 0, "maximum": 1},
        "topSignals": {"type": "array", "items": {"type": "string"}}
      },
      "required": ["nextWindowStart", "nextWindowEnd", "confidence"]
    },
    "explanations": {"type": "array", "items": {"type": "string"}},
    "creatorCheck": {
      "type": "object",
      "properties": {
        "passed": {"type": "boolean"},
        "notes": {"type": "array", "items": {"type": "string"}}
      },
      "required": ["passed"]
    }
  },
  "required": ["generatedAt", "horizons", "persona", "revenueForecast", "cashFlowStabilityIndex", "churnRisk", "anticipatedNeed", "creatorCheck"]
} as const;
