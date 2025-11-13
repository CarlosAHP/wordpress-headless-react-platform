const API_URL = process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json'

export interface Product {
  id: number
  title: string
  content: string
  excerpt: string
  slug: string
  precio: string
  disponibilidad: string
  sku: string
  featured_image: string
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
  date: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  pages: number
}

export interface ProductFilters {
  categoria?: string
  precio_min?: number
  precio_max?: number
  disponibilidad?: string
  page?: number
  per_page?: number
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams()
  
  if (filters.categoria) params.append('categoria', filters.categoria)
  if (filters.precio_min) params.append('precio_min', filters.precio_min.toString())
  if (filters.precio_max) params.append('precio_max', filters.precio_max.toString())
  if (filters.disponibilidad) params.append('disponibilidad', filters.disponibilidad)
  if (filters.page) params.append('page', filters.page.toString())
  if (filters.per_page) params.append('per_page', filters.per_page.toString())

  const url = `${API_URL}/catalog/v1/products?${params.toString()}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }

  return res.json()
}

export async function getProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/catalog/v1/product/${id}`, {
    next: { revalidate: 60 }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch product')
  }

  return res.json()
}

