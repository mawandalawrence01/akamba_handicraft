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
            imageUrl: true,
            city: true,
            country: true
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            images: {
              where: { isPrimary: true },
              select: { url: true, altText: true },
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
      avatar: review.user.imageUrl,
      productName: review.product.name,
      productImage: review.product.images[0]?.url,
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
