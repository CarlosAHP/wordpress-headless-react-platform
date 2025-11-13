import { getProducts } from '@/lib/api'
import ProductGrid from '@/components/ProductGrid'
import Filters from '@/components/Filters'
import Hero from '@/components/Hero'
import FeaturedCategories from '@/components/FeaturedCategories'
import FeaturedProducts from '@/components/FeaturedProducts'

export default async function Home() {
  let initialData
  let error = null

  try {
    initialData = await getProducts({ per_page: 12 })
  } catch (err) {
    error = err instanceof Error ? err.message : 'Error desconocido'
    initialData = { products: [], total: 0, pages: 0 }
  }

  // Obtener productos destacados
  let featuredProducts = []
  try {
    const featuredResponse = await fetch(
      `${process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json'}/catalog/v1/products?destacados=true&per_page=6`,
      { next: { revalidate: 3600 } }
    )
    if (featuredResponse.ok) {
      const featuredData = await featuredResponse.json()
      featuredProducts = featuredData.products || []
    }
  } catch (err) {
    console.error('Error fetching featured products:', err)
  }

  return (
    <main>
      <Hero />
      
      <div className="container mx-auto px-4 py-12">
        <FeaturedCategories />
        
        {featuredProducts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">⭐ Productos Destacados</h2>
            <FeaturedProducts products={featuredProducts} />
          </section>
        )}

        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Todos los Productos</h2>
          </div>
          
          {error && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Advertencia:</strong> No se pudo conectar con WordPress.
                    {error.includes('fetch') && (
                      <>
                        <br />
                        Asegúrate de que WordPress esté configurado en{' '}
                        <a href="http://localhost:8080" className="underline" target="_blank" rel="noopener">
                          http://localhost:8080
                        </a>
                        {' '}y que el plugin "Catalog API" esté activado.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Filters />
          
          {initialData.products.length > 0 ? (
            <>
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                  Mostrando <span className="font-semibold">{initialData.products.length}</span> de{' '}
                  <span className="font-semibold">{initialData.total}</span> productos
                </p>
              </div>
              <ProductGrid initialProducts={initialData.products} />
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-600 mb-4 text-lg">
                {error ? 'No hay productos disponibles debido a un error de conexión.' : 'No hay productos disponibles.'}
              </p>
              <p className="text-sm text-gray-500">
                Crea productos en WordPress Admin para verlos aquí.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
