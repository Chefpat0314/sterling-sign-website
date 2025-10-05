export interface Industry {
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

export const industries: Industry[] = [
  {
    slug: 'construction',
    name: 'Construction',
    headline: 'Fast turnaround for contractors & GCs',
    subhead: 'Keep your construction sites safe and compliant with professional signage that withstands the elements and meets all safety requirements.',
    bullets: [
      'Job site safety signage and barriers',
      'Permit and inspection signage',
      'Construction site identification',
      'Temporary wayfinding and directions',
      'Weather-resistant materials for outdoor use'
    ],
    heroImage: '/images/industries/construction-hero.jpg',
    alt: 'Construction site with hard hat and safety equipment, construction signage visible in background',
    ctaLabel: 'Claim Your Jobsite Walkthrough',
    ctaHref: '/request-a-quote?rfq_source=industries&industry=construction'
  },
  {
    slug: 'corporate',
    name: 'Corporate',
    headline: 'Branded, compliant, and consistent',
    subhead: 'Professional corporate signage that reinforces your brand identity while meeting all compliance and accessibility standards.',
    bullets: [
      'Corporate identity and branding',
      'ADA compliant wayfinding systems',
      'Reception and lobby signage',
      'Office directory and room identification',
      'Conference room and meeting space signs'
    ],
    heroImage: '/images/industries/corporate-hero.jpg',
    alt: 'Modern corporate office lobby with professional signage and branding elements',
    ctaLabel: 'Book Your Free Office Signage Plan',
    ctaHref: '/request-a-quote?rfq_source=industries&industry=corporate'
  },
  {
    slug: 'retail',
    name: 'Retail',
    headline: 'Boost walk‑in traffic and seasonal promotions',
    subhead: 'Eye-catching retail signage that drives foot traffic and enhances the shopping experience for your customers.',
    bullets: [
      'Window graphics and displays',
      'Promotional banners and signs',
      'Storefront identification',
      'Seasonal and holiday displays',
      'Point-of-sale and directional signage'
    ],
    heroImage: '/images/industries/retail-hero.jpg',
    alt: 'Busy retail storefront with colorful promotional signage and window displays',
    ctaLabel: 'Get the Retail Signage Playbook',
    ctaHref: '/request-a-quote?rfq_source=industries&industry=retail'
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    headline: 'Clean, compliant, and clearly labeled',
    subhead: 'Healthcare signage that meets strict compliance requirements while maintaining a calming, professional environment for patients and staff.',
    bullets: [
      'ADA compliant wayfinding systems',
      'Department and room identification',
      'Patient safety and information signage',
      'Infection control compliant materials',
      'Emergency and evacuation signage'
    ],
    heroImage: '/images/industries/healthcare-hero.jpg',
    alt: 'Clean healthcare facility corridor with professional signage and wayfinding systems',
    ctaLabel: 'Download the ADA Compliance Sign Kit',
    ctaHref: '/request-a-quote?rfq_source=industries&industry=healthcare'
  },
  {
    slug: 'education',
    name: 'Education',
    headline: 'Make your campus signage unforgettable',
    subhead: 'Educational institution signage that creates a welcoming environment while providing clear navigation and information for students, staff, and visitors.',
    bullets: [
      'Campus wayfinding and directories',
      'Building and room identification',
      'Safety and emergency signage',
      'Athletic and event signage',
      'Donor recognition and commemorative signs'
    ],
    heroImage: '/images/industries/education-hero.jpg',
    alt: 'University campus building with clear directional signage and student-friendly design',
    ctaLabel: 'Explore Campus Signage Concepts',
    ctaHref: '/request-a-quote?rfq_source=industries&industry=education'
  },
  {
    slug: 'events',
    name: 'Events',
    headline: 'Direct foot traffic and improve visibility',
    subhead: 'Event signage that ensures smooth operations and enhances the attendee experience with clear directions and professional presentation.',
    bullets: [
      'Event branding and identification',
      'Directional and wayfinding signage',
      'Registration and check-in signage',
      'Schedule and program displays',
      'Sponsor recognition and displays'
    ],
    heroImage: '/images/industries/events-hero.jpg',
    alt: 'Conference center with event signage, registration area, and directional displays',
    ctaLabel: 'Plan Your Event Sign Strategy',
    ctaHref: '/request-a-quote?rfq_source=industries&industry=events'
  },
  {
    slug: 'hospitality',
    name: 'Hospitality',
    headline: 'Directional, room, and lobby signage that shines',
    subhead: 'Hospitality signage that creates memorable first impressions and ensures guests can easily navigate your property with confidence.',
    bullets: [
      'Hotel and resort wayfinding',
      'Room and suite identification',
      'Amenity and facility signage',
      'Restaurant and dining signage',
      'Guest services and information displays'
    ],
    heroImage: '/images/industries/hospitality-hero.jpg',
    alt: 'Luxury hotel lobby with elegant signage and guest service areas',
    ctaLabel: 'Build Your Hospitality Sign Package',
    ctaHref: '/request-a-quote?rfq_source=industries&industry=hospitality'
  }
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find(industry => industry.slug === slug);
}

export function getAllIndustries(): Industry[] {
  return industries;
}
