import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Configurator from '../../components/configurator/Configurator';

// Works whether BannerConfigurator is .jsx or .tsx
const BannerConfigurator = dynamic(
  async () => {
    const m = await import('../../components/configurator/BannerConfigurator');
    return m.default || m;
  },
  { ssr: false }
);

export default function ProductConfiguratorPage() {
  const router = useRouter();
  const slug = router.query.slug;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch('/api/pricing');
        const data = await res.json();
        setProduct(data && data.products ? (data.products[slug] || null) : null);
      } catch (err) {
        console.error(err);
        setProduct(null);
      }
    })();
  }, [slug]);

  if (!slug) return null;
  if (!product) return <div className="max-w-3xl mx-auto py-12">Loading...</div>;

  if (slug === 'banners_13oz') {
    return <BannerConfigurator product={product} />;
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <Configurator product={product} />
    </div>
  );
}
