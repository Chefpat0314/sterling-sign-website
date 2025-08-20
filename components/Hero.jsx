import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="bg-black text-white py-12 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl"
      >
        <Image
          src="/images/sterling_logo_large_white.png"
          alt="Sterling Sign Solutions"
          width={400}
          height={200}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl md:text-6xl font-bold">
          California’s Trusted Sign Partner
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Built for builders. Engineered for speed.
        </p>
      </motion.div>
    </section>
  );
}
