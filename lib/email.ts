import nodemailer from 'nodemailer'

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
})

// Verify connection configuration
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify()
    console.log('Email server is ready to take our messages')
    return true
  } catch (error) {
    console.error('Email server connection failed:', error)
    return false
  }
}

// Order confirmation email template
export const generateOrderConfirmationEmail = (orderData: {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
    image: string
  }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: {
    address: string
    city: string
    zipCode: string
    country: string
  }
}) => {
  const { orderId, customerName, customerEmail, items, subtotal, shipping, tax, total, shippingAddress } = orderData

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Akamba Handicraft</title>
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
        .order-id {
          background-color: #fef3c7;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          margin-bottom: 20px;
        }
        .item {
          display: flex;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        }
        .item-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 5px;
          margin-right: 15px;
        }
        .item-details {
          flex: 1;
        }
        .item-name {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .item-quantity {
          color: #666;
          font-size: 14px;
        }
        .item-price {
          font-weight: bold;
          color: #f59e0b;
        }
        .summary {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .total {
          font-size: 18px;
          font-weight: bold;
          border-top: 2px solid #f59e0b;
          padding-top: 10px;
        }
        .shipping-info {
          background-color: #f0f9ff;
          padding: 20px;
          border-radius: 5px;
          margin: 20px 0;
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
          <h1>Order Confirmation</h1>
        </div>

        <div class="order-id">
          <strong>Order ID: ${orderId}</strong>
        </div>

        <p>Dear ${customerName},</p>
        
        <p>Thank you for your purchase! We're excited to share our authentic Akamba artifacts with you. Your order has been confirmed and is being prepared for shipment.</p>

        <h2>Order Details</h2>
        
        ${items.map(item => `
          <div class="item">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
              <div class="item-name">${item.name}</div>
              <div class="item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
          </div>
        `).join('')}

        <div class="summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>${formatPrice(subtotal)}</span>
          </div>
          <div class="summary-row">
            <span>Shipping:</span>
            <span>${shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
          </div>
          <div class="summary-row">
            <span>Tax:</span>
            <span>${formatPrice(tax)}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>${formatPrice(total)}</span>
          </div>
        </div>

        <div class="shipping-info">
          <h3>Shipping Address</h3>
          <p>
            ${shippingAddress.address}<br>
            ${shippingAddress.city}, ${shippingAddress.zipCode}<br>
            ${shippingAddress.country}
          </p>
        </div>

        <h2>What's Next?</h2>
        <ul>
          <li>Your order will be carefully packaged within 1-2 business days</li>
          <li>You'll receive a shipping confirmation with tracking information</li>
          <li>Expected delivery: 3-5 business days</li>
        </ul>

        <div style="text-align: center;">
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/products" class="button">
            Continue Shopping
          </a>
        </div>

        <div class="footer">
          <p>Thank you for supporting authentic Akamba craftsmanship!</p>
          <p>If you have any questions, please contact us at support@akambahandicraft.com</p>
          <p>© 2024 Akamba Handicraft. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
    Order Confirmation - Akamba Handicraft
    
    Dear ${customerName},
    
    Thank you for your purchase! Your order has been confirmed.
    
    Order ID: ${orderId}
    
    Order Details:
    ${items.map(item => `- ${item.name} (Qty: ${item.quantity}) - ${formatPrice(item.price * item.quantity)}`).join('\n')}
    
    Summary:
    Subtotal: ${formatPrice(subtotal)}
    Shipping: ${shipping === 0 ? 'Free' : formatPrice(shipping)}
    Tax: ${formatPrice(tax)}
    Total: ${formatPrice(total)}
    
    Shipping Address:
    ${shippingAddress.address}
    ${shippingAddress.city}, ${shippingAddress.zipCode}
    ${shippingAddress.country}
    
    What's Next:
    - Your order will be carefully packaged within 1-2 business days
    - You'll receive a shipping confirmation with tracking information
    - Expected delivery: 3-5 business days
    
    Thank you for supporting authentic Akamba craftsmanship!
    
    If you have any questions, please contact us at support@akambahandicraft.com
    
    © 2024 Akamba Handicraft. All rights reserved.
  `

  return {
    html: htmlContent,
    text: textContent
  }
}

// Send order confirmation email
export const sendOrderConfirmationEmail = async (orderData: {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
    image: string
  }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: {
    address: string
    city: string
    zipCode: string
    country: string
  }
}) => {
  try {
    const emailContent = generateOrderConfirmationEmail(orderData)
    
    const mailOptions = {
      from: `"Akamba Handicraft" <${process.env.SMTP_USER}>`,
      to: orderData.customerEmail,
      subject: `Order Confirmation #${orderData.orderId} - Akamba Handicraft`,
      text: emailContent.text,
      html: emailContent.html,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Order confirmation email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Send general email
export const sendEmail = async (to: string, subject: string, html: string, text?: string) => {
  try {
    const mailOptions = {
      from: `"Akamba Handicraft" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
      html,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
