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
  CheckCircle
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
import { AdminLayout } from '@/components/admin/admin-layout'
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
  }>
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchQuery, filterStatus])

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
                         product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'active' && product.isActive) ||
                         (filterStatus === 'inactive' && !product.isActive) ||
                         (filterStatus === 'featured' && product.isFeatured) ||
                         (filterStatus === 'out-of-stock' && !product.inStock)
    
    return matchesSearch && matchesFilter
  })

  return (
    <AdminLayout>
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

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Products</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="featured">Featured</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
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
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                      <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                              {product.images[0] ? (
                                <Image
                                  src={product.images[0].url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                by {product.artisan?.name || 'Akamba Artisan'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {product.category.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">${product.price}</span>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ${product.compareAtPrice}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${
                              product.stockQuantity > 10 ? 'text-green-600' :
                              product.stockQuantity > 0 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {product.stockQuantity}
                            </span>
                            {product.inStock ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={product.isActive ? "default" : "secondary"}
                                className={product.isActive ? "bg-green-100 text-green-800" : ""}
                              >
                                {product.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              {product.isFeatured && (
                                <Badge className="bg-amber-100 text-amber-800">
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {product.viewCount}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {product.likeCount}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <Link href={`/products/${product.slug}`} target="_blank">
                                <DropdownMenuItem className="cursor-pointer">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Product
                                </DropdownMenuItem>
                              </Link>
                              <Link href={`/admin/products/${product.id}/edit`}>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Product
                                </DropdownMenuItem>
                              </Link>
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
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {filteredProducts.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Get started by creating your first product'
                  }
                </p>
                {(!searchQuery && filterStatus === 'all') && (
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
    </AdminLayout>
  )
}
