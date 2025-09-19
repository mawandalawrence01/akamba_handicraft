import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const category = searchParams.get('category')
    
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(featured === 'true' && { isFeatured: true }),
        ...(category && { categoryId: category })
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        compareAtPrice: true,
        isFeatured: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        artisan: {
          select: {
            id: true,
            name: true
          }
        },
        images: {
          where: {
            isPrimary: true
          },
          select: {
            id: true,
            url: true,
            altText: true,
            isPrimary: true
          },
          take: 1
        },
        _count: {
          select: {
            reviews: true,
            likes: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      ...(limit && { take: parseInt(limit) })
    })

    // Transform the data to match the frontend expectations
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      stockQuantity: 1, // Default stock quantity
      isActive: true, // All products from API are active
      isFeatured: product.isFeatured,
      inStock: true, // Default to in stock
      viewCount: 0, // Default view count
      likeCount: product._count.likes,
      createdAt: product.createdAt,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug
      },
      artisan: product.artisan ? {
        id: product.artisan.id,
        name: product.artisan.name
      } : undefined,
      images: product.images.length > 0 ? product.images.map(img => ({
        id: img.id,
        url: img.url,
        isPrimary: img.isPrimary,
        altText: img.altText
      })) : [{
        id: 'no-image',
        url: '/placeholder-product.jpg',
        isPrimary: true,
        altText: product.name
      }]
    }))

    return NextResponse.json({ 
      products: transformedProducts,
      total: transformedProducts.length
    })

  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}