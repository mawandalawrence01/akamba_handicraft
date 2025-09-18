import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminActivity } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }
    
    if (status !== 'all') {
      switch (status) {
        case 'active':
          where.isActive = true
          break
        case 'inactive':
          where.isActive = false
          break
        case 'featured':
          where.isFeatured = true
          break
        case 'out-of-stock':
          where.inStock = false
          break
      }
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true } },
          artisan: { select: { name: true } },
          images: {
            select: { id: true, url: true, isPrimary: true },
            orderBy: { sortOrder: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      products,
      totalPages,
      currentPage: page,
      totalCount
    })

  } catch (error) {
    console.error('Admin products fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
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
      shortDescription,
      price,
      compareAtPrice,
      costPrice,
      weight,
      dimensions,
      materials,
      colors,
      stockQuantity,
      minOrderQty,
      maxOrderQty,
      tags,
      metaTitle,
      metaDescription,
      categoryId,
      artisanId,
      isFeatured,
      isActive,
      images,
      videos
    } = body

    // Validate required fields
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: 'Name, description, price, and category are required'
        },
        { status: 400 }
      )
    }

    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })
    
    if (!category) {
      return NextResponse.json(
        { 
          error: 'Invalid category',
          details: 'The selected category does not exist. Please select a valid category.'
        },
        { status: 400 }
      )
    }

    // Validate artisan exists if provided
    if (artisanId) {
      const artisan = await prisma.artisan.findUnique({
        where: { id: artisanId }
      })
      
      if (!artisan) {
        return NextResponse.json(
          { 
            error: 'Invalid artisan',
            details: 'The selected artisan does not exist. Please select a valid artisan or leave this field empty.'
          },
          { status: 400 }
        )
      }
    }

    // Generate SKU
    const sku = `AH-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    
    // Generate slug
    const baseSlug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    let slug = baseSlug
    let counter = 1
    
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        sku,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        weight: weight ? parseFloat(weight) : null,
        dimensions: dimensions || null,
        materials: materials || [],
        colors: colors || [],
        stockQuantity: parseInt(stockQuantity) || 0,
        minOrderQty: parseInt(minOrderQty) || 1,
        maxOrderQty: maxOrderQty ? parseInt(maxOrderQty) : null,
        tags: tags || [],
        metaTitle,
        metaDescription,
        categoryId,
        artisanId: artisanId || null,
        isFeatured: isFeatured || false,
        isActive: isActive !== false,
        inStock: parseInt(stockQuantity) > 0,
        images: {
          create: images?.map((img: any, index: number) => ({
            url: img.url,
            altText: img.altText || name,
            sortOrder: index,
            isPrimary: index === 0,
            is360View: img.is360View || false
          })) || []
        },
        videos: {
          create: videos?.map((video: any, index: number) => ({
            url: video.url,
            title: video.title,
            description: video.description,
            duration: video.duration,
            sortOrder: index
          })) || []
        }
      },
      include: {
        category: true,
        artisan: true,
        images: true,
        videos: true
      }
    })

    // Log admin activity
    await logAdminActivity(
      admin.id,
      'PRODUCT_CREATE',
      `Created product: ${product.name}`,
      { productId: product.id, productName: product.name },
      request
    )

    return NextResponse.json({ 
      success: true, 
      product 
    }, { status: 201 })

  } catch (error: any) {
    console.error('Admin product creation error:', error)
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          error: 'Duplicate entry',
          details: 'A product with this name or SKU already exists. Please choose a different name or SKU.'
        },
        { status: 400 }
      )
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        { 
          error: 'Invalid reference',
          details: 'The selected category or artisan does not exist. Please refresh the page and try again.'
        },
        { status: 400 }
      )
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: 'Failed to create product',
        details: 'An unexpected error occurred. Please try again or contact support if the problem persists.'
      },
      { status: 500 }
    )
  }
}
