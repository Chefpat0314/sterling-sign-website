# Sterling MVP Patch — Drop-in Files

## What this gives you
- Universal configurator component (TSX)
- Pricing engine util (TS)
- API routes for pricing/templates
- Product pages (index + dynamic)
- Sample pricing & template JSONs

## How to apply
1) Copy the folders into your project root:
   - `components/configurator/Configurator.tsx`
   - `lib/pricing/PriceCalculator.ts`
   - `pages/api/pricing.js`
   - `pages/api/templates.js`
   - `pages/products/index.js`
   - `pages/products/[slug].js`
   - `data/pricing/pricing_normalized.json`
   - `data/templates/template_manifest.json`

2) Update imports:
   - Ensure your TS path alias `@/` maps to project root (tsconfig `baseUrl` and `paths`).
   - If not, change `@/lib/pricing/PriceCalculator` to a relative path.

3) Env
   - In `.env.example` and `.env.local`, set:
     `NEXT_PUBLIC_API_URL=http://localhost:3000/api`
   - (Optional HubSpot) Also add:
     `NEXT_PUBLIC_HUBSPOT_PORTAL_ID=XXXX`
     `NEXT_PUBLIC_HUBSPOT_FORM_ID=XXXX-XXXX-XXXX-XXXX`

4) Install deps (if missing):
   - `npm i framer-motion`
   - (TypeScript is already in this project.)

5) Run
   - `npm run dev`
   - Visit `/products` and configure a product.

## Notes
- The pricing engine uses per‑sqft + option adders + a simple quantity discount.
- Replace JSON values with your real pricing once ready.
