import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Catálogo Inteligente',
  description: 'Plataforma de catálogo de productos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Navigation />
          {children}
        </CartProvider>
      </body>
    </html>
  )
}

