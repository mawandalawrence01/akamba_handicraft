import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const {
      customerName,
      customerEmail,
      items,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress
    } = body

    if (!customerName || !customerEmail || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate a simple order ID (in production, you'd want a more robust system)
    const orderId = `AKB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Prepare order data for email
    const orderData = {
      orderId,
      customerName,
      customerEmail,
      items,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress
    }

    // Send confirmation email
    const emailResult = await sendOrderConfirmationEmail(orderData)
    
    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error)
      // In production, you might want to queue the email for retry
      // For now, we'll still return success but log the error
    }

    // In a real application, you would also:
    // 1. Save the order to the database
    // 2. Process payment
    // 3. Update inventory
    // 4. Send notifications to admin

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order processed successfully',
      emailSent: emailResult.success
    })

  } catch (error) {
    console.error('Order processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
