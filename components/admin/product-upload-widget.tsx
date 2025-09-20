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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Product Images ({images.length}/{maxImages})
            </div>
            {images.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllImages}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <div className="space-y-4">
              <Separator />
              <h4 className="font-medium">Manage Images</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

                      {/* Cloudinary Badge */}
                      {image.isCloudinary && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs">
                            Cloudinary
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
                    
                    <div className="p-3 space-y-3">
                      {/* Alt Text Input */}
                      <div className="space-y-1">
                        <Label htmlFor={`alt-${image.id}`} className="text-xs font-medium">
                          Alt Text
                        </Label>
                        <Input
                          id={`alt-${image.id}`}
                          value={image.altText}
                          onChange={(e) => updateImage(image.id, { altText: e.target.value })}
                          placeholder="Describe this image"
                          className="text-xs"
                        />
                      </div>

                      {/* Image Settings */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`360-${image.id}`} className="text-xs">
                            360° View
                          </Label>
                          <Switch
                            id={`360-${image.id}`}
                            checked={image.is360View}
                            onCheckedChange={(checked) => updateImage(image.id, { is360View: checked })}
                          />
                        </div>
                      </div>

                      {/* Image Info */}
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Size:</span>
                          <span>{image.width} × {image.height}</span>
                        </div>
                        {image.fileSize && (
                          <div className="flex items-center justify-between">
                            <span>File:</span>
                            <span>{Math.round(image.fileSize / 1024)} KB</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span>Order:</span>
                          <span>{index + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Guidelines */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2 text-blue-800">
              <Settings className="h-4 w-4" />
              Upload Guidelines
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• First image will be set as primary automatically</div>
              <div>• Use high-quality images (minimum 800x800px recommended)</div>
              <div>• Supported formats: JPG, PNG, GIF, WebP</div>
              <div>• Maximum file size: 10MB per image</div>
              <div>• Add descriptive alt text for accessibility</div>
              <div>• Enable 360° view for interactive product images</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
