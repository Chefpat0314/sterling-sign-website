import Head from 'next/head';
import IndustriesWeServe from '../components/IndustriesWeServe';
import ServicesWeOffer from '../components/ServicesWeOffer';

function HeroVideoSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <img src="/images/logo.svg" alt="Sterling Sign Solutions" className="w-64 md:w-96 mb-6" />
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
          California’s Trusted Sign Partner
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-xl mx-auto drop-shadow-md">
          Built for builders. Engineered for speed.
        </p>
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
