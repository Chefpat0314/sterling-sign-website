// pages/index-new.tsx - Redesigned homepage with trust elements
import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { analytics } from '../lib/metrics';
import TrustBadges, { GuaranteeBadges } from '../components/TrustBadges';
import SocialProof from '../components/SocialProof';
import { getProductCategory, getProductName } from '../lib/pricing';

// Category data
const categories = [
  {
    id: 'banners',
    name: 'Banners',
    description: 'Vinyl banners for events, construction, and advertising',
    image: '/images/products/banner-hero.jpg',
    products: ['BAN-13OZ', 'BAN-18OZ', 'BAN-20OZ'],
    href: '/products?category=banners',
  },
  {
    id: 'rigid-signs',
    name: 'Rigid Signs',
    description: 'Aluminum, ACM, and coroplast signs for permanent display',
    image: '/images/products/aluminum-sign.jpg',
    products: ['ALU-040', 'ACM-3MM', 'COR-4MM'],
    href: '/products?category=rigid-signs',
  },
  {
    id: 'ada',
    name: 'ADA Signs',
    description: 'Compliant room and wayfinding signs with braille',
    image: '/images/products/ada-room-sign.jpg',
    products: ['ADA-ROOM'],
    href: '/products?category=ada',
  },
  {
    id: 'window-wall',
    name: 'Window/Wall',
    description: 'Decals, window graphics, and wall applications',
    image: '/images/products/window-graphic.jpg',
    products: ['WIN-PERF', 'WAL-DECAL', 'DEC-VINYL'],
    href: '/products?category=window-wall',
  },
  {
    id: 'specialty',
    name: 'Specialty',
    description: 'Magnets, floor graphics, and custom applications',
    image: '/images/products/magnetic-sign.jpg',
    products: ['MAG-VINYL', 'FLR-VINYL'],
    href: '/products?category=specialty',
  },
  {
    id: 'labels',
    name: 'Labels',
    description: 'Safety labels, decals, and identification signs',
    image: '/images/products/safety-label.jpg',
    products: ['SAF-POLY'],
    href: '/products?category=labels',
  },
];

// Metrics data
const metrics = [
  { value: '98.6%', label: 'On-Time Delivery', icon: '🚚' },
  { value: '+64', label: 'NPS Score', icon: '⭐' },
  { value: '15k+', label: 'Happy Customers', icon: '👥' },
  { value: '2h', label: 'Average Proof Time', icon: '⏱️' },
];

export default function HomePage() {
  useEffect(() => {
    analytics.viewHome();
  }, []);

  const handleCTAClick = (label: string, source: string) => {
    analytics.clickCTA(label, source);
  };

  return (
    <>
      <Head>
        <title>Custom Signs. Delivered Fast. Guaranteed. | Sterling Sign Solutions</title>
        <meta name="description" content="Instant quotes, human-checked proofs, and date-certain delivery. Custom signs for every business need with 100% satisfaction guarantee." />
        <meta name="keywords" content="custom signs, vinyl banners, aluminum signs, ADA signs, fast delivery, instant quotes" />
        <meta property="og:title" content="Custom Signs. Delivered Fast. Guaranteed." />
        <meta property="og:description" content="Instant quotes, human-checked proofs, and date-certain delivery. Custom signs for every business need." />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Custom Signs. Delivered Fast. Guaranteed." />
        <meta name="twitter:description" content="Instant quotes, human-checked proofs, and date-certain delivery." />
        <meta name="twitter:image" content="/og-image.png" />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-repeat"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Custom Signs.
                  <br />
                  <span className="text-yellow-400">Delivered Fast.</span>
                  <br />
                  Guaranteed.
                </h1>
                
                <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                  Instant quotes, human-checked proofs, and date-certain delivery. 
                  No hidden fees. Price-match guarantee.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/products"
                    onClick={() => handleCTAClick('Get Instant Quote', 'hero')}
                    className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 text-blue-900 font-bold text-lg rounded-lg hover:bg-yellow-300 transition-colors shadow-lg"
                  >
                    Get Instant Quote
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  
                  <Link
                    href="/products"
                    onClick={() => handleCTAClick('Browse Products', 'hero')}
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold text-lg rounded-lg border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    Browse Products
                  </Link>
                  
                  <Link
                    href="/request-a-quote"
                    onClick={() => handleCTAClick('Talk to Designer', 'hero')}
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold text-lg rounded-lg border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    Talk to a Designer
                  </Link>
                </div>

                {/* Trust Elements */}
                <div className="flex flex-wrap items-center gap-6 pt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">⚡</span>
                    <span className="font-medium">2-Hour Proofs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">✅</span>
                    <span className="font-medium">100% Satisfaction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🚚</span>
                    <span className="font-medium">On-Time Delivery</span>
                  </div>
                </div>
              </motion.div>

              {/* Hero Image/Video */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/hero-signs.jpg"
                    alt="Custom signs showcase"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                    priority
                  />
                  {/* Overlay with stats */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <div className="grid grid-cols-2 gap-4 text-white">
                      <div>
                        <div className="text-2xl font-bold">98.6%</div>
                        <div className="text-sm opacity-90">On-Time Delivery</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">+64</div>
                        <div className="text-sm opacity-90">NPS Score</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Trusted by Thousands of Businesses
              </h2>
              <p className="text-xl text-gray-600">
                Our commitment to quality and service shows in our numbers
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-2">{metric.icon}</div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</div>
                  <div className="text-gray-600 font-medium">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Every Sign Type. Every Business Need.
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From temporary banners to permanent ADA signs, we manufacture and deliver 
                professional signage for every industry and application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Popular Products:</h4>
                        <div className="flex flex-wrap gap-2">
                          {category.products.slice(0, 3).map((productId) => (
                            <span
                              key={productId}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                            >
                              {getProductName(productId)}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <Link
                        href={category.href}
                        onClick={() => handleCTAClick('Browse Category', `category-${category.id}`)}
                        className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                      >
                        Browse {category.name}
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantees Section */}
        <section className="py-20 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Guarantees
              </h2>
              <p className="text-xl text-gray-600">
                We stand behind every sign we make
              </p>
            </div>

            <GuaranteeBadges />
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <SocialProof />
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Get Your Custom Signs?
              </h2>
              <p className="text-xl text-blue-100">
                Join thousands of satisfied customers. Get your instant quote today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  onClick={() => handleCTAClick('Get Started Now', 'final-cta')}
                  className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 text-blue-900 font-bold text-lg rounded-lg hover:bg-yellow-300 transition-colors shadow-lg"
                >
                  Get Started Now
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                
                <Link
                  href="/request-a-quote"
                  onClick={() => handleCTAClick('Talk to Expert', 'final-cta')}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold text-lg rounded-lg border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  Talk to an Expert
                </Link>
              </div>

              <div className="flex justify-center">
                <TrustBadges 
                  badges={[
                    { icon: '🔒', text: 'Secure Checkout', color: 'text-white', bgColor: 'bg-white/10' },
                    { icon: '💰', text: 'No Hidden Fees', color: 'text-white', bgColor: 'bg-white/10' },
                    { icon: '✅', text: '100% Satisfaction', color: 'text-white', bgColor: 'bg-white/10' },
                  ]}
                  size="sm"
                />
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
