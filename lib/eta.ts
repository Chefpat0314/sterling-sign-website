// lib/eta.ts - Delivery ETA calculations with business day math
import { z } from 'zod';
import { SHIPPING_CONFIG, type ShippingInput, type DeliveryOption, type RushLevel } from '../config/shipping';

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

// Business day utilities
export function isBusinessDay(date: Date): boolean {
  const day = date.getDay();
  if (day === 0 || day === 6) return false; // Weekend
  
  // Check if it's a holiday
  const isoDate = date.toISOString().split('T')[0];
  return !SHIPPING_CONFIG.productionHolidays.includes(isoDate);
}

export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDay(result)) {
      addedDays++;
    }
  }
  
  return result;
}

export function nextBusinessDay(date: Date): Date {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  while (!isBusinessDay(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
}

export function adjustForHolidays(date: Date): Date {
  while (!isBusinessDay(date)) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

// Check if date is weekend (legacy function)
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
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

// Production day calculations
export function computeProductionDays(
  productCode: string,
  qty: number,
  areaSqft: number,
  rushLevel: RushLevel
): number {
  const baseDays = SHIPPING_CONFIG.baseProdDaysByProduct[productCode] || 2;
  
  // Apply rush reduction
  let productionDays = baseDays;
  if (rushLevel === 'rush20' || rushLevel === 'rush40') {
    const rushConfig = SHIPPING_CONFIG.allowRushByProduct[productCode];
    if (rushConfig) {
      productionDays = rushConfig.rushProdDays;
    }
  }
  
  // Apply bulk adder
  if (areaSqft > SHIPPING_CONFIG.bulkAdders.areaSqftThreshold || qty > 50) {
    productionDays += SHIPPING_CONFIG.bulkAdders.addDays;
  }
  
  return productionDays;
}

// Ship date calculation
export function computeShipDate(now: Date, cutoff: string, prodDays: number): Date {
  const [cutoffHour, cutoffMinute] = cutoff.split(':').map(Number);
  const cutoffTime = new Date(now);
  cutoffTime.setHours(cutoffHour, cutoffMinute, 0, 0);
  
  let productionStart = now;
  if (now > cutoffTime) {
    productionStart = nextBusinessDay(now);
  } else {
    productionStart = adjustForHolidays(productionStart);
  }
  
  return addBusinessDays(productionStart, prodDays);
}

// Transit time estimation
export function estimateTransitDays(
  method: string,
  originZip: string,
  destZip: string,
  oversize: boolean = false
): number {
  if (oversize) {
    return 7; // Freight transit time
  }
  
  const zone = getShippingZone(destZip);
  const transitMatrix = SHIPPING_CONFIG.groundTransitMatrix[zone] || 
    SHIPPING_CONFIG.groundTransitMatrix['50000-59999'];
  
  switch (method) {
    case 'GROUND':
      return transitMatrix.ground + SHIPPING_CONFIG.buffers.groundDaysPad;
    case '2DAY':
      return transitMatrix.twoDay;
    case 'OVERNIGHT':
      return transitMatrix.overnight;
    case 'FREIGHT':
      return 7;
    default:
      return transitMatrix.ground;
  }
}

// Delivery date calculation
export function computeDeliveryDate(
  shipDate: Date,
  transitDays: number,
  method: string
): Date {
  if (method === 'GROUND') {
    // Ground shipping can have a range, return the latest date
    return addBusinessDays(shipDate, transitDays);
  } else {
    // Air shipping is guaranteed
    return addBusinessDays(shipDate, transitDays);
  }
}

// Build delivery options
export function buildDeliveryOptions(input: ShippingInput): DeliveryOption[] {
  const { productCode, areaSqft, width, height, destZip, rushLevel } = input;
  
  // Check if item is oversize
  const longestEdge = Math.max(width, height);
  const isOversize = longestEdge > SHIPPING_CONFIG.freightRules.longestEdgeIn;
  
  const productionDays = computeProductionDays(productCode, input.quantity, areaSqft, rushLevel);
  const shipDate = computeShipDate(new Date(), SHIPPING_CONFIG.dailyCutoffLocal, productionDays);
  
  const options: DeliveryOption[] = [];
  
  if (isOversize) {
    // Oversize items go freight only
    const transitDays = estimateTransitDays('FREIGHT', '90210', destZip, true);
    const deliveryDate = computeDeliveryDate(shipDate, transitDays, 'FREIGHT');
    
    options.push({
      code: 'FREIGHT',
      label: `Freight — $${(1500 / 100).toFixed(2)} — arrives ${formatETA({ promisedDate: deliveryDate.toISOString().split('T')[0] })}`,
      arrivalDate: deliveryDate.toISOString().split('T')[0],
      costCents: 1500, // $15.00
      guaranteed: false,
      notes: 'Large item — ships on pallet',
    });
  } else {
    // Standard shipping options
    const groundTransit = estimateTransitDays('GROUND', '90210', destZip, false);
    const twoDayTransit = estimateTransitDays('2DAY', '90210', destZip, false);
    const overnightTransit = estimateTransitDays('OVERNIGHT', '90210', destZip, false);
    
    const groundDelivery = computeDeliveryDate(shipDate, groundTransit, 'GROUND');
    const twoDayDelivery = computeDeliveryDate(shipDate, twoDayTransit, '2DAY');
    const overnightDelivery = computeDeliveryDate(shipDate, overnightTransit, 'OVERNIGHT');
    
    options.push(
      {
        code: 'GROUND',
        label: `Standard — FREE — arrives ${formatETA({ promisedDate: groundDelivery.toISOString().split('T')[0] })} (Ground)`,
        arrivalDate: groundDelivery.toISOString().split('T')[0],
        costCents: 0,
        guaranteed: false,
      },
      {
        code: '2DAY',
        label: `Expedited — $20.00 — arrives ${formatETA({ promisedDate: twoDayDelivery.toISOString().split('T')[0] })} (2-Day)`,
        arrivalDate: twoDayDelivery.toISOString().split('T')[0],
        costCents: 2000,
        guaranteed: true,
      },
      {
        code: 'OVERNIGHT',
        label: `Rush — $60.00 — arrives ${formatETA({ promisedDate: overnightDelivery.toISOString().split('T')[0] })} (Overnight)`,
        arrivalDate: overnightDelivery.toISOString().split('T')[0],
        costCents: 6000,
        guaranteed: true,
      }
    );
  }
  
  return options;
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
  
  while (!isBusinessDay(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
}
