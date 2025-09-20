# Vercel Deployment Setup Guide

## File Upload Issues on Vercel

The upload errors you're experiencing are due to Vercel's serverless architecture limitations. Here are the solutions:

## Solution 1: Cloudinary Integration (Recommended)

### Step 1: Set up Cloudinary
1. Go to [Cloudinary](https://cloudinary.com/) and create a free account
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Create an upload preset:
   - Go to Settings > Upload
   - Create a new upload preset named `akamba_handicraft`
   - Set it to "Unsigned" for public uploads

### Step 2: Add Environment Variables
Add these to your Vercel environment variables:

```bash
CLOUDINARY_URL=https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload
CLOUDINARY_UPLOAD_PRESET=akamba_handicraft
```

### Step 3: Deploy
The updated upload API will automatically use Cloudinary in production.

## Solution 2: Alternative Services

If you prefer other services:

### AWS S3
- Use AWS SDK to upload to S3
- Configure S3 bucket with public read access
- Update the upload handler accordingly

### Vercel Blob Storage
- Use Vercel's built-in blob storage
- Install `@vercel/blob` package
- Update upload handler to use Vercel Blob

## Solution 3: Database Storage (Not Recommended)

Store images as base64 in your database:
- Pros: No external dependencies
- Cons: Large database size, slower queries, limited scalability

## Current Implementation

The updated code includes:
1. **Hybrid approach**: Local filesystem for development, Cloudinary for production
2. **Fallback handling**: Graceful error handling for missing configurations
3. **Image optimization**: Updated Next.js config for better image handling

## Testing

1. **Development**: Files will be saved locally in `public/uploads/products/`
2. **Production**: Files will be uploaded to Cloudinary and served via CDN

## Troubleshooting

### If uploads still fail:
1. Check Vercel environment variables are set correctly
2. Verify Cloudinary upload preset is configured
3. Check Vercel function logs for detailed error messages

### If images don't load:
1. Ensure Cloudinary URLs are being returned correctly
2. Check Next.js image configuration
3. Verify image URLs in the database

## Migration

To migrate existing local images to Cloudinary:
1. Upload existing images from `public/uploads/products/` to Cloudinary
2. Update database records with new Cloudinary URLs
3. Remove local uploads directory from production builds
