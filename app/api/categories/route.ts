import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        ...(featured === 'true' && { sortOrder: { gte: 0 } }) // Featured categories have sortOrder >= 0
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        parentId: true,
        sortOrder: true,
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
        { sortOrder: 'asc' },
        { name: 'asc' }
      ],
      ...(limit && { take: parseInt(limit) })
    })

    // Transform the data to match the frontend expectations
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      productCount: category._count.products,
      featured: category.sortOrder >= 0, // Consider categories with sortOrder >= 0 as featured
      parentId: category.parentId
    }))

    return NextResponse.json({ 
      categories: transformedCategories,
      total: transformedCategories.length
    })

  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}