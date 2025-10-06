/**
 * Models Tests
 * 
 * Unit tests for forecasting models
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ETSLiteModel, EWMAModel, ARLiteModel, ModelEnsemble } from '../../lib/forecast/models';
import { ModelConfig } from '../../types/forecast';

describe('ETSLiteModel', () => {
  let model: ETSLiteModel;
  let config: ModelConfig;

  beforeEach(() => {
    config = {
      alpha: 0.3,
      beta: 0.1,
      gamma: 0.1,
      confidenceLevel: 0.8,
      churnThreshold: 0.6,
      lookbackDays: 90,
      minConfidence: 0.3,
      maxWindowDays: 30,
    };
    model = new ETSLiteModel(config);
  });

  describe('fit', () => {
    it('should fit model to data', () => {
      const data = [100, 120, 110, 130, 140, 150, 160, 170, 180, 190];
      
      const result = model.fit(data);
      
      expect(result.level).toBeDefined();
      expect(result.trend).toBeDefined();
      expect(result.seasonal).toBeDefined();
      expect(result.fitted).toBeDefined();
      expect(result.residuals).toBeDefined();
      expect(result.level.length).toBe(data.length);
    });

    it('should handle insufficient data', () => {
      const data = [100, 120];
      
      expect(() => model.fit(data)).toThrow('Insufficient data for seasonal model');
    });
  });

  describe('forecast', () => {
    it('should generate forecasts with confidence intervals', () => {
      const data = [100, 120, 110, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300];
      const fitted = model.fit(data);
      
      const forecast = model.forecast(fitted.fitted, fitted.residuals, '14d', 0.8);
      
      expect(forecast).toBeDefined();
      expect(forecast.length).toBe(14);
      expect(forecast[0]).toHaveProperty('date');
      expect(forecast[0]).toHaveProperty('point');
      expect(forecast[0]).toHaveProperty('ciLow');
      expect(forecast[0]).toHaveProperty('ciHigh');
      expect(forecast[0].ciLow).toBeLessThanOrEqual(forecast[0].point);
      expect(forecast[0].point).toBeLessThanOrEqual(forecast[0].ciHigh);
    });
  });
});

describe('EWMAModel', () => {
  let model: EWMAModel;

  beforeEach(() => {
    model = new EWMAModel(0.3);
  });

  describe('fit', () => {
    it('should fit EWMA to data', () => {
      const data = [100, 120, 110, 130, 140, 150, 160, 170, 180, 190];
      
      const result = model.fit(data);
      
      expect(result.smoothed).toBeDefined();
      expect(result.trend).toBeDefined();
      expect(result.residuals).toBeDefined();
      expect(result.smoothed.length).toBe(data.length);
    });
  });

  describe('forecast', () => {
    it('should generate forecasts', () => {
      const data = [100, 120, 110, 130, 140, 150, 160, 170, 180, 190];
      const fitted = model.fit(data);
      
      const forecast = model.forecast(fitted.smoothed, fitted.residuals, '14d', 0.8);
      
      expect(forecast).toBeDefined();
      expect(forecast.length).toBe(14);
      expect(forecast[0]).toHaveProperty('date');
      expect(forecast[0]).toHaveProperty('point');
      expect(forecast[0]).toHaveProperty('ciLow');
      expect(forecast[0]).toHaveProperty('ciHigh');
    });
  });
});

describe('ARLiteModel', () => {
  let model: ARLiteModel;

  beforeEach(() => {
    model = new ARLiteModel(2);
  });

  describe('fit', () => {
    it('should fit AR model to data', () => {
      const data = [100, 120, 110, 130, 140, 150, 160, 170, 180, 190, 200, 210];
      
      const result = model.fit(data);
      
      expect(result.fitted).toBeDefined();
      expect(result.residuals).toBeDefined();
      expect(result.coefficients).toBeDefined();
      expect(result.fitted.length).toBe(data.length);
    });

    it('should handle insufficient data', () => {
      const data = [100, 120];
      
      expect(() => model.fit(data)).toThrow('Insufficient data for AR model');
    });
  });

  describe('forecast', () => {
    it('should generate forecasts', () => {
      const data = [100, 120, 110, 130, 140, 150, 160, 170, 180, 190, 200, 210];
      
      const forecast = model.forecast(data, '14d', 0.8);
      
      expect(forecast).toBeDefined();
      expect(forecast.length).toBe(14);
      expect(forecast[0]).toHaveProperty('date');
      expect(forecast[0]).toHaveProperty('point');
      expect(forecast[0]).toHaveProperty('ciLow');
      expect(forecast[0]).toHaveProperty('ciHigh');
    });
  });
});

describe('ModelEnsemble', () => {
  let ensemble: ModelEnsemble;
  let config: ModelConfig;

  beforeEach(() => {
    config = {
      alpha: 0.3,
      beta: 0.1,
      gamma: 0.1,
      confidenceLevel: 0.8,
      churnThreshold: 0.6,
      lookbackDays: 90,
      minConfidence: 0.3,
      maxWindowDays: 30,
    };
    ensemble = new ModelEnsemble(config);
  });

  describe('forecast', () => {
    it('should generate ensemble forecasts', async () => {
      const data = [100, 120, 110, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300];
      
      const forecast = await ensemble.forecast(data, '14d', 0.8);
      
      expect(forecast).toBeDefined();
      expect(forecast.length).toBe(14);
      expect(forecast[0]).toHaveProperty('date');
      expect(forecast[0]).toHaveProperty('point');
      expect(forecast[0]).toHaveProperty('ciLow');
      expect(forecast[0]).toHaveProperty('ciHigh');
    });

    it('should handle model failures gracefully', async () => {
      const data = [100, 120]; // Insufficient data for some models
      
      const forecast = await ensemble.forecast(data, '14d', 0.8);
      
      expect(forecast).toBeDefined();
      expect(forecast.length).toBe(14);
    });
  });
});
