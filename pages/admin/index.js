import Layout from '../../components/Layout';

export default function AdminDashboard({ products, rfqs }) {
  return (
    <Layout title="Admin Dashboard">
      <h1>Admin Dashboard</h1>
      <section style={{ marginBottom: '2rem' }}>
        <h2>Products</h2>
        {products.length === 0 && <p>No products found.</p>}
        <ul>
          {products.map((p) => (
            <li key={p.id}>{p.name} – ${p.base_price.toFixed(2)}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>RFQs</h2>
        {rfqs.length === 0 && <p>No RFQs submitted.</p>}
        <ul>
          {rfqs.map((r) => (
            <li key={r.id}>
              <strong>{r.project_title}</strong> ({r.company || 'Individual'}) – {r.status}
              {r.file_url && (
                <span>
                  {' '}- <a href={r.file_url} target="_blank" rel="noopener noreferrer">file</a>
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  let products = [];
  let rfqs = [];
  try {
    const [prodRes, rfqRes] = await Promise.all([
      fetch(`${base}/products`),
      fetch(`${base}/rfqs`),
    ]);
    if (prodRes.ok) products = await prodRes.json();
    if (rfqRes.ok) rfqs = await rfqRes.json();
  } catch (err) {
    console.error('Failed to fetch admin data:', err);
  }
  return { props: { products, rfqs } };
}