import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '6')
    const featured = searchParams.get('featured') === 'true'

    // Get reviews that can be used as testimonials
    const reviews = await prisma.review.findMany({
      where: {
        isActive: true,
        isVerified: true, // Only verified purchase reviews
        rating: { gte: 4 } // Only 4+ star reviews
      },
      select: {
        id: true,
        rating: true,
        title: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
            city: true,
            country: true,
            cloudinaryId: true,
            cloudinaryUrl: true,
            imageWidth: true,
            imageHeight: true,
            imageFormat: true,
            imageFileSize: true,
            isCloudinary: true
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            images: {
              where: { isPrimary: true },
              select: { 
                url: true, 
                altText: true,
                cloudinaryId: true,
                cloudinaryUrl: true,
                width: true,
                height: true,
                format: true,
                fileSize: true,
                isCloudinary: true
              },
              take: 1
            }
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    })

    // Transform the data for testimonials
    const testimonials = reviews.map(review => ({
      id: review.id,
      name: `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || 'Anonymous',
      location: [review.user.city, review.user.country].filter(Boolean).join(', ') || 'Kenya',
      rating: review.rating,
      content: review.content,
      title: review.title,
      avatar: review.user.isCloudinary && review.user.cloudinaryUrl ? review.user.cloudinaryUrl : review.user.image,
      productName: review.product.name,
      productImage: review.product.images[0] ? 
        (review.product.images[0].isCloudinary && review.product.images[0].cloudinaryUrl ? 
          review.product.images[0].cloudinaryUrl : 
          review.product.images[0].url) : 
        null,
      date: review.createdAt,
      verified: true
    }))

    return NextResponse.json({ 
      testimonials,
      total: testimonials.length
    })

  } catch (error) {
    console.error('Testimonials fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}
