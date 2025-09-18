import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (range) {
      case '24h':
        startDate.setHours(now.getHours() - 24)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Get basic stats
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      revenueResult
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.order.count({
        where: {
          createdAt: { gte: startDate },
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] }
        }
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate },
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] }
        },
        _sum: { totalAmount: true }
      })
    ])

    const totalRevenue = revenueResult._sum.totalAmount?.toNumber() || 0

    // Get most visited products
    const mostVisitedProducts = await prisma.product.findMany({
      take: 10,
      orderBy: [
        { viewCount: 'desc' },
        { likeCount: 'desc' }
      ],
      include: {
        category: { select: { name: true } }
      },
      where: { isActive: true }
    })

    // Get recent admin activities
    const recentActivity = await prisma.adminActivity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      where: {
        createdAt: { gte: startDate }
      }
    })

    // Generate mock sales trends data (replace with real data)
    const salesTrends = generateSalesTrends(startDate, now, range)

    // Generate user activity heatmap (mock data)
    const userActivity = generateUserActivityHeatmap()

    const stats = {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      mostVisitedProducts: mostVisitedProducts.map(product => ({
        id: product.id,
        name: product.name,
        viewCount: product.viewCount,
        likeCount: product.likeCount,
        category: product.category.name
      })),
      recentActivity: recentActivity.map(activity => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        timestamp: activity.createdAt.toISOString()
      })),
      salesTrends,
      userActivity
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}

function generateSalesTrends(startDate: Date, endDate: Date, range: string) {
  const trends = []
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  
  for (let i = 0; i < Math.min(daysDiff, 30); i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    // Generate realistic mock data
    const baseRevenue = 1000 + Math.random() * 2000
    const orders = Math.floor(5 + Math.random() * 20)
    
    trends.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(baseRevenue),
      orders
    })
  }
  
  return trends
}

function generateUserActivityHeatmap() {
  const activity = []
  
  for (let hour = 0; hour < 24; hour++) {
    // Simulate realistic user activity patterns
    let users = 10
    
    // Higher activity during business hours
    if (hour >= 9 && hour <= 17) {
      users += Math.random() * 50
    }
    
    // Evening peak
    if (hour >= 18 && hour <= 22) {
      users += Math.random() * 30
    }
    
    // Lower activity at night
    if (hour >= 23 || hour <= 6) {
      users = Math.random() * 20
    }
    
    activity.push({
      hour,
      users: Math.round(users)
    })
  }
  
  return activity
}
