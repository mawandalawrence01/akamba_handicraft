# Email Setup Guide

This guide explains how to set up and use the email functionality for order confirmations in the Akamba Handicraft application.

## Environment Variables

Add the following variables to your `.env` file:

```env
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mawandalawrence01@gmail.com
SMTP_PASSWORD="rera jxlw anxa jygr" # Use App Password, not regular password
SMTP_TLS=true
```

## Gmail Setup

If you're using Gmail, you need to:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in your `SMTP_PASSWORD` variable

## Features

### Order Confirmation Emails

When a customer completes an order, they automatically receive a beautifully formatted email containing:

- Order confirmation with unique order ID
- List of purchased items with images
- Order summary with pricing breakdown
- Shipping address
- Next steps information
- Branded styling with Akamba Handicraft theme

### Email Templates

The email system includes:

- **HTML Template**: Rich, responsive design with images and styling
- **Text Template**: Plain text fallback for email clients that don't support HTML
- **Branded Design**: Consistent with the website's amber/orange color scheme

## Testing

### Admin Test Page

Visit `/admin/test-email` to:

1. Test email server connection
2. Send test order confirmation emails
3. Verify email delivery

### API Testing

You can also test the email functionality via API:

```bash
# Test connection
curl http://localhost:3000/api/test-email

# Send test email
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "your-email@example.com"}'
```

### Script Testing

Run the test script:

```bash
npx tsx scripts/test-email.ts
```

## API Endpoints

### POST /api/orders

Processes a new order and sends confirmation email.

**Request Body:**
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "items": [
    {
      "name": "Hand-carved Mask",
      "quantity": 1,
      "price": 89.99,
      "image": "https://example.com/image.jpg"
    }
  ],
  "subtotal": 89.99,
  "shipping": 0,
  "tax": 9.00,
  "total": 98.99,
  "shippingAddress": {
    "address": "123 Main St",
    "city": "Nairobi",
    "zipCode": "00100",
    "country": "Kenya"
  }
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "AKB-1234567890-ABC123",
  "message": "Order processed successfully",
  "emailSent": true
}
```

## Integration

The email system is automatically integrated into the checkout process:

1. Customer fills out checkout form
2. Order data is sent to `/api/orders`
3. Email confirmation is sent automatically
4. Customer is redirected to success page

## Troubleshooting

### Common Issues

1. **Connection Failed**: Check SMTP credentials and network connectivity
2. **Authentication Failed**: Verify Gmail App Password is correct
3. **Emails Not Delivered**: Check spam folder, verify email address format
4. **Template Issues**: Ensure all required order data is provided

### Debug Mode

Enable debug logging by checking the server console for detailed error messages.

## Security Notes

- Never commit real SMTP credentials to version control
- Use environment variables for all sensitive configuration
- Consider using a dedicated email service (SendGrid, Mailgun) for production
- Implement rate limiting for email sending in production

## Future Enhancements

Potential improvements:

- Email templates for shipping notifications
- Admin notifications for new orders
- Email marketing integration
- Order status update emails
- Customer review request emails
