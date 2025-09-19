"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Star,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  Users,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import { AdminPageLayout } from '@/components/admin/admin-page-layout'

interface Artisan {
  id: string
  name: string
  slug: string
  bio: string
  location: string
  image?: string
  status: 'active' | 'inactive'
  totalProducts: number
  totalRevenue: number
  joinDate: string
  lastUpdated: string
}

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null)
  const [showArtisanModal, setShowArtisanModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    image: '',
    isActive: true,
  })

  useEffect(() => {
    fetchArtisans()
  }, [pagination.page, searchQuery, statusFilter])

  const fetchArtisans = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      })

      const response = await fetch(`/api/admin/artisans?${params}`)
      if (response.ok) {
        const data = await response.json()
        setArtisans(data.artisans)
        setPagination(data.pagination)
      } else {
        console.error('Failed to fetch artisans')
        toast.error('Failed to fetch artisans')
      }
    } catch (error) {
      console.error('Error fetching artisans:', error)
      toast.error('Error fetching artisans')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateArtisan = async () => {
    try {
      const response = await fetch('/api/admin/artisans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Artisan created successfully')
        setShowCreateModal(false)
        setFormData({
          name: '',
          bio: '',
          location: '',
          image: '',
          isActive: true,
        })
        fetchArtisans()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create artisan')
      }
    } catch (error) {
      console.error('Error creating artisan:', error)
      toast.error('Error creating artisan')
    }
  }

  const handleEditArtisan = async () => {
    if (!selectedArtisan) return

    try {
      const response = await fetch(`/api/admin/artisans/${selectedArtisan.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Artisan updated successfully')
        setShowArtisanModal(false)
        setSelectedArtisan(null)
        setFormData({
          name: '',
          bio: '',
          location: '',
          image: '',
          isActive: true,
        })
        fetchArtisans()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update artisan')
      }
    } catch (error) {
      console.error('Error updating artisan:', error)
      toast.error('Error updating artisan')
    }
  }

  const handleDeleteArtisan = async (artisanId: string) => {
    if (!confirm('Are you sure you want to delete this artisan?')) return

    try {
      const response = await fetch(`/api/admin/artisans/${artisanId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Artisan deleted successfully')
        fetchArtisans()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete artisan')
      }
    } catch (error) {
      console.error('Error deleting artisan:', error)
      toast.error('Error deleting artisan')
    }
  }

  const handleViewArtisan = (artisan: Artisan) => {
    setSelectedArtisan(artisan)
    setFormData({
      name: artisan.name,
      bio: artisan.bio,
      location: artisan.location,
      image: artisan.image || '',
      isActive: artisan.status === 'active',
    })
    setShowArtisanModal(true)
  }

  const handleEditClick = (artisan: Artisan) => {
    setSelectedArtisan(artisan)
    setFormData({
      name: artisan.name,
      bio: artisan.bio,
      location: artisan.location,
      image: artisan.image || '',
      isActive: artisan.status === 'active',
    })
    setShowArtisanModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = [
    {
      title: 'Total Artisans',
      value: pagination.total,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Active Artisans',
      value: artisans.filter(a => a.status === 'active').length,
      icon: Star,
      color: 'text-green-600'
    },
    {
      title: 'Featured Artisans',
      value: artisans.filter(a => a.status === 'active').length, // Count active artisans instead
      icon: Star,
      color: 'text-amber-600'
    },
    {
      title: 'Total Products',
      value: artisans.reduce((sum, a) => sum + a.totalProducts, 0),
      icon: Package,
      color: 'text-purple-600'
    }
  ]

  return (
    <AdminPageLayout
      title="Artisans Management"
      description="Manage artisans and their profiles"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search artisans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

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

              {/* Create Button */}
              <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Artisan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Artisan</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter artisan name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Enter artisan bio"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter location"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="Enter image URL"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isActive"
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="isActive">Active</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateArtisan}>
                        Create Artisan
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Artisans List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : artisans.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {artisans.map((artisan, index) => (
            <motion.div
              key={artisan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {viewMode === 'grid' ? (
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={artisan.image} alt={artisan.name} />
                        <AvatarFallback>
                          {artisan.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{artisan.name}</h3>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{artisan.location}</span>
                        </div>
                        <Badge className={getStatusColor(artisan.status)}>
                          {artisan.status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {artisan.bio}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-amber-600">{artisan.totalProducts}</div>
                        <div className="text-xs text-gray-600">Products</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">KSh {artisan.totalRevenue.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Revenue</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      Joined {format(new Date(artisan.joinDate), 'MMM yyyy')}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewArtisan(artisan)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(artisan)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteArtisan(artisan.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={artisan.image} alt={artisan.name} />
                        <AvatarFallback>
                          {artisan.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{artisan.name}</h3>
                          <Badge className={getStatusColor(artisan.status)}>
                            {artisan.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {artisan.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Joined {format(new Date(artisan.joinDate), 'MMM yyyy')}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {artisan.bio}
                        </p>
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4 text-amber-600" />
                            {artisan.totalProducts} Products
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            KSh {artisan.totalRevenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewArtisan(artisan)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(artisan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteArtisan(artisan.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No artisans found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search criteria or filters'
                : 'Get started by adding your first artisan'
              }
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Artisan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View/Edit Modal */}
      <Dialog open={showArtisanModal} onOpenChange={setShowArtisanModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedArtisan ? 'View/Edit Artisan' : 'Create Artisan'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="modal-name">Name</Label>
              <Input
                id="modal-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter artisan name"
              />
            </div>
            <div>
              <Label htmlFor="modal-bio">Bio</Label>
              <Textarea
                id="modal-bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Enter artisan bio"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="modal-location">Location</Label>
              <Input
                id="modal-location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>
            <div>
              <Label htmlFor="modal-image">Image URL</Label>
              <Input
                id="modal-image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="Enter image URL"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="modal-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="modal-isActive">Active</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowArtisanModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditArtisan}>
                Update Artisan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  )
}
