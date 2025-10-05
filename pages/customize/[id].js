import { useState } from 'react';
import Layout from '../../components/Layout';

export default function CustomizePage({ product }) {
  const [text, setText] = useState('Your Text Here');
  const [color, setColor] = useState('#000000');

  if (!product) {
    return (
      <Layout title="Customize – Not Found">
        <h1>Product not found</h1>
      </Layout>
    );
  }
  return (
    <Layout title={`Customize ${product.name}`}>
      <h1>Customize {product.name}</h1>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <label>
            Text:
            <input value={text} onChange={(e) => setText(e.target.value)} style={{ display: 'block', marginTop: '0.5rem' }} />
          </label>
          <label style={{ display: 'block', marginTop: '1rem' }}>
            Color:
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ marginLeft: '0.5rem' }} />
          </label>
          <p style={{ marginTop: '1rem' }}>
            <em>In a full implementation this page would integrate an HTML5 canvas library such as Fabric.js
            to allow drag‑and‑drop editing of text, shapes and images.  The current version simply
            demonstrates how you might bind form inputs to a live preview.</em>
          </p>
        </div>
        <div>
          <div style={{ width: 400, height: 200, border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f7' }}>
            <span style={{ color, fontSize: '2rem', fontWeight: 'bold' }}>{text}</span>
          </div>
          <button disabled style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Add to Cart (not implemented)</button>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  let product = null;
  try {
    const res = await fetch(`${base}/products/${id}`);
    if (res.ok) product = await res.json();
  } catch (err) {
    console.error('Failed to fetch product:', err);
  }
  return { props: { product } };
}