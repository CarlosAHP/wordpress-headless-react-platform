import { getProducts } from '@/lib/api'
import ProductGrid from '@/components/ProductGrid'
import Filters from '@/components/Filters'

export default async function Home() {
  const initialData = await getProducts()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Catálogo de Productos</h1>
      <Filters />
      <ProductGrid initialProducts={initialData.products} />
    </main>
  )
}

