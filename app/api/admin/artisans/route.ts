import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request) // Ensure admin access

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    const skip = (page - 1) * limit

    const whereClause: any = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { bio: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(status !== 'all' && { isActive: status === 'active' }),
    }

    const [artisans, totalArtisans] = await prisma.$transaction([
      prisma.artisan.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          slug: true,
          bio: true,
          location: true,
          image: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          products: {
            select: {
              id: true,
              name: true,
              price: true,
              isActive: true,
            },
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.artisan.count({ where: whereClause }),
    ])

    const transformedArtisans = artisans.map((artisan) => {
      const totalProducts = artisan._count.products
      const totalRevenue = artisan.products.reduce((sum, product) => {
        return sum + (product.isActive ? Number(product.price) : 0)
      }, 0)

      return {
        id: artisan.id,
        name: artisan.name,
        slug: artisan.slug,
        bio: artisan.bio,
        location: artisan.location,
        image: artisan.image,
        status: artisan.isActive ? 'active' : 'inactive',
        totalProducts,
        totalRevenue,
        joinDate: artisan.createdAt.toISOString(),
        lastUpdated: artisan.updatedAt.toISOString(),
      }
    })

    return NextResponse.json({
      artisans: transformedArtisans,
      pagination: {
        page,
        limit,
        total: totalArtisans,
        pages: Math.ceil(totalArtisans / limit),
      },
    })
  } catch (error: any) {
    console.error('Admin artisans fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch artisans' },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request) // Ensure admin access

    const body = await request.json()
    const { name, bio, location, image, isActive = true } = body

    // Generate slug from name
    const baseSlug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    let slug = baseSlug
    let counter = 1

    // Ensure unique slug
    while (await prisma.artisan.findFirst({
      where: { slug }
    })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const artisan = await prisma.artisan.create({
      data: {
        name,
        slug,
        bio,
        location,
        image,
        isActive,
      },
    })

    return NextResponse.json({
      message: 'Artisan created successfully',
      artisan,
    })
  } catch (error: any) {
    console.error('Admin artisan creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create artisan' },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    )
  }
}