"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
  Trash2
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
import axios from 'axios'
import { AdminPageLayout, AdminCard } from '@/components/admin/admin-page-layout'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { ProductUploadWidget } from '@/components/admin/product-upload-widget'

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

interface ProductVideo {
  id: string
  url: string
  title: string
  description: string
}

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

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
    originalPrice: '',
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
    tags: [''],
    metaTitle: '',
    metaDescription: '',
    isActive: true,
    isFeatured: false
  })

  const [images, setImages] = useState<ProductImage[]>([])
  const [videos, setVideos] = useState<ProductVideo[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([])
  const [artisans, setArtisans] = useState<Array<{id: string, name: string}>>([])
  const [loadingData, setLoadingData] = useState(true)

  // Fetch categories and artisans on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, artisansRes] = await Promise.all([
          axios.get('/api/admin/categories'),
          axios.get('/api/admin/artisans')
        ])
        
        setCategories(categoriesRes.data.categories)
        setArtisans(artisansRes.data.artisans)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load categories and artisans')
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item: string, i: number) => 
        i === index ? value : item
      )
    }))
  }

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), '']
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_: any, i: number) => i !== index)
    }))
  }

  const handleImageUpload = (files: FileList) => {
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newImage: ProductImage = {
            id: `temp-${Date.now()}-${index}`,
            url: e.target?.result as string,
            altText: `${formData.name} - Image ${images.length + index + 1}`,
            sortOrder: images.length + index,
            isPrimary: images.length === 0 && index === 0,
            is360View: false,
            cloudinaryId: undefined,
            cloudinaryUrl: undefined,
            width: undefined,
            height: undefined,
            format: undefined,
            fileSize: undefined,
            isCloudinary: false
          }
          setImages(prev => [...prev, newImage])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    handleImageUpload(files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stockQuantity: parseInt(formData.stockQuantity),
        weight: parseFloat(formData.weight),
        dimensions: {
          length: parseFloat(formData.dimensions.length),
          width: parseFloat(formData.dimensions.width),
          height: parseFloat(formData.dimensions.height)
        },
        materials: (formData.materials as string[]).filter(m => m.trim()),
        tags: (formData.tags as string[]).filter(t => t.trim()),
        images,
        videos
      }

      const response = await axios.post('/api/admin/products', productData)
      
      if (response.status === 201) {
        toast.success('Product created successfully!')
        router.push('/admin/products')
      }
    } catch (error: any) {
      console.error('Error creating product:', error)
      
      // Handle specific error responses
      if (error.response?.data?.error) {
        const errorData = error.response.data
        toast.error(`${errorData.error}: ${errorData.details || 'Please try again'}`)
      } else {
        toast.error('Failed to create product. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminPageLayout
        title="Add New Product"
        description="Create a new handcraft product for your catalog"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading || loadingData}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Creating...' : loadingData ? 'Loading...' : 'Create Product'}
            </Button>
          </div>
        }
      >

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Product Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Traditional Elephant Carving"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="e.g., ELE-001"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Input
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    placeholder="Brief product description for listings"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed product description, crafting process, cultural significance..."
                    rows={6}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing and Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="89.99"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (USD)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                      placeholder="120.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                      placeholder="10"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) => handleInputChange('inStock', checked)}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category *</Label>
                    <Select 
                      value={formData.categoryId} 
                      onValueChange={(value) => handleInputChange('categoryId', value)}
                      disabled={loadingData}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loadingData ? "Loading categories..." : "Select category"} />
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
                  <div className="space-y-2">
                    <Label htmlFor="artisanId">Artisan</Label>
                    <Select 
                      value={formData.artisanId || undefined} 
                      onValueChange={(value) => handleInputChange('artisanId', value || '')}
                      disabled={loadingData}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loadingData ? "Loading artisans..." : "Select artisan (optional)"} />
                      </SelectTrigger>
                      <SelectContent>
                        {artisans.map((artisan) => (
                          <SelectItem key={artisan.id} value={artisan.id}>
                            {artisan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="2.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dimensions (cm)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Length"
                      type="number"
                      value={formData.dimensions.length}
                      onChange={(e) => handleInputChange('dimensions.length', e.target.value)}
                    />
                    <Input
                      placeholder="Width"
                      type="number"
                      value={formData.dimensions.width}
                      onChange={(e) => handleInputChange('dimensions.width', e.target.value)}
                    />
                    <Input
                      placeholder="Height"
                      type="number"
                      value={formData.dimensions.height}
                      onChange={(e) => handleInputChange('dimensions.height', e.target.value)}
                    />
                  </div>
                </div>

                {/* Materials */}
                <div className="space-y-2">
                  <Label>Materials</Label>
                  {formData.materials.map((material, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={material}
                        onChange={(e) => handleArrayChange('materials', index, e.target.value)}
                        placeholder="e.g., Premium Ebony Wood"
                      />
                      {formData.materials.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem('materials', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('materials')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Material
                  </Button>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={tag}
                        onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                        placeholder="e.g., traditional, handmade"
                      />
                      {formData.tags.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem('tags', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('tags')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tag
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Status */}
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
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
              </CardContent>
            </Card>

            {/* Media Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductUploadWidget
                  existingImages={images}
                  onImagesChange={setImages}
                  maxImages={10}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    placeholder="SEO title for search engines"
                  />
                </div>
                <div className="space-y-2">
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
            </Card>
          </div>
        </div>
      </form>
      </AdminPageLayout>
  )
}
