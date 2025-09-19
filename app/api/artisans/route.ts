import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const search = searchParams.get('search') || ''
    
    const whereClause: any = {
      isActive: true,
      // Note: isFeatured field doesn't exist in Artisan model, so we'll skip featured filtering for now
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { bio: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
        ],
      }),
    }

    const artisans = await prisma.artisan.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        slug: true,
        bio: true,
        location: true,
        image: true,
        createdAt: true,
        products: {
          where: {
            isActive: true
          },
          select: {
            id: true,
            name: true,
            price: true,
            images: {
              where: { isPrimary: true },
              select: { url: true, altText: true },
              take: 1
            }
          },
          take: 3,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            products: {
              where: {
                isActive: true
              }
            }
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ],
      ...(limit && { take: parseInt(limit) })
    })

    // Transform the data to match the frontend expectations
    const transformedArtisans = artisans.map(artisan => {
      const totalProducts = artisan._count.products
      const recentWork = artisan.products.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images[0]?.url || null,
        imageAlt: product.images[0]?.altText || product.name
      }))

      // Calculate experience years (mock calculation based on join date)
      const joinYear = new Date(artisan.createdAt).getFullYear()
      const currentYear = new Date().getFullYear()
      const experience = Math.max(1, currentYear - joinYear)

      // Mock rating and review count (you can implement real ratings later)
      const rating = 4.5 + Math.random() * 0.5 // 4.5-5.0
      const reviewCount = Math.floor(Math.random() * 50) + 10 // 10-60

      return {
        id: artisan.id,
        name: artisan.name,
        slug: artisan.slug,
        bio: artisan.bio,
        location: artisan.location,
        image: artisan.image,
        isFeatured: false, // Default to false since field doesn't exist in schema
        experience,
        rating: parseFloat(rating.toFixed(1)),
        reviewCount,
        productCount: totalProducts,
        recentWork,
        joinDate: joinYear.toString(),
        specialties: generateSpecialties(artisan.name, totalProducts) // Mock specialties
      }
    })

    return NextResponse.json({
      artisans: transformedArtisans,
      total: transformedArtisans.length
    })

  } catch (error) {
    console.error('Artisans fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artisans' },
      { status: 500 }
    )
  }
}

// Helper function to generate mock specialties based on artisan name and products
function generateSpecialties(name: string, productCount: number): string[] {
  const specialtiesMap: { [key: string]: string[] } = {
    'john': ['Wildlife Sculptures', 'Elephant Carvings', 'Abstract Art'],
    'mary': ['Traditional Masks', 'Ceremonial Art', 'Cultural Pieces'],
    'peter': ['Functional Art', 'Wooden Bowls', 'Kitchen Utensils'],
    'grace': ['Animal Sculptures', 'Miniature Art', 'Gift Items'],
    'samuel': ['Warrior Masks', 'Historical Pieces', 'Cultural Artifacts'],
    'elizabeth': ['Furniture', 'Home Décor', 'Modern Designs'],
    'david': ['Pottery', 'Jewelry', 'Traditional Crafts']
  }

  const nameLower = name.toLowerCase()
  for (const [key, specialties] of Object.entries(specialtiesMap)) {
    if (nameLower.includes(key)) {
      return specialties.slice(0, Math.min(3, Math.ceil(productCount / 5) + 1))
    }
  }

  // Default specialties
  return ['Traditional Crafts', 'Handmade Art', 'Cultural Artifacts']
}
