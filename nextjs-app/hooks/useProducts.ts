import { useState, useEffect, useCallback } from 'react'
import { getProducts, ProductFilters, ProductsResponse } from '@/lib/api'

export function useProducts(initialFilters: ProductFilters = {}) {
  const [data, setData] = useState<ProductsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>(initialFilters)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getProducts(filters)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  return {
    products: data?.products || [],
    total: data?.total || 0,
    pages: data?.pages || 0,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchProducts
  }
}

