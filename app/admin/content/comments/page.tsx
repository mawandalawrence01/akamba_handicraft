"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  Globe,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Reply,
  Flag,
  Download,
  Upload,
  Save,
  Send,
  ThumbsUp,
  ThumbsDown
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

interface Comment {
  id: string
  content: string
  author: string
  email: string
  status: 'approved' | 'pending' | 'spam' | 'rejected'
  postId: string
  postTitle: string
  postType: 'blog' | 'page'
  parentId?: string
  replies: number
  likes: number
  dislikes: number
  createdAt: string
  updatedAt: string
  ipAddress: string
  userAgent: string
  isReply: boolean
  reported: boolean
  reportReason?: string
}

interface CommentStats {
  totalComments: number
  approvedComments: number
  pendingComments: number
  spamComments: number
  rejectedComments: number
  totalReplies: number
  totalLikes: number
  reportedComments: number
  recentComments: number
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [postTypeFilter, setPostTypeFilter] = useState('all')
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)

  // Mock data
  useEffect(() => {
    const mockComments: Comment[] = [
      {
        id: '1',
        content: 'This is a beautiful piece of traditional Kenyan handicraft. I love the attention to detail!',
        author: 'John Mwangi',
        email: 'john.mwangi@email.com',
        status: 'approved',
        postId: '1',
        postTitle: 'The Art of Traditional Kenyan Handicrafts',
        postType: 'blog',
        replies: 2,
        likes: 5,
        dislikes: 0,
        createdAt: '2024-01-18',
        updatedAt: '2024-01-18',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        isReply: false,
        reported: false
      },
      {
        id: '2',
        content: 'Thank you for sharing this wonderful article. It really opened my eyes to the rich culture.',
        author: 'Sarah Wanjiku',
        email: 'sarah.wanjiku@email.com',
        status: 'approved',
        postId: '1',
        postTitle: 'The Art of Traditional Kenyan Handicrafts',
        postType: 'blog',
        parentId: '1',
        replies: 0,
        likes: 3,
        dislikes: 0,
        createdAt: '2024-01-19',
        updatedAt: '2024-01-19',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        isReply: true,
        reported: false
      },
      {
        id: '3',
        content: 'This is spam content with promotional links...',
        author: 'Spam User',
        email: 'spam@fake.com',
        status: 'spam',
        postId: '2',
        postTitle: 'Sustainable Crafting Practices',
        postType: 'blog',
        replies: 0,
        likes: 0,
        dislikes: 2,
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (compatible; SpamBot/1.0)',
        isReply: false,
        reported: true,
        reportReason: 'Spam content with promotional links'
      },
      {
        id: '4',
        content: 'I have a question about the shipping to international customers. How long does it take?',
        author: 'Peter Kimani',
        email: 'peter.kimani@email.com',
        status: 'pending',
        postId: '6',
        postTitle: 'Shipping Information',
        postType: 'page',
        replies: 0,
        likes: 1,
        dislikes: 0,
        createdAt: '2024-01-21',
        updatedAt: '2024-01-21',
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
        isReply: false,
        reported: false
      },
      {
        id: '5',
        content: 'This content is inappropriate and offensive.',
        author: 'Anonymous',
        email: 'anonymous@temp.com',
        status: 'rejected',
        postId: '1',
        postTitle: 'The Art of Traditional Kenyan Handicrafts',
        postType: 'blog',
        replies: 0,
        likes: 0,
        dislikes: 5,
        createdAt: '2024-01-22',
        updatedAt: '2024-01-22',
        ipAddress: '192.168.1.104',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        isReply: false,
        reported: true,
        reportReason: 'Inappropriate content'
      },
      {
        id: '6',
        content: 'Great article! I learned so much about Akamba pottery. Keep up the good work!',
        author: 'Grace Akinyi',
        email: 'grace.akinyi@email.com',
        status: 'approved',
        postId: '3',
        postTitle: 'The History of Akamba Pottery',
        postType: 'blog',
        replies: 0,
        likes: 8,
        dislikes: 0,
        createdAt: '2024-01-23',
        updatedAt: '2024-01-23',
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        isReply: false,
        reported: false
      }
    ]

    setTimeout(() => {
      setComments(mockComments)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comment.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comment.postTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter
    const matchesPostType = postTypeFilter === 'all' || comment.postType === postTypeFilter
    return matchesSearch && matchesStatus && matchesPostType
  })

  const stats: CommentStats = {
    totalComments: comments.length,
    approvedComments: comments.filter(c => c.status === 'approved').length,
    pendingComments: comments.filter(c => c.status === 'pending').length,
    spamComments: comments.filter(c => c.status === 'spam').length,
    rejectedComments: comments.filter(c => c.status === 'rejected').length,
    totalReplies: comments.reduce((sum, c) => sum + c.replies, 0),
    totalLikes: comments.reduce((sum, c) => sum + c.likes, 0),
    reportedComments: comments.filter(c => c.reported).length,
    recentComments: comments.filter(c => {
      const date = new Date(c.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date > weekAgo
    }).length
  }

  const handleViewComment = (comment: Comment) => {
    setSelectedComment(comment)
    setShowCommentModal(true)
  }

  const handleReplyToComment = (comment: Comment) => {
    setSelectedComment(comment)
    setShowReplyModal(true)
  }

  const handleApproveComment = (commentId: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, status: 'approved' as const } : c
    ))
    toast.success('Comment approved successfully!')
  }

  const handleRejectComment = (commentId: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, status: 'rejected' as const } : c
    ))
    toast.success('Comment rejected successfully!')
  }

  const handleMarkAsSpam = (commentId: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, status: 'spam' as const } : c
    ))
    toast.success('Comment marked as spam!')
  }

  const handleExportComments = () => {
    toast.success('Comments data exported successfully!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'spam': return 'bg-red-100 text-red-800'
      case 'rejected': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'spam': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'rejected': return <XCircle className="h-4 w-4 text-gray-500" />
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading comments...</p>
          </div>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout
      title="Comments"
      description="Manage user comments and interactions"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportComments}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      }
    >
      {/* Comment Stats */}
      <AdminSection title="Comments Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatsCard
            title="Total Comments"
            value={stats.totalComments.toString()}
            icon={<MessageSquare className="h-5 w-5" />}
            change={{ value: 8, type: 'increase' }}
          />
          <AdminStatsCard
            title="Approved"
            value={stats.approvedComments.toString()}
            icon={<CheckCircle className="h-5 w-5" />}
            change={{ value: 5, type: 'increase' }}
          />
          <AdminStatsCard
            title="Pending"
            value={stats.pendingComments.toString()}
            icon={<Clock className="h-5 w-5" />}
            change={{ value: 2, type: 'increase' }}
          />
          <AdminStatsCard
            title="Spam"
            value={stats.spamComments.toString()}
            icon={<AlertCircle className="h-5 w-5" />}
            change={{ value: 1, type: 'increase' }}
          />
        </div>
      </AdminSection>

      {/* Additional Stats */}
      <AdminSection title="Comment Activity">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminStatsCard
            title="Total Replies"
            value={stats.totalReplies.toString()}
            icon={<Reply className="h-5 w-5" />}
            change={{ value: 3, type: 'increase' }}
          />
          <AdminStatsCard
            title="Total Likes"
            value={stats.totalLikes.toString()}
            icon={<ThumbsUp className="h-5 w-5" />}
            change={{ value: 12, type: 'increase' }}
          />
          <AdminStatsCard
            title="Reported"
            value={stats.reportedComments.toString()}
            icon={<Flag className="h-5 w-5" />}
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
                placeholder="Search comments by content, author, or post..."
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
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="spam">Spam</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={postTypeFilter} onValueChange={setPostTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by post type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="blog">Blog Posts</SelectItem>
              <SelectItem value="page">Pages</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AdminCard>

      {/* Comments Table */}
      <AdminCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Comment</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Post</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead>Replies</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell>
                  <div className="max-w-md">
                    <div className="flex items-start gap-2">
                      {comment.isReply && (
                        <Reply className="h-4 w-4 text-gray-400 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {comment.content}
                        </p>
                        {comment.reported && (
                          <div className="flex items-center gap-1 mt-1">
                            <Flag className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-red-600">Reported</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-sm">{comment.author}</div>
                    <div className="text-xs text-gray-500">{comment.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-sm">{comment.postTitle}</div>
                    <Badge variant="outline" className="text-xs">
                      {comment.postType}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(comment.status)}
                    <Badge className={getStatusColor(comment.status)}>
                      {comment.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{comment.likes}</span>
                    {comment.dislikes > 0 && (
                      <>
                        <ThumbsDown className="h-4 w-4 text-red-500 ml-2" />
                        <span className="text-sm text-red-500">{comment.dislikes}</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {comment.replies > 0 ? (
                    <div className="flex items-center gap-1">
                      <Reply className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{comment.replies}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {format(new Date(comment.createdAt), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewComment(comment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {comment.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApproveComment(comment.id)}
                          className="text-green-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRejectComment(comment.id)}
                          className="text-red-600"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsSpam(comment.id)}
                      className="text-orange-600"
                    >
                      <AlertCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReplyToComment(comment)}
                    >
                      <Reply className="h-4 w-4" />
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

      {/* Comment Details Modal */}
      <Dialog open={showCommentModal} onOpenChange={setShowCommentModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comment Details</DialogTitle>
          </DialogHeader>
          {selectedComment && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedComment.author}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(selectedComment.status)}>
                      {selectedComment.status}
                    </Badge>
                    {selectedComment.reported && (
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        <Flag className="h-3 w-3 mr-1" />
                        Reported
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2">{selectedComment.email}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Comment Content</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{selectedComment.content}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Post</label>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span>{selectedComment.postTitle}</span>
                      <Badge variant="outline">{selectedComment.postType}</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{format(new Date(selectedComment.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">IP Address</label>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="font-mono text-sm">{selectedComment.ipAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Engagement</label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4 text-green-500" />
                        <span>{selectedComment.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4 text-red-500" />
                        <span>{selectedComment.dislikes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Reply className="h-4 w-4 text-gray-500" />
                        <span>{selectedComment.replies}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User Agent</label>
                    <p className="text-xs text-gray-600 mt-1 break-all">
                      {selectedComment.userAgent}
                    </p>
                  </div>
                </div>
              </div>

              {selectedComment.reportReason && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Report Reason</label>
                  <div className="mt-2 p-3 bg-red-50 rounded-lg">
                    <p className="text-red-800">{selectedComment.reportReason}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                {selectedComment.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleRejectComment(selectedComment.id)}
                      className="text-red-600"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApproveComment(selectedComment.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleMarkAsSpam(selectedComment.id)}
                  className="text-orange-600"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Mark as Spam
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Modal */}
      <Dialog open={showReplyModal} onOpenChange={setShowReplyModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to Comment</DialogTitle>
          </DialogHeader>
          {selectedComment && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Original Comment</label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{selectedComment.content}</p>
                  <p className="text-xs text-gray-500 mt-1">by {selectedComment.author}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Your Reply</label>
                <Textarea 
                  placeholder="Write your reply..." 
                  rows={4}
                  className="mt-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReplyModal(false)}>
                  Cancel
                </Button>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  )
}
