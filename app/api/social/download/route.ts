import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const body = await request.json()
    
    const { downloadType, fileName, fileUrl, fileSize, productId } = body

    if (!downloadType || !fileName || !fileUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create download record
    const download = await prisma.download.create({
      data: {
        downloadType: downloadType.toUpperCase(),
        fileName,
        fileUrl,
        fileSize: fileSize || null,
        userId: userId || undefined,
        productId: productId || undefined
      }
    })

    // Track analytics event
    await prisma.analyticsEvent.create({
      data: {
        event: 'file_download',
        properties: {
          downloadType,
          fileName,
          productId,
          fileSize
        },
        userId: userId || undefined,
        timestamp: new Date()
      }
    })

    return NextResponse.json({ 
      success: true, 
      downloadId: download.id 
    })

  } catch (error) {
    console.error('Download tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    )
  }
}
