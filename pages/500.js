// pages/500.js
import Link from 'next/link';

export default function Custom500() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-3">Something went wrong</h1>
      <p className="text-gray-600">
        An unexpected error occurred. Please try again in a moment.
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
