import Link from 'next/link'

export default function ProductCard({ product }) {
  return (
    <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl group hover:scale-[1.03] transition-transform duration-300">
      <picture className="absolute inset-0 w-full h-full z-0">
        <source srcSet={product.imageUrl.replace('.png','.webp')} type="image/webp" />
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </picture>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6 text-white z-10">
        <h3 className="text-2xl font-semibold drop-shadow-md mb-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm drop-shadow-md mb-4">
            {product.description.length > 100
              ? product.description.slice(0,100) + '…'
              : product.description}
          </p>
        )}
        {product.price && (
          <p className="font-bold mb-4 drop-shadow-sm">
            From ${product.price.toFixed(2)}
          </p>
        )}
        <Link
          href={`/products/${product.id}?source=product_card_${product.id}`}
          className="inline-block bg-amber-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-500 hover:text-white hover:scale-105 transition duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}