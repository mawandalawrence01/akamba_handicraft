"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Folder,
  FolderOpen,
  Package,
  AlertCircle,
  CheckCircle,
  Loader2,
  Grid,
  List
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AdminPageLayout } from '@/components/admin/admin-page-layout'
import { toast } from 'react-hot-toast'
import { OptimizedImage } from '@/components/ui/optimized-image'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  parent?: {
    id: string
    name: string
  }
  children: Array<{
    id: string
    name: string
  }>
  _count: {
    products: number
  }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Helper function to handle image URLs from any source
  const getImageUrl = (url: string) => {
    if (!url) return null
    // If URL already starts with /, return as is (local file)
    if (url.startsWith('/')) return url
    // If URL starts with http/https, return as is (external URL)
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    // If URL doesn't start with /, add it (assume local file)
    return `/${url}`
  }

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    parentId: '',
    sortOrder: 0,
    isActive: true
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      } else {
        toast.error('Failed to load categories')
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      parentId: '',
      sortOrder: 0,
      isActive: true
    })
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare data for API - convert empty string to null for parentId
      const apiData = {
        ...formData,
        parentId: formData.parentId === '' ? null : formData.parentId
      }

      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      })

      if (response.ok) {
        toast.success('Category created successfully!')
        setIsCreateDialogOpen(false)
        resetForm()
        fetchCategories()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create category')
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Failed to create category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return

    setIsSubmitting(true)

    try {
      // Prepare data for API - convert empty string to null for parentId
      const apiData = {
        ...formData,
        parentId: formData.parentId === '' ? null : formData.parentId
      }

      const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      })

      if (response.ok) {
        toast.success('Category updated successfully!')
        setIsEditDialogOpen(false)
        setEditingCategory(null)
        resetForm()
        fetchCategories()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Category deleted successfully')
        fetchCategories()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  const handleToggleStatus = async (categoryId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (response.ok) {
        toast.success(`Category ${!isActive ? 'activated' : 'deactivated'} successfully`)
        fetchCategories()
      } else {
        toast.error('Failed to update category status')
      }
    } catch (error) {
      toast.error('Failed to update category status')
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      parentId: category.parentId || '',
      sortOrder: category.sortOrder,
      isActive: category.isActive
    })
    setIsEditDialogOpen(true)
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'active' && category.isActive) ||
                         (filterStatus === 'inactive' && !category.isActive) ||
                         (filterStatus === 'parent' && !category.parentId) ||
                         (filterStatus === 'child' && category.parentId)
    
    return matchesSearch && matchesFilter
  })


  // Group categories by parent/child relationship
  const parentCategories = filteredCategories.filter(cat => !cat.parentId)
  const childCategories = filteredCategories.filter(cat => cat.parentId)

  return (
    <AdminPageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-2">
              Organize your products with categories and subcategories
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new category to organize your products.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter category name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="Enter image URL (local or external)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supports local files (/uploads/...) or external URLs (https://...)
                  </p>
                </div>

                <div>
                  <Label htmlFor="parentId">Parent Category</Label>
                  <Select
                    value={formData.parentId || "none"}
                    onValueChange={(value) => handleInputChange('parentId', value === "none" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No parent (root category)</SelectItem>
                      {categories.filter(cat => !cat.parentId).map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active</Label>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Category'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and View Controls */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search categories, descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* View Mode Toggle */}
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
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredCategories.length} of {categories.length} categories
          </p>
        </div>

        {/* Categories */}
        <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-amber-600" />
                  Categories ({filteredCategories.length})
                </CardTitle>
                <CardDescription>
                  Manage your product categories and subcategories
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
                ) : filteredCategories.length > 0 ? (
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }>
                    {filteredCategories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        {viewMode === 'grid' ? (
                          <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                            <div className="relative aspect-square overflow-hidden">
                              {category.image && getImageUrl(category.image) ? (
                                <OptimizedImage
                                  src={getImageUrl(category.image)!}
                                  alt={category.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  quality="auto"
                                  format="auto"
                                  onError={(e) => {
                                    console.error('Image failed to load:', category.image)
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <FolderOpen className="h-12 w-12 text-gray-400" />
                                </div>
                              )}
                              
                              {/* Badges */}
                              <div className="absolute top-3 left-3 flex flex-col gap-2">
                                <Badge 
                                  variant={category.isActive ? "default" : "secondary"}
                                  className={category.isActive ? "bg-green-100 text-green-800" : ""}
                                >
                                  {category.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                {category.parentId && (
                                  <Badge variant="outline">Subcategory</Badge>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className="h-8 w-8 bg-white/90 hover:bg-white"
                                  onClick={() => openEditDialog(category)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  className="h-8 w-8 bg-red-500/90 hover:bg-red-500"
                                  onClick={() => handleDeleteCategory(category.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <CardContent className="p-4">
                              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                <span>Sort: {category.sortOrder}</span>
                                <span>{category.parentId ? 'Subcategory' : 'Parent'}</span>
                              </div>

                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                {category.name}
                              </h3>

                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {category.description || 'No description'}
                              </p>

                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <Package className="h-4 w-4" />
                                  {category._count.products} products
                                </div>
                                {category.children.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Folder className="h-4 w-4" />
                                    {category.children.length} subcategories
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleToggleStatus(category.id, category.isActive)}
                                  className="flex-1"
                                >
                                  {category.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-6">
                              <div className="flex gap-6">
                                <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                  {category.image && getImageUrl(category.image) ? (
                                    <OptimizedImage
                                      src={getImageUrl(category.image)!}
                                      alt={category.name}
                                      width={128}
                                      height={128}
                                      className="w-full h-full object-cover"
                                      quality="auto"
                                      format="auto"
                                      onError={(e) => {
                                        console.error('Image failed to load:', category.image)
                                        e.currentTarget.style.display = 'none'
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <FolderOpen className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge 
                                          variant={category.isActive ? "default" : "secondary"}
                                          className={category.isActive ? "bg-green-100 text-green-800" : ""}
                                        >
                                          {category.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                        {category.parentId && <Badge variant="outline">Subcategory</Badge>}
                                      </div>
                                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                        {category.name}
                                      </h3>
                                      <p className="text-gray-600 text-sm">
                                        {category.description || 'No description'}
                                      </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => openEditDialog(category)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
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
                                            onClick={() => handleToggleStatus(category.id, category.isActive)}
                                            className="cursor-pointer"
                                          >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            {category.isActive ? 'Deactivate' : 'Activate'}
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem 
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="cursor-pointer text-red-600 focus:text-red-600"
                                          >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Category
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                    <div className="flex items-center gap-1">
                                      <Package className="h-4 w-4" />
                                      {category._count.products} products
                                    </div>
                                    {category.children.length > 0 && (
                                      <div className="flex items-center gap-1">
                                        <Folder className="h-4 w-4" />
                                        {category.children.length} subcategories
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <span>Sort: {category.sortOrder}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery || filterStatus !== 'all'
                        ? 'Try adjusting your search criteria or filters'
                        : 'Get started by creating your first category'
                      }
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery('')
                        setFilterStatus('all')
                      }}
                      variant="outline"
                      className="mr-4"
                    >
                      Clear Filters
                    </Button>
                    {(!searchQuery && filterStatus === 'all') && (
                      <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Category
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the category information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditCategory} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Category Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter category name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="Enter image URL (local or external)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports local files (/uploads/...) or external URLs (https://...)
                </p>
              </div>

              <div>
                <Label htmlFor="edit-parentId">Parent Category</Label>
                <Select
                  value={formData.parentId || "none"}
                  onValueChange={(value) => handleInputChange('parentId', value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No parent (root category)</SelectItem>
                    {categories
                      .filter(cat => !cat.parentId && cat.id !== editingCategory?.id)
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-sortOrder">Sort Order</Label>
                <Input
                  id="edit-sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-isActive">Active</Label>
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setEditingCategory(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Category'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageLayout>
  )
}
