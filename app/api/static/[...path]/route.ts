import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

interface RouteParams {
  params: Promise<{
    path: string[]
  }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Only serve files in development
    if (process.env.NODE_ENV !== 'development') {
      return new NextResponse('Not Found', { status: 404 })
    }

    const { path } = await params
    const filePath = path.join('/')
    const fullPath = join(process.cwd(), 'public', 'uploads', filePath)

    // Security check - ensure the path is within the uploads directory
    if (!fullPath.startsWith(join(process.cwd(), 'public', 'uploads'))) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    if (!existsSync(fullPath)) {
      return new NextResponse('File not found', { status: 404 })
    }

    const fileBuffer = await readFile(fullPath)
    const contentType = getContentType(filePath)

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Static file serving error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

function getContentType(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    case 'webp':
      return 'image/webp'
    case 'svg':
      return 'image/svg+xml'
    default:
      return 'application/octet-stream'
  }
}
