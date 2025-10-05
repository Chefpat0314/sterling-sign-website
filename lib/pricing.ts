// lib/pricing.ts - Deterministic pricing calculations
import { z } from 'zod';

// Pricing Schema
const PricingConfigSchema = z.object({
  baseRateSqft: z.number(),
  minCharge: z.number(),
  options: z.record(z.object({
    type: z.enum(['perLf', 'perSqft', 'each', 'percent']),
    value: z.number(),
  })).optional(),
  rush: z.object({
    rush20: z.number(), // 20% rush multiplier
    rush40: z.number(), // 40% rush multiplier
  }),
  sla: z.object({
    stdDays: z.number(),
    rushDays: z.number(),
  }),
});

export type PricingConfig = z.infer<typeof PricingConfigSchema>;

// Complete pricing table for all Sterling products
export const PRICING: Record<string, PricingConfig> = {
  // Vinyl Banners
  'BAN-13OZ': {
    baseRateSqft: 5,
    minCharge: 19,
    options: {
      hemGrommet: { type: 'perLf', value: 0.6 },
      reinforcedCorners: { type: 'each', value: 2.0 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 2, rushDays: 1 },
  },
  'BAN-18OZ': {
    baseRateSqft: 6,
    minCharge: 25,
    options: {
      polePocket: { type: 'perLf', value: 1.0 },
      doubleSided: { type: 'percent', value: 0.75 },
      reinforcedCorners: { type: 'each', value: 2.0 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 2, rushDays: 1 },
  },
  'BAN-20OZ': {
    baseRateSqft: 7,
    minCharge: 35,
    options: {
      polePocket: { type: 'perLf', value: 1.0 },
      doubleSided: { type: 'percent', value: 0.75 },
      reinforcedCorners: { type: 'each', value: 2.0 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 2, rushDays: 1 },
  },

  // Coroplast Signs
  'COR-4MM': {
    baseRateSqft: 7,
    minCharge: 15,
    options: {
      hStake: { type: 'each', value: 1.25 },
      uChannel: { type: 'perLf', value: 0.8 },
      doubleSided: { type: 'percent', value: 0.75 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 2, rushDays: 1 },
  },
  'COR-6MM': {
    baseRateSqft: 9,
    minCharge: 20,
    options: {
      hStake: { type: 'each', value: 1.25 },
      uChannel: { type: 'perLf', value: 0.8 },
      doubleSided: { type: 'percent', value: 0.75 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 2, rushDays: 1 },
  },

  // Aluminum Signs
  'ALU-040': {
    baseRateSqft: 12,
    minCharge: 35,
    options: {
      hole: { type: 'each', value: 2.0 },
      lam: { type: 'perSqft', value: 2.0 },
      powderCoat: { type: 'perSqft', value: 3.0 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 3, rushDays: 2 },
  },
  'ALU-063': {
    baseRateSqft: 15,
    minCharge: 45,
    options: {
      hole: { type: 'each', value: 2.0 },
      lam: { type: 'perSqft', value: 2.0 },
      powderCoat: { type: 'perSqft', value: 3.0 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 3, rushDays: 2 },
  },

  // ACM (Aluminum Composite Material)
  'ACM-3MM': {
    baseRateSqft: 18,
    minCharge: 65,
    options: {
      hole: { type: 'each', value: 2.0 },
      lam: { type: 'perSqft', value: 2.0 },
      standoffs: { type: 'each', value: 3.5 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 4, rushDays: 2 },
  },
  'ACM-6MM': {
    baseRateSqft: 25,
    minCharge: 85,
    options: {
      hole: { type: 'each', value: 2.0 },
      lam: { type: 'perSqft', value: 2.0 },
      standoffs: { type: 'each', value: 3.5 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 4, rushDays: 2 },
  },

  // PVC Foamboard
  'PVC-3MM': {
    baseRateSqft: 8,
    minCharge: 20,
    options: {
      mountingTape: { type: 'perSqft', value: 0.5 },
      doubleSided: { type: 'percent', value: 0.75 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 2, rushDays: 1 },
  },
  'PVC-6MM': {
    baseRateSqft: 12,
    minCharge: 30,
    options: {
      mountingTape: { type: 'perSqft', value: 0.5 },
      doubleSided: { type: 'percent', value: 0.75 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 2, rushDays: 1 },
  },

  // ADA Signs (table-based pricing)
  'ADA-ROOM': {
    baseRateSqft: 0, // Table-based
    minCharge: 45,
    options: {
      braille: { type: 'each', value: 0 }, // Included
      mountingHoles: { type: 'each', value: 1.0 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 3, rushDays: 2 },
  },

  // Decals
  'DEC-VINYL': {
    baseRateSqft: 6,
    minCharge: 15,
    options: {
      lamination: { type: 'perSqft', value: 1.5 },
      dieCut: { type: 'each', value: 5.0 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 2, rushDays: 1 },
  },

  // Window Perforated
  'WIN-PERF': {
    baseRateSqft: 8,
    minCharge: 25,
    options: {
      lamination: { type: 'perSqft', value: 1.5 },
      grommets: { type: 'each', value: 1.0 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 2, rushDays: 1 },
  },

  // Wall Decals
  'WAL-DECAL': {
    baseRateSqft: 5,
    minCharge: 20,
    options: {
      lamination: { type: 'perSqft', value: 1.5 },
      application: { type: 'perSqft', value: 2.0 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 2, rushDays: 1 },
  },

  // Magnets
  'MAG-VINYL': {
    baseRateSqft: 8,
    minCharge: 25,
    options: {
      lamination: { type: 'perSqft', value: 1.5 },
      cornerRounding: { type: 'each', value: 0 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 2, rushDays: 1 },
  },

  // Floor Graphics
  'FLR-VINYL': {
    baseRateSqft: 12,
    minCharge: 35,
    options: {
      lamination: { type: 'perSqft', value: 2.0 },
      application: { type: 'perSqft', value: 3.0 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 3, rushDays: 2 },
  },

  // Safety Labels
  'SAF-POLY': {
    baseRateSqft: 15,
    minCharge: 20,
    options: {
      lamination: { type: 'perSqft', value: 1.5 },
      customSize: { type: 'each', value: 0 },
    },
    rush: { rush20: 0.2, rush40: 0.4 },
    sla: { stdDays: 2, rushDays: 1 },
  },
};

// Quote Configuration Schema
const QuoteConfigSchema = z.object({
  productCode: z.string(),
  width: z.number().positive(),
  height: z.number().positive(),
  quantity: z.number().int().positive(),
  options: z.record(z.any()).optional(),
  rushLevel: z.enum(['standard', 'rush20', 'rush40']).default('standard'),
  zipCode: z.string().optional(),
});

export type QuoteConfig = z.infer<typeof QuoteConfigSchema>;

// Quote Result Schema
const QuoteResultSchema = z.object({
  price: z.number(),
  lineItems: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    total: z.number(),
  })),
  sqFt: z.number(),
  lfPerimeter: z.number(),
  minApplied: z.boolean(),
  rushAdd: z.number(),
  etaDate: z.string(),
  basePrice: z.number(),
  optionsPrice: z.number(),
});

export type QuoteResult = z.infer<typeof QuoteResultSchema>;

// ADA Sign pricing table (special case)
const ADA_PRICING: Record<string, number> = {
  '4x6': 45,
  '6x8': 65,
  '8x10': 85,
  '10x12': 105,
  '12x16': 135,
  '16x20': 175,
  '20x24': 225,
};

// Main pricing function
export function quote(config: QuoteConfig): QuoteResult {
  const validated = QuoteConfigSchema.parse(config);
  const { productCode, width, height, quantity, options = {}, rushLevel, zipCode } = validated;

  const pricing = PRICING[productCode];
  if (!pricing) {
    throw new Error(`Unknown product code: ${productCode}`);
  }

  const sqFt = (width * height) / 144; // Convert square inches to square feet
  const lfPerimeter = 2 * (width + height) / 12; // Linear feet of perimeter

  const lineItems: Array<{ description: string; quantity: number; unitPrice: number; total: number }> = [];

  let basePrice = 0;
  let optionsPrice = 0;

  // Calculate base price
  if (productCode === 'ADA-ROOM') {
    // ADA signs use table-based pricing
    const sizeKey = `${Math.round(width)}x${Math.round(height)}`;
    basePrice = ADA_PRICING[sizeKey] || ADA_PRICING['8x10']; // Default to 8x10 if size not found
    lineItems.push({
      description: `ADA Room Sign ${width}"x${height}"`,
      quantity,
      unitPrice: basePrice,
      total: basePrice * quantity,
    });
  } else {
    // Standard square footage pricing
    basePrice = sqFt * pricing.baseRateSqft;
    lineItems.push({
      description: `${productCode} Base (${sqFt.toFixed(2)} sq ft)`,
      quantity,
      unitPrice: basePrice,
      total: basePrice * quantity,
    });
  }

  // Calculate options
  if (pricing.options) {
    for (const [optionKey, optionConfig] of Object.entries(pricing.options)) {
      if (options[optionKey]) {
        let optionPrice = 0;
        let description = optionKey;

        switch (optionConfig.type) {
          case 'perSqft':
            optionPrice = sqFt * optionConfig.value;
            description = `${optionKey} (${sqFt.toFixed(2)} sq ft)`;
            break;
          case 'perLf':
            optionPrice = lfPerimeter * optionConfig.value;
            description = `${optionKey} (${lfPerimeter.toFixed(2)} lf)`;
            break;
          case 'each':
            optionPrice = optionConfig.value;
            description = optionKey;
            break;
          case 'percent':
            optionPrice = basePrice * optionConfig.value;
            description = `${optionKey} (${(optionConfig.value * 100)}%)`;
            break;
        }

        optionsPrice += optionPrice;
        lineItems.push({
          description,
          quantity,
          unitPrice: optionPrice,
          total: optionPrice * quantity,
        });
      }
    }
  }

  // Apply minimum charge
  const subtotal = (basePrice + optionsPrice) * quantity;
  const minApplied = subtotal < pricing.minCharge;
  const adjustedSubtotal = minApplied ? pricing.minCharge : subtotal;

  if (minApplied) {
    lineItems.push({
      description: 'Minimum charge applied',
      quantity: 1,
      unitPrice: pricing.minCharge - subtotal,
      total: pricing.minCharge - subtotal,
    });
  }

  // Calculate rush pricing
  let rushAdd = 0;
  if (rushLevel === 'rush20') {
    rushAdd = adjustedSubtotal * pricing.rush.rush20;
    lineItems.push({
      description: '20% Rush Fee',
      quantity: 1,
      unitPrice: rushAdd,
      total: rushAdd,
    });
  } else if (rushLevel === 'rush40') {
    rushAdd = adjustedSubtotal * pricing.rush.rush40;
    lineItems.push({
      description: '40% Rush Fee',
      quantity: 1,
      unitPrice: rushAdd,
      total: rushAdd,
    });
  }

  const finalPrice = adjustedSubtotal + rushAdd;

  // Calculate ETA (simplified - would integrate with eta.ts)
  const etaDate = new Date();
  const productionDays = rushLevel === 'standard' ? pricing.sla.stdDays : pricing.sla.rushDays;
  etaDate.setDate(etaDate.getDate() + productionDays + 2); // +2 for shipping

  return {
    price: finalPrice,
    lineItems,
    sqFt,
    lfPerimeter,
    minApplied,
    rushAdd,
    etaDate: etaDate.toISOString().split('T')[0],
    basePrice: basePrice * quantity,
    optionsPrice: optionsPrice * quantity,
  };
}

// Utility functions
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
}

export function getProductName(productCode: string): string {
  const names: Record<string, string> = {
    'BAN-13OZ': '13oz Vinyl Banner',
    'BAN-18OZ': '18oz Blockout Banner',
    'BAN-20OZ': '20oz Premium Banner',
    'COR-4MM': '4mm Coroplast Sign',
    'COR-6MM': '6mm Coroplast Sign',
    'ALU-040': '.040 Aluminum Sign',
    'ALU-063': '.063 Aluminum Sign',
    'ACM-3MM': '3mm ACM Sign',
    'ACM-6MM': '6mm ACM Sign',
    'PVC-3MM': '3mm PVC Foamboard',
    'PVC-6MM': '6mm PVC Foamboard',
    'ADA-ROOM': 'ADA Room Sign',
    'DEC-VINYL': 'Vinyl Decal',
    'WIN-PERF': 'Window Perforated',
    'WAL-DECAL': 'Wall Decal',
    'MAG-VINYL': 'Magnetic Sign',
    'FLR-VINYL': 'Floor Graphic',
    'SAF-POLY': 'Safety Label',
  };
  return names[productCode] || productCode;
}

export function getProductCategory(productCode: string): string {
  if (productCode.startsWith('BAN-')) return 'Banners';
  if (productCode.startsWith('COR-')) return 'Rigid Signs';
  if (productCode.startsWith('ALU-') || productCode.startsWith('ACM-') || productCode.startsWith('PVC-')) return 'Rigid Signs';
  if (productCode.startsWith('ADA-')) return 'ADA';
  if (productCode.startsWith('DEC-') || productCode.startsWith('WIN-') || productCode.startsWith('WAL-')) return 'Window/Wall';
  if (productCode.startsWith('MAG-') || productCode.startsWith('FLR-')) return 'Specialty';
  if (productCode.startsWith('SAF-')) return 'Labels';
  return 'Other';
}
