import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

// Product data interface
interface Product {
  slug: string;
  name: string;
  description?: string;
  blurb?: string;
  base_price_per_sqft: number;
  quantity_tiers: number[];
  options: Array<{
    key: string;
    type: string;
    label: string;
    choices?: Array<{ value: string; add: number }>;
    add?: number;
  }>;
  hero_image?: string;
  specs?: string[];
  features?: string[];
}

// Product data mapping with hero images and specs
const PRODUCT_DATA: Record<string, Partial<Product>> = {
  'vinyl-banner': {
    slug: 'vinyl-banner',
    name: 'Vinyl Banners',
    description: 'Durable, weather-resistant banners perfect for construction sites, events, and promotional displays.',
    blurb: 'Professional vinyl banners that withstand the elements while delivering your message clearly.',
    hero_image: '/images/products/banner-hero.jpg',
    specs: [
      '13oz vinyl material for maximum durability',
      'UV-resistant inks prevent fading',
      'Weatherproof for indoor and outdoor use',
      'Custom sizes up to 20ft wide',
      'Reinforced hems and grommets available'
    ],
    features: [
      'Fast 24-48 hour turnaround',
      'Full-color digital printing',
      'Multiple mounting options',
      'Cost-effective for large quantities'
    ]
  },
  'aluminum-sign': {
    slug: 'aluminum-sign',
    name: 'Aluminum Signs',
    description: 'Professional-grade aluminum signs built to last decades with crisp, fade-resistant graphics.',
    blurb: 'Heavy-duty aluminum signs for permanent installations that maintain their appearance over time.',
    hero_image: '/images/products/aluminum-hero.jpg',
    specs: [
      '0.040" aluminum substrate',
      'High-performance vinyl graphics',
      'Optional UV-protective laminate',
      'Pre-drilled mounting holes',
      'Square or rounded corners available'
    ],
    features: [
      'Weatherproof and corrosion-resistant',
      'Professional mounting hardware included',
      'Custom sizes and shapes',
      'Long-term warranty available'
    ]
  },
  'door-hours-decal': {
    slug: 'door-hours-decal',
    name: 'Door Hours Decals',
    description: 'Clean, professional door hours signage that enhances your business appearance.',
    blurb: 'Vinyl cut decals for clear, professional door hours display.',
    hero_image: '/images/products/door-hours-hero.jpg',
    specs: [
      'Premium vinyl material',
      'Multiple color options',
      'Easy installation included',
      'Clean removal when needed',
      'Custom text and formatting'
    ],
    features: [
      'Professional appearance',
      'Easy to update',
      'ADA compliant options',
      'Local installation available'
    ]
  }
};

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || typeof slug !== 'string') return;

    const fetchProductData = async () => {
      setLoading(true);
      try {
        // Try to get product data from API first
        const res = await fetch('/api/pricing');
        const data = await res.json();
        
        let productData: Product | null = null;
        
        // Map API slug to our product slugs
        const slugMapping: Record<string, string> = {
          'vinyl-banner': 'banners_13oz',
          'aluminum-sign': 'aluminum_040',
          'door-hours-decal': 'door_hours_cut_vinyl'
        };
        
        const apiSlug = slugMapping[slug];
        if (apiSlug && data.products && data.products[apiSlug]) {
          productData = data.products[apiSlug] as Product;
        }
        
        // Merge with our enhanced product data
        const enhancedData = PRODUCT_DATA[slug];
        if (enhancedData) {
          productData = {
            ...productData,
            ...enhancedData,
            slug: slug
          } as Product;
        }
        
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product data:', error);
        // Fallback to static data
        setProduct(PRODUCT_DATA[slug] as Product || null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  // Loading state
  if (!slug || loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Not found
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            We couldn't find the product you're looking for. Browse our available options below.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sterling-sign-website.vercel.app';
  const title = `${product.name} – Sterling Sign Solutions`;
  const description = product.description || product.blurb || `Professional ${product.name} by Sterling Sign Solutions.`;
  const ogImage = `${siteUrl}${product.hero_image || '/og-image.png'}`;
  const canonical = `${siteUrl}/products/${slug}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        
        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Sterling Sign Solutions" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content={`${product.name} by Sterling Sign Solutions`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="text-sm text-gray-600">
            <Link href="/products" className="hover:text-blue-600 transition-colors">
              Products
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gray-900">
        <div className="absolute inset-0">
          {product.hero_image && (
            <Image
              src={product.hero_image}
              alt={`Professional ${product.name} installation`}
              fill
              className="object-cover opacity-40"
              priority
            />
          )}
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {product.name}
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              {product.description}
            </p>
            <Link
              href={`/request-a-quote?product=${encodeURIComponent(product.name)}&source=product`}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Start Your Design
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Specifications */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
              {product.specs && (
                <ul className="space-y-3 mb-8">
                  {product.specs.map((spec, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{spec}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {product.features && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* CTA Card */}
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
              <p className="text-gray-600 mb-6">
                Get a custom quote for your {product.name.toLowerCase()} project. Our team will provide pricing and recommendations based on your specific needs.
              </p>
              <div className="space-y-3">
                <Link
                  href={`/request-a-quote?product=${encodeURIComponent(product.name)}&source=product`}
                  className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Request a Quote
                </Link>
                <Link
                  href="/products"
                  className="block w-full text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  View All Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
