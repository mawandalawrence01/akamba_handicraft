"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  X, 
  Save, 
  Eye,
  Image as ImageIcon,
  Video,
  Trash2,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'
import { CldImage } from 'next-cloudinary'
import { AdminPageLayout, AdminCard } from '@/components/admin/admin-page-layout'
import { OptimizedImage } from '@/components/ui/optimized-image'

interface ProductImage {
  id: string
  url: string
  altText: string
  isPrimary: boolean
  is360View: boolean
}

interface ProductVideo {
  id: string
  url: string
  title: string
  description: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  sku: string
  price: number
  compareAtPrice?: number
  costPrice?: number
  weight?: number
  dimensions?: any
  materials: string[]
  colors: string[]
  isHandmade: boolean
  isFeatured: boolean
  isActive: boolean
  inStock: boolean
  stockQuantity: number
  minOrderQty: number
  maxOrderQty?: number
  tags: string[]
  metaTitle?: string
  metaDescription?: string
  viewCount: number
  likeCount: number
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
  }
  artisan?: {
    id: string
    name: string
  }
  images: ProductImage[]
  videos: ProductVideo[]
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [previewMode, setPreviewMode] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)

  // Helper function to check if image is from Cloudinary
  const isCloudinaryImage = (url: string) => {
    return url && (url.includes('cloudinary.com') || url.includes('res.cloudinary.com'))
  }

  // Helper function to get Cloudinary public ID from URL
  const getCloudinaryPublicId = (url: string) => {
    if (!isCloudinaryImage(url)) return null
    const parts = url.split('/')
    const filename = parts[parts.length - 1]
    return filename.split('.')[0] // Remove file extension
  }

  // Helper function to ensure image URLs are properly formatted
  const getImageUrl = (url: string) => {
    if (!url) return null
    // If URL already starts with /, return as is
    if (url.startsWith('/')) return url
    // If URL doesn't start with /, add it
    return `/${url}`
  }

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    compareAtPrice: '',
    costPrice: '',
    sku: '',
    categoryId: '',
    artisanId: '',
    inStock: true,
    stockQuantity: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    materials: [''],
    colors: [''],
    tags: [''],
    metaTitle: '',
    metaDescription: '',
    isActive: true,
    isFeatured: false,
    isHandmade: true,
    minOrderQty: '1',
    maxOrderQty: ''
  })

  const [images, setImages] = useState<ProductImage[]>([])
  const [videos, setVideos] = useState<ProductVideo[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([])
  const [artisans, setArtisans] = useState<Array<{id: string, name: string}>>([])
  const [loadingData, setLoadingData] = useState(true)

  // Fetch product data and form dependencies
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data
        const productResponse = await fetch(`/api/admin/products/${productId}`)
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product')
        }
        const productData = await productResponse.json()
        setProduct(productData.product)

        // Populate form with product data
        const product = productData.product
        setFormData({
          name: product.name || '',
          description: product.description || '',
          shortDescription: product.shortDescription || '',
          price: product.price?.toString() || '',
          compareAtPrice: product.compareAtPrice?.toString() || '',
          costPrice: product.costPrice?.toString() || '',
          sku: product.sku || '',
          categoryId: product.category?.id || '',
          artisanId: product.artisan?.id || '',
          inStock: product.inStock ?? true,
          stockQuantity: product.stockQuantity?.toString() || '',
          weight: product.weight?.toString() || '',
          dimensions: {
            length: product.dimensions?.length?.toString() || '',
            width: product.dimensions?.width?.toString() || '',
            height: product.dimensions?.height?.toString() || ''
          },
          materials: product.materials?.length ? product.materials : [''],
          colors: product.colors?.length ? product.colors : [''],
          tags: product.tags?.length ? product.tags : [''],
          metaTitle: product.metaTitle || '',
          metaDescription: product.metaDescription || '',
          isActive: product.isActive ?? true,
          isFeatured: product.isFeatured ?? false,
          isHandmade: product.isHandmade ?? true,
          minOrderQty: product.minOrderQty?.toString() || '1',
          maxOrderQty: product.maxOrderQty?.toString() || ''
        })

        setImages(product.images || [])
        setVideos(product.videos || [])

        // Fetch categories
        const categoriesResponse = await fetch('/api/admin/categories')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData.categories)
        }

        // Fetch artisans
        const artisansResponse = await fetch('/api/admin/artisans')
        if (artisansResponse.ok) {
          const artisansData = await artisansResponse.json()
          setArtisans(artisansData.artisans || [])
        }

      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load product data')
        router.push('/admin/products')
      } finally {
        setLoadingProduct(false)
        setLoadingData(false)
      }
    }

    if (productId) {
      fetchData()
    }
  }, [productId, router])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDimensionChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [field]: value
      }
    }))
  }

  const handleArrayFieldChange = (field: 'materials' | 'colors' | 'tags', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayField = (field: 'materials' | 'colors' | 'tags') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayField = (field: 'materials' | 'colors' | 'tags', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true)
    
    const uploadPromises = Array.from(files).map(async (file, index) => {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const result = await response.json()
        
        return {
          id: `temp-${Date.now()}-${index}`,
          url: result.url,
          altText: file.name.split('.')[0], // Remove file extension
          isPrimary: images.length === 0 && index === 0,
          is360View: false
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        toast.error(`Failed to upload ${file.name}`)
        return null
      }
    })

    const uploadedImages = await Promise.all(uploadPromises)
    const validImages = uploadedImages.filter(img => img !== null)
    
    if (validImages.length > 0) {
      setImages(prev => [...prev, ...validImages])
      toast.success(`${validImages.length} image(s) uploaded successfully`)
    }
    
    setUploadingImages(false)
  }

  const removeImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
  }

  const setPrimaryImage = (imageId: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    })))
  }

  const handleVideoAdd = () => {
    const newVideo = {
      id: `temp-${Date.now()}`,
      url: '',
      title: '',
      description: ''
    }
    setVideos(prev => [...prev, newVideo])
  }

  const handleVideoChange = (videoId: string, field: string, value: string) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId ? { ...video, [field]: value } : video
    ))
  }

  const removeVideo = (videoId: string) => {
    setVideos(prev => prev.filter(video => video.id !== videoId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare dimensions object
      const dimensions = formData.dimensions.length || formData.dimensions.width || formData.dimensions.height 
        ? {
            length: formData.dimensions.length ? parseFloat(formData.dimensions.length) : null,
            width: formData.dimensions.width ? parseFloat(formData.dimensions.width) : null,
            height: formData.dimensions.height ? parseFloat(formData.dimensions.height) : null
          }
        : null

      // Filter out empty array items
      const materials = formData.materials.filter(m => m.trim() !== '')
      const colors = formData.colors.filter(c => c.trim() !== '')
      const tags = formData.tags.filter(t => t.trim() !== '')

      const updateData = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription || null,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
        sku: formData.sku,
        categoryId: formData.categoryId,
        artisanId: formData.artisanId || null,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions,
        materials,
        colors,
        tags,
        metaTitle: formData.metaTitle || null,
        metaDescription: formData.metaDescription || null,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        isHandmade: formData.isHandmade,
        minOrderQty: parseInt(formData.minOrderQty) || 1,
        maxOrderQty: formData.maxOrderQty ? parseInt(formData.maxOrderQty) : null,
        inStock: parseInt(formData.stockQuantity) > 0,
        images: images.map((img, index) => ({
          id: img.id.startsWith('temp-') ? undefined : img.id,
          url: img.url,
          altText: img.altText,
          sortOrder: index,
          isPrimary: img.isPrimary,
          is360View: img.is360View
        })),
        videos: videos.map((video, index) => ({
          id: video.id.startsWith('temp-') ? undefined : video.id,
          url: video.url,
          title: video.title,
          description: video.description,
          sortOrder: index
        }))
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        toast.success('Product updated successfully!')
        router.push('/admin/products')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  if (loadingProduct) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading product...</span>
          </div>
        </div>
      </AdminPageLayout>
    )
  }

  if (!product) {
    return (
      <AdminPageLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/admin/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/products">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600 mt-1">
                Update product information and settings
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link href="/admin/products">
              <Button variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" form="product-edit-form" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Product
                </>
              )}
            </Button>
          </div>
        </div>

        <form id="product-edit-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <AdminCard>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU *</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => handleInputChange('sku', e.target.value)}
                        placeholder="Enter SKU"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <Textarea
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                      placeholder="Brief description for product cards"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Full Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Detailed product description"
                      rows={6}
                      required
                    />
                  </div>
                </CardContent>
              </AdminCard>

              {/* Pricing */}
              <AdminCard>
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="compareAtPrice">Compare at Price</Label>
                      <Input
                        id="compareAtPrice"
                        type="number"
                        step="0.01"
                        value={formData.compareAtPrice}
                        onChange={(e) => handleInputChange('compareAtPrice', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="costPrice">Cost Price</Label>
                      <Input
                        id="costPrice"
                        type="number"
                        step="0.01"
                        value={formData.costPrice}
                        onChange={(e) => handleInputChange('costPrice', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                      <Input
                        id="stockQuantity"
                        type="number"
                        value={formData.stockQuantity}
                        onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                        placeholder="0"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.01"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minOrderQty">Minimum Order Quantity</Label>
                      <Input
                        id="minOrderQty"
                        type="number"
                        value={formData.minOrderQty}
                        onChange={(e) => handleInputChange('minOrderQty', e.target.value)}
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxOrderQty">Maximum Order Quantity</Label>
                      <Input
                        id="maxOrderQty"
                        type="number"
                        value={formData.maxOrderQty}
                        onChange={(e) => handleInputChange('maxOrderQty', e.target.value)}
                        placeholder="No limit"
                      />
                    </div>
                  </div>
                </CardContent>
              </AdminCard>

              {/* Dimensions */}
              <AdminCard>
                <CardHeader>
                  <CardTitle>Dimensions (cm)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="length">Length</Label>
                      <Input
                        id="length"
                        type="number"
                        step="0.1"
                        value={formData.dimensions.length}
                        onChange={(e) => handleDimensionChange('length', e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        type="number"
                        step="0.1"
                        value={formData.dimensions.width}
                        onChange={(e) => handleDimensionChange('width', e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        value={formData.dimensions.height}
                        onChange={(e) => handleDimensionChange('height', e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                  </div>
                </CardContent>
              </AdminCard>

              {/* Materials */}
              <AdminCard>
                <CardHeader>
                  <CardTitle>Materials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.materials.map((material, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={material}
                        onChange={(e) => handleArrayFieldChange('materials', index, e.target.value)}
                        placeholder="Enter material"
                      />
                      {formData.materials.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayField('materials', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayField('materials')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Material
                  </Button>
                </CardContent>
              </AdminCard>

              {/* Colors */}
              <AdminCard>
                <CardHeader>
                  <CardTitle>Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={color}
                        onChange={(e) => handleArrayFieldChange('colors', index, e.target.value)}
                        placeholder="Enter color"
                      />
                      {formData.colors.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayField('colors', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayField('colors')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Color
                  </Button>
                </CardContent>
              </AdminCard>

              {/* Tags */}
              <AdminCard>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={tag}
                        onChange={(e) => handleArrayFieldChange('tags', index, e.target.value)}
                        placeholder="Enter tag"
                      />
                      {formData.tags.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayField('tags', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayField('tags')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tag
                  </Button>
                </CardContent>
              </AdminCard>

              {/* SEO */}
              <AdminCard>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                      placeholder="SEO title for search engines"
                    />
                  </div>
                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                      placeholder="SEO description for search engines"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </AdminCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status & Settings */}
              <AdminCard>
                <CardHeader>
                  <CardTitle>Status & Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isActive">Active</Label>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isFeatured">Featured</Label>
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isHandmade">Handmade</Label>
                    <Switch
                      id="isHandmade"
                      checked={formData.isHandmade}
                      onCheckedChange={(checked) => handleInputChange('isHandmade', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inStock">In Stock</Label>
                    <Switch
                      id="inStock"
                      checked={formData.inStock}
                      onCheckedChange={(checked) => handleInputChange('inStock', checked)}
                    />
                  </div>
                </CardContent>
              </AdminCard>

              {/* Category & Artisan */}
              <AdminCard>
                <CardHeader>
                  <CardTitle>Category & Artisan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => handleInputChange('categoryId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="artisan">Artisan</Label>
                    <Select
                      value={formData.artisanId || "none"}
                      onValueChange={(value) => handleInputChange('artisanId', value === "none" ? "" : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select artisan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No artisan</SelectItem>
                        {artisans.map((artisan) => (
                          <SelectItem key={artisan.id} value={artisan.id}>
                            {artisan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </AdminCard>

              {/* Images */}
              <AdminCard>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragOver ? 'border-amber-500 bg-amber-50' : 
                      uploadingImages ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragOver(true)
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setDragOver(false)
                      if (!uploadingImages) {
                        handleImageUpload(e.dataTransfer.files)
                      }
                    }}
                  >
                    {uploadingImages ? (
                      <>
                        <Loader2 className="h-8 w-8 mx-auto text-blue-500 mb-2 animate-spin" />
                        <p className="text-sm text-blue-600 mb-2">
                          Uploading images...
                        </p>
                        <p className="text-xs text-gray-500">
                          Please wait while your images are being processed
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Drag & drop images here or click to upload
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          Supports JPG, PNG, GIF up to 5MB each
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                          className="hidden"
                          id="image-upload"
                          disabled={uploadingImages}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('image-upload')?.click()}
                          disabled={uploadingImages}
                        >
                          Choose Images
                        </Button>
                      </>
                    )}
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div key={image.id} className="relative group border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                          <div className="aspect-square relative">
                            <OptimizedImage
                              src={image.url}
                              alt={image.altText}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              quality="auto"
                              format="auto"
                              onError={(e) => {
                                console.error('Image failed to load:', image.url)
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                            {image.isPrimary && (
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-amber-500 text-white text-xs font-medium">
                                  Primary
                                </Badge>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 flex space-x-2 transition-opacity duration-200">
                                {!image.isPrimary && (
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setPrimaryImage(image.id)}
                                    className="bg-white text-gray-900 hover:bg-gray-100 shadow-sm"
                                  >
                                    Set Primary
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeImage(image.id)}
                                  className="shadow-sm"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 border-t bg-gray-50">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {image.altText}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {image.isPrimary ? 'Primary Image' : 'Secondary Image'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 truncate">
                              {image.url}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </AdminCard>

              {/* Videos */}
              <AdminCard>
                <CardHeader>
                  <CardTitle>Product Videos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVideoAdd}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Video
                  </Button>

                  {videos.length > 0 && (
                    <div className="space-y-3">
                      {videos.map((video) => (
                        <div key={video.id} className="p-3 border rounded space-y-2">
                          <Input
                            placeholder="Video URL"
                            value={video.url}
                            onChange={(e) => handleVideoChange(video.id, 'url', e.target.value)}
                          />
                          <Input
                            placeholder="Video title"
                            value={video.title}
                            onChange={(e) => handleVideoChange(video.id, 'title', e.target.value)}
                          />
                          <Textarea
                            placeholder="Video description"
                            value={video.description}
                            onChange={(e) => handleVideoChange(video.id, 'description', e.target.value)}
                            rows={2}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeVideo(video.id)}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Video
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </AdminCard>
            </div>
          </div>

        </form>
      </div>
    </AdminPageLayout>
  )
}
