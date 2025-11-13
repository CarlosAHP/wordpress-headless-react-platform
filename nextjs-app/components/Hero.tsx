'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Bienvenido a nuestro Catálogo
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Descubre productos increíbles con las mejores ofertas
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="#productos"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Ver Productos
            </Link>
            <Link
              href="/carrito"
              className="bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors border-2 border-white"
            >
              Mi Carrito
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

