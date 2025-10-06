/**
 * Feature Store Tests
 * 
 * Unit tests for feature extraction and transformation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { FeatureStore } from '../../lib/forecast/featureStore';

describe('FeatureStore', () => {
  let featureStore: FeatureStore;

  beforeEach(() => {
    featureStore = new FeatureStore();
  });

  describe('extractFeatures', () => {
    it('should extract features from mock data', async () => {
      const mockRevenueData = [
        { date: '2024-01-01', revenue: 5000, grossMargin: 0.4, refunds: 100 },
        { date: '2024-01-02', revenue: 5500, grossMargin: 0.42, refunds: 50 },
      ];

      const mockLeadData = [
        { date: '2024-01-01', leads: 20, rfqSubmissions: 10, wins: 3 },
        { date: '2024-01-02', leads: 25, rfqSubmissions: 12, wins: 4 },
      ];

      const mockCustomerData = [
        { date: '2024-01-01', reorders: 5, personaMix: { contractor: 0.5, property_manager: 0.3, logistics: 0.2 }, productMix: { banners: 0.6, yard_signs: 0.4 } },
        { date: '2024-01-02', reorders: 7, personaMix: { contractor: 0.6, property_manager: 0.2, logistics: 0.2 }, productMix: { banners: 0.7, yard_signs: 0.3 } },
      ];

      const mockOperationalData = [
        { date: '2024-01-01', slaMet: 0.95, onTime: 0.90, cutoffViews: 30, freightUsage: 0.3 },
        { date: '2024-01-02', slaMet: 0.97, onTime: 0.92, cutoffViews: 35, freightUsage: 0.25 },
      ];

      const mockEngagementData = [
        { date: '2024-01-01', emailOpenRate: 0.3, emailClickRate: 0.1, siteSessions: 100, siteEngagement: 0.5 },
        { date: '2024-01-02', emailOpenRate: 0.35, emailClickRate: 0.12, siteSessions: 120, siteEngagement: 0.6 },
      ];

      const features = await featureStore.extractFeatures(
        mockRevenueData,
        mockLeadData,
        mockCustomerData,
        mockOperationalData,
        mockEngagementData
      );

      expect(features).toBeDefined();
      expect(features.dailyRevenue).toBeDefined();
      expect(features.grossMargin).toBeDefined();
      expect(features.leadVolume).toBeDefined();
      expect(features.personaMix).toBeDefined();
      expect(features.productMix).toBeDefined();
      expect(features.dates).toBeDefined();
      expect(features.lastUpdated).toBeDefined();
    });

    it('should handle empty data gracefully', async () => {
      const features = await featureStore.extractFeatures([], [], [], [], []);

      expect(features).toBeDefined();
      expect(features.dailyRevenue).toBeDefined();
      expect(features.dates).toBeDefined();
    });
  });

  describe('calculateRollingStats', () => {
    it('should calculate rolling statistics correctly', () => {
      const data = [100, 120, 110, 130, 140, 150, 160];
      const window = 3;
      
      const stats = featureStore.calculateRollingStats(data, window);
      
      expect(stats.mean).toBeDefined();
      expect(stats.std).toBeDefined();
      expect(stats.variance).toBeDefined();
      expect(stats.mean.length).toBe(data.length - window + 1);
    });

    it('should handle insufficient data', () => {
      const data = [100, 120];
      const window = 3;
      
      const stats = featureStore.calculateRollingStats(data, window);
      
      expect(stats.mean).toEqual([]);
      expect(stats.std).toEqual([]);
      expect(stats.variance).toEqual([]);
    });
  });

  describe('detectSeasonality', () => {
    it('should detect seasonality in data', () => {
      const data = [100, 120, 110, 130, 140, 150, 160, 100, 120, 110, 130, 140, 150, 160];
      const period = 7;
      
      const seasonality = featureStore.detectSeasonality(data, period);
      
      expect(seasonality.hasSeasonality).toBe(true);
      expect(seasonality.seasonalStrength).toBeGreaterThan(0);
      expect(seasonality.seasonalIndices).toHaveLength(period);
    });

    it('should not detect seasonality in random data', () => {
      const data = [100, 120, 110, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230];
      const period = 7;
      
      const seasonality = featureStore.detectSeasonality(data, period);
      
      expect(seasonality.hasSeasonality).toBe(false);
      expect(seasonality.seasonalStrength).toBeLessThan(0.1);
    });
  });
});
