"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  File, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  Globe,
  Clock,
  TrendingUp,
  Home,
  Info,
  Mail,
  Download,
  Save,
  Send,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AdminPageLayout, AdminCard, AdminStatsCard, AdminSection } from '@/components/admin/admin-page-layout'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

interface Page {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  status: 'published' | 'draft' | 'archived'
  author: string
  type: 'home' | 'about' | 'contact' | 'custom'
  template: 'default' | 'landing' | 'contact' | 'about'
  createdAt: string
  updatedAt: string
  publishedAt?: string
  views: number
  seoTitle?: string
  seoDescription?: string
  featuredImage?: string
  isHomepage: boolean
  showInMenu: boolean
  menuOrder: number
}

interface PageStats {
  totalPages: number
  publishedPages: number
  draftPages: number
  totalViews: number
  averageViews: number
  popularPages: number
  menuPages: number
  customPages: number
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [showPageModal, setShowPageModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Mock data
  useEffect(() => {
    const mockPages: Page[] = [
      {
        id: '1',
        title: 'Home',
        slug: 'home',
        content: 'Welcome to Akamba Handicraft Industry Co-operative Society...',
        excerpt: 'Discover authentic Kenyan handicrafts and support local artisans.',
        status: 'published',
        author: 'Admin',
        type: 'home',
        template: 'landing',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
        publishedAt: '2024-01-01',
        views: 2500,
        seoTitle: 'Akamba Handicraft - Authentic Kenyan Handicrafts',
        seoDescription: 'Shop authentic Kenyan handicrafts from skilled artisans. Traditional pottery, wood carvings, and more.',
        featuredImage: '/placeholder-home.jpg',
        isHomepage: true,
        showInMenu: true,
        menuOrder: 1
      },
      {
        id: '2',
        title: 'About Us',
        slug: 'about',
        content: 'Akamba Handicraft Industry Co-operative Society has been preserving...',
        excerpt: 'Learn about our mission to preserve and promote traditional Kenyan handicrafts.',
        status: 'published',
        author: 'Admin',
        type: 'about',
        template: 'about',
        createdAt: '2024-01-02',
        updatedAt: '2024-01-10',
        publishedAt: '2024-01-02',
        views: 850,
        seoTitle: 'About Akamba Handicraft - Our Story',
        seoDescription: 'Discover the story behind Akamba Handicraft and our commitment to preserving Kenyan culture.',
        featuredImage: '/placeholder-about.jpg',
        isHomepage: false,
        showInMenu: true,
        menuOrder: 2
      },
      {
        id: '3',
        title: 'Contact Us',
        slug: 'contact',
        content: 'Get in touch with us for inquiries, orders, or partnerships...',
        excerpt: 'Contact information and inquiry form for Akamba Handicraft.',
        status: 'published',
        author: 'Admin',
        type: 'contact',
        template: 'contact',
        createdAt: '2024-01-03',
        updatedAt: '2024-01-08',
        publishedAt: '2024-01-03',
        views: 450,
        seoTitle: 'Contact Akamba Handicraft - Get In Touch',
        seoDescription: 'Contact Akamba Handicraft for inquiries, orders, or partnerships.',
        isHomepage: false,
        showInMenu: true,
        menuOrder: 3
      },
      {
        id: '4',
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        content: 'This Privacy Policy describes how we collect, use, and protect...',
        excerpt: 'Our privacy policy and data protection practices.',
        status: 'published',
        author: 'Admin',
        type: 'custom',
        template: 'default',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-12',
        publishedAt: '2024-01-05',
        views: 120,
        isHomepage: false,
        showInMenu: false,
        menuOrder: 0
      },
      {
        id: '5',
        title: 'Terms of Service',
        slug: 'terms-of-service',
        content: 'These Terms of Service govern your use of our website...',
        excerpt: 'Terms and conditions for using our services.',
        status: 'draft',
        author: 'Admin',
        type: 'custom',
        template: 'default',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-22',
        views: 0,
        isHomepage: false,
        showInMenu: false,
        menuOrder: 0
      },
      {
        id: '6',
        title: 'Shipping Information',
        slug: 'shipping-information',
        content: 'Learn about our shipping policies, rates, and delivery times...',
        excerpt: 'Comprehensive shipping information and policies.',
        status: 'published',
        author: 'Admin',
        type: 'custom',
        template: 'default',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-15',
        publishedAt: '2024-01-10',
        views: 320,
        isHomepage: false,
        showInMenu: true,
        menuOrder: 4
      }
    ]

    setTimeout(() => {
      setPages(mockPages)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter
    const matchesType = typeFilter === 'all' || page.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const stats: PageStats = {
    totalPages: pages.length,
    publishedPages: pages.filter(p => p.status === 'published').length,
    draftPages: pages.filter(p => p.status === 'draft').length,
    totalViews: pages.reduce((sum, p) => sum + p.views, 0),
    averageViews: Math.round(pages.reduce((sum, p) => sum + p.views, 0) / pages.length),
    popularPages: pages.filter(p => p.views > 200).length,
    menuPages: pages.filter(p => p.showInMenu).length,
    customPages: pages.filter(p => p.type === 'custom').length
  }

  const handleViewPage = (page: Page) => {
    setSelectedPage(page)
    setShowPageModal(true)
  }

  const handleCreatePage = () => {
    setShowCreateModal(true)
  }

  const handleExportPages = () => {
    toast.success('Pages data exported successfully!')
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />
      case 'about': return <Info className="h-4 w-4" />
      case 'contact': return <Mail className="h-4 w-4" />
      case 'custom': return <File className="h-4 w-4" />
      default: return <File className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'home': return 'bg-blue-100 text-blue-800'
      case 'about': return 'bg-green-100 text-green-800'
      case 'contact': return 'bg-purple-100 text-purple-800'
      case 'custom': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading pages...</p>
          </div>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout
      title="Pages"
      description="Manage your website pages and content"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportPages}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreatePage}>
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Button>
        </div>
      }
    >
      {/* Page Stats */}
      <AdminSection title="Pages Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatsCard
            title="Total Pages"
            value={stats.totalPages.toString()}
            icon={<File className="h-5 w-5" />}
            change={{ value: 2, type: 'increase' }}
          />
          <AdminStatsCard
            title="Published"
            value={stats.publishedPages.toString()}
            icon={<Globe className="h-5 w-5" />}
            change={{ value: 1, type: 'increase' }}
          />
          <AdminStatsCard
            title="Total Views"
            value={stats.totalViews.toLocaleString()}
            icon={<Eye className="h-5 w-5" />}
            change={{ value: 8, type: 'increase' }}
          />
          <AdminStatsCard
            title="Menu Pages"
            value={stats.menuPages.toString()}
            icon={<Settings className="h-5 w-5" />}
            change={{ value: 0, type: 'increase' }}
          />
        </div>
      </AdminSection>

      {/* Additional Stats */}
      <AdminSection title="Page Performance">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminStatsCard
            title="Draft Pages"
            value={stats.draftPages.toString()}
            icon={<Clock className="h-5 w-5" />}
            change={{ value: 1, type: 'increase' }}
          />
          <AdminStatsCard
            title="Average Views"
            value={stats.averageViews.toString()}
            icon={<TrendingUp className="h-5 w-5" />}
            change={{ value: 5, type: 'increase' }}
          />
          <AdminStatsCard
            title="Popular Pages"
            value={stats.popularPages.toString()}
            icon={<TrendingUp className="h-5 w-5" />}
            change={{ value: 1, type: 'increase' }}
          />
        </div>
      </AdminSection>

      {/* Filters and Search */}
      <AdminCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search pages by title or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="about">About</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AdminCard>

      {/* Pages Table */}
      <AdminCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Menu</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPages.map((page) => (
              <TableRow key={page.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {getTypeIcon(page.type)}
                    <div>
                      <div className="font-medium">{page.title}</div>
                      <div className="text-sm text-gray-500">/{page.slug}</div>
                      {page.isHomepage && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Homepage
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getTypeColor(page.type)}>
                    {page.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(page.status)}>
                    {page.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{page.template}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span>{page.views.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {page.showInMenu ? (
                    <div className="flex items-center gap-1">
                      <Settings className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">#{page.menuOrder}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Hidden</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {format(new Date(page.updatedAt), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewPage(page)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminCard>

      {/* Page Details Modal */}
      <Dialog open={showPageModal} onOpenChange={setShowPageModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Page Details</DialogTitle>
          </DialogHeader>
          {selectedPage && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                {selectedPage.featuredImage ? (
                  <img 
                    src={selectedPage.featuredImage} 
                    alt={selectedPage.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    {getTypeIcon(selectedPage.type)}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedPage.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getTypeColor(selectedPage.type)}>
                      {selectedPage.type}
                    </Badge>
                    <Badge className={getStatusColor(selectedPage.status)}>
                      {selectedPage.status}
                    </Badge>
                    <Badge variant="outline">{selectedPage.template}</Badge>
                    {selectedPage.isHomepage && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Homepage
                      </Badge>
                    )}
                  </div>
                  {selectedPage.excerpt && (
                    <p className="text-gray-600 mt-2">{selectedPage.excerpt}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Author</label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{selectedPage.author}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Slug</label>
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-gray-400" />
                      <span className="font-mono text-sm">/{selectedPage.slug}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{format(new Date(selectedPage.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{format(new Date(selectedPage.updatedAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Views</label>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span>{selectedPage.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Menu Settings</label>
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-400" />
                      <span>
                        {selectedPage.showInMenu 
                          ? `Visible (Order: ${selectedPage.menuOrder})` 
                          : 'Hidden'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Content Preview</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                  <p className="text-sm text-gray-700">{selectedPage.content}</p>
                </div>
              </div>

              {selectedPage.seoTitle && (
                <div>
                  <label className="text-sm font-medium text-gray-500">SEO Title</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedPage.seoTitle}</p>
                </div>
              )}

              {selectedPage.seoDescription && (
                <div>
                  <label className="text-sm font-medium text-gray-500">SEO Description</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedPage.seoDescription}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Page Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Title</label>
                <Input placeholder="Enter page title..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Slug</label>
                <Input placeholder="page-slug" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Excerpt</label>
              <Textarea placeholder="Enter page excerpt..." rows={3} />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Content</label>
              <Textarea placeholder="Enter page content..." rows={10} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="about">About</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Template</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="landing">Landing</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="about">About</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  )
}
