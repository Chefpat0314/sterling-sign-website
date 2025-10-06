// pages/products/index.tsx - Enhanced product catalog
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { analytics } from '../../lib/metrics';
import { getAllCatalog, getAllCategories, searchCatalog, CatalogItem } from '../../lib/catalog';
import { formatPrice } from '../../lib/pricing';
import { calculateETA, formatETA } from '../../lib/eta';
import ProductGrid from '../../components/catalog/ProductGrid';

const getProductDescription = (code: string): string => {
  const descriptions: Record<string, string> = {
    'BAN-13OZ': 'Standard vinyl banners perfect for events, construction sites, and temporary signage.',
    'BAN-18OZ': 'Heavy-duty blockout banners with superior opacity and durability.',
    'BAN-20OZ': 'Premium vinyl banners with maximum strength and weather resistance.',
    'COR-4MM': 'Lightweight coroplast signs ideal for yard signs and temporary displays.',
    'COR-6MM': 'Thicker coroplast signs for better rigidity and longevity.',
    'ALU-040': 'Professional aluminum signs for permanent outdoor installations.',
    'ALU-063': 'Heavy-duty aluminum signs for high-traffic areas.',
    'ACM-3MM': 'Aluminum composite material signs with modern appearance.',
    'ACM-6MM': 'Thick ACM signs for large format applications.',
    'PVC-3MM': 'Rigid PVC foam board signs for indoor and outdoor use.',
    'PVC-6MM': 'Thick PVC foam board for maximum durability.',
    'ADA-ROOM': 'ADA-compliant room signs with braille and tactile elements.',
    'DEC-VINYL': 'Vinyl decals for windows, walls, and vehicles.',
    'WIN-PERF': 'Perforated window graphics with one-way visibility.',
    'WAL-DECAL': 'Wall decals and graphics for interior branding.',
    'MAG-VINYL': 'Magnetic signs for vehicles and metal surfaces.',
    'FLR-VINYL': 'Floor graphics and directional signage.',
    'SAF-POLY': 'Safety labels and identification signs.',
  };
  return descriptions[code] || 'Professional signage solution.';
};

const getMinSize = (code: string): string => {
  if (code === 'ADA-ROOM') return '4" x 6"';
  return '12" x 12"';
};

const getMaxSize = (code: string): string => {
  if (code.startsWith('BAN-')) return '10\' x 20\'';
  if (code.startsWith('COR-') || code.startsWith('ALU-')) return '4\' x 8\'';
  if (code.startsWith('ACM-')) return '5\' x 10\'';
  return '4\' x 8\'';
};

const getProductFeatures = (code: string): string[] => {
  const features: Record<string, string[]> = {
    'BAN-13OZ': ['Weather resistant', 'Grommets included', 'Full color printing'],
    'BAN-18OZ': ['Blockout material', 'Double-sided option', 'Reinforced corners'],
    'BAN-20OZ': ['Premium vinyl', 'UV resistant', 'Professional finish'],
    'COR-4MM': ['Lightweight', 'Weather resistant', 'Easy installation'],
    'COR-6MM': ['Rigid construction', 'Durable', 'Outdoor rated'],
    'ALU-040': ['Rust resistant', 'Professional grade', 'Long lasting'],
    'ALU-063': ['Heavy duty', 'Industrial grade', 'Maximum durability'],
    'ACM-3MM': ['Modern appearance', 'Lightweight', 'Easy mounting'],
    'ACM-6MM': ['Thick construction', 'Professional finish', 'Durable'],
    'PVC-3MM': ['Versatile', 'Indoor/outdoor', 'Easy to work with'],
    'PVC-6MM': ['Thick and rigid', 'Weather resistant', 'Professional grade'],
    'ADA-ROOM': ['ADA compliant', 'Braille included', 'Tactile elements'],
    'DEC-VINYL': ['Removable', 'Full color', 'Custom shapes'],
    'WIN-PERF': ['One-way visibility', 'Professional appearance', 'Easy removal'],
    'WAL-DECAL': ['Interior safe', 'Full color', 'Custom designs'],
    'MAG-VINYL': ['Magnetic backing', 'Removable', 'Vehicle safe'],
    'FLR-VINYL': ['Slip resistant', 'High traffic rated', 'Easy maintenance'],
    'SAF-POLY': ['Durable materials', 'Safety compliant', 'Long lasting'],
  };
  return features[code] || ['Professional quality', 'Custom printing', 'Fast delivery'];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<CatalogItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [zipCode, setZipCode] = useState<string>('');
  const [etaResults, setEtaResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productList = getAllCatalog();
    setProducts(productList);
    setFilteredProducts(productList);
    setLoading(false);
    analytics.viewCategory('products');
  }, []);

  // Calculate ETAs when zip code changes
  useEffect(() => {
    if (zipCode && zipCode.length === 5) {
      const calculateETAs = async () => {
        const results: Record<string, any> = {};
        for (const product of products) {
          try {
            const eta = await getETA(product.id, zipCode);
            results[product.id] = eta;
          } catch (error) {
            console.error('ETA calculation error:', error);
          }
        }
        setEtaResults(results);
      };
      calculateETAs();
    }
  }, [zipCode, products]);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = searchCatalog(searchQuery);
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(product => product.category === selectedCategory);
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
          return b.popular ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, sortBy]);

  const categories = ['all', ...getAllCategories()];

  const handleProductClick = (productId: string) => {
    analytics.viewProduct(productId, 'products');
  };

  const getETA = async (productId: string, zipCode: string) => {
    if (!zipCode || zipCode.length !== 5) return null;
    
    try {
      const config = PRICING[productId];
      if (!config) return null;

      const eta = calculateETA({
        productCode: productId,
        sqFt: 2, // Default 2 sq ft for ETA calculation
        qty: 1,
        rushLevel: 'standard',
        shipZip: zipCode,
      });

      return eta;
    } catch (error) {
      console.error('ETA calculation error:', error);
      return null;
    }
  };

  return (
    <>
      <Head>
        <title>Custom Signs & Banners | Sterling Sign Solutions</title>
        <meta name="description" content="Browse our complete catalog of custom signs, banners, and graphics. Instant quotes, fast delivery, and professional quality guaranteed." />
        <meta name="keywords" content="custom signs, vinyl banners, aluminum signs, ADA signs, decals, window graphics" />
        <meta property="og:title" content="Custom Signs & Banners | Sterling Sign Solutions" />
        <meta property="og:description" content="Browse our complete catalog of custom signs, banners, and graphics." />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <main className="min-h-screen bg-gray-50">
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
              
              {/* Quick Quote Tool */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
                <h3 className="font-semibold mb-4">Get Instant Quote</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter ZIP code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg text-gray-900"
                    maxLength={5}
                  />
                  <button className="px-4 py-2 bg-yellow-400 text-blue-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                    Quote
                  </button>
                </div>
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
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All Products' : category}
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
            <ProductGrid products={filteredProducts} loading={loading} />

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
                onClick={() => analytics.clickCTA('Custom Solution', 'products')}
                className="inline-flex items-center justify-center px-8 py-3 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
              >
                Request Custom Quote
              </Link>
              <Link
                href="/services/design"
                onClick={() => analytics.clickCTA('Design Help', 'products')}
                className="inline-flex items-center justify-center px-8 py-3 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
              >
                Talk to Designer
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
