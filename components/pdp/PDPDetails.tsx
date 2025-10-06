import React, { useState } from 'react';
import { CatalogItem } from '../../lib/catalog';

interface PDPDetailsProps {
  product: CatalogItem;
}

export default function PDPDetails({ product }: PDPDetailsProps) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specs', label: 'Specifications' },
    { id: 'faq', label: 'FAQ' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'shipping', label: 'Shipping & Returns' },
    { id: 'templates', label: 'Templates' }
  ];

  const faqData = [
    {
      question: "What materials are available for this product?",
      answer: "We offer a variety of materials including vinyl, coroplast, aluminum, and more. Each material is selected for durability and suitability for your specific application."
    },
    {
      question: "How long does production take?",
      answer: "Most products are ready within 24-48 hours of approval. Rush orders can be accommodated with same-day production for an additional fee."
    },
    {
      question: "Do you provide installation services?",
      answer: "Yes, we offer professional installation services through our network of certified installers. Installation can be scheduled during the ordering process."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 100% satisfaction guarantee. If you're not completely satisfied with your order, we'll work with you to make it right or provide a full refund."
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              {product.description}
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'specs':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="font-medium text-gray-900">Category</dt>
                  <dd className="text-gray-600">{product.category}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">Material</dt>
                  <dd className="text-gray-600">{product.material}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">Size Range</dt>
                  <dd className="text-gray-600">{product.minSize} - {product.maxSize}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">Starting Price</dt>
                  <dd className="text-gray-600">From ${product.startingPrice}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Production Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="font-medium text-gray-900">Production Time</dt>
                  <dd className="text-gray-600">24-48 hours</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">Rush Available</dt>
                  <dd className="text-gray-600">Same-day production</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">Proof Required</dt>
                  <dd className="text-gray-600">Free online proof</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">Installation</dt>
                  <dd className="text-gray-600">Professional installation available</dd>
                </div>
              </dl>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
            {faqData.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-gray-900">4.8</div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-600">Based on 85 reviews</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Sarah M.", rating: 5, comment: "Excellent quality and fast delivery. Will definitely order again!" },
                { name: "Mike R.", rating: 5, comment: "Professional service and great communication throughout the process." },
                { name: "Jennifer L.", rating: 4, comment: "Good quality product, arrived on time. Minor issue with sizing but customer service resolved it quickly." }
              ].map((review, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">{review.name}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping & Returns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Shipping Information</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Free shipping on orders over $100</li>
                  <li>• Standard delivery: 3-5 business days</li>
                  <li>• Rush delivery: 1-2 business days (additional fee)</li>
                  <li>• Tracking provided for all shipments</li>
                  <li>• Professional installation available</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Return Policy</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• 100% satisfaction guarantee</li>
                  <li>• 30-day return window</li>
                  <li>• Free return shipping</li>
                  <li>• Full refund or replacement</li>
                  <li>• No restocking fees</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'templates':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Templates</h3>
            <p className="text-gray-600 mb-4">
              Get started with our professional design templates. Customize colors, text, and layout to match your brand.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((template) => (
                <div key={template} className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="w-full h-24 bg-gray-100 rounded mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">Template {template}</p>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
