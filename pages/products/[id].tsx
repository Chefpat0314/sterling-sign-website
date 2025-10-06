import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSlugFromSourceId } from '../../lib/catalog';

export default function ProductRedirectPage() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const slug = getSlugFromSourceId(id);
    if (slug) {
      // Redirect to the new slug-based URL
      router.replace(`/products/${slug}`, undefined, { statusCode: 301 });
    } else {
      // If no mapping found, redirect to products index
      router.replace('/products', undefined, { statusCode: 301 });
    }
  }, [id, router]);

  return null; // This component doesn't render anything
}
