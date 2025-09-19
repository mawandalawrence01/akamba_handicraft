import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    const { id: productId } = await params

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get like status and count
    const [userLike, likeCount] = await Promise.all([
      prisma.productLike.findUnique({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      }),
      prisma.productLike.count({
        where: { productId }
      })
    ])

    return NextResponse.json({
      isLiked: !!userLike,
      likeCount
    })

  } catch (error) {
    console.error('Get like status error:', error)
    return NextResponse.json(
      { error: 'Failed to get like status' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    const { id: productId } = await params

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    // Check if already liked
    const existingLike = await prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    })

    if (existingLike) {
      return NextResponse.json(
        { error: 'Product already liked' },
        { status: 409 }
      )
    }

    // Create like and update product like count
    const [like, updatedProduct] = await Promise.all([
      prisma.productLike.create({
        data: {
          userId,
          productId
        }
      }),
      prisma.product.update({
        where: { id: productId },
        data: {
          likeCount: {
            increment: 1
          }
        }
      })
    ])

    // Track analytics event
    await prisma.analyticsEvent.create({
      data: {
        event: 'product_liked',
        properties: {
          productId,
          productName: product.name,
          productPrice: product.price.toString()
        },
        userId,
        timestamp: new Date()
      }
    })

    // Get updated like count
    const likeCount = await prisma.productLike.count({
      where: { productId }
    })

    return NextResponse.json({
      success: true,
      isLiked: true,
      likeCount
    })

  } catch (error) {
    console.error('Like product error:', error)
    return NextResponse.json(
      { error: 'Failed to like product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    const { id: productId } = await params

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if like exists
    const existingLike = await prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    })

    if (!existingLike) {
      return NextResponse.json(
        { error: 'Like not found' },
        { status: 404 }
      )
    }

    // Remove like and update product like count
    await Promise.all([
      prisma.productLike.delete({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      }),
      prisma.product.update({
        where: { id: productId },
        data: {
          likeCount: {
            decrement: 1
          }
        }
      })
    ])

    // Track analytics event
    await prisma.analyticsEvent.create({
      data: {
        event: 'product_unliked',
        properties: {
          productId
        },
        userId,
        timestamp: new Date()
      }
    })

    // Get updated like count
    const likeCount = await prisma.productLike.count({
      where: { productId }
    })

    return NextResponse.json({
      success: true,
      isLiked: false,
      likeCount
    })

  } catch (error) {
    console.error('Unlike product error:', error)
    return NextResponse.json(
      { error: 'Failed to unlike product' },
      { status: 500 }
    )
  }
}
