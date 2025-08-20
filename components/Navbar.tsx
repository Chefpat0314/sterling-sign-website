import React from 'react';
import Link from 'next/link';

/**
 * Navbar component renders the primary navigation across the site. It
 * reinstates links to the Industries and Services pages per the updated
 * change order. Adjust or extend this component as needed to fit your
 * existing layout and styling conventions.
 */
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-6 px-8 bg-white shadow-md">
      <div className="flex items-center space-x-8">
        <Link href="/" className="font-bold text-xl">Home</Link>
        <Link href="/industries">Industries</Link>
        <Link href="/services">Services</Link>
        <Link href="/products">Products</Link>
        <Link href="/request-a-quote">Request a Quote</Link>
      </div>
      <div>{/* Secondary nav items can go here if needed */}</div>
    </nav>
  );
}