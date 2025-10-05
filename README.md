# Sterling Sign Solutions

A modern Next.js website for Sterling Sign Solutions, featuring product catalogs, request-for-quote functionality, and professional signage services.

## Features

- **Product Detail Pages (PDPs)**: Three main products with size presets, custom sizing, and pricing tables
- **Request for Quote (RFQ)**: Flexible form system with HubSpot integration and Formspree fallback
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **SEO Optimized**: Proper meta tags and structured data
- **Performance**: Optimized images and lazy loading

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd sterling-sign-website
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration (see Environment Setup below).

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Environment Setup

### HubSpot Form Integration (Recommended)

For the RFQ form to use HubSpot:

1. Log into your HubSpot account
2. Go to Marketing > Lead Capture > Forms
3. Create or select a form
4. Copy the complete embed code from HubSpot
5. Add to `.env.local`:

```env
NEXT_PUBLIC_HUBSPOT_FORM_EMBED='<script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>
<script>
  hbspt.forms.create({
    region: "na1",
    portalId: "your_portal_id",
    formId: "your_form_id"
  });
</script>'
```

### Formspree Fallback

If HubSpot isn't available, configure Formspree:

1. Create a form at [formspree.io](https://formspree.io)
2. Get your form endpoint
3. Add to `.env.local`:

```env
NEXT_PUBLIC_FORMSPREE_ACTION=https://formspree.io/f/your_form_id_here
```

### Site Configuration

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Product Pages

The site includes three main product detail pages:

- `/products/13oz-vinyl-banner` - Vinyl banners with grommets
- `/products/.040-aluminum` - Aluminum signs  
- `/products/door-hours` - Cut vinyl lettering

### Adding New Products

To add a new product:

1. **Update the products list** in `pages/products/index.js`:
   ```javascript
   const products = [
     // existing products...
     { slug: 'new-product-slug', name: 'New Product Name', blurb: 'Short description.' },
   ];
   ```

2. **Add product data** in `pages/products/[slug].js`:
   ```javascript
   const PRODUCTS = {
     // existing products...
     'new-product-slug': {
       name: 'New Product Name',
       description: 'Detailed product description...',
       features: ['Feature 1', 'Feature 2'],
       sizePresets: [
         { name: 'Small', width: 12, height: 18 },
         // more sizes...
       ],
       basePricing: [
         { size: 'Small', price: 25 },
         // more pricing...
       ]
     }
   };
   ```

3. **Test the new product**:
   - Visit `/products` to see it listed
   - Click through to `/products/new-product-slug`
   - Test the "Add to RFQ" functionality

## Pages Structure

- `/` - Homepage with hero, services, and industries
- `/products` - Product catalog listing
- `/products/[slug]` - Individual product detail pages
- `/request-a-quote` - RFQ form with product pre-selection

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Key Technologies

- **Next.js 13** - React framework with file-based routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **TypeScript** - Type safety (partial implementation)

### Project Structure

```
├── components/           # Reusable React components
│   ├── configurator/    # Product configuration components
│   ├── Hero.jsx         # Homepage hero section
│   ├── IndustriesWeServe.jsx
│   └── ServicesWeOffer.jsx
├── pages/               # Next.js pages (file-based routing)
│   ├── api/            # API routes
│   ├── products/       # Product pages
│   ├── index.js        # Homepage
│   └── request-a-quote.js
├── public/             # Static assets
├── styles/             # Global styles
└── data/               # JSON data files
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The site is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify  
- DigitalOcean App Platform
- Any Node.js hosting provider

## Form Configuration Priority

The RFQ form uses this priority order:

1. **HubSpot** (if `NEXT_PUBLIC_HUBSPOT_FORM_EMBED` is set)
2. **Formspree** (if `NEXT_PUBLIC_FORMSPREE_ACTION` is set)
3. **Contact fallback** (shows contact information if no forms are configured)

### Form Fields

The Formspree fallback form includes these fields:
- **name** (required) - Full name
- **email** (required) - Email address  
- **phone** - Phone number
- **company** - Company name
- **product** - Product type (pre-filled if coming from product page)
- **size** - Size/dimensions
- **notes** (required) - Project details and requirements
- **file** (optional) - File attachment for artwork/specifications

## Support

For questions about this codebase:
- Check the existing issues
- Review the code comments
- Test in development mode first

For Sterling Sign Solutions business inquiries:
- Email: info@sterlingsignsolutions.com
- Phone: (555) 123-4567

