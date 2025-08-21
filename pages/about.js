// pages/about.js
import Head from 'next/head';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us – Sterling Sign Solutions</title>
        <meta
          name="description"
          content="Learn about Sterling Sign Solutions — a full-service signage provider for design, fabrication, installation, and maintenance."
        />
      </Head>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          About Sterling Sign Solutions
        </h1>

        <div className="space-y-5 leading-7">
          <p>
            Sterling Sign Solutions is a family-owned business with over two decades of
            experience crafting high-quality signage for clients across a diverse range
            of industries.
          </p>

          <p>
            We’ve grown into a full-service signage provider—design, fabrication,
            installation, and ongoing maintenance—trusted by both small businesses and
            national enterprises.
          </p>

          <h2 className="text-xl font-semibold mt-6">Our Mission</h2>
          <p>
            To help businesses communicate their message through beautiful, durable
            signage. Our mission is to make the process of ordering custom signs simple
            and stress-free, while delivering products that exceed expectations.
          </p>

          <h2 className="text-xl font-semibold mt-6">Community & Sustainability</h2>
          <p>
            We support local schools, charities and events, and continually invest in
            more sustainable materials and processes to reduce our environmental footprint.
          </p>

          <p>
            Thank you for considering Sterling Sign Solutions for your next project. We
            look forward to working with you!
          </p>
        </div>
      </section>
    </>
  );
}
