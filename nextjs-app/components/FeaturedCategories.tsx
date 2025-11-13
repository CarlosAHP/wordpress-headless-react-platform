'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  count: number
}

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/wp-json/wp/v2/product-categories?per_page=6`
        )
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Cargando categorías...</div>
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-center">Categorías Destacadas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/?categoria=${category.slug}`}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-xl font-bold mb-2">{category.name}</h3>
            {category.description && (
              <p className="text-gray-600 text-sm mb-3">{category.description}</p>
            )}
            <p className="text-blue-600 font-semibold">
              {category.count} {category.count === 1 ? 'producto' : 'productos'}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

