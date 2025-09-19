import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    const body = await request.json()
    
    const { platform, url, title, description, imageUrl, productId } = body

    if (!platform || !url || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create social share record
    const socialShare = await prisma.socialShare.create({
      data: {
        platform: platform.toUpperCase(),
        url,
        title,
        content: description,
        imageUrl,
        userId: userId || undefined,
        productId: productId || undefined
      }
    })

    // Update product stats if productId is provided
    if (productId) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          viewCount: {
            increment: 1
          }
        }
      })
    }

    // Track analytics event
    await prisma.analyticsEvent.create({
      data: {
        event: 'social_share',
        properties: {
          platform,
          productId,
          url,
          title
        },
        userId: userId || undefined,
        timestamp: new Date()
      }
    })

    return NextResponse.json({ 
      success: true, 
      shareId: socialShare.id 
    })

  } catch (error) {
    console.error('Social share error:', error)
    return NextResponse.json(
      { error: 'Failed to track social share' },
      { status: 500 }
    )
  }
}
