"use client"

import Image from 'next/image'
import { CldImage } from 'next-cloudinary'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
  quality?: number | 'auto'
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb'
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
  // Cloudinary metadata from database
  cloudinaryId?: string
  isCloudinary?: boolean
  cloudinaryUrl?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  sizes,
  priority = false,
  quality = 'auto',
  crop = 'fill',
  format = 'auto',
  onError,
  onLoad,
  cloudinaryId,
  isCloudinary,
  cloudinaryUrl,
  ...props
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)

  // Check if the image is from Cloudinary
  const isCloudinaryImage = (url: string) => {
    return url && (url.includes('cloudinary.com') || url.includes('res.cloudinary.com'))
  }

  // Get Cloudinary public ID from URL
  const getCloudinaryPublicId = (url: string) => {
    if (!isCloudinaryImage(url)) return null
    
    try {
      // Extract public ID from Cloudinary URL
      // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
      const urlParts = url.split('/')
      const uploadIndex = urlParts.findIndex(part => part === 'upload')
      
      if (uploadIndex !== -1 && urlParts[uploadIndex + 2]) {
        // Get everything after the version number
        const publicIdParts = urlParts.slice(uploadIndex + 2)
        return publicIdParts.join('/').replace(/\.[^/.]+$/, '') // Remove file extension
      }
      
      // Fallback: try to extract from the end of the URL
      const filename = urlParts[urlParts.length - 1]
      return filename ? filename.split('.')[0] : null
    } catch (error) {
      console.error('Error extracting Cloudinary public ID:', error)
      return null
    }
  }

  // Handle image error
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true)
    if (onError) {
      onError(e)
    }
  }

  // Handle image load
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (onLoad) {
      onLoad(e)
    }
  }

  // If image failed to load, show placeholder
  if (imageError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <span className="text-gray-400 text-sm">Image unavailable</span>
      </div>
    )
  }

  // Use CldImage for Cloudinary images
  // Priority: 1. Use cloudinaryId from props, 2. Extract from URL, 3. Check URL pattern
  if (isCloudinary || isCloudinaryImage(src)) {
    const publicId = cloudinaryId || getCloudinaryPublicId(src)
    
    if (publicId) {
      return (
        <CldImage
          src={publicId}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          className={className}
          sizes={sizes}
          priority={priority}
          quality={quality}
          crop={crop}
          format={format}
          onError={handleError}
          onLoad={handleLoad}
          {...props}
        />
      )
    }
  }

  // Fallback to regular Next.js Image for local images or if Cloudinary fails
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      quality={typeof quality === 'number' ? quality : 75}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  )
}

// Helper function to check if an image URL is from Cloudinary
export const isCloudinaryImage = (url: string) => {
  return url && (url.includes('cloudinary.com') || url.includes('res.cloudinary.com'))
}

// Helper function to get Cloudinary public ID from URL
export const getCloudinaryPublicId = (url: string) => {
  if (!isCloudinaryImage(url)) return null
  
  try {
    const urlParts = url.split('/')
    const uploadIndex = urlParts.findIndex(part => part === 'upload')
    
    if (uploadIndex !== -1 && urlParts[uploadIndex + 2]) {
      const publicIdParts = urlParts.slice(uploadIndex + 2)
      return publicIdParts.join('/').replace(/\.[^/.]+$/, '')
    }
    
    const filename = urlParts[urlParts.length - 1]
    return filename ? filename.split('.')[0] : null
  } catch (error) {
    console.error('Error extracting Cloudinary public ID:', error)
    return null
  }
}
