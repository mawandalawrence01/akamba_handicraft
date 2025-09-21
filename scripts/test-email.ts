import { verifyEmailConnection, sendOrderConfirmationEmail } from '../lib/email'

async function testEmail() {
  console.log('Testing email connection...')
  
  // Test connection
  const connectionOk = await verifyEmailConnection()
  if (!connectionOk) {
    console.error('❌ Email connection failed. Please check your SMTP credentials.')
    return
  }
  
  console.log('✅ Email connection successful!')
  
  // Test sending order confirmation email
  console.log('Testing order confirmation email...')
  
  const testOrderData = {
    orderId: 'TEST-123456789',
    customerName: 'John Doe',
    customerEmail: 'test@example.com', // Change this to your email for testing
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
    shipping: 0, // Free shipping over $100
    tax: 18.00,
    total: 197.99,
    shippingAddress: {
      address: '123 Main Street',
      city: 'Nairobi',
      zipCode: '00100',
      country: 'Kenya'
    }
  }
  
  const result = await sendOrderConfirmationEmail(testOrderData)
  
  if (result.success) {
    console.log('✅ Order confirmation email sent successfully!')
    console.log('Message ID:', result.messageId)
  } else {
    console.error('❌ Failed to send order confirmation email:', result.error)
  }
}

// Run the test
testEmail().catch(console.error)
