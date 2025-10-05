import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Portfolio data matching the reference site categories
const portfolioItems = [
  {
    id: 1,
    category: 'Banners',
    title: 'Vinyl Banners',
    image: '/images/480_F_1320140627_giwODRB9w0ARnYuE5jy1yzwE3aUlRNE2.jpg',
    description: 'High-quality vinyl banners for events and promotions',
    slug: '13oz-vinyl-banner'
  },
  {
    id: 2,
    category: 'Aluminum Signs',
    title: 'Aluminum Signs',
    image: '/images/480_F_1575048288_qWQn7miPilL5sUQEXzzhVH8aVpx3ZkvD.jpg',
    description: 'Durable aluminum signage for indoor and outdoor use',
    slug: '.040-aluminum'
  },
  {
    id: 3,
    category: 'ADA Signs',
    title: 'ADA Signage',
    image: '/images/480_F_218353026_XtNzGSrvRJpUjCtulsr2iKpXNv3LTuRr.jpg',
    description: 'ADA compliant signage for accessibility',
    slug: 'door-hours'
  },
  {
    id: 4,
    category: 'Channel Letters',
    title: 'Channel Letters',
    image: '/images/480_F_1223326773_2LsdW7GGVMw2OPWRdnGJjBXoaN6K13mF.jpg',
    description: 'Illuminated channel letters for storefronts',
    slug: 'channel-letters'
  },
  {
    id: 5,
    category: 'Monument Signs',
    title: 'Monument Signs',
    image: '/images/480_F_1467127469_n8NEUVKDrYlkRdwTWh9eb8l2Tdz26iaz.jpg',
    description: 'Impressive monument signs for businesses',
    slug: 'monument-signs'
  },
  {
    id: 6,
    category: 'Wayfinding & Door Graphics',
    title: 'Wayfinding Signs',
    image: '/images/480_F_1389176127_vuFro1efknvOhOoGE5JUikXii8rv9xIF.jpg',
    description: 'Clear directional and wayfinding signage',
    slug: 'wayfinding-signs'
  },
  {
    id: 7,
    category: 'Trade Show Graphics',
    title: 'Trade Show Graphics',
    image: '/images/480_F_1214475422_SZ03dsGH1xbIlLYs0sUNSM5uTVbnAGwz.jpg',
    description: 'Eye-catching graphics for trade shows and events',
    slug: 'trade-show-graphics'
  },
  {
    id: 8,
    category: 'Yard Signs',
    title: 'Yard Signs',
    image: '/images/480_F_1147721705_ZyTe1mUWNM5ULbg6lvxoPG1i2fBG5hCk.jpg',
    description: 'Corrugated plastic signs for temporary use',
    slug: 'yard-signs'
  },
  {
    id: 9,
    category: 'Vehicle Graphics',
    title: 'Vehicle Graphics',
    image: '/images/480_F_1073841746_R2gqegYgQvn5V2ZmztcWWpRF90G2MCWE.jpg',
    description: 'Professional vehicle wraps and graphics',
    slug: 'vehicle-graphics'
  },
  {
    id: 10,
    category: 'Wayfinding Signs',
    title: 'Wayfinding Signs',
    image: '/images/480_F_1536659926_2Z1Dn8uJPokNbPXGm8V052QlMXc8YPSy.jpg',
    description: 'Interior and exterior wayfinding solutions',
    slug: 'wayfinding-interior'
  },
  {
    id: 11,
    category: 'Dimensional Letters',
    title: 'Dimensional Letters',
    image: '/images/480_F_1603832543_d5NOyHD0ZYv8hWxXvTDU5qZGCsQYGGhS.jpg',
    description: '3D letters and logos for professional branding',
    slug: 'dimensional-letters'
  },
  {
    id: 12,
    category: 'Window Graphics',
    title: 'Window Graphics',
    image: '/images/480_F_1580425920_XWwq1HIR5VyfNk397RxnSijHfxuVuagH.jpg',
    description: 'Vinyl graphics and window displays',
    slug: 'window-graphics'
  }
];

export default function PortfolioGallery({ showModal = true }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {portfolioItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              {/* Image */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {item.description}
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/products/${item.slug}`}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-md font-medium transition-colors duration-200"
                  >
                    Learn More
                  </Link>
                  <Link
                    href={`/request-a-quote?product=${encodeURIComponent(item.title)}&notes=${encodeURIComponent(`Interested in ${item.title} - ${item.description}`)}`}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-md font-medium transition-colors duration-200"
                  >
                    Get Quote
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Request Modal Trigger */}
        {showModal && (
          <div className="bg-gray-100 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Looking for Something Custom?
                </h2>
                <p className="text-gray-600 mb-6">
                  We create fully custom signage solutions to match your unique branding and requirements.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md font-semibold transition-colors duration-200"
                >
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Request Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Custom Request</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Tell us about your custom signage needs and we'll create a solution that's perfect for your business.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/request-a-quote?product=Custom%20Signage&notes=I%20need%20a%20custom%20signage%20solution"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-4 rounded-md font-semibold transition-colors duration-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  Start Custom Quote
                </Link>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-md font-medium transition-colors duration-200"
                >
                  Browse Products First
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
