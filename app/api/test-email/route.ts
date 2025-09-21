import { NextRequest, NextResponse } from 'next/server'
import { verifyEmailConnection, sendOrderConfirmationEmail } from '@/lib/email'

export async function GET() {
  try {
    // Test email connection
    const connectionOk = await verifyEmailConnection()
    
    if (!connectionOk) {
      return NextResponse.json({
        success: false,
        error: 'Email connection failed. Please check your SMTP credentials.'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Email connection successful!'
    })

  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Email test failed'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testEmail } = body

    if (!testEmail) {
      return NextResponse.json({
        success: false,
        error: 'Test email address is required'
      }, { status: 400 })
    }

    // Send test order confirmation email
    const testOrderData = {
      orderId: 'TEST-' + Date.now(),
      customerName: 'Test Customer',
      customerEmail: testEmail,
      items: [
        {
          name: 'Hand-carved Wooden Mask',
          quantity: 1,
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=150&auto=format&fit=crop'
        },
        {
          name: 'Traditional Beaded Necklace',
          quantity: 2,
          price: 45.00,
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=150&auto=format&fit=crop'
        }
      ],
      subtotal: 179.99,
      shipping: 0,
      tax: 18.00,
      total: 197.99,
      shippingAddress: {
        address: '123 Test Street',
        city: 'Nairobi',
        zipCode: '00100',
        country: 'Kenya'
      }
    }

    const result = await sendOrderConfirmationEmail(testOrderData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully!',
        messageId: result.messageId
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Email test failed'
    }, { status: 500 })
  }
}
