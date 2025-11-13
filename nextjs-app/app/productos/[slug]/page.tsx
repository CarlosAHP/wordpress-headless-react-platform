import { getProducts } from '@/lib/api'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/ProductDetail'
import Script from 'next/script'

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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return {
    title: product.title,
    description: product.excerpt,
    openGraph: {
      title: product.title,
      description: product.excerpt,
      images: product.featured_image ? [product.featured_image] : [],
      url: `${baseUrl}/productos/${product.slug}`,
    },
    other: {
      'product:price:amount': product.precio || '0',
      'product:availability': product.disponibilidad === 'disponible' ? 'in stock' : 'out of stock',
    },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const data = await getProducts({ per_page: 100 })
  const product = data.products.find(p => p.slug === params.slug)

  if (!product) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.excerpt,
    image: product.featured_image,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.precio || '0',
      priceCurrency: 'USD',
      availability: product.disponibilidad === 'disponible' 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/productos/${product.slug}`
    }
  }

  return (
    <>
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProductDetail product={product} />
    </>
  )
}

