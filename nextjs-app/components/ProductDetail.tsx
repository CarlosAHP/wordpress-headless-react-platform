'use client'

import { Product } from '@/lib/api'
import Link from 'next/link'

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Volver al catálogo
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {product.featured_image && (
            <div>
              <img
                src={product.featured_image}
                alt={product.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
            
            {product.precio && (
              <p className="text-3xl font-bold text-blue-600 mb-4">${product.precio}</p>
            )}
            
            {product.sku && (
              <p className="text-sm text-gray-600 mb-4">SKU: {product.sku}</p>
            )}
            
            {product.disponibilidad && (
              <span className={`inline-block mb-4 px-3 py-1 rounded ${
                product.disponibilidad === 'disponible' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.disponibilidad}
              </span>
            )}
            
            {product.categories && product.categories.length > 0 && (
              <div className="mb-4">
                <span className="text-sm font-medium">Categorías: </span>
                {product.categories.map((cat, idx) => (
                  <span key={cat.id} className="text-sm text-gray-600">
                    {cat.name}{idx < product.categories.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            )}
            
            <div 
              className="prose max-w-none mt-6"
              dangerouslySetInnerHTML={{ __html: product.content }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

