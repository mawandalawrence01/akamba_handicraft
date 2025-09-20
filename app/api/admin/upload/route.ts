import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Use Cloudinary for both development and production
    // This ensures consistency across environments
    return await handleCloudinaryUpload(file)

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// Local file system upload (for development)
async function handleLocalUpload(file: File) {
  const { writeFile, mkdir } = await import('fs/promises')
  const { join } = await import('path')
  const { existsSync } = await import('fs')

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Create uploads directory if it doesn't exist
  const uploadsDir = join(process.cwd(), 'public', 'uploads', 'products')
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true })
  }

  // Generate unique filename
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const fileExtension = file.name.split('.').pop()
  const filename = `${timestamp}-${randomString}.${fileExtension}`
  const filepath = join(uploadsDir, filename)

  // Save file
  await writeFile(filepath, buffer)

  // Return the public URL
  const publicUrl = `/uploads/products/${filename}`

  return NextResponse.json({ 
    success: true, 
    url: publicUrl,
    filename: filename
  })
}

// Cloudinary upload (for production)
async function handleCloudinaryUpload(file: File) {
  try {
    const result = await uploadImageToCloudinary(file, 'akamba-handicraft/products')
    
    return NextResponse.json({ 
      success: true, 
      url: result.url,
      filename: result.publicId,
      cloudinaryId: result.publicId,
      cloudinaryUrl: result.url,
      width: result.width,
      height: result.height,
      format: file.type.split('/')[1] || 'jpg',
      fileSize: file.size,
      isCloudinary: true
    })
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}
