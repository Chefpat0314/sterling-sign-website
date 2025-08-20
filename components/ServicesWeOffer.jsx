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
      className="bg-gradient-to-br from-sky-100 via-white to-slate-100 py-16"
      aria-label="Our Services"
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
          Our Services
        </h2>
        <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl mx-auto">
          We offer a full suite of services to bring your signage vision to life.
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {services.map((svc, i) => (
            <motion.article
              key={svc.key}
              role="listitem"
              className="relative h-[400px] rounded-2xl overflow-hidden bg-gray-200 shadow-2xl group hover:scale-[1.03] transition-transform duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              {/* Placeholder background – replace with <picture> or <video> later */}
              <div className="absolute inset-0 bg-gray-200" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6 text-white z-10">
                <h3 className="text-2xl font-semibold drop-shadow-md mb-2">
                  {svc.title}
                </h3>
                <p className="text-sm drop-shadow-md mb-4">
                  {svc.description}
                </p>
                <a
                  href={`${svc.link}&source=service_card_${svc.key}`}
                  className="inline-block bg-amber-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-500 hover:text-white hover:scale-105 transition duration-200"
                >
                  {svc.cta}
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}