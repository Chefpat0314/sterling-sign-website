import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

/**
 * Navbar component renders the primary navigation across the site. It
 * reinstates links to the Industries and Services pages per the updated
 * change order. Adjust or extend this component as needed to fit your
 * existing layout and styling conventions.
 */
export default function Navbar() {
  const router = useRouter();
  
  const isActive = (path: string) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between py-4 px-8 bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-100">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <div className="hidden sm:block">
          <div className="text-lg font-bold text-gray-900">STERLING</div>
          <div className="text-xs text-gray-600">SIGN SOLUTIONS</div>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        <Link 
          href="/products" 
          className={`font-medium transition-colors ${
            isActive('/products') 
              ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
              : 'text-gray-700 hover:text-blue-600'
          }`}
        >
          Products
        </Link>
        <Link 
          href="/industries" 
          className={`font-medium transition-colors ${
            isActive('/industries') 
              ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
              : 'text-gray-700 hover:text-blue-600'
          }`}
        >
          Industries
        </Link>
        <Link 
          href="/services" 
          className={`font-medium transition-colors ${
            isActive('/services') 
              ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
              : 'text-gray-700 hover:text-blue-600'
          }`}
        >
          Services
        </Link>
        <Link 
          href="/about" 
          className={`font-medium transition-colors ${
            isActive('/about') 
              ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
              : 'text-gray-700 hover:text-blue-600'
          }`}
        >
          About
        </Link>
        <Link 
          href="/request-a-quote" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Request a Quote
        </Link>
      </div>
    </nav>
  );
}