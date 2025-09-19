import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status !== 'all') {
      where.isActive = status === 'active'
    }

    // Get customers with their order statistics
    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          image: true,
          isActive: true,
          loyaltyPoints: true,
          lastLoginAt: true,
          createdAt: true,
          city: true,
          country: true,
          orders: {
            select: {
              id: true,
              totalAmount: true,
              status: true,
              createdAt: true
            }
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              content: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              orders: true,
              reviews: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    // Transform the data
    const transformedCustomers = customers.map(customer => {
      const totalSpent = customer.orders.reduce((sum, order) => {
        return sum + Number(order.totalAmount)
      }, 0)

      const lastOrder = customer.orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

      const averageRating = customer.reviews.length > 0 
        ? customer.reviews.reduce((sum, review) => sum + review.rating, 0) / customer.reviews.length
        : 0

      return {
        id: customer.id,
        name: customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email.split('@')[0] || 'Unknown',
        email: customer.email,
        phone: customer.phone,
        avatar: customer.image,
        status: customer.isActive ? 'active' : 'inactive',
        totalOrders: customer._count.orders,
        totalSpent,
        lastOrderDate: lastOrder?.createdAt,
        joinDate: customer.createdAt,
        location: [customer.city, customer.country].filter(Boolean).join(', ') || 'Unknown',
        loyaltyPoints: customer.loyaltyPoints,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: customer._count.reviews,
        lastLoginAt: customer.lastLoginAt,
        tags: [
          customer._count.orders > 10 ? 'VIP' : null,
          customer._count.orders > 0 ? 'Customer' : 'Prospect',
          customer.loyaltyPoints > 1000 ? 'Loyal' : null,
          customer._count.reviews > 5 ? 'Reviewer' : null
        ].filter(Boolean)
      }
    })

    return NextResponse.json({
      customers: transformedCustomers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Admin customers fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}
