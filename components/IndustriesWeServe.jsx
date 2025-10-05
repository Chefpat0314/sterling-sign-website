import React from 'react';
import { motion } from 'framer-motion';

const industries = [
  {
    key: 'construction',
    title: 'Construction',
    cta: 'Claim Your Jobsite Walkthrough Today',
    secondary: 'Fast turnaround for contractors & GCs',
    imageBase: 'construction_background_overlay',
  },
  {
    key: 'corporate',
    title: 'Corporate',
    cta: 'Book Your Free Office Signage Plan',
    secondary: 'Branded, compliant, and consistent',
    imageBase: 'corporate_background_overlay_alt',
  },
  {
    key: 'retail',
    title: 'Retail',
    cta: 'Get the Retail Signage Playbook',
    secondary: 'Boost walk‑in traffic and seasonal promotions',
    imageBase: 'retail_background_storefront_vinyl_overlay',
  },
  {
    key: 'healthcare',
    title: 'Healthcare',
    cta: 'Download the ADA Compliance Sign Kit',
    secondary: 'Clean, compliant, and clearly labeled',
    imageBase: 'healthcare_background_emergency_sign_overlay',
  },
  {
    key: 'education',
    title: 'Education',
    cta: 'Explore Campus Signage Concepts',
    secondary: 'Make your campus signage unforgettable',
    imageBase: 'education_background_carver_school_overlay',
  },
  {
    key: 'events',
    title: 'Events',
    cta: 'Plan Your Event Sign Strategy',
    secondary: 'Direct foot traffic and improve visibility',
    imageBase: 'events_background_sterling_backdrop_overlay',
  },
  {
    key: 'hospitality',
    title: 'Hospitality',
    cta: 'Build Your Hospitality Sign Package',
    secondary: 'Directional, room, and lobby signage that shines',
    imageBase: 'hospitality_background_welcome_lobby_overlay',
  },
];

export default function IndustriesWeServe() {
  return (
    <section
      className="bg-white py-20"
      aria-label="Industries We Serve"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Modern section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Industries We Serve
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Who Are You?
          </h2>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
            We tailor our approach to your industry's unique needs.
          </p>
        </div>
        <div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {industries.map((industry, i) => (
            <motion.article
              key={industry.key}
              role="listitem"
              className="group relative h-[400px] rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              {industry.key === "healthcare" ? (
                <img
                  src="/images/healthcare_background_emergency_sign_overlay.png"
                  alt="Signage for Healthcare"
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              ) : (
                <picture className="absolute inset-0 w-full h-full z-0">
                  <source
                    srcSet={`/images/${industry.imageBase}.webp`}
                    type="image/webp"
                  />
                  <img
                    src={`/images/${industry.imageBase}.png`}
                    alt={`Signage for ${industry.title}`}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </picture>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white z-10">
                <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">
                  {industry.title}
                </h3>
                <p className="text-sm mb-4 drop-shadow-md opacity-90">
                  {industry.secondary}
                </p>
                <a
                  href={`/industries/${industry.key}?industry=${industry.key}&source=industry_card_${industry.key}`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {industry.cta}
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
