import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const category = searchParams.get('category')
    
    // Build where clause
    const whereClause: any = {
      isActive: true,
      ...(featured === 'true' && { isFeatured: true })
    }

    // Handle category filtering - can be either category ID or slug
    if (category) {
      // First check if it's a slug by trying to find a category with that slug
      const categoryRecord = await prisma.category.findUnique({
        where: { slug: category }
      })
      
      if (categoryRecord) {
        whereClause.categoryId = categoryRecord.id
      } else {
        // If not found by slug, assume it's an ID
        whereClause.categoryId = category
      }
    }
    
    const products = await prisma.product.findMany({
      where: whereClause,
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
            name: true,
            location: true
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
            isPrimary: true,
            cloudinaryId: true,
            cloudinaryUrl: true,
            width: true,
            height: true,
            format: true,
            fileSize: true,
            isCloudinary: true
          },
          take: 1
        },
        _count: {
          select: {
            reviews: true,
            likes: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        },
        stockQuantity: true
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      ...(limit && { take: parseInt(limit) })
    })

    // Transform the data to match the frontend expectations
    const transformedProducts = products.map(product => {
      // Calculate average rating
      const avgRating = product.reviews.length > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        stockQuantity: product.stockQuantity || 1,
        isActive: true, // All products from API are active
        isFeatured: product.isFeatured,
        inStock: (product.stockQuantity || 1) > 0,
        viewCount: 0, // Default view count
        likeCount: product._count.likes,
        rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
        reviewCount: product._count.reviews,
        stock: product.stockQuantity || 1,
        createdAt: product.createdAt,
        category: {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug
        },
        artisan: product.artisan ? {
          id: product.artisan.id,
          name: product.artisan.name,
          location: product.artisan.location || 'Unknown'
        } : undefined,
      images: product.images.length > 0 ? product.images.map(img => ({
        id: img.id,
        url: img.isCloudinary && img.cloudinaryUrl ? img.cloudinaryUrl : img.url,
        isPrimary: img.isPrimary,
        altText: img.altText,
        cloudinaryId: img.cloudinaryId,
        cloudinaryUrl: img.cloudinaryUrl,
        width: img.width,
        height: img.height,
        format: img.format,
        fileSize: img.fileSize,
        isCloudinary: img.isCloudinary
      })) : [{
        id: 'no-image',
        url: '/placeholder-product.svg',
        isPrimary: true,
        altText: product.name,
        cloudinaryId: null,
        cloudinaryUrl: null,
        width: null,
        height: null,
        format: null,
        fileSize: null,
        isCloudinary: false
      }]
      }
    })

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