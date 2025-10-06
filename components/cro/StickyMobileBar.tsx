import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface StickyMobileBarProps {
  productName: string;
  productSlug: string;
  startingPrice: number;
}

export default function StickyMobileBar({ productName, productSlug, startingPrice }: StickyMobileBarProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 md:hidden"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {productName}
          </h3>
          <p className="text-xs text-gray-500">
            From ${startingPrice}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Link
            href={`/products/${productSlug}`}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Details
          </Link>
          <Link
            href={`/request-a-quote?product=${productSlug}`}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
