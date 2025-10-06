import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import DeliveryDateBadge from '../../components/shipping/DeliveryDateBadge';
import CutoffCountdown from '../../components/shipping/CutoffCountdown';
import { analytics } from '../../lib/metrics';

export default function MetroLandingPage({ metro, metroData, marketsData }) {
  const [personaHint, setPersonaHint] = useState(null);

  useEffect(() => {
    // Track page view with metro context
    analytics.track('view_market_landing', {
      metro_slug: metro,
      persona_hint: personaHint,
      utm: {
        source: 'organic',
        medium: 'seo',
        campaign: 'metro_landing'
      }
    });
  }, [metro, personaHint]);

  if (!metroData) {
    return (
      <Layout title="Market Not Found | Sterling Sign Solutions">
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Market Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We don't currently serve this market. Check out our national services.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View National Services
          </Link>
        </div>
      </Layout>
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sterling-sign-website.vercel.app';
  const title = `${metroData.hero_title} | Sterling Sign Solutions`;
  const description = `Professional signage services in ${metroData.hero_title.split(' ')[0]}. ${metroData.hero_subtitle}`;
  const canonical = `${siteUrl}/markets/${metro}`;

  return (
    <Layout title={title} description={description}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sterling Sign Solutions" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`${siteUrl}/og-image.png`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}/og-image.png`} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": title,
              "description": description,
              "url": canonical,
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": siteUrl
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Markets",
                    "item": `${siteUrl}/markets`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": metroData.hero_title.split(' ')[0],
                    "item": canonical
                  }
                ]
              }
            })
          }}
        />
      </Head>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {metroData.hero_title}
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {metroData.hero_subtitle}
            </p>
            
            {/* Trust Strip */}
            <div className="mb-6 flex items-center justify-center text-sm text-gray-300">
              <span className="flex items-center mr-6">
                <span className="text-green-400 mr-1">✓</span>
                97% on-time
              </span>
              <span className="flex items-center mr-6">
                <span className="text-green-400 mr-1">✓</span>
                0.5% damage-rate
              </span>
              <span className="flex items-center">
                <span className="text-green-400 mr-1">✓</span>
                Free online proof
              </span>
            </div>

            {/* Shipping Widgets */}
            <div className="mb-6 space-y-3 max-w-md mx-auto">
              <CutoffCountdown productId="metro-landing" />
              <DeliveryDateBadge 
                product="metro-landing"
                qty={1}
                areaSqft={10}
                width={24}
                height={18}
                destZip=""
                rushLevel="none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/request-a-quote?metro=${metro}`}
                onClick={() => {
                  analytics.track('cta_clicked', {
                    metro_slug: metro,
                    cta_type: 'hero_quote',
                    source: 'metro_landing_hero'
                  });
                }}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                {metroData.rfq_cta}
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="#categories"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                View Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section id="categories" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Categories for {metroData.hero_title.split(' ')[0]}
            </h2>
            <p className="text-lg text-gray-600">
              {metroData.local_social_proof}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metroData.featured_categories.map((category) => (
              <div key={category} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 capitalize">
                  {category.replace('-', ' ')}
                </h3>
                <p className="text-gray-600 mb-4">
                  Professional {category.replace('-', ' ')} for {metroData.hero_title.split(' ')[0]} businesses
                </p>
                <Link
                  href={`/products?category=${category}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  View Products
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Persona Modules */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Serving {metroData.hero_title.split(' ')[0]} Professionals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {metroData.persona_modules.map((persona) => {
              const personaData = {
                contractor_gc: {
                  title: 'Contractors & General Contractors',
                  description: 'Construction site signage, safety labels, and project identification',
                  icon: '🔨',
                  features: ['Job site safety signs', 'Construction banners', 'Project identification', 'Safety compliance']
                },
                property_manager: {
                  title: 'Property Managers',
                  description: 'ADA compliant signage, wayfinding, and building identification',
                  icon: '🏢',
                  features: ['ADA room signs', 'Wayfinding systems', 'Building identification', 'Compliance signage']
                },
                logistics: {
                  title: 'Logistics & Warehousing',
                  description: 'Safety signage, directional systems, and operational identification',
                  icon: '📦',
                  features: ['Safety labels', 'Directional signage', 'Operational signs', 'Warehouse identification']
                }
              };

              const data = personaData[persona];
              if (!data) return null;

              return (
                <div key={persona} className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{data.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {data.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {data.description}
                    </p>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {data.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      setPersonaHint(persona);
                      analytics.track('persona_interest', {
                        metro_slug: metro,
                        persona: persona,
                        source: 'metro_landing_persona'
                      });
                    }}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for Your {metroData.hero_title.split(' ')[0]} Project?
          </h2>
          <p className="text-xl mb-8">
            Get a custom quote with free online proof and fast delivery.
          </p>
          <Link
            href={`/request-a-quote?metro=${metro}`}
            onClick={() => {
              analytics.track('cta_clicked', {
                metro_slug: metro,
                cta_type: 'final_quote',
                source: 'metro_landing_final'
              });
            }}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            {metroData.rfq_cta}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  const marketsData = require('../../data/step11/markets.json');
  
  const paths = marketsData.metros.map((metro) => ({
    params: { metro: metro.slug }
  }));

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { metro } = params;
  
  try {
    const marketsData = require('../../data/step11/markets.json');
    const metroLandingMap = require('../../data/step11/metro_landing_map.json');
    
    const metroInfo = marketsData.metros.find(m => m.slug === metro);
    const metroData = metroLandingMap[metro];

    if (!metroInfo || !metroData) {
      return {
        notFound: true
      };
    }

    return {
      props: {
        metro,
        metroData,
        marketsData: metroInfo
      }
    };
  } catch (error) {
    console.error('Error loading metro data:', error);
    return {
      notFound: true
    };
  }
}
