import Head from 'next/head';
import IndustriesWeServe from '../components/IndustriesWeServe';
import ServicesWeOffer from '../components/ServicesWeOffer';

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
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
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
          From vision to installation, Sterling delivers signage that lasts, elevates, and inspires.
        </p>

        {/* Mission statement in modern card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-12 shadow-lg border border-gray-100">
          <p className="text-lg text-gray-700 italic">
            "Elevating businesses and communities through signage with purpose"
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            Start Your Design
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl">
            Request a Quote
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Sterling Sign Solutions — Signs, Installation & Fast Turnarounds</title>
        <meta
          name="description"
          content="Licensed California sign partner for construction, property management, healthcare, education, and logistics. Fast quotes, pro installs, clean execution."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicon set */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0b0f19" />

        {/* Social cards */}
        <meta property="og:title" content="Sterling Sign Solutions" />
        <meta property="og:description" content="Built for builders. Engineered for speed." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og/sterling-og.jpg" />
        <meta property="og:url" content="https://sterlingsignsolutions.com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <HeroVideoSection />
      <IndustriesWeServe />
      <ServicesWeOffer />
    </>
  );
}
