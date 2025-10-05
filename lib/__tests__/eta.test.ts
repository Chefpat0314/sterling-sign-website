// lib/__tests__/eta.test.ts - Unit tests for ETA calculations
import { describe, it, expect, beforeEach } from 'vitest';
import {
  isBusinessDay,
  addBusinessDays,
  nextBusinessDay,
  adjustForHolidays,
  computeProductionDays,
  computeShipDate,
  estimateTransitDays,
  computeDeliveryDate,
  buildDeliveryOptions,
} from '../eta';
import { SHIPPING_CONFIG } from '../../config/shipping';

describe('ETA Calculations', () => {
  beforeEach(() => {
    // Mock current date for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T10:00:00Z')); // Wednesday, 10 AM
  });

  describe('Business Day Functions', () => {
    it('should identify business days correctly', () => {
      const monday = new Date('2025-01-13T10:00:00Z'); // Monday
      const saturday = new Date('2025-01-18T10:00:00Z'); // Saturday
      const holiday = new Date('2025-01-01T10:00:00Z'); // New Year's Day

      expect(isBusinessDay(monday)).toBe(true);
      expect(isBusinessDay(saturday)).toBe(false);
      expect(isBusinessDay(holiday)).toBe(false);
    });

    it('should add business days correctly', () => {
      const startDate = new Date('2025-01-13T10:00:00Z'); // Monday
      const result = addBusinessDays(startDate, 3);
      
      // Should skip weekends
      expect(result.getDay()).toBe(4); // Thursday
    });

    it('should find next business day', () => {
      const friday = new Date('2025-01-17T10:00:00Z'); // Friday
      const result = nextBusinessDay(friday);
      
      expect(result.getDay()).toBe(1); // Monday
    });

    it('should adjust for holidays', () => {
      const holiday = new Date('2025-01-01T10:00:00Z'); // New Year's Day
      const result = adjustForHolidays(holiday);
      
      expect(result.getDate()).toBe(2); // Day after holiday
    });
  });

  describe('Production Day Calculations', () => {
    it('should calculate base production days', () => {
      const days = computeProductionDays('BAN-13OZ', 1, 10, 'standard');
      expect(days).toBe(2);
    });

    it('should apply rush reduction', () => {
      const standardDays = computeProductionDays('BAN-13OZ', 1, 10, 'standard');
      const rushDays = computeProductionDays('BAN-13OZ', 1, 10, 'rush20');
      
      expect(rushDays).toBeLessThan(standardDays);
    });

    it('should apply bulk adders', () => {
      const normalDays = computeProductionDays('BAN-13OZ', 1, 10, 'standard');
      const bulkDays = computeProductionDays('BAN-13OZ', 100, 100, 'standard');
      
      expect(bulkDays).toBeGreaterThan(normalDays);
    });
  });

  describe('Ship Date Calculations', () => {
    it('should start production today if before cutoff', () => {
      const now = new Date('2025-01-15T14:00:00Z'); // 2 PM
      const shipDate = computeShipDate(now, '17:00', 2);
      
      // Should start production today
      expect(shipDate.getDate()).toBeGreaterThan(now.getDate());
    });

    it('should start production tomorrow if after cutoff', () => {
      const now = new Date('2025-01-15T18:00:00Z'); // 6 PM
      const shipDate = computeShipDate(now, '17:00', 2);
      
      // Should start production tomorrow
      expect(shipDate.getDate()).toBeGreaterThan(now.getDate() + 1);
    });
  });

  describe('Transit Time Estimation', () => {
    it('should estimate ground transit correctly', () => {
      const days = estimateTransitDays('GROUND', '90210', '10001', false);
      expect(days).toBeGreaterThan(0);
    });

    it('should estimate air transit correctly', () => {
      const groundDays = estimateTransitDays('GROUND', '90210', '10001', false);
      const twoDayDays = estimateTransitDays('2DAY', '90210', '10001', false);
      const overnightDays = estimateTransitDays('OVERNIGHT', '90210', '10001', false);
      
      expect(overnightDays).toBeLessThan(twoDayDays);
      expect(twoDayDays).toBeLessThan(groundDays);
    });

    it('should use freight for oversize items', () => {
      const freightDays = estimateTransitDays('FREIGHT', '90210', '10001', true);
      expect(freightDays).toBe(7);
    });
  });

  describe('Delivery Date Calculations', () => {
    it('should calculate delivery date correctly', () => {
      const shipDate = new Date('2025-01-16T10:00:00Z');
      const deliveryDate = computeDeliveryDate(shipDate, 3, 'GROUND');
      
      expect(deliveryDate.getTime()).toBeGreaterThan(shipDate.getTime());
    });

    it('should handle air shipping guarantees', () => {
      const shipDate = new Date('2025-01-16T10:00:00Z');
      const groundDelivery = computeDeliveryDate(shipDate, 5, 'GROUND');
      const airDelivery = computeDeliveryDate(shipDate, 2, '2DAY');
      
      expect(airDelivery.getTime()).toBeLessThan(groundDelivery.getTime());
    });
  });

  describe('Delivery Options', () => {
    it('should build standard delivery options', () => {
      const input = {
        productCode: 'BAN-13OZ',
        quantity: 1,
        areaSqft: 10,
        width: 24,
        height: 12,
        destZip: '10001',
        rushLevel: 'standard' as const,
      };

      const options = buildDeliveryOptions(input);
      
      expect(options.length).toBeGreaterThan(0);
      expect(options[0]).toHaveProperty('code');
      expect(options[0]).toHaveProperty('label');
      expect(options[0]).toHaveProperty('arrivalDate');
      expect(options[0]).toHaveProperty('costCents');
    });

    it('should show freight for oversize items', () => {
      const input = {
        productCode: 'BAN-13OZ',
        quantity: 1,
        areaSqft: 10,
        width: 50, // Oversize
        height: 50,
        destZip: '10001',
        rushLevel: 'standard' as const,
      };

      const options = buildDeliveryOptions(input);
      
      expect(options.length).toBe(1);
      expect(options[0].code).toBe('FREIGHT');
      expect(options[0].notes).toContain('Large item');
    });

    it('should show guaranteed options for air shipping', () => {
      const input = {
        productCode: 'BAN-13OZ',
        quantity: 1,
        areaSqft: 10,
        width: 24,
        height: 12,
        destZip: '10001',
        rushLevel: 'standard' as const,
      };

      const options = buildDeliveryOptions(input);
      const airOptions = options.filter(opt => opt.code === '2DAY' || opt.code === 'OVERNIGHT');
      
      airOptions.forEach(option => {
        expect(option.guaranteed).toBe(true);
      });
    });
  });
});
