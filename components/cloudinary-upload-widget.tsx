"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, X, Check, AlertCircle, Image as ImageIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'

// Extend the Window interface to include cloudinary
declare global {
  interface Window {
    cloudinary: any
  }
}

interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
  created_at: string
  asset_id: string
  version: number
  version_id: string
  signature: string
  resource_type: string
  tags: string[]
  folder: string
  access_mode: string
  context: any
  metadata: any
}

interface CloudinaryUploadWidgetProps {
  onUploadSuccess?: (result: CloudinaryUploadResult) => void
  onUploadError?: (error: any) => void
  multiple?: boolean
  maxFiles?: number
  folder?: string
  cropping?: boolean
  croppingAspectRatio?: number
  showAdvancedOptions?: boolean
  allowedFormats?: string[]
  maxFileSize?: number
  theme?: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'grey'
  className?: string
  buttonText?: string
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export function CloudinaryUploadWidget({
  onUploadSuccess,
  onUploadError,
  multiple = true,
  maxFiles = 10,
  folder = 'akamba-handicraft/products',
  cropping = true,
  croppingAspectRatio = 1,
  showAdvancedOptions = true,
  allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  maxFileSize = 10000000, // 10MB
  theme = 'purple',
  className = '',
  buttonText = 'Upload Images',
  buttonVariant = 'default'
}: CloudinaryUploadWidgetProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<CloudinaryUploadResult[]>([])
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false)
  const uploadWidgetRef = useRef<any>(null)

  // Load Cloudinary widget script
  useEffect(() => {
    const loadCloudinaryScript = () => {
      if (window.cloudinary) {
        setIsWidgetLoaded(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js'
      script.async = true
      script.onload = () => {
        setIsWidgetLoaded(true)
      }
      script.onerror = () => {
        console.error('Failed to load Cloudinary widget script')
        toast.error('Failed to load upload widget')
      }
      document.head.appendChild(script)
    }

    loadCloudinaryScript()
  }, [])

  // Initialize upload widget
  useEffect(() => {
    if (!isWidgetLoaded || !window.cloudinary) return

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    if (!cloudName) {
      console.error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set')
      toast.error('Cloudinary configuration missing')
      return
    }

    uploadWidgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: 'akamba_handicraft', // Make sure this preset exists in Cloudinary
        sources: ['local', 'url', 'camera', 'image_search', 'google_drive', 'dropbox'],
        multiple: multiple,
        maxFiles: maxFiles,
        folder: folder,
        cropping: cropping,
        croppingAspectRatio: croppingAspectRatio,
        showAdvancedOptions: showAdvancedOptions,
        clientAllowedFormats: allowedFormats,
        maxFileSize: maxFileSize,
        theme: theme,
        styles: {
          palette: {
            window: '#FFFFFF',
            sourceBg: '#F4F4F5',
            windowBorder: '#90A0B3',
            tabIcon: '#0078FF',
            inactiveTabIcon: '#69778A',
            menuIcons: '#0078FF',
            link: '#0078FF',
            action: '#0078FF',
            inProgress: '#0078FF',
            complete: '#20B832',
            error: '#EA2727',
            textDark: '#000000',
            textLight: '#FFFFFF'
          },
          fonts: {
            default: null,
            "'Inter', sans-serif": {
              url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
              active: true
            }
          }
        },
        text: {
          en: {
            local: {
              menu_title: 'Upload from Device',
              menu_dropbox: 'Dropbox',
              menu_google_drive: 'Google Drive',
              menu_url: 'Upload from URL',
              menu_camera: 'Take Photo',
              menu_image_search: 'Search Images'
            }
          }
        }
      },
      (error: any, result: any) => {
        if (error) {
          console.error('Upload widget error:', error)
          toast.error('Upload failed: ' + (error.message || 'Unknown error'))
          onUploadError?.(error)
          setIsLoading(false)
          return
        }

        if (result && result.event === 'success') {
          console.log('Upload successful:', result.info)
          const uploadResult: CloudinaryUploadResult = result.info
          
          setUploadedImages(prev => [...prev, uploadResult])
          toast.success('Image uploaded successfully!')
          onUploadSuccess?.(uploadResult)
          setIsLoading(false)
        }

        if (result && result.event === 'upload-added') {
          setIsLoading(true)
          toast.loading('Uploading image...', { id: 'upload' })
        }

        if (result && result.event === 'upload-progress') {
          const progress = Math.round(result.info.progress.percent)
          toast.loading(`Uploading... ${progress}%`, { id: 'upload' })
        }

        if (result && result.event === 'upload-complete') {
          toast.success('Upload complete!', { id: 'upload' })
        }
      }
    )
  }, [isWidgetLoaded, multiple, maxFiles, folder, cropping, croppingAspectRatio, showAdvancedOptions, allowedFormats, maxFileSize, theme, onUploadSuccess, onUploadError])

  const openUploadWidget = () => {
    if (!uploadWidgetRef.current) {
      toast.error('Upload widget not ready')
      return
    }
    uploadWidgetRef.current.open()
  }

  const removeImage = (publicId: string) => {
    setUploadedImages(prev => prev.filter(img => img.public_id !== publicId))
  }

  const clearAllImages = () => {
    setUploadedImages([])
  }

  if (!isWidgetLoaded) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading upload widget...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Cloudinary Upload Widget
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Button */}
          <Button
            onClick={openUploadWidget}
            disabled={isLoading}
            variant={buttonVariant}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {buttonText}
              </>
            )}
          </Button>

          {/* Uploaded Images Display */}
          {uploadedImages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Uploaded Images ({uploadedImages.length})</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllImages}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={image.public_id} className="relative group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-square relative">
                      <img
                        src={image.secure_url}
                        alt={`Uploaded image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(image.public_id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {image.format.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(image.bytes / 1024)} KB
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <Check className="h-3 w-3 text-green-500" />
                          <span>Uploaded successfully</span>
                        </div>
                        <div className="text-gray-500">
                          {image.width} × {image.height}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Upload Features
            </h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• Drag & drop multiple images</div>
              <div>• Upload from URL, camera, or cloud storage</div>
              <div>• Automatic image optimization</div>
              <div>• Built-in cropping and transformations</div>
              <div>• Max file size: {Math.round(maxFileSize / 1024 / 1024)}MB</div>
              <div>• Supported formats: {allowedFormats.join(', ').toUpperCase()}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for using the upload widget
export function useCloudinaryUpload() {
  const [uploadedImages, setUploadedImages] = useState<CloudinaryUploadResult[]>([])

  const handleUploadSuccess = (result: CloudinaryUploadResult) => {
    setUploadedImages(prev => [...prev, result])
  }

  const handleUploadError = (error: any) => {
    console.error('Upload error:', error)
  }

  const clearImages = () => {
    setUploadedImages([])
  }

  const removeImage = (publicId: string) => {
    setUploadedImages(prev => prev.filter(img => img.public_id !== publicId))
  }

  return {
    uploadedImages,
    handleUploadSuccess,
    handleUploadError,
    clearImages,
    removeImage
  }
}
