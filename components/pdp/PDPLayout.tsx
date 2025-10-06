import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { CatalogItem } from '../../lib/catalog';
import { analytics } from '../../lib/metrics';
import DeliveryDateBadge from '../shipping/DeliveryDateBadge';
import CutoffCountdown from '../shipping/CutoffCountdown';
import StarsInline from '../reviews/StarsInline';
import PDPDetails from './PDPDetails';
import PDPTrustRail from './PDPTrustRail';

interface PDPLayoutProps {
  product: CatalogItem;
  category: string;
}

export default function PDPLayout({ product, category }: PDPLayoutProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({
    size: '',
    material: '',
    quantity: 1
  });

  const handleOptionChange = (option: string, value: string | number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [option]: value
    }));

    analytics.track('configure_change', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      option,
      value,
      source: 'pdp_options'
    });
  };

  const handleGetQuote = () => {
    analytics.track('cta_click', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      cta_type: 'get_quote',
      source: 'pdp_hero'
    });
  };

  const handleCustomize = () => {
    analytics.track('cta_click', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      cta_type: 'customize',
      source: 'pdp_hero'
    });
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sterling-sign-website.vercel.app';
  const title = `${product.name} | Sterling Sign Solutions`;
  const description = product.description || product.excerpt;
  const canonical = `${siteUrl}/products/${category}/${product.slug}`;

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
        <meta property="og:image" content={`${siteUrl}${product.image}`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}${product.image}`} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": product.name,
              "description": description,
              "image": `${siteUrl}${product.image}`,
              "brand": {
                "@type": "Brand",
                "name": "Sterling Sign Solutions"
              },
              "offers": {
                "@type": "Offer",
                "price": product.startingPrice,
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@type": "Organization",
                  "name": "Sterling Sign Solutions"
                }
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "85"
              }
            })
          }}
        />
      </Head>

      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 border-b" aria-label="Breadcrumb">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/products" className="hover:text-blue-600">Products</Link>
            <span className="mx-2">›</span>
            <Link href={`/products/${category}`} className="hover:text-blue-600 capitalize">
              {category.replace('-', ' ')}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </nav>

      {/* Main PDP Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Media Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {[product.image, product.image, product.image, product.image].map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="mb-4">
                <StarsInline rating={4.8} reviewCount={85} size="lg" />
              </div>
            </div>

            {/* Trust Rail */}
            <PDPTrustRail />

            {/* Shipping Widgets */}
            <div className="space-y-3">
              <CutoffCountdown productId={product.id} />
              <DeliveryDateBadge 
                product={product.id}
                qty={selectedOptions.quantity}
                areaSqft={10}
                width={24}
                height={18}
                destZip=""
                rushLevel="none"
              />
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  From ${product.startingPrice}
                </span>
                <span className="text-gray-600">each</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Size: {product.minSize} - {product.maxSize}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <select
                  value={selectedOptions.size}
                  onChange={(e) => handleOptionChange('size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select size</option>
                  <option value="small">Small (12" x 18")</option>
                  <option value="medium">Medium (24" x 36")</option>
                  <option value="large">Large (36" x 48")</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material
                </label>
                <select
                  value={selectedOptions.material}
                  onChange={(e) => handleOptionChange('material', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select material</option>
                  <option value="vinyl">Vinyl</option>
                  <option value="coroplast">Coroplast</option>
                  <option value="aluminum">Aluminum</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={selectedOptions.quantity}
                  onChange={(e) => handleOptionChange('quantity', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <button
                onClick={handleCustomize}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Customize / Design Now
              </button>
              <Link
                href={`/request-a-quote?product=${product.slug}`}
                onClick={handleGetQuote}
                className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <PDPDetails product={product} />
        </div>
      </div>
    </>
  );
}
