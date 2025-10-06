# Product Routes Mapping Analysis

## Current Route Structure

### Working Routes ✅
```
/products → Products catalog page (index.tsx)
/products/vinyl-banner → Product detail page ✅
/products/aluminum-sign → Product detail page ✅
/products/door-hours-decal → Product detail page ✅
```

### Broken Routes ❌ (404s)
```
/products/ban-13oz → 404 (should be /products/banners-13oz)
/products/ban-18oz → 404 (should be /products/banners-18oz)
/products/ban-20oz → 404 (should be /products/banners-20oz)
/products/cor-4mm → 404 (should be /products/coroplast-4mm)
/products/cor-6mm → 404 (should be /products/coroplast-6mm)
/products/alu-040 → 404 (should be /products/aluminum-040)
/products/alu-063 → 404 (should be /products/aluminum-063)
/products/acm-3mm → 404 (should be /products/acm-3mm)
/products/acm-6mm → 404 (should be /products/acm-6mm)
/products/pvc-3mm → 404 (should be /products/pvc-3mm)
/products/pvc-6mm → 404 (should be /products/pvc-6mm)
/products/ada-room → 404 (should be /products/ada-room)
/products/dec-vinyl → 404 (should be /products/decals-vinyl)
/products/win-perf → 404 (should be /products/window-perf)
/products/wal-decal → 404 (should be /products/wall-decal)
/products/mag-vinyl → 404 (should be /products/magnetic-vinyl)
/products/flr-vinyl → 404 (should be /products/floor-vinyl)
/products/saf-poly → 404 (should be /products/safety-poly)
```

## Route Generation Logic Issues

### Current Logic (BROKEN):
```typescript
// In pages/products/index.tsx
href={`/products/${product.id.toLowerCase()}`}

// Product IDs from pricing:
'BAN-13OZ' → '/products/ban-13oz' ❌
'COR-4MM' → '/products/cor-4mm' ❌
'ALU-040' → '/products/alu-040' ❌
```

### Expected Logic (FIXED):
```typescript
// Should generate proper slugs:
'BAN-13OZ' → '/products/banners-13oz' ✅
'COR-4MM' → '/products/coroplast-4mm' ✅
'ALU-040' → '/products/aluminum-040' ✅
```

## Slug Mapping Requirements

### Product ID to Slug Conversion:
```typescript
const SLUG_MAPPING = {
  // Banners
  'BAN-13OZ': 'banners-13oz',
  'BAN-18OZ': 'banners-18oz',
  'BAN-20OZ': 'banners-20oz',
  
  // Coroplast
  'COR-4MM': 'coroplast-4mm',
  'COR-6MM': 'coroplast-6mm',
  
  // Aluminum
  'ALU-040': 'aluminum-040',
  'ALU-063': 'aluminum-063',
  
  // ACM
  'ACM-3MM': 'acm-3mm',
  'ACM-6MM': 'acm-6mm',
  
  // PVC
  'PVC-3MM': 'pvc-3mm',
  'PVC-6MM': 'pvc-6mm',
  
  // Specialized
  'ADA-ROOM': 'ada-room-signs',
  'DEC-VINYL': 'decals-vinyl',
  'WIN-PERF': 'window-perforated',
  'WAL-DECAL': 'wall-decals',
  'MAG-VINYL': 'magnetic-vinyl',
  'FLR-VINYL': 'floor-graphics',
  'SAF-POLY': 'safety-labels'
};
```

## Static Generation Requirements

### getStaticPaths Implementation:
```typescript
export async function getStaticPaths() {
  const products = getAllCatalog();
  
  const paths = products.map((product) => ({
    params: { slug: product.slug }
  }));
  
  return {
    paths,
    fallback: false // or 'blocking' for better UX
  };
}
```

### getStaticProps Implementation:
```typescript
export async function getStaticProps({ params }) {
  const product = getCatalogBySlug(params.slug);
  
  if (!product) {
    return {
      notFound: true
    };
  }
  
  return {
    props: {
      product
    }
  };
}
```

## Redirect Strategy

### Legacy Route Redirects:
```typescript
// pages/products/[id].tsx - Handle old product IDs
export async function getServerSideProps({ params }) {
  const slug = getSlugFromSourceId(params.id);
  
  if (slug) {
    return {
      redirect: {
        destination: `/products/${slug}`,
        permanent: true
      }
    };
  }
  
  return {
    notFound: true
  };
}
```

## Route Testing Checklist

### Manual Testing Required:
- [ ] `/products` loads without errors
- [ ] All product cards link to working PDPs
- [ ] Product detail pages load with correct data
- [ ] Images display properly
- [ ] Configurator opens from PDP
- [ ] Checkout flow works from PDP
- [ ] SEO meta tags are present
- [ ] Breadcrumb navigation works
- [ ] Related products suggestions work

### Automated Testing:
- [ ] All routes return 200 status
- [ ] No console errors on product pages
- [ ] Images load without 404s
- [ ] Analytics events fire correctly
- [ ] Accessibility compliance maintained

## Implementation Priority

### Phase 1 (Critical):
1. Fix product link generation
2. Create proper slug mapping
3. Generate missing product data
4. Test all routes work

### Phase 2 (Enhancement):
1. Add static generation
2. Implement redirects
3. Add error handling
4. Performance optimization

---

**Route mapping completed**: 2024-01-06
**Status**: Ready for implementation
