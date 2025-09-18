import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        sortOrder: true
      },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json({ categories })

  } catch (error) {
    console.error('Admin categories fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}