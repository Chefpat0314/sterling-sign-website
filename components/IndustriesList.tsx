import React from 'react';
import { motion } from 'framer-motion';

// Define the structure for our industries. When ready, you can expand
// this type to include more properties.
interface Industry {
  key: string;
  title: string;
  primaryCTA: string;
  secondaryLine: string;
  imageBase: string;
}

// Data describing each industry card. The `imageBase` corresponds to
// filenames in the public/images directory. Ensure both .png and .webp
// versions exist for each base name.
const industries: Industry[] = [
  {
    key: 'construction',
    title: 'Construction',
    primaryCTA: 'Claim Your Jobsite Walkthrough Today',
    secondaryLine: 'Fast turnaround for contractors & GCs',
    imageBase: 'construction_background_overlay',
  },
  {
    key: 'corporate',
    title: 'Corporate',
    primaryCTA: 'Book Your Free Office Signage Plan',
    secondaryLine: 'Branded, compliant, and consistent',
    imageBase: 'corporate_background_overlay_alt',
  },
  {
    key: 'retail',
    title: 'Retail',
    primaryCTA: 'Get the Retail Signage Playbook',
    secondaryLine: 'Boost walk‑in traffic and seasonal promotions',
    imageBase: 'retail_background_storefront_vinyl_overlay',
  },
  {
    key: 'healthcare',
    title: 'Healthcare',
    primaryCTA: 'Download the ADA Compliance Sign Kit',
    secondaryLine: 'Clean, compliant, and clearly labeled',
    imageBase: 'healthcare_background_emergency_sign_overlay',
  },
  {
    key: 'education',
    title: 'Education',
    primaryCTA: 'Explore Campus Signage Concepts',
    secondaryLine: 'Make your campus signage unforgettable',
    imageBase: 'education_background_carver_school_overlay',
  },
  {
    key: 'events',
    title: 'Events',
    primaryCTA: 'Plan Your Event Sign Strategy',
    secondaryLine: 'Direct foot traffic and improve visibility',
    imageBase: 'events_background_sterling_backdrop_overlay',
  },
  {
    key: 'hospitality',
    title: 'Hospitality',
    primaryCTA: 'Build Your Hospitality Sign Package',
    secondaryLine: 'Directional, room, and lobby signage that shines',
    imageBase: 'hospitality_background_welcome_lobby_overlay',
  },
];

/**
 * IndustriesList renders a grid of industry cards. Each card uses a
 * <picture> element to serve WebP and PNG versions of the background
 * images, overlays a gradient and displays titles, secondary lines and
 * call‑to‑action buttons. This component matches the v6 spec for
 * industries, including Framer Motion entrance animations.
 */
export default function IndustriesList() {
  return (
    <section
      className="bg-gradient-to-br from-slate-100 via-white to-sky-100 py-16"
      aria-label="Industries We Serve"
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
          Industries We Serve
        </h2>
        <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl mx-auto">
          From construction to hospitality, Sterling Sign Solutions has
          expertise across a broad range of industries. Browse the cards
          below to discover how we can elevate your space.
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {industries.map((industry, i) => (
            <motion.article
              key={industry.key}
              role="listitem"
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl group hover:scale-[1.03] transition-transform duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6 text-white z-10">
                <h3 className="text-2xl font-semibold drop-shadow-md">
                  {industry.title}
                </h3>
                <p className="text-sm drop-shadow-md">
                  {industry.secondaryLine}
                </p>
                <a
                  href={`/industries/${industry.key}?industry=${industry.key}&source=industry_card_${industry.key}`}
                  className="mt-4 inline-block bg-amber-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-500 hover:text-white hover:scale-105 transition duration-200"
                >
                  {industry.primaryCTA}
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}