import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getCloudinaryImageStats } from '@/lib/cloudinary-helpers'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const stats = await getCloudinaryImageStats()
    
    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Cloudinary stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Cloudinary stats' },
      { status: 500 }
    )
  }
}
