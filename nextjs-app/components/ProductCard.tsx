'use client'

import { Product } from '@/lib/api'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const isInCart = items.some(item => item.id === product.id)
  const isAvailable = product.disponibilidad === 'disponible'

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAvailable) return
    
    setIsAdding(true)
    addToCart(product)
    setTimeout(() => setIsAdding(false), 300)
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link href={`/productos/${product.slug}`}>
        <div className="relative">
          {product.featured_image ? (
            <img
              src={product.featured_image}
              alt={product.title}
              className="w-full h-56 object-cover"
            />
          ) : (
            <div className="w-full h-56 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <span className="text-6xl">📦</span>
            </div>
          )}
          {!isAvailable && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Agotado
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-5">
        <Link href={`/productos/${product.slug}`}>
          <h3 className="text-xl font-bold mb-2 text-gray-800 hover:text-blue-600 transition-colors line-clamp-1">
            {product.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
            {product.excerpt}
          </p>
        </Link>
        
        <div className="flex items-center justify-between mb-4">
          {product.precio ? (
            <div>
              {(product as any).descuento && parseFloat((product as any).descuento) > 0 ? (
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-blue-600">
                      ${(product as any).precio_final || product.precio}
                    </p>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      -{(product as any).descuento}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 line-through">${product.precio}</p>
                </div>
              ) : (
                <p className="text-3xl font-bold text-blue-600">${product.precio}</p>
              )}
              {product.sku && (
                <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-400">Precio no disponible</p>
          )}
        </div>

        {product.categories && product.categories.length > 0 && (
          <div className="mb-4">
            <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
              {product.categories[0].name}
            </span>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!isAvailable || isAdding}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            isAvailable
              ? isInCart
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } ${isAdding ? 'animate-pulse' : ''}`}
        >
          {isAdding ? (
            'Agregando...'
          ) : isInCart ? (
            '✓ En el carrito'
          ) : isAvailable ? (
            '🛒 Agregar al carrito'
          ) : (
            'No disponible'
          )}
        </button>
      </div>
    </div>
  )
}


