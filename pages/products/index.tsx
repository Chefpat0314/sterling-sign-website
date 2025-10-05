import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

const PRODUCTS = [
  { 
    slug: "vinyl-banner", 
    name: "Vinyl Banners", 
    blurb: "Durable, weather-resistant banners perfect for construction sites, events, and promotional displays.",
    image: "/images/products/banner-hero.jpg",
    alt: "Professional vinyl banner installation at construction site"
  },
  { 
    slug: "aluminum-sign", 
    name: "Aluminum Signs", 
    blurb: "Professional-grade aluminum signs built to last decades with crisp, fade-resistant graphics.",
    image: "/images/products/aluminum-hero.jpg",
    alt: "Professional aluminum sign mounted on building exterior"
  },
  { 
    slug: "door-hours-decal", 
    name: "Door Hours Decals", 
    blurb: "Clean, professional door hours signage that enhances your business appearance.",
    image: "/images/products/door-hours-hero.jpg",
    alt: "Clean door hours decal on glass door with business hours displayed"
  },
];

export default function ProductsIndex() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sterling-sign-website.vercel.app';
  
  return (
    <>
      <Head>
        <title>Products – Sterling Sign Solutions | Vinyl Banners, Aluminum Signs, Door Decals</title>
        <meta name="description" content="Professional signage products including vinyl banners, aluminum signs, and door hours decals. Fast turnaround, durable materials, and expert installation in California." />
        <link rel="canonical" href={`${siteUrl}/products`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sterling Sign Solutions" />
        <meta property="og:title" content="Products – Sterling Sign Solutions" />
        <meta property="og:description" content="Professional signage products including vinyl banners, aluminum signs, and door hours decals. Fast turnaround, durable materials, and expert installation." />
        <meta property="og:url" content={`${siteUrl}/products`} />
        <meta property="og:image" content={`${siteUrl}/images/products/banner-hero.jpg`} />
        <meta property="og:image:alt" content="Professional signage products by Sterling Sign Solutions" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Products – Sterling Sign Solutions" />
        <meta name="twitter:description" content="Professional signage products including vinyl banners, aluminum signs, and door hours decals." />
        <meta name="twitter:image" content={`${siteUrl}/images/products/banner-hero.jpg`} />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Products
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Professional signage solutions designed for durability, compliance, and maximum impact. 
              From construction sites to corporate offices, we deliver signs that last.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              aria-label={`View ${product.name} details`}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {product.blurb}
                </p>
                
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                  <span>View Details</span>
                  <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Don't see exactly what you need? Our team can create custom signage solutions 
            tailored to your specific requirements and industry standards.
          </p>
          <Link
            href="/request-a-quote?rfq_source=products&product=custom"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Request Custom Quote
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </main>
    </>
  );
}
