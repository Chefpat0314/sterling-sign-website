import React from 'react';
import Link from 'next/link';

export default function ProjectStartsCTA() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-blue-600 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Main Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Your Next Project Starts Here
        </h2>
        
        {/* Subheading */}
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Ready to transform your business with professional signage? Let's bring your vision to life.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/request-a-quote?product=Custom%20Project&notes=Ready%20to%20start%20my%20next%20signage%20project"
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform"
          >
            Start Your Project
          </Link>
          
          <Link
            href="/products"
            className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200"
          >
            Browse Our Work
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-blue-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-blue-100">
            {/* Phone */}
            <div className="flex items-center justify-center md:justify-start">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-medium">(555) 123-4567</span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">info@sterlingsignsolutions.com</span>
            </div>

            {/* Response Time */}
            <div className="flex items-center justify-center md:justify-end">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">24-hour response</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
