'use client'

import { Product } from '@/lib/api'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart, items, updateQuantity } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const isInCart = items.some(item => item.id === product.id)
  const cartItem = items.find(item => item.id === product.id)
  const isAvailable = product.disponibilidad === 'disponible'

  const handleAddToCart = () => {
    if (!isAvailable) return
    
    setIsAdding(true)
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setTimeout(() => setIsAdding(false), 300)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block font-semibold">
        ← Volver al catálogo
      </Link>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div>
            {product.featured_image ? (
              <img
                src={product.featured_image}
                alt={product.title}
                className="w-full h-auto rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-9xl">📦</span>
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.title}</h1>
            
            {product.precio && (
              <p className="text-4xl font-bold text-blue-600 mb-4">${product.precio}</p>
            )}
            
            <div className="flex items-center gap-4 mb-6">
              {product.sku && (
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                  SKU: {product.sku}
                </span>
              )}
              {product.disponibilidad && (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  product.disponibilidad === 'disponible' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.disponibilidad === 'disponible' ? '✓ Disponible' : '✗ Agotado'}
                </span>
              )}
            </div>
            
            {product.categories && product.categories.length > 0 && (
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-700">Categorías: </span>
                {product.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="inline-block bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full mr-2"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {isAvailable && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium mb-2">Cantidad</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 font-bold"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 border-x-2 border-gray-300 font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isInCart && cartItem && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ Este producto está en tu carrito ({cartItem.quantity} {cartItem.quantity === 1 ? 'unidad' : 'unidades'})
                </p>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!isAvailable || isAdding}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 ${
                isAvailable
                  ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } ${isAdding ? 'animate-pulse' : ''}`}
            >
              {isAdding ? (
                'Agregando...'
              ) : isAvailable ? (
                `🛒 Agregar ${quantity} al carrito`
              ) : (
                'Producto no disponible'
              )}
            </button>
            
            <div 
              className="prose max-w-none mt-8 pt-8 border-t"
              dangerouslySetInnerHTML={{ __html: product.content }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


