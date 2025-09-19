import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminActivity } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin(request)
    
    const { id: orderId } = await params
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: {
                  select: { url: true },
                  where: { isPrimary: true },
                  take: 1
                }
              }
            }
          }
        },
        tracking: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await requireAdmin(request)
    const { id: orderId } = await params
    const body = await request.json()
    
    const { status, trackingNumber, notes } = body

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(trackingNumber && { trackingNumber }),
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    // Create tracking entry
    if (status) {
      await prisma.orderTracking.create({
        data: {
          orderId: orderId,
          status,
          location: 'Admin Panel'
        }
      })
    }

    // Log admin activity
    await logAdminActivity(
      admin.id,
      'PRODUCT_UPDATE',
      `Updated order ${order.orderNumber} status to ${status}`,
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        newStatus: status
      }
    )

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
