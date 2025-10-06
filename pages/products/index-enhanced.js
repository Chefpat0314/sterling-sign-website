import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import ProductGridV2 from '../../components/catalog/ProductGridV2';
import { getAllCatalog, getAllCategories, searchCatalog } from '../../lib/catalog';
import { analytics } from '../../lib/metrics';

export default function ProductsPageEnhanced() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productList = getAllCatalog();
    setProducts(productList);
    setFilteredProducts(productList);
    setLoading(false);
    
    analytics.track('view_category', {
      category: 'products',
      productCount: productList.length,
      source: 'products_index'
    });
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = searchCatalog(searchQuery);
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(product => 
          product.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
        );
      }
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.startingPrice - b.startingPrice;
        case 'price-high':
          return b.startingPrice - a.startingPrice;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popular':
        default:
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, sortBy]);

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'banners', label: 'Banners' },
    { value: 'yard-signs', label: 'Yard Signs' },
    { value: 'decals', label: 'Decals' },
    { value: 'ada-signs', label: 'ADA Signs' },
    { value: 'safety-signs', label: 'Safety Signs' },
    { value: 'trade-show', label: 'Trade Show' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'vehicle-signs', label: 'Vehicle Signs' }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    analytics.track('search', {
      query,
      category: 'products',
      source: 'products_index'
    });
  };

  return (
    <Layout 
      title="Custom Signs & Banners | Sterling Sign Solutions"
      description="Browse our complete catalog of custom signs, banners, and graphics. Instant quotes, fast delivery, and professional quality guaranteed."
    >
      <Head>
        <title>Custom Signs & Banners | Sterling Sign Solutions</title>
        <meta name="description" content="Browse our complete catalog of custom signs, banners, and graphics. Instant quotes, fast delivery, and professional quality guaranteed." />
        <meta name="keywords" content="custom signs, vinyl banners, aluminum signs, ADA signs, decals, window graphics" />
        <link rel="canonical" href="https://sterling-sign-website.vercel.app/products" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sterling Sign Solutions" />
        <meta property="og:title" content="Custom Signs & Banners | Sterling Sign Solutions" />
        <meta property="og:description" content="Browse our complete catalog of custom signs, banners, and graphics." />
        <meta property="og:url" content="https://sterling-sign-website.vercel.app/products" />
        <meta property="og:image" content="https://sterling-sign-website.vercel.app/og-image.png" />
        
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "Custom Signs & Banners",
              "description": "Browse our complete catalog of custom signs, banners, and graphics.",
              "url": "https://sterling-sign-website.vercel.app/products",
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://sterling-sign-website.vercel.app"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Products",
                    "item": "https://sterling-sign-website.vercel.app/products"
                  }
                ]
              }
            })
          }}
        />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Custom Signs & Banners
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Professional signage solutions for every business need. 
              Instant quotes, fast delivery, and guaranteed quality.
            </p>
            
            {/* Trust Strip */}
            <div className="mb-6 flex items-center justify-center text-sm text-blue-200">
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
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {filteredProducts.length} Products Found
            </h2>
            <p className="text-gray-600">
              Professional signage solutions for your business needs
            </p>
          </div>

          <ProductGridV2 
            products={filteredProducts} 
            loading={loading}
            columns={4}
          />

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Need Custom Solution CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Don't see what you're looking for? Our design team can create 
            custom signage solutions for any application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request-a-quote"
              onClick={() => analytics.track('cta_click', {
                cta_type: 'custom_solution',
                source: 'products_index'
              })}
              className="inline-flex items-center justify-center px-8 py-3 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Request Custom Quote
            </Link>
            <Link
              href="/services/design"
              onClick={() => analytics.track('cta_click', {
                cta_type: 'design_help',
                source: 'products_index'
              })}
              className="inline-flex items-center justify-center px-8 py-3 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
            >
              Talk to Designer
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
