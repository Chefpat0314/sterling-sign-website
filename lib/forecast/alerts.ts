/**
 * Alerts System
 * 
 * Alert rules and actions for predictive analytics
 */

import { AlertRule, ForecastOutput } from '../../types/forecast';
import { runCreatorCheck } from './governance';

/**
 * Alert conditions and thresholds
 */
export const ALERT_RULES: AlertRule[] = [
  {
    id: 'forecast_downside',
    name: 'Revenue Forecast Downside',
    condition: 'forecast_downside > 15%',
    threshold: 0.15,
    severity: 'high',
    action: 'email',
    enabled: true,
  },
  {
    id: 'cfsi_low',
    name: 'Cash Flow Stability Low',
    condition: 'cfsi < 55',
    threshold: 55,
    severity: 'medium',
    action: 'hubspot',
    enabled: true,
  },
  {
    id: 'churn_risk_high',
    name: 'High Churn Risk',
    condition: 'churnRisk > 0.6',
    threshold: 0.6,
    severity: 'high',
    action: 'hubspot',
    enabled: true,
  },
  {
    id: 'anticipated_need_urgent',
    name: 'Anticipated Need Window Urgent',
    condition: 'daysUntilWindow <= 10 AND confidence > 0.7',
    threshold: 10,
    severity: 'medium',
    action: 'webhook',
    enabled: true,
  },
  {
    id: 'revenue_volatility_high',
    name: 'High Revenue Volatility',
    condition: 'revenueVolatility > 0.3',
    threshold: 0.3,
    severity: 'medium',
    action: 'email',
    enabled: true,
  },
  {
    id: 'sla_performance_low',
    name: 'SLA Performance Low',
    condition: 'slaPerformance < 0.90',
    threshold: 0.90,
    severity: 'high',
    action: 'hubspot',
    enabled: true,
  },
];

/**
 * Check alerts for forecast output
 */
export async function checkAlerts(forecast: ForecastOutput): Promise<{
  triggered: AlertRule[];
  actions: AlertAction[];
  creatorCheck: any;
}> {
  const triggered: AlertRule[] = [];
  const actions: AlertAction[] = [];
  
  try {
    // Check each alert rule
    for (const rule of ALERT_RULES) {
      if (!rule.enabled) continue;
      
      const isTriggered = await evaluateAlertCondition(rule, forecast);
      if (isTriggered) {
        triggered.push(rule);
        
        // Create alert action
        const action = await createAlertAction(rule, forecast);
        actions.push(action);
      }
    }
    
    // Run Creator Check on all actions
    const creatorCheck = await runCreatorCheck({
      ...forecast,
      explanations: [
        ...(forecast.explanations || []),
        `Generated ${actions.length} alerts`,
        `Triggered rules: ${triggered.map(r => r.name).join(', ')}`,
      ],
    });
    
    // Filter actions based on Creator Check
    const approvedActions = creatorCheck.passed 
      ? actions 
      : actions.filter(action => action.severity === 'critical');
    
    return {
      triggered,
      actions: approvedActions,
      creatorCheck,
    };
    
  } catch (error) {
    console.error('Error checking alerts:', error);
    return {
      triggered: [],
      actions: [],
      creatorCheck: { passed: false, notes: ['Alert check failed'] },
    };
  }
}

/**
 * Evaluate alert condition
 */
async function evaluateAlertCondition(rule: AlertRule, forecast: ForecastOutput): Promise<boolean> {
  try {
    switch (rule.id) {
      case 'forecast_downside':
        return await checkForecastDownside(forecast, rule.threshold);
      
      case 'cfsi_low':
        return forecast.cashFlowStabilityIndex < rule.threshold;
      
      case 'churn_risk_high':
        return forecast.churnRisk > rule.threshold;
      
      case 'anticipated_need_urgent':
        return await checkAnticipatedNeedUrgent(forecast, rule.threshold);
      
      case 'revenue_volatility_high':
        return await checkRevenueVolatility(forecast, rule.threshold);
      
      case 'sla_performance_low':
        return await checkSLAPerformance(forecast, rule.threshold);
      
      default:
        return false;
    }
  } catch (error) {
    console.error(`Error evaluating alert condition ${rule.id}:`, error);
    return false;
  }
}

/**
 * Check forecast downside
 */
async function checkForecastDownside(forecast: ForecastOutput, threshold: number): Promise<boolean> {
  if (!forecast.revenueForecast || forecast.revenueForecast.length === 0) {
    return false;
  }
  
  // Calculate average forecast vs recent performance
  const avgForecast = forecast.revenueForecast.reduce((sum, point) => sum + point.point, 0) / forecast.revenueForecast.length;
  
  // TODO: Replace with actual recent performance data
  const recentPerformance = 5000; // Mock recent daily revenue
  
  const downside = (recentPerformance - avgForecast) / recentPerformance;
  return downside > threshold;
}

/**
 * Check anticipated need urgency
 */
async function checkAnticipatedNeedUrgent(forecast: ForecastOutput, threshold: number): Promise<boolean> {
  if (!forecast.anticipatedNeed) {
    return false;
  }
  
  const windowStart = new Date(forecast.anticipatedNeed.nextWindowStart);
  const now = new Date();
  const daysUntilWindow = Math.ceil((windowStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysUntilWindow <= threshold && forecast.anticipatedNeed.confidence > 0.7;
}

/**
 * Check revenue volatility
 */
async function checkRevenueVolatility(forecast: ForecastOutput, threshold: number): Promise<boolean> {
  if (!forecast.revenueForecast || forecast.revenueForecast.length < 2) {
    return false;
  }
  
  const values = forecast.revenueForecast.map(point => point.point);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / mean;
  
  return coefficientOfVariation > threshold;
}

/**
 * Check SLA performance
 */
async function checkSLAPerformance(forecast: ForecastOutput, threshold: number): Promise<boolean> {
  // TODO: Replace with actual SLA performance data
  // For now, use heuristic based on CFSI
  const slaPerformance = forecast.cashFlowStabilityIndex / 100;
  return slaPerformance < threshold;
}

/**
 * Create alert action
 */
async function createAlertAction(rule: AlertRule, forecast: ForecastOutput): Promise<AlertAction> {
  const action: AlertAction = {
    id: `alert_${rule.id}_${Date.now()}`,
    ruleId: rule.id,
    severity: rule.severity,
    action: rule.action,
    message: generateAlertMessage(rule, forecast),
    data: {
      forecast: {
        generatedAt: forecast.generatedAt,
        persona: forecast.persona,
        cfsi: forecast.cashFlowStabilityIndex,
        churnRisk: forecast.churnRisk,
        anticipatedNeed: forecast.anticipatedNeed,
      },
      rule: {
        name: rule.name,
        condition: rule.condition,
        threshold: rule.threshold,
      },
    },
    timestamp: new Date().toISOString(),
    status: 'pending',
  };
  
  return action;
}

/**
 * Generate alert message
 */
function generateAlertMessage(rule: AlertRule, forecast: ForecastOutput): string {
  const baseMessage = `Alert: ${rule.name}`;
  
  switch (rule.id) {
    case 'forecast_downside':
      return `${baseMessage} - Revenue forecast shows significant downside risk`;
    
    case 'cfsi_low':
      return `${baseMessage} - Cash flow stability index is ${forecast.cashFlowStabilityIndex.toFixed(1)} (threshold: ${rule.threshold})`;
    
    case 'churn_risk_high':
      return `${baseMessage} - Churn risk is ${(forecast.churnRisk * 100).toFixed(1)}% (threshold: ${(rule.threshold * 100).toFixed(1)}%)`;
    
    case 'anticipated_need_urgent':
      return `${baseMessage} - Anticipated need window in next ${rule.threshold} days with ${(forecast.anticipatedNeed.confidence * 100).toFixed(1)}% confidence`;
    
    case 'revenue_volatility_high':
      return `${baseMessage} - Revenue volatility exceeds ${(rule.threshold * 100).toFixed(1)}% threshold`;
    
    case 'sla_performance_low':
      return `${baseMessage} - SLA performance below ${(rule.threshold * 100).toFixed(1)}% threshold`;
    
    default:
      return `${baseMessage} - Condition triggered`;
  }
}

/**
 * Execute alert action
 */
export async function executeAlertAction(action: AlertAction): Promise<{
  success: boolean;
  response?: any;
  error?: string;
}> {
  try {
    switch (action.action) {
      case 'email':
        return await executeEmailAlert(action);
      
      case 'hubspot':
        return await executeHubSpotAlert(action);
      
      case 'webhook':
        return await executeWebhookAlert(action);
      
      default:
        return {
          success: false,
          error: `Unknown action type: ${action.action}`,
        };
    }
  } catch (error) {
    console.error('Error executing alert action:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Execute email alert
 */
async function executeEmailAlert(action: AlertAction): Promise<{ success: boolean; response?: any; error?: string }> {
  // TODO: Implement actual email sending
  console.log('Email alert:', action.message);
  
  return {
    success: true,
    response: { message: 'Email alert sent' },
  };
}

/**
 * Execute HubSpot alert
 */
async function executeHubSpotAlert(action: AlertAction): Promise<{ success: boolean; response?: any; error?: string }> {
  // TODO: Implement actual HubSpot integration
  console.log('HubSpot alert:', action.message);
  
  return {
    success: true,
    response: { message: 'HubSpot alert created' },
  };
}

/**
 * Execute webhook alert
 */
async function executeWebhookAlert(action: AlertAction): Promise<{ success: boolean; response?: any; error?: string }> {
  // TODO: Implement actual webhook call
  console.log('Webhook alert:', action.message);
  
  return {
    success: true,
    response: { message: 'Webhook alert sent' },
  };
}

/**
 * Alert action interface
 */
interface AlertAction {
  id: string;
  ruleId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'email' | 'hubspot' | 'webhook';
  message: string;
  data: any;
  timestamp: string;
  status: 'pending' | 'sent' | 'failed';
}

/**
 * Get alert summary
 */
export function getAlertSummary(triggered: AlertRule[], actions: AlertAction[]): {
  totalAlerts: number;
  severityBreakdown: Record<string, number>;
  actionBreakdown: Record<string, number>;
  topConcerns: string[];
} {
  const severityBreakdown: Record<string, number> = {};
  const actionBreakdown: Record<string, number> = {};
  
  triggered.forEach(rule => {
    severityBreakdown[rule.severity] = (severityBreakdown[rule.severity] || 0) + 1;
  });
  
  actions.forEach(action => {
    actionBreakdown[action.action] = (actionBreakdown[action.action] || 0) + 1;
  });
  
  const topConcerns = triggered
    .sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    })
    .slice(0, 3)
    .map(rule => rule.name);
  
  return {
    totalAlerts: triggered.length,
    severityBreakdown,
    actionBreakdown,
    topConcerns,
  };
}
