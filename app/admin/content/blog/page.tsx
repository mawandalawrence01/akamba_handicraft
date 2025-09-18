"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
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
  Image,
  Tag,
  FileText,
  Download,
  Upload,
  Save,
  Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { AdminPageLayout, AdminCard, AdminStatsCard, AdminSection } from '@/components/admin/admin-page-layout'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  status: 'published' | 'draft' | 'archived'
  author: string
  category: string
  tags: string[]
  featuredImage?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  views: number
  comments: number
  likes: number
  seoTitle?: string
  seoDescription?: string
}

interface BlogStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  totalComments: number
  totalLikes: number
  averageViews: number
  popularPosts: number
}

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [showPostModal, setShowPostModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Mock data
  useEffect(() => {
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'The Art of Traditional Kenyan Handicrafts',
        slug: 'art-traditional-kenyan-handicrafts',
        content: 'Traditional Kenyan handicrafts represent centuries of cultural heritage and artistic expression...',
        excerpt: 'Discover the rich history and techniques behind traditional Kenyan handicrafts.',
        status: 'published',
        author: 'John Mwangi',
        category: 'Culture',
        tags: ['handicrafts', 'tradition', 'kenya', 'art'],
        featuredImage: '/placeholder-blog.jpg',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-18',
        publishedAt: '2024-01-16',
        views: 1250,
        comments: 23,
        likes: 45,
        seoTitle: 'Traditional Kenyan Handicrafts - Art & Culture',
        seoDescription: 'Explore the beautiful world of traditional Kenyan handicrafts and their cultural significance.'
      },
      {
        id: '2',
        title: 'Sustainable Crafting Practices',
        slug: 'sustainable-crafting-practices',
        content: 'In today\'s world, sustainability is more important than ever in crafting...',
        excerpt: 'Learn about eco-friendly crafting methods and sustainable materials.',
        status: 'draft',
        author: 'Sarah Wanjiku',
        category: 'Sustainability',
        tags: ['sustainability', 'eco-friendly', 'crafting', 'environment'],
        createdAt: '2024-01-20',
        updatedAt: '2024-01-22',
        views: 0,
        comments: 0,
        likes: 0
      },
      {
        id: '3',
        title: 'The History of Akamba Pottery',
        slug: 'history-akamba-pottery',
        content: 'Akamba pottery has a rich history dating back centuries...',
        excerpt: 'Discover the fascinating history and techniques of Akamba pottery making.',
        status: 'published',
        author: 'Grace Akinyi',
        category: 'History',
        tags: ['pottery', 'history', 'akamba', 'tradition'],
        featuredImage: '/placeholder-pottery.jpg',
        createdAt: '2024-01-12',
        updatedAt: '2024-01-15',
        publishedAt: '2024-01-13',
        views: 980,
        comments: 15,
        likes: 32
      },
      {
        id: '4',
        title: 'Modern Techniques in Wood Carving',
        slug: 'modern-techniques-wood-carving',
        content: 'Wood carving has evolved significantly with modern tools and techniques...',
        excerpt: 'Explore contemporary wood carving methods and tools.',
        status: 'published',
        author: 'Peter Kimani',
        category: 'Techniques',
        tags: ['wood-carving', 'techniques', 'modern', 'tools'],
        featuredImage: '/placeholder-wood.jpg',
        createdAt: '2024-01-08',
        updatedAt: '2024-01-10',
        publishedAt: '2024-01-09',
        views: 750,
        comments: 8,
        likes: 28
      },
      {
        id: '5',
        title: 'Beadwork Patterns and Meanings',
        slug: 'beadwork-patterns-meanings',
        content: 'Beadwork in Kenyan culture carries deep symbolic meanings...',
        excerpt: 'Understand the cultural significance of traditional beadwork patterns.',
        status: 'draft',
        author: 'Mary Wanjiku',
        category: 'Culture',
        tags: ['beadwork', 'patterns', 'culture', 'symbolism'],
        createdAt: '2024-01-25',
        updatedAt: '2024-01-26',
        views: 0,
        comments: 0,
        likes: 0
      }
    ]

    setTimeout(() => {
      setPosts(mockPosts)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats: BlogStats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.status === 'published').length,
    draftPosts: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
    totalComments: posts.reduce((sum, p) => sum + p.comments, 0),
    totalLikes: posts.reduce((sum, p) => sum + p.likes, 0),
    averageViews: Math.round(posts.reduce((sum, p) => sum + p.views, 0) / posts.length),
    popularPosts: posts.filter(p => p.views > 500).length
  }

  const categories = Array.from(new Set(posts.map(p => p.category)))

  const handleViewPost = (post: BlogPost) => {
    setSelectedPost(post)
    setShowPostModal(true)
  }

  const handleCreatePost = () => {
    setShowCreateModal(true)
  }

  const handleExportPosts = () => {
    toast.success('Blog posts exported successfully!')
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
            <p className="mt-2 text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout
      title="Blog Posts"
      description="Manage your blog content and articles"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportPosts}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreatePost}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      }
    >
      {/* Blog Stats */}
      <AdminSection title="Blog Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatsCard
            title="Total Posts"
            value={stats.totalPosts.toString()}
            icon={<BookOpen className="h-5 w-5" />}
            change={{ value: 3, type: 'increase' }}
          />
          <AdminStatsCard
            title="Published"
            value={stats.publishedPosts.toString()}
            icon={<Globe className="h-5 w-5" />}
            change={{ value: 2, type: 'increase' }}
          />
          <AdminStatsCard
            title="Total Views"
            value={stats.totalViews.toLocaleString()}
            icon={<Eye className="h-5 w-5" />}
            change={{ value: 15, type: 'increase' }}
          />
          <AdminStatsCard
            title="Total Comments"
            value={stats.totalComments.toString()}
            icon={<MessageSquare className="h-5 w-5" />}
            change={{ value: 8, type: 'increase' }}
          />
        </div>
      </AdminSection>

      {/* Additional Stats */}
      <AdminSection title="Blog Performance">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminStatsCard
            title="Draft Posts"
            value={stats.draftPosts.toString()}
            icon={<Clock className="h-5 w-5" />}
            change={{ value: 1, type: 'increase' }}
          />
          <AdminStatsCard
            title="Average Views"
            value={stats.averageViews.toString()}
            icon={<TrendingUp className="h-5 w-5" />}
            change={{ value: 12, type: 'increase' }}
          />
          <AdminStatsCard
            title="Popular Posts"
            value={stats.popularPosts.toString()}
            icon={<TrendingUp className="h-5 w-5" />}
            change={{ value: 2, type: 'increase' }}
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
                placeholder="Search posts by title, author, or tags..."
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
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </AdminCard>

      {/* Blog Posts Table */}
      <AdminCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Post</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {post.featuredImage ? (
                      <img 
                        src={post.featuredImage} 
                        alt={post.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Image className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-gray-500">{post.excerpt}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(post.status)}>
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{post.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{post.author}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span>{post.views.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-gray-400" />
                    <span>{post.comments}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {post.publishedAt ? (
                    <div className="text-sm">
                      {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
                    </div>
                  ) : (
                    <span className="text-gray-400">Not published</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewPost(post)}
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

      {/* Post Details Modal */}
      <Dialog open={showPostModal} onOpenChange={setShowPostModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Blog Post Details</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                {selectedPost.featuredImage ? (
                  <img 
                    src={selectedPost.featuredImage} 
                    alt={selectedPost.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedPost.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(selectedPost.status)}>
                      {selectedPost.status}
                    </Badge>
                    <Badge variant="outline">{selectedPost.category}</Badge>
                  </div>
                  <p className="text-gray-600 mt-2">{selectedPost.excerpt}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Author</label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{selectedPost.author}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Slug</label>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="font-mono text-sm">{selectedPost.slug}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{format(new Date(selectedPost.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{format(new Date(selectedPost.updatedAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Views</label>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span>{selectedPost.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Comments</label>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span>{selectedPost.comments}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Content Preview</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                  <p className="text-sm text-gray-700">{selectedPost.content}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Tags</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedPost.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedPost.seoTitle && (
                <div>
                  <label className="text-sm font-medium text-gray-500">SEO Title</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedPost.seoTitle}</p>
                </div>
              )}

              {selectedPost.seoDescription && (
                <div>
                  <label className="text-sm font-medium text-gray-500">SEO Description</label>
                  <p className="text-sm text-gray-700 mt-1">{selectedPost.seoDescription}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Post Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Title</label>
                <Input placeholder="Enter post title..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Slug</label>
                <Input placeholder="post-slug" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Excerpt</label>
              <Textarea placeholder="Enter post excerpt..." rows={3} />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Content</label>
              <Textarea placeholder="Enter post content..." rows={10} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
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

            <div>
              <label className="text-sm font-medium text-gray-500">Tags</label>
              <Input placeholder="Enter tags separated by commas..." />
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
