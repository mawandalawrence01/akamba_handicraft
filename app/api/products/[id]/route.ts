import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    
    // Try to find product by ID first, then by slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ],
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        shortDescription: true,
        price: true,
        compareAtPrice: true,
        weight: true,
        dimensions: true,
        materials: true,
        colors: true,
        isHandmade: true,
        isFeatured: true,
        inStock: true,
        stockQuantity: true,
        minOrderQty: true,
        maxOrderQty: true,
        tags: true,
        metaTitle: true,
        metaDescription: true,
        viewCount: true,
        likeCount: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true
          }
        },
        artisan: {
          select: {
            id: true,
            name: true,
            slug: true,
            bio: true,
            image: true,
            location: true,
            experience: true,
            specialties: true,
            isVerified: true
          }
        },
        images: {
          select: {
            id: true,
            url: true,
            altText: true,
            sortOrder: true,
            is360View: true,
            isPrimary: true,
            cloudinaryId: true,
            cloudinaryUrl: true,
            width: true,
            height: true,
            format: true,
            fileSize: true,
            isCloudinary: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        },
        videos: {
          select: {
            id: true,
            url: true,
            title: true,
            description: true,
            duration: true,
            sortOrder: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        },
        reviews: {
          where: {
            isActive: true
          },
          select: {
            id: true,
            rating: true,
            title: true,
            content: true,
            isVerified: true,
            helpfulCount: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        _count: {
          select: {
            reviews: true,
            likes: true,
            comments: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const averageRating = product.reviews.length > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

    // Transform the data to match frontend expectations
    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      price: Number(product.price),
      originalPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      weight: product.weight ? Number(product.weight) : null,
      dimensions: product.dimensions,
      materials: product.materials,
      colors: product.colors,
      isHandmade: product.isHandmade,
      isFeatured: product.isFeatured,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      minOrderQty: product.minOrderQty,
      maxOrderQty: product.maxOrderQty,
      tags: product.tags,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      viewCount: product.viewCount,
      likeCount: product.likeCount,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      rating: parseFloat(averageRating.toFixed(1)),
      reviewCount: product._count.reviews,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        description: product.category.description
      },
      artisan: product.artisan ? {
        id: product.artisan.id,
        name: product.artisan.name,
        slug: product.artisan.slug,
        bio: product.artisan.bio,
        image: product.artisan.image,
        location: product.artisan.location,
        experience: product.artisan.experience,
        specialties: product.artisan.specialties,
        isVerified: product.artisan.isVerified
      } : null,
      images: product.images.length > 0 ? product.images.map(img => ({
        id: img.id,
        url: img.isCloudinary && img.cloudinaryUrl ? img.cloudinaryUrl : img.url,
        altText: img.altText,
        sortOrder: img.sortOrder,
        is360View: img.is360View,
        isPrimary: img.isPrimary,
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
        altText: product.name,
        sortOrder: 0,
        is360View: false,
        isPrimary: true,
        cloudinaryId: null,
        cloudinaryUrl: null,
        width: null,
        height: null,
        format: null,
        fileSize: null,
        isCloudinary: false
      }],
      videos: product.videos.map(video => ({
        id: video.id,
        url: video.url,
        title: video.title,
        description: video.description,
        duration: video.duration,
        sortOrder: video.sortOrder
      })),
      reviews: product.reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        isVerified: review.isVerified,
        helpfulCount: review.helpfulCount,
        createdAt: review.createdAt,
        user: {
          id: review.user.id,
          name: review.user.name || `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || 'Anonymous',
          image: review.user.image
        }
      })),
      // Additional computed fields for frontend
      longDescription: product.description, // Use main description as long description
      features: [
        product.isHandmade ? 'Handcrafted by skilled artisans' : null,
        'Authentic African craftsmanship',
        'Premium quality materials',
        'Cultural authenticity certificate',
        'Sustainable sourcing'
      ].filter(Boolean),
      shipping: {
        local: 'Free shipping within Kenya',
        international: 'Ships worldwide - calculated at checkout'
      }
    }

    // Increment view count
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } }
    })

    return NextResponse.json(transformedProduct)

  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
