import { z } from 'zod';

// SEO Pack Schema
const SeoPackSchema = z.object({
  slug: z.string(),
  page_type: z.enum(['category', 'product', 'industry', 'service', 'homepage']),
  title_tag: z.string().max(60),
  meta_description: z.string().min(140).max(160),
  h1: z.string(),
  intro_paragraph: z.string(),
  feature_bullets: z.array(z.string()),
  cta_blurb: z.string(),
  schema: z.object({
    type: z.string(),
    brand: z.string(),
    category: z.string().optional(),
    mainEntity: z.any().optional()
  }),
  internal_links: z.array(z.string()),
  target_keywords: z.array(z.string()),
  audience_segment: z.string()
});

export type SeoPack = z.infer<typeof SeoPackSchema>;

/**
 * Load SEO pack by route slug
 */
export async function loadSeoPack(route: string): Promise<SeoPack | null> {
  try {
    // Map route to SEO pack file
    const packFile = route === '/' ? 'homepage' : route.replace(/^\//, '').replace(/\//g, '-');
    const packPath = `/content/seo_packs/${packFile}.json`;
    
    // In a real implementation, you'd fetch this from your CMS or file system
    // For now, we'll return null to indicate no pack found
    return null;
  } catch (error) {
    console.error('Error loading SEO pack:', error);
    return null;
  }
}

/**
 * Apply SEO pack to page metadata
 */
export function applySeoPack(pack: SeoPack) {
  return {
    title: pack.title_tag,
    description: pack.meta_description,
    h1: pack.h1,
    intro: pack.intro_paragraph,
    features: pack.feature_bullets,
    cta: pack.cta_blurb,
    schema: pack.schema,
    keywords: pack.target_keywords,
    audience: pack.audience_segment
  };
}

/**
 * Generate JSON-LD structured data from SEO pack
 */
export function generateJsonLd(pack: SeoPack, additionalData: any = {}) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": pack.schema.type,
    "name": pack.h1,
    "description": pack.meta_description,
    "brand": {
      "@type": "Brand",
      "name": pack.schema.brand
    },
    ...additionalData
  };

  if (pack.schema.category) {
    baseSchema.category = pack.schema.category;
  }

  return baseSchema;
}

/**
 * Validate SEO pack data
 */
export function validateSeoPack(pack: any): { valid: boolean; errors: string[] } {
  try {
    SeoPackSchema.parse(pack);
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { valid: false, errors: ['Unknown validation error'] };
  }
}
