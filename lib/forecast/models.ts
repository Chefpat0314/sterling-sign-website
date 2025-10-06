/**
 * Forecasting Models
 * 
 * Lightweight, explainable models for revenue forecasting
 * ETS-lite with EWMA + seasonal adjustments
 */

import { ModelConfig, RevenueForecastPoint, ForecastHorizon } from '../../types/forecast';

/**
 * ETS (Exponential Smoothing) Lite Model
 * Simplified version of Exponential Triple Smoothing
 */
export class ETSLiteModel {
  private alpha: number; // Level smoothing
  private beta: number;  // Trend smoothing
  private gamma: number; // Seasonal smoothing
  private seasonLength: number;

  constructor(config: ModelConfig) {
    this.alpha = config.alpha;
    this.beta = config.beta;
    this.gamma = config.gamma;
    this.seasonLength = 7; // Weekly seasonality
  }

  /**
   * Fit the model to historical data
   */
  fit(data: number[]): {
    level: number[];
    trend: number[];
    seasonal: number[];
    fitted: number[];
    residuals: number[];
  } {
    if (data.length < this.seasonLength * 2) {
      throw new Error('Insufficient data for seasonal model');
    }

    const n = data.length;
    const level = new Array(n).fill(0);
    const trend = new Array(n).fill(0);
    const seasonal = new Array(n).fill(0);
    const fitted = new Array(n).fill(0);

    // Initialize with simple averages
    level[0] = data[0];
    trend[0] = 0;
    
    // Initialize seasonal components
    for (let i = 0; i < this.seasonLength; i++) {
      seasonal[i] = 1.0; // Default seasonal index
    }

    // Holt-Winters with seasonal adjustment
    for (let i = 1; i < n; i++) {
      const prevLevel = level[i - 1];
      const prevTrend = trend[i - 1];
      const prevSeasonal = seasonal[i - this.seasonLength] || 1.0;
      
      // Update level
      level[i] = this.alpha * (data[i] / prevSeasonal) + (1 - this.alpha) * (prevLevel + prevTrend);
      
      // Update trend
      trend[i] = this.beta * (level[i] - prevLevel) + (1 - this.beta) * prevTrend;
      
      // Update seasonal
      seasonal[i] = this.gamma * (data[i] / level[i]) + (1 - this.gamma) * prevSeasonal;
      
      // Calculate fitted value
      fitted[i] = (prevLevel + prevTrend) * prevSeasonal;
    }

    // Calculate residuals
    const residuals = data.map((value, i) => value - fitted[i]);

    return {
      level,
      trend,
      seasonal,
      fitted,
      residuals,
    };
  }

  /**
   * Generate forecasts with confidence intervals
   */
  forecast(
    fitted: number[],
    residuals: number[],
    horizon: ForecastHorizon,
    confidenceLevel: number = 0.8
  ): RevenueForecastPoint[] {
    const horizonDays = this.getHorizonDays(horizon);
    const forecasts: RevenueForecastPoint[] = [];
    
    const lastLevel = fitted[fitted.length - 1];
    const lastTrend = fitted.length > 1 ? fitted[fitted.length - 1] - fitted[fitted.length - 2] : 0;
    const lastSeasonal = fitted.length > this.seasonLength ? 
      fitted[fitted.length - 1] / fitted[fitted.length - this.seasonLength] : 1.0;

    // Bootstrap residuals for confidence intervals
    const bootstrapSamples = this.bootstrapResiduals(residuals, 1000);
    const sortedResiduals = bootstrapSamples.sort((a, b) => a - b);
    
    const lowerPercentile = (1 - confidenceLevel) / 2;
    const upperPercentile = 1 - lowerPercentile;
    const lowerIndex = Math.floor(lowerPercentile * sortedResiduals.length);
    const upperIndex = Math.floor(upperPercentile * sortedResiduals.length);

    for (let h = 1; h <= horizonDays; h++) {
      const date = new Date();
      date.setDate(date.getDate() + h);
      
      // Calculate point forecast
      const seasonalIndex = (h - 1) % this.seasonLength;
      const pointForecast = (lastLevel + h * lastTrend) * lastSeasonal;
      
      // Calculate confidence intervals
      const ciLow = pointForecast + sortedResiduals[lowerIndex];
      const ciHigh = pointForecast + sortedResiduals[upperIndex];
      
      forecasts.push({
        date: date.toISOString().split('T')[0],
        point: Math.max(0, pointForecast), // Ensure non-negative
        ciLow: Math.max(0, ciLow),
        ciHigh: Math.max(0, ciHigh),
      });
    }

    return forecasts;
  }

  /**
   * Bootstrap residuals for confidence intervals
   */
  private bootstrapResiduals(residuals: number[], samples: number): number[] {
    const bootstrapSamples: number[] = [];
    
    for (let i = 0; i < samples; i++) {
      const randomIndex = Math.floor(Math.random() * residuals.length);
      bootstrapSamples.push(residuals[randomIndex]);
    }
    
    return bootstrapSamples;
  }

  /**
   * Get horizon days from string
   */
  private getHorizonDays(horizon: ForecastHorizon): number {
    switch (horizon) {
      case '14d': return 14;
      case '30d': return 30;
      case '60d': return 60;
      default: return 30;
    }
  }
}

/**
 * EWMA (Exponentially Weighted Moving Average) Model
 * Simple trend-following model
 */
export class EWMAModel {
  private alpha: number;

  constructor(alpha: number = 0.3) {
    this.alpha = alpha;
  }

  /**
   * Fit EWMA to data
   */
  fit(data: number[]): {
    smoothed: number[];
    trend: number[];
    residuals: number[];
  } {
    if (data.length === 0) {
      return { smoothed: [], trend: [], residuals: [] };
    }

    const smoothed = [data[0]];
    const trend = [0];
    const residuals = [0];

    for (let i = 1; i < data.length; i++) {
      const prevSmoothed = smoothed[i - 1];
      const newSmoothed = this.alpha * data[i] + (1 - this.alpha) * prevSmoothed;
      const newTrend = newSmoothed - prevSmoothed;
      const residual = data[i] - newSmoothed;

      smoothed.push(newSmoothed);
      trend.push(newTrend);
      residuals.push(residual);
    }

    return { smoothed, trend, residuals };
  }

  /**
   * Generate forecasts
   */
  forecast(
    smoothed: number[],
    trend: number[],
    horizon: ForecastHorizon,
    confidenceLevel: number = 0.8
  ): RevenueForecastPoint[] {
    const horizonDays = this.getHorizonDays(horizon);
    const forecasts: RevenueForecastPoint[] = [];
    
    const lastSmoothed = smoothed[smoothed.length - 1];
    const lastTrend = trend[trend.length - 1];
    const avgTrend = trend.slice(-7).reduce((sum, t) => sum + t, 0) / Math.min(7, trend.length);

    for (let h = 1; h <= horizonDays; h++) {
      const date = new Date();
      date.setDate(date.getDate() + h);
      
      const pointForecast = lastSmoothed + h * avgTrend;
      const uncertainty = Math.abs(pointForecast) * 0.1; // 10% uncertainty
      
      forecasts.push({
        date: date.toISOString().split('T')[0],
        point: Math.max(0, pointForecast),
        ciLow: Math.max(0, pointForecast - uncertainty),
        ciHigh: Math.max(0, pointForecast + uncertainty),
      });
    }

    return forecasts;
  }

  private getHorizonDays(horizon: ForecastHorizon): number {
    switch (horizon) {
      case '14d': return 14;
      case '30d': return 30;
      case '60d': return 60;
      default: return 30;
    }
  }
}

/**
 * AR-Lite (AutoRegressive) Model
 * Simple autoregressive model for trend detection
 */
export class ARLiteModel {
  private order: number;
  private coefficients: number[];

  constructor(order: number = 2) {
    this.order = order;
    this.coefficients = [];
  }

  /**
   * Fit AR model using least squares
   */
  fit(data: number[]): {
    fitted: number[];
    residuals: number[];
    coefficients: number[];
  } {
    if (data.length < this.order + 1) {
      throw new Error('Insufficient data for AR model');
    }

    // Prepare design matrix
    const X: number[][] = [];
    const y: number[] = [];

    for (let i = this.order; i < data.length; i++) {
      const row = [];
      for (let j = 1; j <= this.order; j++) {
        row.push(data[i - j]);
      }
      X.push(row);
      y.push(data[i]);
    }

    // Solve least squares: coefficients = (X'X)^-1 X'y
    const coefficients = this.solveLeastSquares(X, y);
    this.coefficients = coefficients;

    // Calculate fitted values and residuals
    const fitted = new Array(data.length).fill(0);
    const residuals = new Array(data.length).fill(0);

    for (let i = this.order; i < data.length; i++) {
      let fittedValue = 0;
      for (let j = 0; j < this.order; j++) {
        fittedValue += coefficients[j] * data[i - j - 1];
      }
      fitted[i] = fittedValue;
      residuals[i] = data[i] - fittedValue;
    }

    return { fitted, residuals, coefficients };
  }

  /**
   * Generate forecasts
   */
  forecast(
    data: number[],
    horizon: ForecastHorizon,
    confidenceLevel: number = 0.8
  ): RevenueForecastPoint[] {
    const horizonDays = this.getHorizonDays(horizon);
    const forecasts: RevenueForecastPoint[] = [];
    
    const recentData = data.slice(-this.order);
    const residuals = this.calculateResiduals(data);
    const residualStd = this.calculateStandardDeviation(residuals);

    for (let h = 1; h <= horizonDays; h++) {
      const date = new Date();
      date.setDate(date.getDate() + h);
      
      // Calculate point forecast
      let pointForecast = 0;
      for (let j = 0; j < this.order; j++) {
        pointForecast += this.coefficients[j] * recentData[recentData.length - 1 - j];
      }
      
      // Calculate confidence intervals
      const uncertainty = residualStd * Math.sqrt(h);
      const zScore = this.getZScore(confidenceLevel);
      
      forecasts.push({
        date: date.toISOString().split('T')[0],
        point: Math.max(0, pointForecast),
        ciLow: Math.max(0, pointForecast - zScore * uncertainty),
        ciHigh: Math.max(0, pointForecast + zScore * uncertainty),
      });
    }

    return forecasts;
  }

  /**
   * Solve least squares problem
   */
  private solveLeastSquares(X: number[][], y: number[]): number[] {
    const n = X.length;
    const p = X[0].length;
    
    // Calculate X'X
    const XtX = new Array(p).fill(0).map(() => new Array(p).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < p; j++) {
        for (let k = 0; k < p; k++) {
          XtX[j][k] += X[i][j] * X[i][k];
        }
      }
    }
    
    // Calculate X'y
    const Xty = new Array(p).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < p; j++) {
        Xty[j] += X[i][j] * y[i];
      }
    }
    
    // Solve system (simplified - in production, use proper matrix inversion)
    const coefficients = new Array(p).fill(0);
    for (let i = 0; i < p; i++) {
      coefficients[i] = Xty[i] / XtX[i][i]; // Simplified diagonal solution
    }
    
    return coefficients;
  }

  private calculateResiduals(data: number[]): number[] {
    const residuals: number[] = [];
    for (let i = this.order; i < data.length; i++) {
      let fitted = 0;
      for (let j = 0; j < this.order; j++) {
        fitted += this.coefficients[j] * data[i - j - 1];
      }
      residuals.push(data[i] - fitted);
    }
    return residuals;
  }

  private calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private getZScore(confidenceLevel: number): number {
    switch (confidenceLevel) {
      case 0.8: return 1.28;
      case 0.95: return 1.96;
      case 0.99: return 2.58;
      default: return 1.28;
    }
  }

  private getHorizonDays(horizon: ForecastHorizon): number {
    switch (horizon) {
      case '14d': return 14;
      case '30d': return 30;
      case '60d': return 60;
      default: return 30;
    }
  }
}

/**
 * Model ensemble for improved accuracy
 */
export class ModelEnsemble {
  private models: Array<{
    name: string;
    weight: number;
    model: ETSLiteModel | EWMAModel | ARLiteModel;
  }>;

  constructor(config: ModelConfig) {
    this.models = [
      {
        name: 'ETS',
        weight: 0.5,
        model: new ETSLiteModel(config),
      },
      {
        name: 'EWMA',
        weight: 0.3,
        model: new EWMAModel(0.3),
      },
      {
        name: 'AR',
        weight: 0.2,
        model: new ARLiteModel(2),
      },
    ];
  }

  /**
   * Generate ensemble forecast
   */
  async forecast(
    data: number[],
    horizon: ForecastHorizon,
    confidenceLevel: number = 0.8
  ): Promise<RevenueForecastPoint[]> {
    const forecasts: RevenueForecastPoint[][] = [];

    // Get forecasts from each model
    for (const { model } of this.models) {
      try {
        if (model instanceof ETSLiteModel) {
          const fitted = model.fit(data);
          forecasts.push(model.forecast(fitted.fitted, fitted.residuals, horizon, confidenceLevel));
        } else if (model instanceof EWMAModel) {
          const fitted = model.fit(data);
          forecasts.push(model.forecast(fitted.smoothed, fitted.residuals, horizon, confidenceLevel));
        } else if (model instanceof ARLiteModel) {
          forecasts.push(model.forecast(data, horizon, confidenceLevel));
        }
      } catch (error) {
        console.warn('Model forecast failed:', error);
        // Continue with other models
      }
    }

    if (forecasts.length === 0) {
      throw new Error('All models failed to generate forecasts');
    }

    // Combine forecasts using weighted average
    return this.combineForecasts(forecasts);
  }

  /**
   * Combine multiple forecasts using weighted average
   */
  private combineForecasts(forecasts: RevenueForecastPoint[][]): RevenueForecastPoint[] {
    if (forecasts.length === 0) return [];
    if (forecasts.length === 1) return forecasts[0];

    const result: RevenueForecastPoint[] = [];
    const horizon = forecasts[0].length;

    for (let i = 0; i < horizon; i++) {
      let pointSum = 0;
      let ciLowSum = 0;
      let ciHighSum = 0;
      let weightSum = 0;

      forecasts.forEach((forecast, modelIndex) => {
        if (forecast[i]) {
          const weight = this.models[modelIndex]?.weight || 1.0;
          pointSum += forecast[i].point * weight;
          ciLowSum += forecast[i].ciLow * weight;
          ciHighSum += forecast[i].ciHigh * weight;
          weightSum += weight;
        }
      });

      if (weightSum > 0) {
        result.push({
          date: forecasts[0][i].date,
          point: pointSum / weightSum,
          ciLow: ciLowSum / weightSum,
          ciHigh: ciHighSum / weightSum,
        });
      }
    }

    return result;
  }
}
