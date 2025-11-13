'use client'

import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart()
  const total = getTotalPrice()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-4xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">
            Agrega algunos productos para comenzar a comprar
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Ver Productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Carrito de Compras</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 font-semibold"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6"
            >
              {item.featured_image ? (
                <img
                  src={item.featured_image}
                  alt={item.title}
                  className="w-full md:w-32 h-32 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full md:w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
              )}

              <div className="flex-1">
                <Link href={`/productos/${item.slug}`}>
                  <h3 className="text-xl font-semibold mb-2 hover:text-blue-600">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.excerpt}
                </p>
                <p className="text-2xl font-bold text-blue-600 mb-4">
                  ${item.precio}
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-4 py-1 border-x">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700 font-semibold"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">
                  ${(parseFloat(item.precio || '0') * item.quantity).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  ${item.precio} × {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Resumen</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className="font-semibold">Gratis</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors mb-4">
              Proceder al pago
            </button>

            <Link
              href="/"
              className="block text-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

