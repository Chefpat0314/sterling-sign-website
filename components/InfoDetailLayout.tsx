import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { trackCTAClick } from '../lib/analytics';

interface InfoDetailLayoutProps {
  // Common fields for both services and industries
  slug: string;
  name: string;
  headline: string;
  subhead: string;
  bullets: string[];
  heroImage: string;
  alt: string;
  ctaLabel: string;
  ctaHref: string;
  
  // Layout type to determine breadcrumb and navigation
  type: 'services' | 'industries';
  
  // Optional additional content
  additionalContent?: React.ReactNode;
  sidebarContent?: React.ReactNode;
}

export default function InfoDetailLayout({
  slug,
  name,
  headline,
  subhead,
  bullets,
  heroImage,
  alt,
  ctaLabel,
  ctaHref,
  type,
  additionalContent,
  sidebarContent
}: InfoDetailLayoutProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sterling-sign-website.vercel.app';
  const title = type === 'services' 
    ? `${name} – Sterling Sign Solutions`
    : `${name} Signage – Sterling Sign Solutions`;
  const description = `${subhead} Professional ${name.toLowerCase()} ${type === 'services' ? 'services' : 'signage solutions'} in California.`;
  const ogImage = `${siteUrl}${heroImage}`;
  const canonical = `${siteUrl}/${type}/${slug}`;

  const breadcrumbLabel = type === 'services' ? 'Services' : 'Industries';
  const backLinkHref = `/${type}`;
  const viewAllLabel = type === 'services' ? 'View All Services' : 'View All Industries';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sterling Sign Solutions" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content={alt} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 border-b" aria-label="Breadcrumb">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm text-gray-600" role="list">
            <li>
              <Link href={backLinkHref} className="hover:text-blue-600 transition-colors" aria-label={`Back to ${breadcrumbLabel}`}>
                {breadcrumbLabel}
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 font-medium" aria-current="page">{name}</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gray-900">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={alt}
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {name}
            </h1>
            <p className="text-xl text-gray-200 mb-4 leading-relaxed">
              {headline}
            </p>
            {type === 'industries' && (
              <p className="text-lg text-gray-300 mb-8">
                {subhead}
              </p>
            )}
            <Link
              href={ctaHref}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              aria-label={`${ctaLabel} for ${name}`}
              onClick={() => trackCTAClick(`${type}_hero`, slug)}
            >
              {ctaLabel}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {type === 'services' ? `What We Offer` : `Solutions for ${name}`}
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {type === 'services' ? subhead : `We understand the unique signage needs of the ${name.toLowerCase()} industry. Our solutions are designed to meet your specific requirements while maintaining the highest standards of quality and compliance.`}
              </p>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {type === 'services' ? `Our ${name} Services Include:` : `Our ${name} Signage Solutions:`}
                </h3>
                <ul className="space-y-3">
                  {bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Additional content for industries */}
              {type === 'industries' && (
                <div className="mt-12 bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Sterling for {name}?</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Industry-specific compliance expertise</span>
                      </div>
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Fast 24-48 hour turnaround times</span>
                      </div>
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Durable materials for long-lasting results</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Professional installation and support</span>
                      </div>
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Licensed and insured professionals</span>
                      </div>
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">Warranty and quality guarantee</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom additional content */}
              {additionalContent}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-blue-50 rounded-2xl p-8 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {type === 'services' ? "What's Included" : "Ready to Get Started?"}
                </h3>
                <p className="text-gray-700 mb-6">
                  {type === 'services' 
                    ? "Our comprehensive service includes everything you need for a successful signage project."
                    : `Let's discuss your ${name.toLowerCase()} signage needs and create a solution that works for your business.`
                  }
                </p>
                
                <div className="space-y-4 text-gray-700 mb-8">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free consultation and quote</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{type === 'services' ? 'Licensed and insured professionals' : 'Industry-specific expertise'}</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{type === 'services' ? 'Quality guarantee and warranty' : 'Fast turnaround times'}</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{type === 'services' ? 'Fast turnaround times' : 'Warranty and quality guarantee'}</span>
                  </div>
                </div>

                {/* Custom sidebar content */}
                {sidebarContent}

                <div className="space-y-3">
                  <Link
                    href={ctaHref}
                    className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    onClick={() => trackCTAClick(`${type}_sidebar`, slug)}
                  >
                    {ctaLabel}
                  </Link>
                  <Link
                    href={backLinkHref}
                    className="block w-full text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    {viewAllLabel}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
