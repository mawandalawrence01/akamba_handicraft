import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { userId } = await auth()
    const { id: itemId } = await params

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if item exists and belongs to user
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: { id: itemId },
      include: { product: true }
    })

    if (!wishlistItem) {
      return NextResponse.json(
        { error: 'Wishlist item not found' },
        { status: 404 }
      )
    }

    if (wishlistItem.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this item' },
        { status: 403 }
      )
    }

    // Delete item
    await prisma.wishlistItem.delete({
      where: { id: itemId }
    })

    // Track analytics event
    await prisma.analyticsEvent.create({
      data: {
        event: 'wishlist_remove',
        properties: {
          productId: wishlistItem.productId,
          productName: wishlistItem.product.name
        },
        userId,
        timestamp: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Item removed from wishlist'
    })

  } catch (error) {
    console.error('Remove from wishlist error:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}
