import Layout from '../../components/Layout';
import Link   from 'next/link';

export default function ProductDetail({ product }) {
  if (!product) {
    return (
      <Layout title="Product Not Found – Sterling Signs">
        <div className="max-w-xl mx-auto py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p>The requested product does not exist.</p>
          <Link href="/products" className="mt-6 inline-block text-amber-500">
            ← Back to Products
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${product.name} – Sterling Signs`}>
      <div className="max-w-3xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold mb-6">{product.name}</h1>
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto rounded-lg mb-6 shadow-lg"
          />
        )}
        <p className="mb-4">{product.description}</p>
        {product.price && (
          <p className="text-xl font-semibold mb-6">
            Price: ${product.price.toFixed(2)}
          </p>
        )}
        <Link
          href={`/customize/${product.id}`}
          className="inline-block bg-amber-400 text-black px-6 py-3 rounded-md font-semibold hover:bg-amber-500 hover:text-white transition"
        >
          Customize This Sign
        </Link>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  let product = null;
  try {
    const res = await fetch(`${base}/products/${params.id}`);
    if (res.ok) product = await res.json();
  } catch (err) {
    console.error('Failed to fetch product:', err);
  }
  return { props: { product } };
}
