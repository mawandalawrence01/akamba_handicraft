"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  MessageSquare,
  Globe,
  Clock,
  TrendingUp,
  BookOpen,
  File,
  Image,
  Video,
  Download,
  Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { AdminPageLayout, AdminCard, AdminStatsCard, AdminSection } from '@/components/admin/admin-page-layout'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

interface ContentItem {
  id: string
  title: string
  type: 'blog' | 'page' | 'comment'
  status: 'published' | 'draft' | 'archived'
  author: string
  createdAt: string
  updatedAt: string
  views?: number
  comments?: number
  category?: string
  tags?: string[]
}

interface ContentStats {
  totalContent: number
  publishedContent: number
  draftContent: number
  totalViews: number
  totalComments: number
  recentPosts: number
  popularContent: number
}

export default function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [showContentModal, setShowContentModal] = useState(false)

  // Mock data
  useEffect(() => {
    const mockContent: ContentItem[] = [
      {
        id: '1',
        title: 'The Art of Traditional Kenyan Handicrafts',
        type: 'blog',
        status: 'published',
        author: 'John Mwangi',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-18',
        views: 1250,
        comments: 23,
        category: 'Culture',
        tags: ['handicrafts', 'tradition', 'kenya']
      },
      {
        id: '2',
        title: 'About Us - Akamba Handicraft',
        type: 'page',
        status: 'published',
        author: 'Admin',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-12',
        views: 850,
        comments: 0,
        category: 'Company'
      },
      {
        id: '3',
        title: 'Sustainable Crafting Practices',
        type: 'blog',
        status: 'draft',
        author: 'Sarah Wanjiku',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-22',
        views: 0,
        comments: 0,
        category: 'Sustainability',
        tags: ['sustainability', 'eco-friendly', 'crafting']
      },
      {
        id: '4',
        title: 'Great article about traditional crafts!',
        type: 'comment',
        status: 'published',
        author: 'Peter Kimani',
        createdAt: '2024-01-19',
        updatedAt: '2024-01-19',
        comments: 0,
        category: 'Feedback'
      },
      {
        id: '5',
        title: 'Contact Us',
        type: 'page',
        status: 'published',
        author: 'Admin',
        createdAt: '2024-01-08',
        updatedAt: '2024-01-10',
        views: 450,
        comments: 0,
        category: 'Company'
      },
      {
        id: '6',
        title: 'The History of Akamba Pottery',
        type: 'blog',
        status: 'published',
        author: 'Grace Akinyi',
        createdAt: '2024-01-12',
        updatedAt: '2024-01-15',
        views: 980,
        comments: 15,
        category: 'History',
        tags: ['pottery', 'history', 'akamba']
      }
    ]

    setTimeout(() => {
      setContent(mockContent)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const stats: ContentStats = {
    totalContent: content.length,
    publishedContent: content.filter(c => c.status === 'published').length,
    draftContent: content.filter(c => c.status === 'draft').length,
    totalViews: content.reduce((sum, c) => sum + (c.views || 0), 0),
    totalComments: content.reduce((sum, c) => sum + (c.comments || 0), 0),
    recentPosts: content.filter(c => {
      const date = new Date(c.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date > weekAgo
    }).length,
    popularContent: content.filter(c => (c.views || 0) > 500).length
  }

  const handleViewContent = (item: ContentItem) => {
    setSelectedContent(item)
    setShowContentModal(true)
  }

  const handleExportContent = () => {
    toast.success('Content data exported successfully!')
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog': return <BookOpen className="h-4 w-4" />
      case 'page': return <File className="h-4 w-4" />
      case 'comment': return <MessageSquare className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog': return 'bg-blue-100 text-blue-800'
      case 'page': return 'bg-green-100 text-green-800'
      case 'comment': return 'bg-purple-100 text-purple-800'
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
            <p className="mt-2 text-gray-600">Loading content...</p>
          </div>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout
      title="Content Management"
      description="Manage your blog posts, pages, and comments"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportContent}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Button>
        </div>
      }
    >
      {/* Content Stats */}
      <AdminSection title="Content Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatsCard
            title="Total Content"
            value={stats.totalContent.toString()}
            icon={<FileText className="h-5 w-5" />}
            change={{ value: 8, type: 'increase' }}
          />
          <AdminStatsCard
            title="Published"
            value={stats.publishedContent.toString()}
            icon={<Globe className="h-5 w-5" />}
            change={{ value: 5, type: 'increase' }}
          />
          <AdminStatsCard
            title="Total Views"
            value={stats.totalViews.toLocaleString()}
            icon={<Eye className="h-5 w-5" />}
            change={{ value: 12, type: 'increase' }}
          />
          <AdminStatsCard
            title="Total Comments"
            value={stats.totalComments.toString()}
            icon={<MessageSquare className="h-5 w-5" />}
            change={{ value: 3, type: 'increase' }}
          />
        </div>
      </AdminSection>

      {/* Additional Stats */}
      <AdminSection title="Content Performance">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminStatsCard
            title="Draft Content"
            value={stats.draftContent.toString()}
            icon={<Clock className="h-5 w-5" />}
            change={{ value: 2, type: 'increase' }}
          />
          <AdminStatsCard
            title="Recent Posts"
            value={stats.recentPosts.toString()}
            icon={<TrendingUp className="h-5 w-5" />}
            change={{ value: 4, type: 'increase' }}
          />
          <AdminStatsCard
            title="Popular Content"
            value={stats.popularContent.toString()}
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
                placeholder="Search content by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="blog">Blog Posts</SelectItem>
              <SelectItem value="page">Pages</SelectItem>
              <SelectItem value="comment">Comments</SelectItem>
            </SelectContent>
          </Select>
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
        </div>
      </AdminCard>

      {/* Content Table */}
      <AdminCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContent.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {getTypeIcon(item.type)}
                    <div>
                      <div className="font-medium">{item.title}</div>
                      {item.category && (
                        <div className="text-sm text-gray-500">{item.category}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getTypeColor(item.type)}>
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{item.author}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {item.views ? (
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span>{item.views.toLocaleString()}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {item.comments ? (
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span>{item.comments}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewContent(item)}
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

      {/* Content Details Modal */}
      <Dialog open={showContentModal} onOpenChange={setShowContentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Content Details</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {getTypeIcon(selectedContent.type)}
                <div>
                  <h3 className="text-xl font-semibold">{selectedContent.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getTypeColor(selectedContent.type)}>
                      {selectedContent.type}
                    </Badge>
                    <Badge className={getStatusColor(selectedContent.status)}>
                      {selectedContent.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Author</label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{selectedContent.author}</span>
                    </div>
                  </div>
                  {selectedContent.category && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Category</label>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span>{selectedContent.category}</span>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{format(new Date(selectedContent.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{format(new Date(selectedContent.updatedAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  {selectedContent.views && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Views</label>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span>{selectedContent.views.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  {selectedContent.comments && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Comments</label>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <span>{selectedContent.comments}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedContent.tags && selectedContent.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedContent.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  )
}
