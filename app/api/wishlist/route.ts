import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: true,
            category: true,
            artisan: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      items: wishlistItems
    })

  } catch (error) {
    console.error('Get wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to get wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    const body = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if already in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    })

    if (existingItem) {
      return NextResponse.json(
        { error: 'Item already in wishlist' },
        { status: 409 }
      )
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId,
        productId
      },
      include: {
        product: {
          include: {
            images: true,
            category: true,
            artisan: true
          }
        }
      }
    })

    // Track analytics event
    await prisma.analyticsEvent.create({
      data: {
        event: 'wishlist_add',
        properties: {
          productId,
          productName: product.name,
          productPrice: product.price.toString()
        },
        userId,
        timestamp: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      item: wishlistItem
    })

  } catch (error) {
    console.error('Add to wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}
