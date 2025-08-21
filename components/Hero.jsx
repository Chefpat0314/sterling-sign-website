import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-black overflow-hidden md:h-[70vh] aspect-[16/9] md:aspect-auto">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        // Optional: show the logo as a quick poster before the video buffers
        poster="/logo.png"
      />

      {/* Subtle dark overlay for legibility */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Foreground content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24 text-white">
        <img
          src="/logo.png"
          alt="Sterling Sign Solutions"
          className="w-40 md:w-56 mb-6"
          loading="eager"
          decoding="sync"
        />
        <h1 className="text-3xl md:text-5xl font-bold">
          Signs that work as hard as you do.
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl">
          Design, fabrication, installation, and maintenance—end to end.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/request-a-quote"
            className="inline-block bg-amber-400 text-black px-5 py-3 rounded-lg font-semibold hover:bg-amber-500 transition"
          >
            Request a Quote
          </Link>
          <Link
            href="/products"
            className="inline-block px-5 py-3 rounded-lg ring-1 ring-white/40 hover:bg-white/10 transition"
          >
            Explore Products
          </Link>
        </div>
      </div>
    </section>
  );
}
