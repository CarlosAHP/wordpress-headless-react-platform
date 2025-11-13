'use client'

import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

export default function Navigation() {
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            🛍️ Catálogo
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Productos
            </Link>
            <Link 
              href="/carrito" 
              className="relative text-gray-700 hover:text-blue-600 transition-colors"
            >
              🛒 Carrito
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

