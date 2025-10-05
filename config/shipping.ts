// config/shipping.ts - Shipping SLA configuration and rules
export const SHIPPING_CONFIG = {
  // Store timezone and cutoff
  storeTimezone: 'America/Los_Angeles',
  dailyCutoffLocal: '17:00', // 5pm local

  // Production holidays (ISO dates)
  productionHolidays: [
    '2025-01-01', // New Year's Day
    '2025-07-04', // Independence Day
    '2025-12-25', // Christmas Day
    '2025-12-26', // Day after Christmas
  ],

  // Base production days by product (from existing pricing)
  baseProdDaysByProduct: {
    'BAN-13OZ': 2,
    'BAN-18OZ': 2,
    'BAN-20OZ': 2,
    'COR-4MM': 2,
    'COR-6MM': 2,
    'ALU-040': 3,
    'ALU-063': 3,
    'ACM-3MM': 4,
    'ACM-6MM': 4,
    'PVC-3MM': 2,
    'PVC-6MM': 2,
    'ADA-ROOM': 3,
    'DEC-VINYL': 2,
    'WIN-PERF': 2,
    'WAL-DECAL': 2,
    'MAG-VINYL': 2,
    'FLR-VINYL': 3,
    'SAF-POLY': 2,
  },

  // Bulk order adders
  bulkAdders: {
    areaSqftThreshold: 50,
    addDays: 1,
  },

  // Rush options by product
  allowRushByProduct: {
    'BAN-13OZ': { rushProdDays: 1 },
    'BAN-18OZ': { rushProdDays: 1 },
    'BAN-20OZ': { rushProdDays: 1 },
    'COR-4MM': { rushProdDays: 1 },
    'COR-6MM': { rushProdDays: 1 },
    'ALU-040': { rushProdDays: 2 },
    'ALU-063': { rushProdDays: 2 },
    'ACM-3MM': { rushProdDays: 2 },
    'ACM-6MM': { rushProdDays: 2 },
    'PVC-3MM': { rushProdDays: 1 },
    'PVC-6MM': { rushProdDays: 1 },
    'ADA-ROOM': { rushProdDays: 2 },
    'DEC-VINYL': { rushProdDays: 1 },
    'WIN-PERF': { rushProdDays: 1 },
    'WAL-DECAL': { rushProdDays: 1 },
    'MAG-VINYL': { rushProdDays: 1 },
    'FLR-VINYL': { rushProdDays: 2 },
    'SAF-POLY': { rushProdDays: 1 },
  },

  // Freight rules
  freightRules: {
    longestEdgeIn: 46, // inches
    weightLbThreshold: 150, // pounds
  },

  // Ground transit matrix (zone-based)
  groundTransitMatrix: {
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
  },

  // Safety buffers for >97% OTIF
  buffers: {
    groundDaysPad: 1, // Add 1 day to ground estimates
    etaSafetyPadDays: 0, // Additional safety pad
  },
};

// Product shipping profiles
export const SHIPPING_PROFILES: Record<string, {
  oversize?: boolean;
  fragile?: boolean;
  packing: 'tube' | 'flat' | 'crate';
}> = {
  'BAN-13OZ': { packing: 'tube' },
  'BAN-18OZ': { packing: 'tube' },
  'BAN-20OZ': { packing: 'tube' },
  'COR-4MM': { packing: 'flat' },
  'COR-6MM': { packing: 'flat' },
  'ALU-040': { packing: 'flat' },
  'ALU-063': { packing: 'flat' },
  'ACM-3MM': { packing: 'flat' },
  'ACM-6MM': { packing: 'flat' },
  'PVC-3MM': { packing: 'flat' },
  'PVC-6MM': { packing: 'flat' },
  'ADA-ROOM': { packing: 'flat' },
  'DEC-VINYL': { packing: 'flat' },
  'WIN-PERF': { packing: 'flat' },
  'WAL-DECAL': { packing: 'flat' },
  'MAG-VINYL': { packing: 'flat' },
  'FLR-VINYL': { packing: 'flat' },
  'SAF-POLY': { packing: 'flat' },
};

// Delivery option types
export type DeliveryMethod = 'GROUND' | '2DAY' | 'OVERNIGHT' | 'FREIGHT';

export interface DeliveryOption {
  code: DeliveryMethod;
  label: string;
  arrivalDate: string; // ISO date
  arrivalRange?: [string, string]; // For ground shipping ranges
  costCents: number;
  guaranteed: boolean;
  notes?: string;
}

// Rush level types
export type RushLevel = 'standard' | 'rush20' | 'rush40';

// Shipping input for calculations
export interface ShippingInput {
  productCode: string;
  quantity: number;
  areaSqft: number;
  width: number;
  height: number;
  weight?: number;
  destZip: string;
  rushLevel: RushLevel;
  orderDate?: Date;
}
