import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'

    // Calculate date range - use recent dates for presentation (this week and coming week)
    const now = new Date()
    let startDate = new Date()
    let endDate = new Date()
    
    // Get last Sunday (start of this week)
    const lastSunday = new Date(now)
    lastSunday.setDate(now.getDate() - now.getDay()) // Go back to Sunday
    lastSunday.setHours(0, 0, 0, 0)
    
    // Get next Sunday (end of coming week)
    const nextSunday = new Date(lastSunday)
    nextSunday.setDate(lastSunday.getDate() + 14) // 2 weeks from last Sunday
    nextSunday.setHours(23, 59, 59, 999)
    
    // For presentation purposes, use recent dates that look current
    switch (range) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        endDate = now
        break
      case '7d':
        startDate = lastSunday
        endDate = new Date(lastSunday.getTime() + 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(lastSunday.getTime() - 23 * 24 * 60 * 60 * 1000)
        endDate = nextSunday
        break
      case '90d':
        startDate = new Date(lastSunday.getTime() - 83 * 24 * 60 * 60 * 1000)
        endDate = nextSunday
        break
      default:
        startDate = lastSunday
        endDate = new Date(lastSunday.getTime() + 7 * 24 * 60 * 60 * 1000)
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

    // Get most visited products with sales data
    const mostVisitedProducts = await prisma.product.findMany({
      take: 10,
      orderBy: [
        { viewCount: 'desc' },
        { likeCount: 'desc' }
      ],
      include: {
        category: { select: { name: true } },
        images: { 
          where: { isPrimary: true },
          take: 1,
          select: { url: true }
        },
        orderItems: {
          include: {
            order: true
          }
        }
      },
      where: { isActive: true }
    })

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      where: {
        createdAt: { gte: startDate }
      },
      include: {
        user: { select: { firstName: true, lastName: true, name: true, email: true } }
      }
    })

    // Get top countries from orders
    const topCountriesData = await prisma.order.groupBy({
      by: ['shippingCountry'],
      where: {
        createdAt: { gte: startDate },
        status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] }
      },
      _sum: { totalAmount: true },
      _count: { id: true }
    })

    // Get device stats from user sessions
    const deviceStats = await prisma.userSession.groupBy({
      by: ['userAgent'],
      where: {
        createdAt: { gte: startDate }
      },
      _count: { id: true }
    })

    // Get sales trends from real order data
    const salesTrends = await getSalesTrends(startDate, endDate, range)

    // Get user activity from analytics events
    const userActivity = await getUserActivityHeatmap(startDate)

    // Process top countries data
    const totalRevenueByCountry = topCountriesData.reduce((sum, country) => sum + (country._sum.totalAmount?.toNumber() || 0), 0)
    const topCountries = topCountriesData
      .map(country => ({
        country: country.shippingCountry,
        users: country._count.id,
        revenue: country._sum.totalAmount?.toNumber() || 0,
        percentage: totalRevenueByCountry > 0 ? ((country._sum.totalAmount?.toNumber() || 0) / totalRevenueByCountry) * 100 : 0
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Process device stats
    const deviceBreakdown = processDeviceStats(deviceStats)

    // Process most visited products with sales data
    const processedProducts = mostVisitedProducts.map(product => {
      // Filter order items by date and status
      const validOrderItems = product.orderItems.filter(item => {
        const orderDate = new Date(item.order.createdAt)
        const validStatuses = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
        return orderDate >= startDate && validStatuses.includes(item.order.status)
      })
      
      const sales = validOrderItems.reduce((sum, item) => sum + item.quantity, 0)
      const revenue = validOrderItems.reduce((sum, item) => sum + (item.total.toNumber()), 0)
      
      return {
        id: product.id,
        name: product.name,
        views: product.viewCount,
        sales,
        revenue,
        image: product.images[0]?.url || '/placeholder-product.jpg'
      }
    })

    // Process recent orders
    const processedOrders = recentOrders.map(order => {
      let customerName = 'Unknown Customer'
      
      if (order.user) {
        // For Google OAuth users, use the 'name' field if firstName/lastName are null
        if (order.user.firstName && order.user.lastName) {
          customerName = `${order.user.firstName} ${order.user.lastName}`
        } else if (order.user.name) {
          customerName = order.user.name
        } else {
          // Fallback to email if no name is available
          customerName = order.user.email || 'Unknown Customer'
        }
      } else {
        // For guest orders, use shipping information
        customerName = `${order.shippingFirstName} ${order.shippingLastName}`.trim()
        if (!customerName || customerName === ' ') {
          customerName = 'Guest Customer'
        }
      }
      
      return {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName,
        total: order.totalAmount.toNumber(),
        status: order.status,
        createdAt: order.createdAt.toISOString()
      }
    })

    const stats = {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      mostVisitedProducts: processedProducts,
      recentOrders: processedOrders,
      topCountries,
      deviceStats: deviceBreakdown,
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

async function getSalesTrends(startDate: Date, endDate: Date, range: string) {
  const trends = []
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  
  for (let i = 0; i < Math.min(daysDiff, 30); i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const nextDate = new Date(date)
    nextDate.setDate(date.getDate() + 1)
    
    // Get real order data for this day
    const dayOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: date,
          lt: nextDate
        },
        status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] }
      },
      select: {
        totalAmount: true
      }
    })
    
    const revenue = dayOrders.reduce((sum, order) => sum + order.totalAmount.toNumber(), 0)
    const orders = dayOrders.length
    
    trends.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(revenue),
      orders
    })
  }
  
  return trends
}

async function getUserActivityHeatmap(startDate: Date) {
  const activity = []
  
  // Use recent dates for analytics events to show current activity
  const now = new Date()
  const analyticsStartDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
  
  for (let hour = 0; hour < 24; hour++) {
    const hourStart = new Date(analyticsStartDate)
    hourStart.setHours(hour, 0, 0, 0)
    const hourEnd = new Date(hourStart)
    hourEnd.setHours(hour + 1, 0, 0, 0)
    
    // Get real analytics events for this hour across the last 7 days
    const hourEvents = await prisma.analyticsEvent.count({
      where: {
        timestamp: {
          gte: hourStart,
          lt: hourEnd
        }
      }
    })
    
    activity.push({
      hour,
      users: hourEvents
    })
  }
  
  return activity
}

function processDeviceStats(deviceStats: any[]): Array<{device: string, users: number, percentage: number}> {
  const deviceBreakdown: Array<{device: string, users: number, percentage: number}> = []
  const totalSessions = deviceStats.reduce((sum, stat) => sum + stat._count.id, 0)
  
  // Process user agents to categorize devices
  const deviceCategories = {
    'Desktop': 0,
    'Mobile': 0,
    'Tablet': 0
  }
  
  deviceStats.forEach(stat => {
    const userAgent = stat.userAgent.toLowerCase()
    const count = stat._count.id
    
    if (userAgent.includes('mobile') || userAgent.includes('android') || userAgent.includes('iphone')) {
      deviceCategories['Mobile'] += count
    } else if (userAgent.includes('tablet') || userAgent.includes('ipad')) {
      deviceCategories['Tablet'] += count
    } else {
      deviceCategories['Desktop'] += count
    }
  })
  
  // Convert to array with percentages
  Object.entries(deviceCategories).forEach(([device, users]) => {
    if (users > 0) {
      deviceBreakdown.push({
        device,
        users,
        percentage: totalSessions > 0 ? Math.round((users / totalSessions) * 100) : 0
      })
    }
  })
  
  return deviceBreakdown.sort((a, b) => b.users - a.users)
}
