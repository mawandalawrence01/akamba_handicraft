"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Heart,
  Package,
  AlertCircle,
  CheckCircle,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { AdminPageLayout } from '@/components/admin/admin-page-layout'
import { toast } from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  stockQuantity: number
  isActive: boolean
  isFeatured: boolean
  inStock: boolean
  viewCount: number
  likeCount: number
  createdAt: string
  category: {
    name: string
  }
  artisan?: {
    name: string
  }
  images: Array<{
    id: string
    url: string
    isPrimary: boolean
    altText?: string
  }>
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  // Helper function to ensure image URLs are properly formatted
  const getImageUrl = (url: string) => {
    if (!url) return null
    // If URL already starts with /, return as is
    if (url.startsWith('/')) return url
    // If URL doesn't start with /, add it
    return `/${url}`
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchQuery, filterStatus, priceRange])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        search: searchQuery,
        status: filterStatus,
        limit: '10'
      })

      const response = await fetch(`/api/admin/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Product deleted successfully')
        fetchProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const handleToggleStatus = async (productId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (response.ok) {
        toast.success(`Product ${!isActive ? 'activated' : 'deactivated'} successfully`)
        fetchProducts()
      } else {
        toast.error('Failed to update product status')
      }
    } catch (error) {
      toast.error('Failed to update product status')
    }
  }

  const handleToggleFeatured = async (productId: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !isFeatured })
      })

      if (response.ok) {
        toast.success(`Product ${!isFeatured ? 'featured' : 'unfeatured'} successfully`)
        fetchProducts()
      } else {
        toast.error('Failed to update product featured status')
      }
    } catch (error) {
      toast.error('Failed to update product featured status')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.artisan?.name && product.artisan.name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'active' && product.isActive) ||
                         (filterStatus === 'inactive' && !product.isActive) ||
                         (filterStatus === 'featured' && product.isFeatured) ||
                         (filterStatus === 'out-of-stock' && !product.inStock)
    
    const matchesPriceRange = product.price >= priceRange.min && product.price <= priceRange.max
    
    return matchesSearch && matchesFilter && matchesPriceRange
  })

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Status Filter */}
      <div>
        <h3 className="font-semibold mb-3">Status</h3>
        <div className="space-y-2">
          {[
            { id: 'all', name: 'All Products', count: products.length },
            { id: 'active', name: 'Active', count: products.filter(p => p.isActive).length },
            { id: 'inactive', name: 'Inactive', count: products.filter(p => !p.isActive).length },
            { id: 'featured', name: 'Featured', count: products.filter(p => p.isFeatured).length },
            { id: 'out-of-stock', name: 'Out of Stock', count: products.filter(p => !p.inStock).length },
          ].map((status) => (
            <button
              key={status.id}
              onClick={() => setFilterStatus(status.id)}
              className={`w-full text-left p-2 rounded-lg transition-colors ${
                filterStatus === status.id
                  ? 'bg-amber-100 text-amber-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{status.name}</span>
                <span className="text-sm text-gray-500">({status.count})</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
              className="w-24"
            />
            <span className="self-center">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
              className="w-24"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'Under $50', min: 0, max: 50 },
              { label: '$50 - $100', min: 50, max: 100 },
              { label: '$100 - $200', min: 100, max: 200 },
              { label: 'Over $200', min: 200, max: 1000 },
            ].map((range) => (
              <Button
                key={range.label}
                variant="outline"
                size="sm"
                onClick={() => setPriceRange({ min: range.min, max: range.max })}
                className="text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <AdminPageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-2">
              Manage your artifact collection and inventory
            </p>
          </div>
          
          <Link href="/admin/products/new">
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Search and Filters Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search products, artisans, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Products Content */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-600" />
                  Products ({filteredProducts.length})
                </CardTitle>
                <CardDescription>
                  Manage your product catalog and inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }>
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        {viewMode === 'grid' ? (
                          <Card className="overflow-hidden">
                            <div className="aspect-square bg-gray-200"></div>
                            <CardContent className="p-4 space-y-3">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card>
                            <CardContent className="p-6">
                              <div className="flex gap-6">
                                <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
                                <div className="flex-1 space-y-3">
                                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    ))}
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }>
                    {filteredProducts.map((product, index) => {
                      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]
                      const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price 
                        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                        : 0

                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          {viewMode === 'grid' ? (
                            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                              <div className="relative aspect-square overflow-hidden">
                                {primaryImage && getImageUrl(primaryImage.url) ? (
                                  <Image
                                    src={getImageUrl(primaryImage.url)!}
                                    alt={primaryImage.altText || product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    onError={(e) => {
                                      console.error('Image failed to load:', primaryImage.url)
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <Package className="h-12 w-12 text-gray-400" />
                                  </div>
                                )}
                                
                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                  {product.isFeatured && (
                                    <Badge className="bg-amber-500 text-white">Featured</Badge>
                                  )}
                                  {discountPercentage > 0 && (
                                    <Badge variant="destructive">
                                      {discountPercentage}% OFF
                                    </Badge>
                                  )}
                                  <Badge 
                                    variant={product.isActive ? "default" : "secondary"}
                                    className={product.isActive ? "bg-green-100 text-green-800" : ""}
                                  >
                                    {product.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>

                                {/* Action Buttons */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <Link href={`/products/${product.slug}`} target="_blank">
                                    <Button
                                      size="icon"
                                      variant="secondary"
                                      className="h-8 w-8 bg-white/90 hover:bg-white"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  
                                  <Link href={`/admin/products/${product.id}/edit`}>
                                    <Button
                                      size="icon"
                                      variant="secondary"
                                      className="h-8 w-8 bg-white/90 hover:bg-white"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </div>

                                {/* Quick Actions */}
                                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => handleToggleStatus(product.id, product.isActive)}
                                      className="flex-1 bg-white/90 hover:bg-white"
                                    >
                                      {product.isActive ? 'Deactivate' : 'Activate'}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDeleteProduct(product.id)}
                                      className="bg-red-500/90 hover:bg-red-500"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              <CardContent className="p-4">
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                  <span>{product.category.name}</span>
                                  <span>by {product.artisan?.name || 'Akamba Artisan'}</span>
                                </div>

                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                  {product.name}
                                </h3>

                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {product.viewCount}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Heart className="h-4 w-4" />
                                    {product.likeCount}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Package className="h-4 w-4" />
                                    {product.stockQuantity}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-lg text-gray-900">
                                    ${product.price}
                                  </span>
                                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                                    <span className="text-sm text-gray-500 line-through">
                                      ${product.compareAtPrice}
                                    </span>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ) : (
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                              <CardContent className="p-6">
                                <div className="flex gap-6">
                                  <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                    {primaryImage && getImageUrl(primaryImage.url) ? (
                                      <Image
                                        src={getImageUrl(primaryImage.url)!}
                                        alt={primaryImage.altText || product.name}
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          console.error('Image failed to load:', primaryImage.url)
                                          e.currentTarget.style.display = 'none'
                                        }}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Package className="h-8 w-8 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <Badge variant="outline">{product.category.name}</Badge>
                                          {product.isFeatured && <Badge className="bg-amber-500 text-white">Featured</Badge>}
                                          {discountPercentage > 0 && (
                                            <Badge variant="destructive">
                                              {discountPercentage}% OFF
                                            </Badge>
                                          )}
                                          <Badge 
                                            variant={product.isActive ? "default" : "secondary"}
                                            className={product.isActive ? "bg-green-100 text-green-800" : ""}
                                          >
                                            {product.isActive ? 'Active' : 'Inactive'}
                                          </Badge>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                          {product.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm">by {product.artisan?.name || 'Akamba Artisan'}</p>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Link href={`/products/${product.slug}`} target="_blank">
                                          <Button variant="outline" size="icon">
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                        </Link>
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                          <Button variant="outline" size="icon">
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                        </Link>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem 
                                              onClick={() => handleToggleStatus(product.id, product.isActive)}
                                              className="cursor-pointer"
                                            >
                                              <CheckCircle className="h-4 w-4 mr-2" />
                                              {product.isActive ? 'Deactivate' : 'Activate'}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              onClick={() => handleToggleFeatured(product.id, product.isFeatured)}
                                              className="cursor-pointer"
                                            >
                                              <Package className="h-4 w-4 mr-2" />
                                              {product.isFeatured ? 'Unfeature' : 'Feature'}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem 
                                              onClick={() => handleDeleteProduct(product.id)}
                                              className="cursor-pointer text-red-600 focus:text-red-600"
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Delete Product
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                      <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        {product.viewCount} views
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Heart className="h-4 w-4" />
                                        {product.likeCount} likes
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Package className="h-4 w-4" />
                                        {product.stockQuantity} in stock
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-xl text-gray-900">
                                          ${product.price}
                                        </span>
                                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                                          <span className="text-lg text-gray-500 line-through">
                                            ${product.compareAtPrice}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery || filterStatus !== 'all' || priceRange.min > 0 || priceRange.max < 1000
                        ? 'Try adjusting your search criteria or filters'
                        : 'Get started by creating your first product'
                      }
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery('')
                        setFilterStatus('all')
                        setPriceRange({ min: 0, max: 1000 })
                      }}
                      variant="outline"
                      className="mr-4"
                    >
                      Clear Filters
                    </Button>
                    {(!searchQuery && filterStatus === 'all' && priceRange.min === 0 && priceRange.max === 1000) && (
                      <Link href="/admin/products/new">
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Product
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </AdminPageLayout>
  )
}
