import Head from "next/head";
import Link from "next/link";

const PRODUCTS = [
  { slug: "13oz-vinyl-banner", name: "Vinyl Banner (13oz)", blurb: "Durable full-color banners." },
  { slug: "aluminum-sign", name: "Aluminum Sign", blurb: "Long-term outdoor signage." },
  { slug: "door-hours-vinyl", name: "Door Hours Decal", blurb: "Clean storefront hours." },
];

export default function ProductsIndex() {
  return (
    <>
      <Head>
        <title>Products | Sterling Sign Solutions</title>
        <meta name="description" content="Browse Sterling Sign Solutions products." />
      </Head>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-semibold">Products</h1>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="rounded-2xl border p-5 hover:shadow-md transition"
            >
              <h2 className="text-lg font-medium">{p.name}</h2>
              <p className="mt-2 text-sm text-neutral-600">{p.blurb}</p>
              <span className="mt-3 inline-block text-sm text-blue-600">View →</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
