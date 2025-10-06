/**
 * Governance Tests
 * 
 * Unit tests for Creator Check and ethical guardrails
 */

import { describe, it, expect } from 'vitest';
import { runCreatorCheck } from '../../lib/forecast/governance';
import { ForecastOutput } from '../../types/forecast';

describe('Creator Check', () => {
  describe('runCreatorCheck', () => {
    it('should pass for valid forecast', async () => {
      const forecast: Partial<ForecastOutput> = {
        generatedAt: new Date().toISOString(),
        horizons: ['14d', '30d', '60d'],
        persona: 'contractor',
        revenueForecast: [
          { date: '2024-01-01', point: 5000, ciLow: 4500, ciHigh: 5500 },
          { date: '2024-01-02', point: 5200, ciLow: 4700, ciHigh: 5700 },
        ],
        cashFlowStabilityIndex: 75,
        churnRisk: 0.3,
        anticipatedNeed: {
          nextWindowStart: '2024-01-15',
          nextWindowEnd: '2024-01-30',
          confidence: 0.7,
          topSignals: ['Increased engagement', 'Revenue growth trend'],
        },
        explanations: [
          'Revenue forecast shows stable growth pattern',
          'Cash flow stability is good with room for improvement',
          'Low churn risk, maintain current customer success initiatives',
        ],
      };

      const result = await runCreatorCheck(forecast);

      expect(result.passed).toBe(true);
      expect(result.notes).toBeDefined();
      expect(result.notes.length).toBeGreaterThan(0);
    });

    it('should fail for forecast with PII', async () => {
      const forecast: Partial<ForecastOutput> = {
        generatedAt: new Date().toISOString(),
        horizons: ['14d', '30d', '60d'],
        persona: 'contractor',
        revenueForecast: [
          { date: '2024-01-01', point: 5000, ciLow: 4500, ciHigh: 5500 },
        ],
        cashFlowStabilityIndex: 75,
        churnRisk: 0.3,
        anticipatedNeed: {
          nextWindowStart: '2024-01-15',
          nextWindowEnd: '2024-01-30',
          confidence: 0.7,
          topSignals: ['Increased engagement'],
        },
        explanations: [
          'Revenue forecast shows stable growth pattern',
          'Customer john.doe@example.com has high engagement',
          'Phone number 555-123-4567 shows increased activity',
        ],
      };

      const result = await runCreatorCheck(forecast);

      expect(result.passed).toBe(false);
      expect(result.notes).toContain('PII detected in forecast explanations');
    });

    it('should fail for forecast with manipulative language', async () => {
      const forecast: Partial<ForecastOutput> = {
        generatedAt: new Date().toISOString(),
        horizons: ['14d', '30d', '60d'],
        persona: 'contractor',
        revenueForecast: [
          { date: '2024-01-01', point: 5000, ciLow: 4500, ciHigh: 5500 },
        ],
        cashFlowStabilityIndex: 75,
        churnRisk: 0.3,
        anticipatedNeed: {
          nextWindowStart: '2024-01-15',
          nextWindowEnd: '2024-01-30',
          confidence: 0.7,
          topSignals: ['Increased engagement'],
        },
        explanations: [
          'URGENT: Revenue forecast shows CRITICAL decline',
          'IMMEDIATE action required to prevent LOSS',
          'EMERGENCY: Cash flow stability is in DANGER',
        ],
      };

      const result = await runCreatorCheck(forecast);

      expect(result.passed).toBe(false);
      expect(result.notes).toContain('Excessive urgency language detected');
    });

    it('should fail for forecast with fear-based messaging', async () => {
      const forecast: Partial<ForecastOutput> = {
        generatedAt: new Date().toISOString(),
        horizons: ['14d', '30d', '60d'],
        persona: 'contractor',
        revenueForecast: [
          { date: '2024-01-01', point: 5000, ciLow: 4500, ciHigh: 5500 },
        ],
        cashFlowStabilityIndex: 75,
        churnRisk: 0.3,
        anticipatedNeed: {
          nextWindowStart: '2024-01-15',
          nextWindowEnd: '2024-01-30',
          confidence: 0.7,
          topSignals: ['Increased engagement'],
        },
        explanations: [
          'Revenue forecast shows RISK of decline',
          'DANGER: Cash flow stability is at RISK',
          'THREAT: Churn risk is HIGH',
        ],
      };

      const result = await runCreatorCheck(forecast);

      expect(result.passed).toBe(false);
      expect(result.notes).toContain('Fear-based messaging detected');
    });

    it('should fail for forecast with false scarcity', async () => {
      const forecast: Partial<ForecastOutput> = {
        generatedAt: new Date().toISOString(),
        horizons: ['14d', '30d', '60d'],
        persona: 'contractor',
        revenueForecast: [
          { date: '2024-01-01', point: 5000, ciLow: 4500, ciHigh: 5500 },
        ],
        cashFlowStabilityIndex: 75,
        churnRisk: 0.3,
        anticipatedNeed: {
          nextWindowStart: '2024-01-15',
          nextWindowEnd: '2024-01-30',
          confidence: 0.7,
          topSignals: ['Increased engagement'],
        },
        explanations: [
          'Revenue forecast shows stable growth pattern',
          'LIMITED time offer for exclusive customers',
          'RARE opportunity for special pricing',
        ],
      };

      const result = await runCreatorCheck(forecast);

      expect(result.passed).toBe(false);
      expect(result.notes).toContain('False scarcity language detected');
    });

    it('should fail for forecast without opt-out information', async () => {
      const forecast: Partial<ForecastOutput> = {
        generatedAt: new Date().toISOString(),
        horizons: ['14d', '30d', '60d'],
        persona: 'contractor',
        revenueForecast: [
          { date: '2024-01-01', point: 5000, ciLow: 4500, ciHigh: 5500 },
        ],
        cashFlowStabilityIndex: 75,
        churnRisk: 0.3,
        anticipatedNeed: {
          nextWindowStart: '2024-01-15',
          nextWindowEnd: '2024-01-30',
          confidence: 0.7,
          topSignals: ['Increased engagement'],
        },
        explanations: [
          'Revenue forecast shows stable growth pattern',
          'Cash flow stability is good',
          'Low churn risk, maintain current initiatives',
        ],
      };

      const result = await runCreatorCheck(forecast);

      expect(result.passed).toBe(false);
      expect(result.notes).toContain('No opt-out information provided');
    });

    it('should fail for forecast with unprofessional language', async () => {
      const forecast: Partial<ForecastOutput> = {
        generatedAt: new Date().toISOString(),
        horizons: ['14d', '30d', '60d'],
        persona: 'contractor',
        revenueForecast: [
          { date: '2024-01-01', point: 5000, ciLow: 4500, ciHigh: 5500 },
        ],
        cashFlowStabilityIndex: 75,
        churnRisk: 0.3,
        anticipatedNeed: {
          nextWindowStart: '2024-01-15',
          nextWindowEnd: '2024-01-30',
          confidence: 0.7,
          topSignals: ['Increased engagement'],
        },
        explanations: [
          'Revenue forecast is AWESOME and AMAZING',
          'Cash flow stability is INCREDIBLE',
          'This is FANTASTIC news for the business',
        ],
      };

      const result = await runCreatorCheck(forecast);

      expect(result.passed).toBe(false);
      expect(result.notes).toContain('Unprofessional language detected');
    });

    it('should fail for forecast without customer benefit focus', async () => {
      const forecast: Partial<ForecastOutput> = {
        generatedAt: new Date().toISOString(),
        horizons: ['14d', '30d', '60d'],
        persona: 'contractor',
        revenueForecast: [
          { date: '2024-01-01', point: 5000, ciLow: 4500, ciHigh: 5500 },
        ],
        cashFlowStabilityIndex: 75,
        churnRisk: 0.3,
        anticipatedNeed: {
          nextWindowStart: '2024-01-15',
          nextWindowEnd: '2024-01-30',
          confidence: 0.7,
          topSignals: ['Increased engagement'],
        },
        explanations: [
          'Revenue forecast shows stable growth pattern',
          'Cash flow stability is good',
          'Low churn risk, maintain current initiatives',
        ],
      };

      const result = await runCreatorCheck(forecast);

      expect(result.passed).toBe(false);
      expect(result.notes).toContain('No customer benefit language detected');
    });

    it('should fail for forecast without long-term thinking', async () => {
      const forecast: Partial<ForecastOutput> = {
        generatedAt: new Date().toISOString(),
        horizons: ['14d', '30d', '60d'],
        persona: 'contractor',
        revenueForecast: [
          { date: '2024-01-01', point: 5000, ciLow: 4500, ciHigh: 5500 },
        ],
        cashFlowStabilityIndex: 75,
        churnRisk: 0.3,
        anticipatedNeed: {
          nextWindowStart: '2024-01-15',
          nextWindowEnd: '2024-01-30',
          confidence: 0.7,
          topSignals: ['Increased engagement'],
        },
        explanations: [
          'Revenue forecast shows stable growth pattern',
          'Cash flow stability is good',
          'Low churn risk, maintain current initiatives',
        ],
      };

      const result = await runCreatorCheck(forecast);

      expect(result.passed).toBe(false);
      expect(result.notes).toContain('No long-term thinking language detected');
    });

    it('should handle errors gracefully', async () => {
      const forecast = null as any;

      const result = await runCreatorCheck(forecast);

      expect(result.passed).toBe(false);
      expect(result.notes).toContain('Creator Check failed due to technical error');
    });
  });
});
