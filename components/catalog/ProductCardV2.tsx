import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CatalogItem } from '../../lib/catalog';
import { analytics } from '../../lib/metrics';
import StarsInline from '../reviews/StarsInline';

interface ProductCardV2Props {
  product: CatalogItem;
  index?: number;
  category?: string;
}

export default function ProductCardV2({ product, index = 0, category }: ProductCardV2Props) {
  const handleProductClick = () => {
    analytics.track('product_card_view', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      source: 'products_catalog',
      cardIndex: index
    });
  };

  const handleCTAClick = (ctaType: string) => {
    analytics.track('cta_click', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      cta_type: ctaType,
      source: 'product_card'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 group"
    >
      {/* Product Image */}
      <div className="relative h-40 bg-gray-100">
        <Image
          src={product.image}
          alt={`${product.name} by Sterling Sign Solutions`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {product.popular && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
            Popular
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-800">
          From ${product.startingPrice}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Star Rating */}
        <div className="mb-2">
          <StarsInline rating={4.8} reviewCount={85} size="sm" />
        </div>

        {/* Trust Strip */}
        <div className="mb-3 text-xs text-gray-500 flex items-center justify-between">
          <span className="flex items-center">
            <span className="text-green-500 mr-1">✓</span>
            97% on-time
          </span>
          <span className="flex items-center">
            <span className="text-green-500 mr-1">✓</span>
            0.5% damage-rate
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.excerpt}
        </p>

        {/* Size Range */}
        <div className="text-xs text-gray-500 mb-3">
          Size: {product.minSize} - {product.maxSize}
        </div>

        {/* Features */}
        <div className="mb-4">
          <ul className="text-xs text-gray-600 space-y-1">
            {product.features.slice(0, 2).map((feature, idx) => (
              <li key={idx} className="flex items-center">
                <span className="text-green-500 mr-1 text-xs">✓</span>
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dual CTAs */}
        <div className="space-y-2">
          <Link
            href={`/products/${category || product.category.toLowerCase().replace(/\s+/g, '-')}/${product.slug}`}
            onClick={() => {
              handleProductClick();
              handleCTAClick('customize');
            }}
            className="block w-full text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
          >
            Customize / Design Now
          </Link>
          <Link
            href={`/request-a-quote?product=${product.slug}`}
            onClick={() => {
              handleCTAClick('get_quote');
            }}
            className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
