export type QuantityTier = number;

export type ProductOption =
  | { key: string; type: 'bool'; label: string; add: number }
  | { key: string; type: 'enum'; label: string; choices: { value: string; add: number }[] }
  | { key: string; type: 'color'; label: string; choices: string[]; add: number };

export type ProductSchema = {
  slug: string;
  name: string;
  base_price_per_sqft: number;
  quantity_tiers: QuantityTier[];
  options: ProductOption[];
};

export type ConfigInput = {
  widthIn: number;
  heightIn: number;
  quantity: number;
  options: Record<string, any>;
};

export type PriceBreakdown = {
  sqft: number;
  base: number;
  optionsTotal: number;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  notes?: string[];
};

export function calculatePrice(product: ProductSchema, cfg: ConfigInput): PriceBreakdown {
  const sqft = Math.max(0.01, (cfg.widthIn * cfg.heightIn) / 144);
  const base = sqft * product.base_price_per_sqft;

  let optionsTotal = 0;
  const notes: string[] = [];

  for (const opt of product.options) {
    const v = cfg.options[opt.key];
    if (opt.type === 'bool') {
      if (v) optionsTotal += (opt as any).add * sqft;
    } else if (opt.type === 'enum') {
      const choice = (opt as any).choices.find((c: any) => c.value === v);
      if (choice) optionsTotal += choice.add * sqft;
    } else if (opt.type === 'color') {
      // flat adder per sqft if any color selected and add > 0
      if (v) optionsTotal += (opt as any).add * sqft;
    }
  }

  // Simple quantity economy of scale (5% discount at 5+, 10% at 10+, 15% at 25+)
  let discount = 0;
  if (cfg.quantity >= 25) discount = 0.15;
  else if (cfg.quantity >= 10) discount = 0.10;
  else if (cfg.quantity >= 5) discount = 0.05;

  const unitPrice = (base + optionsTotal) * (1 - discount);
  const lineTotal = unitPrice * Math.max(1, cfg.quantity);

  return {
    sqft: round2(sqft),
    base: round2(base),
    optionsTotal: round2(optionsTotal),
    unitPrice: round2(unitPrice),
    quantity: cfg.quantity,
    lineTotal: round2(lineTotal),
    notes,
  };
}

function round2(n: number) { return Math.round(n * 100) / 100; }
