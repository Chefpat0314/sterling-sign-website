import catalogData from '../data/products.catalog.json';

export interface CatalogItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  excerpt: string;
  description: string;
  status: string;
  startingPrice: number;
  minSize: string;
  maxSize: string;
  popular: boolean;
  features: string[];
}

// Get all catalog items
export function getAllCatalog(): CatalogItem[] {
  return catalogData as CatalogItem[];
}

// Get catalog item by slug
export function getCatalogBySlug(slug: string): CatalogItem | null {
  const item = catalogData.find((item: CatalogItem) => item.slug === slug);
  return item || null;
}

// Get catalog items by category
export function getCatalogByCategory(category: string): CatalogItem[] {
  return catalogData.filter((item: CatalogItem) => item.category === category);
}

// Get popular catalog items
export function getPopularCatalog(): CatalogItem[] {
  return catalogData.filter((item: CatalogItem) => item.popular);
}

// Get slug from old product ID (for redirects)
export function getSlugFromSourceId(id: string): string | null {
  const mapping: Record<string, string> = {
    'BAN-13OZ': 'banners-13oz',
    'BAN-18OZ': 'banners-18oz', 
    'BAN-20OZ': 'banners-20oz',
    'COR-4MM': 'coroplast-4mm',
    'COR-6MM': 'coroplast-6mm',
    'ALU-040': 'aluminum-040',
    'ALU-063': 'aluminum-063',
    'ACM-3MM': 'acm-3mm',
    'ACM-6MM': 'acm-6mm',
    'PVC-3MM': 'pvc-3mm',
    'PVC-6MM': 'pvc-6mm',
    'ADA-ROOM': 'ada-room-signs',
    'DEC-VINYL': 'decals-vinyl',
    'WIN-PERF': 'window-perforated',
    'WAL-DECAL': 'wall-decals',
    'MAG-VINYL': 'magnetic-vinyl',
    'FLR-VINYL': 'floor-graphics',
    'SAF-POLY': 'safety-labels'
  };
  
  return mapping[id] || null;
}

// Get all unique categories
export function getAllCategories(): string[] {
  const categories = catalogData.map((item: CatalogItem) => item.category);
  return [...new Set(categories)];
}

// Search catalog items
export function searchCatalog(query: string): CatalogItem[] {
  const lowercaseQuery = query.toLowerCase();
  return catalogData.filter((item: CatalogItem) => 
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.description.toLowerCase().includes(lowercaseQuery) ||
    item.category.toLowerCase().includes(lowercaseQuery) ||
    item.features.some(feature => feature.toLowerCase().includes(lowercaseQuery))
  );
}
