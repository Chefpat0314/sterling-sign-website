import React from 'react';
import { motion } from 'framer-motion';

// Define the services offered. Each service has a key used for tracking,
// a title, description, call to action text, and a link to learn more.
const services = [
  {
    key: 'design',
    title: 'Design & Engineering',
    description: 'Collaborate with our experts to design signage that reflects your brand and meets code.',
    cta: 'Start Your Design',
    link: '/services/design?service=design',
  },
  {
    key: 'fabrication',
    title: 'Fabrication',
    description: 'From illuminated channel letters to dimensional logos, we build signs that last.',
    cta: 'View Fabrication',
    link: '/services/fabrication?service=fabrication',
  },
  {
    key: 'installation',
    title: 'Installation',
    description: 'Professional installation ensures your signs are mounted safely and effectively.',
    cta: 'Schedule Install',
    link: '/services/installation?service=installation',
  },
  {
    key: 'maintenance',
    title: 'Maintenance & Repairs',
    description: 'Keep your signage looking its best with our maintenance and repair services.',
    cta: 'Request Service',
    link: '/services/maintenance?service=maintenance',
  },
  {
    key: 'permitting',
    title: 'Permitting & Compliance',
    description: 'We navigate local regulations and secure permits to get your signage approved.',
    cta: 'Learn About Permits',
    link: '/services/permitting?service=permitting',
  },
  {
    key: 'project_management',
    title: 'Project Management',
    description: 'From concept to completion, our team handles every aspect of your signage project.',
    cta: 'Contact a PM',
    link: '/services/project-management?service=project_management',
  },
];

/**
 * ServicesWeOffer renders a grid of service cards similar in style to
 * the Industries section. Each card supports a future background image
 * and uses Framer Motion for scroll‑triggered entrance animations. The
 * call to action links append a source parameter for attribution.
 */
export default function ServicesWeOffer() {
  return (
    <section
      className="bg-gray-50 py-20"
      aria-label="Our Services"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Modern section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Full-Service Solutions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What We Do
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From initial concept to final installation, we provide comprehensive signage solutions that deliver results.
          </p>
          
          {/* Value proposition highlight */}
          <div className="mt-8 inline-flex items-center px-6 py-3 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="text-blue-700 font-semibold">
              High-Quality Materials = Lower Long-Term Costs
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Clients reduce signage replacement costs by 30% over standard vendors — saving thousands over project lifetimes.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {services.map((svc, i) => (
            <motion.article
              key={svc.key}
              role="listitem"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              {/* Service icon */}
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors duration-200">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              {/* Service content */}
              <div className="flex flex-col h-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {svc.title}
                </h3>
                <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                  {svc.description}
                </p>
                <a
                  href={`${svc.link}&source=service_card_${svc.key}`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {svc.cta}
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