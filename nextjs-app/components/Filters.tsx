'use client'

import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

interface FiltersProps {
  onFilterChange?: (filters: {
    categoria?: string
    precio_min?: number
    precio_max?: number
    disponibilidad?: string
  }) => void
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const [categoria, setCategoria] = useState('')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [disponibilidad, setDisponibilidad] = useState('')

  const debouncedPrecioMin = useDebounce(precioMin, 500)
  const debouncedPrecioMax = useDebounce(precioMax, 500)

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        categoria: categoria || undefined,
        precio_min: debouncedPrecioMin ? parseFloat(debouncedPrecioMin) : undefined,
        precio_max: debouncedPrecioMax ? parseFloat(debouncedPrecioMax) : undefined,
        disponibilidad: disponibilidad || undefined
      })
    }
  }, [categoria, debouncedPrecioMin, debouncedPrecioMax, disponibilidad, onFilterChange])

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Filtros</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Categoría</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Buscar categoría"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Precio Mín</label>
          <input
            type="number"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Precio Máx</label>
          <input
            type="number"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            placeholder="9999"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Disponibilidad</label>
          <select
            value={disponibilidad}
            onChange={(e) => setDisponibilidad(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Todas</option>
            <option value="disponible">Disponible</option>
            <option value="agotado">Agotado</option>
          </select>
        </div>
      </div>
    </div>
  )
}

