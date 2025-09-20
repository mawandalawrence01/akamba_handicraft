"use client"

import { useState, useEffect } from 'react'
import { CloudinaryUploadWidget, useCloudinaryUpload } from '@/components/cloudinary-upload-widget'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { 
  Upload, 
  X, 
  Check, 
  Star, 
  RotateCcw, 
  Settings,
  Image as ImageIcon,
  Trash2
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ProductImage {
  id: string
  url: string
  altText: string
  sortOrder: number
  isPrimary: boolean
  is360View: boolean
  cloudinaryId?: string
  cloudinaryUrl?: string
  width?: number
  height?: number
  format?: string
  fileSize?: number
  isCloudinary?: boolean
}

interface ProductUploadWidgetProps {
  existingImages?: ProductImage[]
  onImagesChange?: (images: ProductImage[]) => void
  maxImages?: number
  className?: string
}

export function ProductUploadWidget({
  existingImages = [],
  onImagesChange,
  maxImages = 10,
  className = ''
}: ProductUploadWidgetProps) {
  const [images, setImages] = useState<ProductImage[]>(existingImages)
  const [isUploading, setIsUploading] = useState(false)
  const { uploadedImages, handleUploadSuccess, handleUploadError, clearImages } = useCloudinaryUpload()

  // Update parent component when images change
  useEffect(() => {
    onImagesChange?.(images)
  }, [images, onImagesChange])

  // Convert uploaded images to product images
  useEffect(() => {
    if (uploadedImages.length > 0) {
      const newProductImages: ProductImage[] = uploadedImages.map((upload, index) => ({
        id: `temp-${Date.now()}-${index}`,
        url: upload.secure_url,
        altText: `Product image ${images.length + index + 1}`,
        sortOrder: images.length + index,
        isPrimary: images.length === 0 && index === 0, // First image is primary if no existing images
        is360View: false,
        cloudinaryId: upload.public_id,
        cloudinaryUrl: upload.secure_url,
        width: upload.width,
        height: upload.height,
        format: upload.format,
        fileSize: upload.bytes,
        isCloudinary: true
      }))

      setImages(prev => [...prev, ...newProductImages])
      clearImages() // Clear the uploaded images after processing
    }
  }, [uploadedImages, images.length, clearImages])

  const updateImage = (id: string, updates: Partial<ProductImage>) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, ...updates } : img
    ))
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
    toast.success('Image removed')
  }

  const setPrimaryImage = (id: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isPrimary: img.id === id
    })))
    toast.success('Primary image updated')
  }

  const reorderImages = (fromIndex: number, toIndex: number) => {
    setImages(prev => {
      const newImages = [...prev]
      const [movedImage] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, movedImage)
      
      // Update sort orders
      return newImages.map((img, index) => ({
        ...img,
        sortOrder: index
      }))
    })
  }

  const clearAllImages = () => {
    setImages([])
    toast.success('All images cleared')
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Upload Widget */}
        <CloudinaryUploadWidget
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          multiple={true}
          maxFiles={maxImages - images.length}
          folder="akamba-handicraft/products"
          cropping={true}
          croppingAspectRatio={1}
          showAdvancedOptions={true}
          allowedFormats={['jpg', 'jpeg', 'png', 'gif', 'webp']}
          maxFileSize={10000000} // 10MB
          theme="purple"
          buttonText={`Upload Images (${maxImages - images.length} remaining)`}
          buttonVariant="default"
          className="w-full"
        />

        {/* Image Management */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={image.id} className="relative group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square relative">
                  <img
                    src={image.url}
                    alt={image.altText}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Primary Badge */}
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-amber-500 text-white text-xs font-medium">
                        <Star className="h-3 w-3 mr-1" />
                        Primary
                      </Badge>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center gap-2">
                    {!image.isPrimary && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setPrimaryImage(image.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(image.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-2 space-y-2">
                  {/* Alt Text Input */}
                  <Input
                    value={image.altText}
                    onChange={(e) => updateImage(image.id, { altText: e.target.value })}
                    placeholder="Alt text"
                    className="text-xs h-8"
                  />

                  {/* 360° View Toggle */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`360-${image.id}`} className="text-xs">
                      360°
                    </Label>
                    <Switch
                      id={`360-${image.id}`}
                      checked={image.is360View}
                      onCheckedChange={(checked) => updateImage(image.id, { is360View: checked })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
