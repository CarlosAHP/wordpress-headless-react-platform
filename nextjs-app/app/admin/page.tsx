'use client'

import { useState } from 'react'
import { Product } from '@/lib/api'

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    precio: '',
    disponibilidad: 'disponible',
    sku: ''
  })

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        setFormData({
          title: '',
          content: '',
          excerpt: '',
          precio: '',
          disponibilidad: 'disponible',
          sku: ''
        })
        fetchProducts()
      }
    } catch (error) {
      console.error('Error creating product:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Crear Producto</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Título"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <textarea
              placeholder="Contenido"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              rows={4}
            />
            <textarea
              placeholder="Resumen"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              rows={2}
            />
            <input
              type="number"
              placeholder="Precio"
              value={formData.precio}
              onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="SKU"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
            <select
              value={formData.disponibilidad}
              onChange={(e) => setFormData({ ...formData, disponibilidad: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="disponible">Disponible</option>
              <option value="agotado">Agotado</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Crear Producto'}
            </button>
          </form>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Productos</h2>
            <button
              onClick={fetchProducts}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Actualizar
            </button>
          </div>
          <div className="space-y-2">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-sm text-gray-600">SKU: {product.sku || 'N/A'}</p>
                <p className="text-sm">Precio: ${product.precio || '0'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

