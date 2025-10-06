import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getCatalogBySlug, CatalogItem } from '../../lib/catalog';
import { analytics } from '../../lib/metrics';
import Layout from '../../components/Layout';

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState<CatalogItem | null>(null);
  const [loading, setLoading] = useState(true);

  const handleGetQuote = () => {
    const url = `/request-a-quote?product=${slug}`;
    console.log('Get Quote clicked, navigating to:', url);
    
    // Try router.push first, fallback to window.location
    try {
      router.push(url);
    } catch (error) {
      console.error('Router push failed, using window.location:', error);
      window.location.href = url;
    }
  };

  useEffect(() => {
    if (!slug || typeof slug !== 'string') return;

    const fetchProductData = async () => {
      setLoading(true);
      try {
        const productData = getCatalogBySlug(slug);
        setProduct(productData);
        
        if (productData) {
          // Track product view
          analytics.track('product_viewed', {
            productId: productData.id,
            productName: productData.name,
            category: productData.category,
            source: 'product_detail_page'
          });
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
        setProduct(null);
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
  const description = product.description || product.excerpt || `Professional ${product.name} by Sterling Sign Solutions.`;
  const ogImage = `${siteUrl}${product.image || '/og-image.png'}`;
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
      <nav className="bg-gray-50 border-b" aria-label="Breadcrumb">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/products" className="hover:text-blue-600">Products</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gray-900 min-h-[400px]">
        <div className="absolute inset-0">
          <Image
            src={product.image || '/images/placeholder-hero.jpg'}
            alt={product.name}
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-24 text-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {product.name}
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              {product.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGetQuote}
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Get Quote
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <Link
                href="#specifications"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                View Specifications
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Product Details */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Product</h2>
                <p className="text-gray-600 mb-6">
                  {product.description}
                </p>
                
                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-3 mt-1">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specifications */}
                <div id="specifications" className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-gray-900">Category:</span>
                        <span className="ml-2 text-gray-600">{product.category}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Size Range:</span>
                        <span className="ml-2 text-gray-600">{product.minSize} - {product.maxSize}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Starting Price:</span>
                        <span className="ml-2 text-gray-600">From ${product.startingPrice}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Material:</span>
                        <span className="ml-2 text-gray-600">{product.name.includes('Vinyl') ? 'Vinyl' : product.name.includes('Aluminum') ? 'Aluminum' : product.name.includes('Coroplast') ? 'Coroplast' : 'Premium Material'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Order?</h3>
                <p className="text-gray-600 mb-6">
                  Get a custom quote for your {product.name.toLowerCase()} today.
                </p>
                <button
                  onClick={handleGetQuote}
                  className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
                >
                  Get Custom Quote
                </button>
                <div className="text-sm text-gray-500 text-center">
                  <p>✓ Free quotes</p>
                  <p>✓ 24-48 hour turnaround</p>
                  <p>✓ Professional installation available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Related Products
          </h2>
          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}