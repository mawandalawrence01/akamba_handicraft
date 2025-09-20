"use client"

import { useState } from 'react'
import { AdminPageLayout } from '@/components/admin/admin-page-layout'
import { CloudinaryUploadWidget } from '@/components/cloudinary-upload-widget'
import { ProductUploadWidget } from '@/components/admin/product-upload-widget'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Upload, TestTube, Image as ImageIcon } from 'lucide-react'

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

export default function TestUploadPage() {
  const [basicUploads, setBasicUploads] = useState<CloudinaryUploadResult[]>([])
  const [productImages, setProductImages] = useState<ProductImage[]>([])

  const handleBasicUploadSuccess = (result: CloudinaryUploadResult) => {
    setBasicUploads(prev => [...prev, result])
  }

  const handleBasicUploadError = (error: any) => {
    console.error('Basic upload error:', error)
  }

  const clearBasicUploads = () => {
    setBasicUploads([])
  }

  const clearProductImages = () => {
    setProductImages([])
  }

  return (
    <AdminPageLayout
      title="Upload Widget Test"
      description="Test the Cloudinary upload widget functionality"
    >
      <div className="space-y-6">
        {/* Basic Upload Widget Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Basic Upload Widget Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CloudinaryUploadWidget
              onUploadSuccess={handleBasicUploadSuccess}
              onUploadError={handleBasicUploadError}
              multiple={true}
              maxFiles={5}
              folder="akamba-handicraft/test"
              cropping={true}
              croppingAspectRatio={1}
              showAdvancedOptions={true}
              allowedFormats={['jpg', 'jpeg', 'png', 'gif', 'webp']}
              maxFileSize={10000000} // 10MB
              theme="purple"
              buttonText="Test Basic Upload"
              buttonVariant="default"
              className="w-full"
            />

            {basicUploads.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Upload Results ({basicUploads.length})</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearBasicUploads}
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {basicUploads.map((upload, index) => (
                    <div key={upload.public_id} className="border rounded-lg p-4 space-y-2">
                      <img
                        src={upload.secure_url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{upload.format.toUpperCase()}</Badge>
                          <Badge variant="outline">{Math.round(upload.bytes / 1024)} KB</Badge>
                        </div>
                        <p className="text-xs text-gray-600">
                          {upload.width} × {upload.height}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          ID: {upload.public_id}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* Product Upload Widget Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Product Upload Widget Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductUploadWidget
              existingImages={productImages}
              onImagesChange={setProductImages}
              maxImages={5}
              className="w-full"
            />

            {productImages.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Product Images ({productImages.length})</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearProductImages}
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {productImages.map((image, index) => (
                    <div key={image.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-4">
                        <img
                          src={image.url}
                          alt={image.altText}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{image.altText}</span>
                            {image.isPrimary && (
                              <Badge className="bg-amber-500 text-white text-xs">Primary</Badge>
                            )}
                            {image.is360View && (
                              <Badge variant="secondary" className="text-xs">360°</Badge>
                            )}
                            {image.isCloudinary && (
                              <Badge variant="outline" className="text-xs">Cloudinary</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            {image.width} × {image.height} • {image.format?.toUpperCase()} • {image.fileSize ? Math.round(image.fileSize / 1024) : 'N/A'} KB
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {image.cloudinaryId}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Features Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Widget Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-green-700">✅ Available Features</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Drag & drop multiple images</li>
                  <li>• Upload from URL, camera, cloud storage</li>
                  <li>• Built-in image cropping and transformations</li>
                  <li>• Automatic format optimization (WebP, AVIF)</li>
                  <li>• Real-time upload progress</li>
                  <li>• Image preview and management</li>
                  <li>• Alt text and metadata editing</li>
                  <li>• Primary image selection</li>
                  <li>• 360° view toggle</li>
                  <li>• File size and format validation</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-blue-700">🔧 Configuration</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Max file size: 10MB per image</li>
                  <li>• Supported formats: JPG, PNG, GIF, WebP</li>
                  <li>• Upload folder: akamba-handicraft/products</li>
                  <li>• Cropping: Enabled with 1:1 aspect ratio</li>
                  <li>• Advanced options: Enabled</li>
                  <li>• Theme: Purple</li>
                  <li>• Multiple uploads: Enabled</li>
                  <li>• Auto-optimization: Enabled</li>
                  <li>• CDN delivery: Global</li>
                  <li>• Security: Admin authentication required</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  )
}
