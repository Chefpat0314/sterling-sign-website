import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CatalogItem } from '../../lib/catalog';
import { analytics } from '../../lib/metrics';

interface ProductCardProps {
  product: CatalogItem;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const handleProductClick = () => {
    analytics.track('product_viewed', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      source: 'products_catalog'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        <Image
          src={product.image}
          alt={`${product.name} by Sterling Sign Solutions`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.popular && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
            Popular
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
          From ${product.startingPrice}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.excerpt}
          </p>
          <div className="text-sm text-gray-500 mb-3">
            Size: {product.minSize} - {product.maxSize}
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-900 mb-2">Features:</div>
          <ul className="text-sm text-gray-600 space-y-1">
            {product.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="space-y-2">
          <Link
            href={`/products/${product.slug}`}
            onClick={handleProductClick}
            className="block w-full text-center px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
          >
            View Details
          </Link>
          <Link
            href={`/request-a-quote?product=${product.slug}`}
            onClick={() => {
              analytics.track('cta_clicked', {
                productId: product.id,
                productName: product.name,
                category: product.category,
                source: 'product_card_get_quote'
              });
            }}
            className="block w-full text-center px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
