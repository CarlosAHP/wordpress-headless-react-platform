import { getProducts } from '@/lib/api'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/ProductDetail'

export async function generateStaticParams() {
  const data = await getProducts({ per_page: 100 })
  return data.products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getProducts({ per_page: 100 })
  const product = data.products.find(p => p.slug === params.slug)

  if (!product) {
    return {
      title: 'Producto no encontrado'
    }
  }

  return {
    title: product.title,
    description: product.excerpt,
    openGraph: {
      title: product.title,
      description: product.excerpt,
      images: product.featured_image ? [product.featured_image] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const data = await getProducts({ per_page: 100 })
  const product = data.products.find(p => p.slug === params.slug)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}

