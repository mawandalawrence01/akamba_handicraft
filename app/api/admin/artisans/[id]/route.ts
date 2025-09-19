import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request) // Ensure admin access

    const { id: artisanId } = await params

    const artisan = await prisma.artisan.findUnique({
      where: { id: artisanId },
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
            images: {
              where: { isPrimary: true },
              select: { url: true, altText: true },
              take: 1
            }
          },
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
    })

    if (!artisan) {
      return NextResponse.json(
        { error: 'Artisan not found' },
        { status: 404 }
      )
    }

    const totalProducts = artisan._count.products
    const totalRevenue = artisan.products.reduce((sum, product) => {
      return sum + (product.isActive ? Number(product.price) : 0)
    }, 0)

    const transformedArtisan = {
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
      products: artisan.products.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        isActive: product.isActive,
        image: product.images[0]?.url || null,
        imageAlt: product.images[0]?.altText || product.name
      }))
    }

    return NextResponse.json({ artisan: transformedArtisan })
  } catch (error: any) {
    console.error('Admin artisan fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch artisan' },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request) // Ensure admin access

    const { id: artisanId } = await params
    const body = await request.json()

    // Check if artisan exists
    const existingArtisan = await prisma.artisan.findUnique({
      where: { id: artisanId }
    })

    if (!existingArtisan) {
      return NextResponse.json(
        { error: 'Artisan not found' },
        { status: 404 }
      )
    }

    // Generate new slug if name changed
    let newSlug = undefined
    if (body.name && body.name !== existingArtisan.name) {
      const baseSlug = body.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      let slug = baseSlug
      let counter = 1

      while (await prisma.artisan.findFirst({
        where: {
          slug,
          id: { not: artisanId }
        }
      })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
      newSlug = slug
    }

    const updatedArtisan = await prisma.artisan.update({
      where: { id: artisanId },
      data: {
        ...body,
        ...(newSlug && { slug: newSlug }),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      message: 'Artisan updated successfully',
      artisan: updatedArtisan,
    })
  } catch (error: any) {
    console.error('Admin artisan update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update artisan' },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request) // Ensure admin access

    const { id: artisanId } = await params

    // Check if artisan exists
    const existingArtisan = await prisma.artisan.findUnique({
      where: { id: artisanId },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!existingArtisan) {
      return NextResponse.json(
        { error: 'Artisan not found' },
        { status: 404 }
      )
    }

    // Check if artisan has products
    if (existingArtisan._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete artisan with existing products. Please reassign or delete products first.' },
        { status: 400 }
      )
    }

    await prisma.artisan.delete({
      where: { id: artisanId },
    })

    return NextResponse.json({
      message: 'Artisan deleted successfully',
    })
  } catch (error: any) {
    console.error('Admin artisan deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete artisan' },
      { status: error.message.includes('Unauthorized') ? 401 : 500 }
    )
  }
}
