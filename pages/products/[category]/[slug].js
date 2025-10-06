import React from 'react';
import { CatalogItem } from '../../../lib/catalog';
import { getCatalogBySlug } from '../../../lib/catalog';
import PDPLayout from '../../../components/pdp/PDPLayout';

export default function ProductDetailPage({ product, category }) {
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            We couldn't find the product you're looking for. Browse our available options below.
          </p>
          <a
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All Products
          </a>
        </div>
      </div>
    );
  }

  return <PDPLayout product={product} category={category} />;
}

export async function getStaticPaths() {
  const allProducts = getAllCatalog();
  
  const paths = allProducts.map((product) => {
    const category = product.category.toLowerCase().replace(/\s+/g, '-');
    return {
      params: {
        category,
        slug: product.slug
      }
    };
  });

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { category, slug } = params;
  
  const product = getCatalogBySlug(slug);
  
  if (!product) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      product,
      category
    }
  };
}
