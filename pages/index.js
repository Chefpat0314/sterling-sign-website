import Head from 'next/head';
import Link from 'next/link';
import IndustriesWeServe from '../components/IndustriesWeServe';
import ServicesWeOffer from '../components/ServicesWeOffer';
import WhySterling from '../components/WhySterling';
import '../styles/buttons.css';

function HeroVideoSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5"></div>
      
      {/* Video overlay for dynamic background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
        poster="/hero_placeholder.png"
        aria-label="Background video showing professional sign manufacturing equipment"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-gray-800"></div>
      </video>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 py-20">
        {/* Modern badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          California's Trusted Sign Partner
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 max-w-4xl leading-tight">
          Signs That Make Your Business{' '}
          <span className="text-blue-600">Stand Out</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
          Professional signage solutions that drive results. From construction sites to corporate offices, 
          we deliver durable, high-impact signs that elevate your brand and maximize your ROI.
        </p>

        {/* Mission statement in modern card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-12 shadow-lg border border-gray-100">
          <p className="text-lg text-gray-700 italic">
            "Family-owned since 2010, we've completed 500+ projects across California, 
            helping businesses make lasting impressions with durable, professional signage."
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/products" 
            className="btn-primary-lg btn-with-icon"
            aria-label="Start designing your custom signage"
          >
            Start Your Design
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link 
            href="/request-a-quote" 
            className="btn-secondary-lg"
            aria-label="Request a quote for your signage project"
          >
            Request a Quote
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Sterling Sign Solutions — California's Trusted Sign Partner | Fast Turnarounds & Professional Installation</title>
        <meta
          name="description"
          content="Family-owned sign company serving California since 2010. Professional vinyl banners, aluminum signs, and door decals with 24-48 hour turnaround. Licensed, insured, and committed to quality."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Sterling Sign Solutions" />
        <meta name="keywords" content="signs California, vinyl banners, aluminum signs, construction signs, door decals, signage installation, custom signs, fast turnaround" />

        {/* Favicon set */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sterling-sign-website.vercel.app/" />
        <meta property="og:title" content="Sterling Sign Solutions — California's Trusted Sign Partner" />
        <meta property="og:description" content="Built for builders. Engineered for speed. Family-owned sign company with 24-48 hour turnaround on vinyl banners, aluminum signs, and door decals." />
        <meta property="og:image" content="https://sterling-sign-website.vercel.app/og-image.png" />
        <meta property="og:image:alt" content="Professional signage installation at construction site with hard hat and blueprints" />
        <meta property="og:site_name" content="Sterling Sign Solutions" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://sterling-sign-website.vercel.app/" />
        <meta name="twitter:title" content="Sterling Sign Solutions — California's Trusted Sign Partner" />
        <meta name="twitter:description" content="Built for builders. Engineered for speed. Family-owned sign company with 24-48 hour turnaround." />
        <meta name="twitter:image" content="https://sterling-sign-website.vercel.app/og-image.png" />
        <meta name="twitter:image:alt" content="Professional signage installation at construction site" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://sterling-sign-website.vercel.app/" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Sterling Sign Solutions",
              "description": "Family-owned sign company serving California since 2010. Professional vinyl banners, aluminum signs, and door decals.",
              "url": "https://sterling-sign-website.vercel.app",
              "logo": "https://sterling-sign-website.vercel.app/logo.png",
              "image": "https://sterling-sign-website.vercel.app/og-image.png",
              "telephone": "+1-XXX-XXX-XXXX",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "California",
                "addressCountry": "US"
              },
              "openingHours": "Mo-Fr 08:00-17:00",
              "priceRange": "$$",
              "serviceArea": {
                "@type": "State",
                "name": "California"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Signage Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Vinyl Banners",
                      "description": "Durable, weather-resistant banners for construction sites and events"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Aluminum Signs",
                      "description": "Professional-grade aluminum signs for permanent installations"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Door Hours Decals",
                      "description": "Clean, professional door hours signage"
                    }
                  }
                ]
              }
            })
          }}
        />
      </Head>

      <HeroVideoSection />
      <IndustriesWeServe />
      <ServicesWeOffer />
      <WhySterling />
    </>
  );
}
