import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, firstName, lastName } = body

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingSubscription = await prisma.newsletterSubscription.findUnique({
      where: { email }
    })

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 409 }
        )
      } else {
        // Reactivate subscription
        await prisma.newsletterSubscription.update({
          where: { email },
          data: {
            isActive: true,
            subscribedAt: new Date(),
            firstName: firstName || null,
            lastName: lastName || null
          }
        })
      }
    } else {
      // Create new subscription
      await prisma.newsletterSubscription.create({
        data: {
          email,
          firstName: firstName || null,
          lastName: lastName || null,
          isActive: true,
          subscribedAt: new Date()
        }
      })
    }

    // Generate discount code
    const discountCode = `WELCOME15-${Date.now().toString(36).toUpperCase()}`
    
    // Send welcome email with discount code
    const emailResult = await sendNewsletterWelcomeEmail({
      email,
      firstName: firstName || 'Valued Customer',
      discountCode
    })

    if (!emailResult.success) {
      console.error('Failed to send welcome email:', emailResult.error)
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      discountCode,
      emailSent: emailResult.success
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    // Deactivate subscription instead of deleting
    await prisma.newsletterSubscription.update({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    })

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    )
  }
}

// Newsletter welcome email template
const generateNewsletterWelcomeEmail = (data: {
  email: string
  firstName: string
  discountCode: string
}) => {
  const { email, firstName, discountCode } = data

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Akamba Handicraft Newsletter</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .container {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #f59e0b;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #f59e0b;
          margin-bottom: 10px;
        }
        .discount-box {
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          color: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          margin: 20px 0;
        }
        .discount-code {
          font-size: 24px;
          font-weight: bold;
          background-color: rgba(255,255,255,0.2);
          padding: 10px 20px;
          border-radius: 5px;
          display: inline-block;
          margin: 10px 0;
        }
        .benefits {
          background-color: #fef3c7;
          padding: 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .benefit-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .benefit-icon {
          width: 20px;
          height: 20px;
          background-color: #f59e0b;
          border-radius: 50%;
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          background-color: #f59e0b;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🏺 Akamba Handicraft</div>
          <h1>Welcome to Our Community!</h1>
        </div>

        <p>Dear ${firstName},</p>
        
        <p>Thank you for subscribing to the Akamba Handicraft newsletter! We're thrilled to have you join our community of art lovers and cultural enthusiasts.</p>

        <div class="discount-box">
          <h2>🎉 Your Welcome Gift!</h2>
          <p>As promised, here's your exclusive 15% discount code:</p>
          <div class="discount-code">${discountCode}</div>
          <p>Use this code at checkout to save 15% on your first order!</p>
        </div>

        <div class="benefits">
          <h3>What you can expect from us:</h3>
          <div class="benefit-item">
            <div class="benefit-icon">🎁</div>
            <span>Exclusive discounts and early access to sales</span>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">✨</div>
            <span>First look at new collections and limited editions</span>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">👨‍🎨</div>
            <span>Artisan spotlights and behind-the-scenes stories</span>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">🌍</div>
            <span>Cultural insights and the history behind our crafts</span>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">📱</div>
            <span>Tips for caring for your authentic African artifacts</span>
          </div>
        </div>

        <p>We'll send you our newsletter every week with the latest updates, stories, and exclusive offers. Don't worry - we respect your inbox and will never spam you.</p>

        <div style="text-align: center;">
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/products" class="button">
            Start Shopping Now
          </a>
        </div>

        <div class="footer">
          <p>Thank you for supporting authentic Akamba craftsmanship!</p>
          <p>If you have any questions, feel free to contact us at support@akambahandicraft.com</p>
          <p><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/unsubscribe?email=${email}">Unsubscribe</a> | <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/privacy">Privacy Policy</a></p>
          <p>© 2024 Akamba Handicraft. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
    Welcome to Akamba Handicraft Newsletter!
    
    Dear ${firstName},
    
    Thank you for subscribing to the Akamba Handicraft newsletter! We're thrilled to have you join our community of art lovers and cultural enthusiasts.
    
    🎉 Your Welcome Gift!
    As promised, here's your exclusive 15% discount code:
    ${discountCode}
    
    Use this code at checkout to save 15% on your first order!
    
    What you can expect from us:
    🎁 Exclusive discounts and early access to sales
    ✨ First look at new collections and limited editions
    👨‍🎨 Artisan spotlights and behind-the-scenes stories
    🌍 Cultural insights and the history behind our crafts
    📱 Tips for caring for your authentic African artifacts
    
    We'll send you our newsletter every week with the latest updates, stories, and exclusive offers. Don't worry - we respect your inbox and will never spam you.
    
    Start shopping now: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/products
    
    Thank you for supporting authentic Akamba craftsmanship!
    
    If you have any questions, feel free to contact us at support@akambahandicraft.com
    
    Unsubscribe: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/unsubscribe?email=${email}
    Privacy Policy: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/privacy
    
    © 2024 Akamba Handicraft. All rights reserved.
  `

  return {
    html: htmlContent,
    text: textContent
  }
}

// Send newsletter welcome email
const sendNewsletterWelcomeEmail = async (data: {
  email: string
  firstName: string
  discountCode: string
}) => {
  try {
    const emailContent = generateNewsletterWelcomeEmail(data)
    
    const result = await sendEmail(
      data.email, 
      `🎉 Welcome to Akamba Handicraft! Your 15% discount is inside`, 
      emailContent.html, 
      emailContent.text
    )
    return result
  } catch (error) {
    console.error('Failed to send newsletter welcome email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
