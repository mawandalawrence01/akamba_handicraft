import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    
    const artisans = await prisma.artisan.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        bio: true,
        image: true,
        location: true,
        experience: true,
        specialties: true,
        isVerified: true
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ artisans })

  } catch (error) {
    console.error('Admin artisans fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artisans' },
      { status: 500 }
    )
  }
}