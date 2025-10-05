export interface Service {
  slug: string;
  name: string;
  headline: string;
  subhead: string;
  bullets: string[];
  heroImage: string;
  alt: string;
  ctaLabel: string;
  ctaHref: string;
}

export const services: Service[] = [
  {
    slug: 'design',
    name: 'Design & Engineering',
    headline: 'Collaborate with our experts to design signage that reflects your brand and meets code.',
    subhead: 'Our design team works closely with you to create signage solutions that not only look great but comply with local regulations and accessibility standards.',
    bullets: [
      'Custom design consultation and brand alignment',
      'Local code compliance and permitting guidance',
      '3D renderings and mockups for approval',
      'ADA accessibility compliance review',
      'Material and finish recommendations'
    ],
    heroImage: '/images/services/design-hero.jpg',
    alt: 'Designer working on signage plans with blueprints and computer screen showing CAD drawings',
    ctaLabel: 'Start Your Design',
    ctaHref: '/request-a-quote?rfq_source=services&service=design'
  },
  {
    slug: 'fabrication',
    name: 'Fabrication',
    headline: 'From illuminated channel letters to dimensional logos, we build signs that last.',
    subhead: 'Our state-of-the-art fabrication facility produces high-quality signage using premium materials and precision manufacturing techniques.',
    bullets: [
      'Premium materials and substrates',
      'Advanced digital printing technology',
      'Precision cutting and assembly',
      'Quality control at every step',
      'Fast turnaround without compromising quality'
    ],
    heroImage: '/images/services/fabrication-hero.jpg',
    alt: 'Professional sign fabrication equipment and worker assembling aluminum sign components',
    ctaLabel: 'Request Fabrication Quote',
    ctaHref: '/request-a-quote?rfq_source=services&service=fabrication'
  },
  {
    slug: 'installation',
    name: 'Installation',
    headline: 'Professional installation ensures your signs are mounted safely and effectively.',
    subhead: 'Our certified installation team handles everything from permits to final mounting, ensuring your signage is secure and compliant.',
    bullets: [
      'Licensed and insured installation team',
      'Permit acquisition and coordination',
      'Safe mounting on various surfaces',
      'Electrical connections for illuminated signs',
      'Final inspection and cleanup'
    ],
    heroImage: '/images/services/installation-hero.jpg',
    alt: 'Professional installer mounting large aluminum sign on building exterior with safety equipment',
    ctaLabel: 'Schedule Installation',
    ctaHref: '/request-a-quote?rfq_source=services&service=installation'
  },
  {
    slug: 'maintenance',
    name: 'Maintenance & Repairs',
    headline: 'Keep your signage looking its best with our maintenance and repair services.',
    subhead: 'Regular maintenance extends the life of your signage and ensures it continues to represent your brand professionally.',
    bullets: [
      'Routine cleaning and inspection',
      'Bulb and LED replacement',
      'Vinyl repair and replacement',
      'Structural maintenance',
      'Emergency repair services'
    ],
    heroImage: '/images/services/maintenance-hero.jpg',
    alt: 'Maintenance technician cleaning and inspecting illuminated sign with cleaning supplies',
    ctaLabel: 'Request Service',
    ctaHref: '/request-a-quote?rfq_source=services&service=maintenance'
  },
  {
    slug: 'permitting',
    name: 'Permitting & Compliance',
    headline: 'We navigate local regulations and secure permits to get your signage approved.',
    subhead: 'Navigating municipal requirements can be complex. Our team handles all permitting and compliance requirements so you can focus on your business.',
    bullets: [
      'Municipal permit applications',
      'Zoning compliance review',
      'ADA accessibility compliance',
      'Electrical permit coordination',
      'Inspection scheduling and support'
    ],
    heroImage: '/images/services/permitting-hero.jpg',
    alt: 'Permit documents and blueprints on desk with city planning documents and approval stamps',
    ctaLabel: 'Learn About Permits',
    ctaHref: '/request-a-quote?rfq_source=services&service=permitting'
  },
  {
    slug: 'project-management',
    name: 'Project Management',
    headline: 'From concept to completion, our team handles every aspect of your signage project.',
    subhead: 'Our experienced project managers coordinate all phases of your signage project, ensuring timely delivery and quality results.',
    bullets: [
      'End-to-end project coordination',
      'Timeline management and updates',
      'Vendor and subcontractor coordination',
      'Quality assurance and testing',
      'Final delivery and documentation'
    ],
    heroImage: '/images/services/pm-hero.jpg',
    alt: 'Project manager reviewing signage project timeline and coordinating with team members',
    ctaLabel: 'Contact a PM',
    ctaHref: '/request-a-quote?rfq_source=services&service=project-management'
  }
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(service => service.slug === slug);
}

export function getAllServices(): Service[] {
  return services;
}
