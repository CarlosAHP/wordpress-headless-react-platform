import { NextRequest, NextResponse } from 'next/server'

const WORDPRESS_API = process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const url = new URL(`${WORDPRESS_API}/catalog/v1/products`)
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value)
    })

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 }
    })

    if (!res.ok) {
      throw new Error('Failed to fetch products')
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const res = await fetch(`${WORDPRESS_API}/catalog/v1/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      throw new Error('Failed to create product')
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating product' },
      { status: 500 }
    )
  }
}

