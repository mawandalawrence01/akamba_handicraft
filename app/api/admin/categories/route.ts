import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminActivity } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        parentId: true,
        isActive: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
        parent: {
          select: {
            id: true,
            name: true
          }
        },
        children: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json({ categories })

  } catch (error) {
    console.error('Admin categories fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    const body = await request.json()
    
    const {
      name,
      description,
      image,
      parentId,
      sortOrder
    } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: 'Name is required'
        },
        { status: 400 }
      )
    }

    // Generate slug
    const baseSlug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    let slug = baseSlug
    let counter = 1
    
    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Validate parent category exists if provided
    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId }
      })
      
      if (!parentCategory) {
        return NextResponse.json(
          { 
            error: 'Invalid parent category',
            details: 'The selected parent category does not exist.'
          },
          { status: 400 }
        )
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        parentId: parentId || null,
        sortOrder: sortOrder || 0,
        isActive: true
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true
          }
        },
        children: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    // Log admin activity
    await logAdminActivity(
      admin.id,
      'CATEGORY_CREATE',
      `Created category: ${category.name}`,
      { categoryId: category.id, categoryName: category.name },
      request
    )

    return NextResponse.json({ 
      success: true, 
      category 
    })

  } catch (error) {
    console.error('Admin category creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}