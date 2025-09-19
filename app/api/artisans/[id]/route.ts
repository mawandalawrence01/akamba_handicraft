import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: artisanId } = await params

    const artisan = await prisma.artisan.findFirst({
      where: {
        OR: [
          { id: artisanId },
          { slug: artisanId }
        ],
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        bio: true,
        location: true,
        image: true,
        experience: true,
        createdAt: true,
        products: {
          where: { isActive: true },
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
          orderBy: { createdAt: 'desc' },
          take: 6
        },
        _count: {
          select: {
            products: {
              where: { isActive: true }
            }
          }
        }
      }
    })

    if (!artisan) {
      return NextResponse.json(
        { error: 'Artisan not found' },
        { status: 404 }
      )
    }

    // Calculate experience years (mock calculation based on join date)
    const joinYear = new Date(artisan.createdAt).getFullYear()
    const currentYear = new Date().getFullYear()
    const experience = Math.max(1, currentYear - joinYear)

    // Mock rating and review count (you can implement real ratings later)
    const rating = 4.5 + Math.random() * 0.5 // 4.5-5.0
    const reviewCount = Math.floor(Math.random() * 50) + 10 // 10-60

    // Transform the data to match the frontend expectations
    const transformedArtisan = {
      id: artisan.id,
      name: artisan.name,
      slug: artisan.slug,
      bio: artisan.bio,
      location: artisan.location,
      image: artisan.image,
      experience,
      rating: parseFloat(rating.toFixed(1)),
      reviewCount,
      productCount: artisan._count.products,
      recentWork: artisan.products.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images[0]?.url || null,
        imageAlt: product.images[0]?.altText || product.name
      })),
      joinDate: joinYear.toString(),
      specialties: generateSpecialties(artisan.name, artisan._count.products) // Mock specialties
    }

    return NextResponse.json({
      artisan: transformedArtisan
    })

  } catch (error) {
    console.error('Artisan fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artisan' },
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
