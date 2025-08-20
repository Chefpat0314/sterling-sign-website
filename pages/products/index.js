import Link from 'next/link';

const products = [
  { slug: 'banners_13oz', name: '13oz Vinyl Banner', blurb: 'Hem, grommets, pole pockets.' },
  { slug: 'aluminum_040', name: '.040 Aluminum Sign', blurb: 'Durable exterior aluminum signs.' },
  { slug: 'door_hours_cut_vinyl', name: 'Door Hours (Cut Vinyl)', blurb: 'Clean storefront hours and logo.' },
];

export default function ProductsIndex() {
  return (
    <div className="max-w-5xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-6">Products</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {products.map(p => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="border rounded p-4 hover:shadow">
            <div className="text-xl font-semibold">{p.name}</div>
            <div className="text-sm text-gray-600">{p.blurb}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
