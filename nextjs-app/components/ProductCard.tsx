'use client'

import { Product } from '@/lib/api'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/productos/${product.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {product.featured_image && (
          <img
            src={product.featured_image}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.excerpt}</p>
          {product.precio && (
            <p className="text-2xl font-bold text-blue-600">${product.precio}</p>
          )}
          {product.disponibilidad && (
            <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
              product.disponibilidad === 'disponible' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.disponibilidad}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

