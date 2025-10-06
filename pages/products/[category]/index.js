import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import ProductGridV2 from '../../../components/catalog/ProductGridV2';
import { getAllCatalog, getAllCategories, searchCatalog, CatalogItem } from '../../../lib/catalog';
import { analytics } from '../../../lib/metrics';

export default function CategoryPage({ category, categoryData, products }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    analytics.track('view_category', {
      category: category,
      productCount: products.length,
      source: 'category_page'
    });
  }, [category, products.length]);

  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.features.some(feature => 
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.startingPrice - a.startingPrice);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, sortBy]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    analytics.track('search', {
      query,
      category,
      source: 'category_page'
    });
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sterling-sign-website.vercel.app';
  const title = categoryData.title;
  const description = categoryData.description;
  const canonical = `${siteUrl}/products/${category}`;

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
        
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": categoryData.h1,
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
                    "name": "Products",
                    "item": `${siteUrl}/products`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": categoryData.h1,
                    "item": canonical
                  }
                ]
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
            <span className="text-gray-900 font-medium">{categoryData.h1}</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {categoryData.h1}
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {categoryData.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request-a-quote"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Get Custom Quote
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="#products"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-4">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {filteredProducts.length} Products Found
            </h2>
            <p className="text-gray-600">
              Professional {category.replace('-', ' ')} solutions for your business needs
            </p>
          </div>

          <ProductGridV2 
            products={filteredProducts} 
            category={category}
            columns={4}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What materials are available?
              </h3>
              <p className="text-gray-600">
                We offer a variety of materials including vinyl, coroplast, aluminum, and more. 
                Each material is selected for durability and suitability for your specific application.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long does production take?
              </h3>
              <p className="text-gray-600">
                Most products are ready within 24-48 hours of approval. Rush orders can be 
                accommodated with same-day production for an additional fee.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you provide installation?
              </h3>
              <p className="text-gray-600">
                Yes, we offer professional installation services through our network of 
                certified installers. Installation can be scheduled during the ordering process.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What is your return policy?
              </h3>
              <p className="text-gray-600">
                We offer a 100% satisfaction guarantee. If you're not completely satisfied 
                with your order, we'll work with you to make it right or provide a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8">
            Get a custom quote for your {category.replace('-', ' ')} project today.
          </p>
          <Link
            href="/request-a-quote"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Custom Quote
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
  const categories = [
    'banners',
    'yard-signs', 
    'decals',
    'ada-signs',
    'safety-signs',
    'trade-show',
    'real-estate',
    'vehicle-signs'
  ];

  const paths = categories.map((category) => ({
    params: { category }
  }));

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { category } = params;
  
  // Get category data from IA map
  const iaMap = require('../../../reports/b2sign_parity/ia_map.json');
  const categoryData = iaMap.sterling_ia.category_pages.find(
    page => page.slug === `/products/${category}`
  );

  if (!categoryData) {
    return {
      notFound: true
    };
  }

  // Get products for this category
  const allProducts = getAllCatalog();
  const products = allProducts.filter(product => 
    product.category.toLowerCase().replace(/\s+/g, '-') === category
  );

  return {
    props: {
      category,
      categoryData,
      products
    }
  };
}
