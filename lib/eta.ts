// lib/eta.ts - Delivery ETA calculations
import { z } from 'zod';

// ETA Configuration Schema
const ETAConfigSchema = z.object({
  productCode: z.string(),
  sqFt: z.number().positive(),
  qty: z.number().int().positive(),
  rushLevel: z.enum(['standard', 'rush20', 'rush40']),
  shipZip: z.string().regex(/^\d{5}(-\d{4})?$/),
  orderDate: z.date().optional(),
});

export type ETAConfig = z.infer<typeof ETAConfigSchema>;

// ETA Result Schema
const ETAResultSchema = z.object({
  productionDays: z.number(),
  shipDays: z.number(),
  promisedDate: z.string(),
  promiseType: z.enum(['std', 'rush']),
  cutoffTime: z.string(),
  productionStart: z.string(),
  shipDate: z.string(),
  breakdown: z.object({
    cutoffCheck: z.boolean(),
    productionSLA: z.number(),
    largeOrderAdjustment: z.number(),
    weekendAdjustment: z.number(),
    carrierSLA: z.number(),
  }),
});

export type ETAResult = z.infer<typeof ETAResultSchema>;

// Production SLAs by product type
const PRODUCTION_SLA: Record<string, { std: number; rush: number }> = {
  'BAN-13OZ': { std: 2, rush: 1 },
  'BAN-18OZ': { std: 2, rush: 1 },
  'BAN-20OZ': { std: 2, rush: 1 },
  'COR-4MM': { std: 2, rush: 1 },
  'COR-6MM': { std: 2, rush: 1 },
  'ALU-040': { std: 3, rush: 2 },
  'ALU-063': { std: 3, rush: 2 },
  'ACM-3MM': { std: 4, rush: 2 },
  'ACM-6MM': { std: 4, rush: 2 },
  'PVC-3MM': { std: 2, rush: 1 },
  'PVC-6MM': { std: 2, rush: 1 },
  'ADA-ROOM': { std: 3, rush: 2 },
  'DEC-VINYL': { std: 2, rush: 1 },
  'WIN-PERF': { std: 2, rush: 1 },
  'WAL-DECAL': { std: 2, rush: 1 },
  'MAG-VINYL': { std: 2, rush: 1 },
  'FLR-VINYL': { std: 3, rush: 2 },
  'SAF-POLY': { std: 2, rush: 1 },
};

// Shipping zones and SLAs
const SHIPPING_ZONES: Record<string, { ground: number; twoDay: number; overnight: number }> = {
  '00000-09999': { ground: 1, twoDay: 1, overnight: 1 }, // Local
  '10000-19999': { ground: 2, twoDay: 2, overnight: 1 }, // Northeast
  '20000-29999': { ground: 2, twoDay: 2, overnight: 1 }, // Mid-Atlantic
  '30000-39999': { ground: 3, twoDay: 2, overnight: 1 }, // Southeast
  '40000-49999': { ground: 3, twoDay: 2, overnight: 1 }, // Midwest
  '50000-59999': { ground: 4, twoDay: 2, overnight: 1 }, // Central
  '60000-69999': { ground: 4, twoDay: 2, overnight: 1 }, // Upper Midwest
  '70000-79999': { ground: 5, twoDay: 2, overnight: 1 }, // South Central
  '80000-89999': { ground: 5, twoDay: 2, overnight: 1 }, // Mountain
  '90000-99999': { ground: 5, twoDay: 2, overnight: 1 }, // Pacific
};

// Get shipping zone from ZIP code
function getShippingZone(zipCode: string): string {
  const zip = parseInt(zipCode.substring(0, 5));
  const zoneStart = Math.floor(zip / 10000) * 10000;
  const zoneEnd = zoneStart + 9999;
  return `${zoneStart.toString().padStart(5, '0')}-${zoneEnd.toString().padStart(5, '0')}`;
}

// Check if date is weekend
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

// Add business days to date
function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result)) {
      addedDays++;
    }
  }
  
  return result;
}

// Main ETA calculation function
export function calculateETA(config: ETAConfig): ETAResult {
  const validated = ETAConfigSchema.parse(config);
  const { productCode, sqFt, qty, rushLevel, shipZip, orderDate = new Date() } = validated;

  const productionSLA = PRODUCTION_SLA[productCode];
  if (!productionSLA) {
    throw new Error(`Unknown product code: ${productCode}`);
  }

  const cutoffTime = '14:00'; // 2 PM cutoff
  const cutoffHour = 14;
  
  // Check if order is after cutoff
  const orderHour = orderDate.getHours();
  const cutoffCheck = orderHour >= cutoffHour;
  
  // Base production days
  let productionDays = rushLevel === 'standard' ? productionSLA.std : productionSLA.rush;
  
  // Large order adjustment (>50 sq ft or >50 units)
  const largeOrderAdjustment = (sqFt > 50 || qty > 50) ? 1 : 0;
  productionDays += largeOrderAdjustment;
  
  // Weekend adjustment
  let weekendAdjustment = 0;
  let productionStart = new Date(orderDate);
  
  if (cutoffCheck) {
    productionStart.setDate(productionStart.getDate() + 1);
    weekendAdjustment = 1;
  }
  
  // Skip weekends for production start
  while (isWeekend(productionStart)) {
    productionStart.setDate(productionStart.getDate() + 1);
  }
  
  // Calculate ship date
  const shipDate = addBusinessDays(productionStart, productionDays);
  
  // Get shipping zone and SLA
  const zone = getShippingZone(shipZip);
  const shippingSLA = SHIPPING_ZONES[zone] || SHIPPING_ZONES['50000-59999']; // Default to central zone
  const shipDays = shippingSLA.ground; // Default to ground shipping
  
  // Calculate promised date
  const promisedDate = addBusinessDays(shipDate, shipDays);
  
  return {
    productionDays,
    shipDays,
    promisedDate: promisedDate.toISOString().split('T')[0],
    promiseType: rushLevel === 'standard' ? 'std' : 'rush',
    cutoffTime,
    productionStart: productionStart.toISOString().split('T')[0],
    shipDate: shipDate.toISOString().split('T')[0],
    breakdown: {
      cutoffCheck,
      productionSLA: rushLevel === 'standard' ? productionSLA.std : productionSLA.rush,
      largeOrderAdjustment,
      weekendAdjustment,
      carrierSLA: shipDays,
    },
  };
}

// Utility functions
export function formatETA(eta: ETAResult): string {
  const date = new Date(eta.promisedDate);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `${diffDays} days`;
  
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getShippingOptions(zipCode: string): Array<{
  name: string;
  days: number;
  price: number;
  description: string;
}> {
  const zone = getShippingZone(zipCode);
  const shippingSLA = SHIPPING_ZONES[zone] || SHIPPING_ZONES['50000-59999'];
  
  return [
    {
      name: 'Ground',
      days: shippingSLA.ground,
      price: 0, // Free ground shipping
      description: 'Standard delivery',
    },
    {
      name: '2-Day',
      days: shippingSLA.twoDay,
      price: 15,
      description: '2-day delivery',
    },
    {
      name: 'Overnight',
      days: shippingSLA.overnight,
      price: 35,
      description: 'Next day delivery',
    },
  ];
}

export function isRushAvailable(productCode: string): boolean {
  return !!PRODUCTION_SLA[productCode];
}

export function getRushOptions(productCode: string): Array<{
  level: 'rush20' | 'rush40';
  label: string;
  description: string;
  multiplier: number;
}> {
  if (!isRushAvailable(productCode)) return [];
  
  return [
    {
      level: 'rush20',
      label: '20% Rush',
      description: '20% faster production',
      multiplier: 0.2,
    },
    {
      level: 'rush40',
      label: '40% Rush',
      description: '40% faster production',
      multiplier: 0.4,
    },
  ];
}

// Business hours check
export function isBusinessHours(date: Date = new Date()): boolean {
  const hour = date.getHours();
  const day = date.getDay();
  
  // Monday-Friday, 8 AM - 6 PM
  return day >= 1 && day <= 5 && hour >= 8 && hour < 18;
}

// Next business day
export function getNextBusinessDay(date: Date = new Date()): Date {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  while (isWeekend(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
}
