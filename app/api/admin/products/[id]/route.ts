import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminActivity } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await requireAdmin(request)
    const productId = params.id

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        artisan: true,
        images: { orderBy: { sortOrder: 'asc' } },
        videos: { orderBy: { sortOrder: 'asc' } },
        reviews: {
          include: { user: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            likes: true,
            wishlistItems: true,
            orderItems: true
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

    return NextResponse.json({ product })

  } catch (error) {
    console.error('Admin product fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const admin = await requireAdmin(request)
    const productId = params.id
    const body = await request.json()

    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...body,
        updatedAt: new Date(),
        // Ensure inStock is updated based on stockQuantity
        ...(body.stockQuantity !== undefined && {
          inStock: parseInt(body.stockQuantity) > 0
        })
      },
      include: {
        category: true,
        artisan: true,
        images: { orderBy: { sortOrder: 'asc' } },
        videos: { orderBy: { sortOrder: 'asc' } }
      }
    })

    // Log admin activity
    const changes = Object.keys(body).join(', ')
    await logAdminActivity(
      admin.id,
      'PRODUCT_UPDATE',
      `Updated product: ${product.name} (${changes})`,
      { 
        productId: product.id, 
        productName: product.name,
        changes: body
      },
      request
    )

    return NextResponse.json({ 
      success: true, 
      product: updatedProduct 
    })

  } catch (error) {
    console.error('Admin product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const admin = await requireAdmin(request)
    const productId = params.id

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if product has orders
    const orderCount = await prisma.orderItem.count({
      where: { productId }
    })

    if (orderCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing orders. Consider deactivating instead.' },
        { status: 400 }
      )
    }

    // Delete product and all related data
    await prisma.$transaction([
      // Delete related data first
      prisma.productLike.deleteMany({ where: { productId } }),
      prisma.wishlistItem.deleteMany({ where: { productId } }),
      prisma.cartItem.deleteMany({ where: { productId } }),
      prisma.review.deleteMany({ where: { productId } }),
      prisma.comment.deleteMany({ where: { productId } }),
      prisma.socialShare.deleteMany({ where: { productId } }),
      prisma.download.deleteMany({ where: { productId } }),
      prisma.productImage.deleteMany({ where: { productId } }),
      prisma.productVideo.deleteMany({ where: { productId } }),
      
      // Finally delete the product
      prisma.product.delete({ where: { id: productId } })
    ])

    // Log admin activity
    await logAdminActivity(
      admin.id,
      'PRODUCT_DELETE',
      `Deleted product: ${product.name}`,
      { productId: product.id, productName: product.name },
      request
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    })

  } catch (error) {
    console.error('Admin product deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
