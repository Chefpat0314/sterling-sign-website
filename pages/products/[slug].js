// pages/products/[slug].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import Configurator from '../../components/configurator/Configurator';

// Load the banner-specific configurator only when needed
const BannerConfigurator = dynamic(
  async () => {
    const m = await import('../../components/configurator/BannerConfigurator');
    return m.default || m;
  },
  { ssr: false }
);

export default function ProductConfiguratorPage() {
  const router = useRouter();
  const slug = router.query.slug;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // distinguish loading vs missing

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/pricing');
        const data = await res.json();
        const p = data && data.products ? data.products[slug] : null;
        setProduct(p || null);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  // Loading state
  if (!slug || loading) {
    return <div className="max-w-3xl mx-auto py-12">Loading…</div>;
  }

  // Not found (bad slug)
  if (!product) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4">
        <h1 className="text-2xl font-bold mb-3">Product not found</h1>
        <p className="text-gray-700 mb-6">
          We couldn’t find that product. Please browse all available options.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  // SEO bits
  const site = process.env.NEXT_PUBLIC_SITE_URL || '';
  const title = `${product.name} – Sterling Sign Solutions`;
  const description =
    product.blurb ||
    product.description ||
    `Custom ${product.name} by Sterling Sign Solutions.`;
  const ogImage = `${site}${product.image || '/og-image.png'}`;
  const canonical = `${site}/products/${slug}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {site && <link rel="canonical" href={canonical} />}
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Sterling Sign Solutions" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {site && <meta property="og:url" content={canonical} />}
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content={product.name} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <div className="max-w-5xl mx-auto py-12 px-4 md:px-6">
        <nav className="text-sm mb-6 text-gray-600">
          <Link href="/products" className="hover:underline">Products</Link>
          <span> / </span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
          <Link
            href={`/request-a-quote?product=${encodeURIComponent(
              product.name
            )}&source=product`}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:opacity-90"
          >
            Request a Quote
          </Link>
        </div>

        {/* If this is the special banner product, use the banner configurator */}
        {slug === 'banners_13oz' ? (
          <BannerConfigurator product={product} />
        ) : (
          <Configurator product={product} />
        )}
      </div>
    </>
  );
}
