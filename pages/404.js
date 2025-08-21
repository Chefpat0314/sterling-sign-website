// pages/404.js
import Link from 'next/link';

export default function Custom404() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-3">Page not found</h1>
      <p className="text-gray-600">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Link
        href="/"
        className="inline-block mt-6 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 transition"
      >
        Go Home
      </Link>
    </section>
  );
}
