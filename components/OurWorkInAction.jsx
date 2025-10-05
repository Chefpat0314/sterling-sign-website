import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const featuredProjects = [
  {
    id: 1,
    title: 'Retail Storefront Transformation',
    image: '/images/480_F_1320140627_giwODRB9w0ARnYuE5jy1yzwE3aUlRNE2.jpg',
    category: 'Channel Letters & Storefront',
    description: 'Complete storefront makeover with illuminated channel letters and window graphics'
  },
  {
    id: 2,
    title: 'Corporate Campus Wayfinding',
    image: '/images/480_F_1389176127_vuFro1efknvOhOoGE5JUikXii8rv9xIF.jpg',
    category: 'Wayfinding System',
    description: 'Comprehensive wayfinding solution for a large corporate campus'
  },
  {
    id: 3,
    title: 'Healthcare Facility Signage',
    image: '/images/480_F_218353026_XtNzGSrvRJpUjCtulsr2iKpXNv3LTuRr.jpg',
    category: 'ADA Compliant Signs',
    description: 'Full ADA compliant signage package for medical facility'
  }
];

export default function OurWorkInAction() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See Our Work in Action
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From concept to installation, we deliver professional signage solutions that make an impact.
          </p>
        </div>

        {/* Featured Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              {/* Project Image */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {project.category}
                  </span>
                </div>
              </div>
              
              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {project.description}
                </p>
                <Link
                  href="/request-a-quote?product=Custom%20Project&notes=I%20saw%20your%20work%20and%20would%20like%20something%20similar"
                  className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Get Similar Quote
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Work CTA */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md font-semibold transition-colors duration-200"
          >
            View All Our Work
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
