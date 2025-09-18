"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Image as ImageIcon, 
  Video, 
  Download, 
  Trash2,
  Eye,
  Edit,
  Copy,
  Grid3X3,
  List,
  FolderPlus,
  SortAsc,
  SortDesc,
  Calendar,
  FileText,
  Maximize
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import { AdminPageLayout, AdminCard, AdminStatsCard, AdminSection } from '@/components/admin/admin-page-layout'

interface MediaFile {
  id: string
  fileName: string
  originalName: string
  filePath: string
  fileSize: number
  mimeType: string
  width?: number
  height?: number
  duration?: number
  alt?: string
  caption?: string
  isActive: boolean
  createdAt: string
  url: string
}

interface UploadProgress {
  fileName: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
}

// Mock data - in real app, fetch from API
const mockMediaFiles: MediaFile[] = [
  {
    id: '1',
    fileName: 'elephant-carving-001.jpg',
    originalName: 'Traditional Elephant Carving Main.jpg',
    filePath: '/uploads/products/elephant-carving-001.jpg',
    fileSize: 2048576,
    mimeType: 'image/jpeg',
    width: 1920,
    height: 1080,
    alt: 'Traditional Elephant Carving - Main View',
    caption: 'Beautiful handcrafted elephant carving made from premium ebony wood',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    url: '/placeholder-product.jpg'
  },
  {
    id: '2',
    fileName: 'mask-ceremony-001.jpg',
    originalName: 'Ceremonial Mask Collection.jpg',
    filePath: '/uploads/products/mask-ceremony-001.jpg',
    fileSize: 1536000,
    mimeType: 'image/jpeg',
    width: 1600,
    height: 1200,
    alt: 'Ceremonial Mask',
    caption: 'Traditional ceremonial mask used in cultural festivities',
    isActive: true,
    createdAt: '2024-01-14T15:45:00Z',
    url: '/placeholder-product.jpg'
  },
  {
    id: '3',
    fileName: 'basket-weaving-demo.mp4',
    originalName: 'Basket Weaving Process.mp4',
    filePath: '/uploads/videos/basket-weaving-demo.mp4',
    fileSize: 15728640,
    mimeType: 'video/mp4',
    width: 1920,
    height: 1080,
    duration: 120,
    alt: 'Basket Weaving Demonstration',
    caption: 'Step-by-step process of traditional basket weaving',
    isActive: true,
    createdAt: '2024-01-13T09:15:00Z',
    url: '/placeholder-video.mp4'
  }
]

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(mockMediaFiles)
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>(mockMediaFiles)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [showFileDetails, setShowFileDetails] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [dragOver, setDragOver] = useState(false)

  // Filter and sort files
  useEffect(() => {
    let filtered = mediaFiles

    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.alt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.caption?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(file => {
        if (typeFilter === 'images') return file.mimeType.startsWith('image/')
        if (typeFilter === 'videos') return file.mimeType.startsWith('video/')
        return true
      })
    }

    // Sort files
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'name':
          return a.fileName.localeCompare(b.fileName)
        case 'size':
          return b.fileSize - a.fileSize
        default:
          return 0
      }
    })

    setFilteredFiles(filtered)
  }, [mediaFiles, searchTerm, typeFilter, sortBy])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const uploadId = `upload-${Date.now()}-${index}`
        
        // Add to upload progress
        setUploadProgress(prev => [...prev, {
          fileName: file.name,
          progress: 0,
          status: 'uploading'
        }])

        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress(prev => prev.map(up => 
            up.fileName === file.name && up.status === 'uploading'
              ? { ...up, progress: Math.min(up.progress + 10, 100) }
              : up
          ))
        }, 200)

        // Simulate upload completion
        setTimeout(() => {
          clearInterval(interval)
          setUploadProgress(prev => prev.map(up => 
            up.fileName === file.name
              ? { ...up, progress: 100, status: 'completed' }
              : up
          ))

          // Add to media files (mock)
          const reader = new FileReader()
          reader.onload = (e) => {
            const newFile: MediaFile = {
              id: uploadId,
              fileName: file.name.toLowerCase().replace(/\s+/g, '-'),
              originalName: file.name,
              filePath: `/uploads/${file.type.startsWith('image/') ? 'images' : 'videos'}/${file.name}`,
              fileSize: file.size,
              mimeType: file.type,
              width: file.type.startsWith('image/') ? 1920 : undefined,
              height: file.type.startsWith('image/') ? 1080 : undefined,
              duration: file.type.startsWith('video/') ? 60 : undefined,
              alt: file.name.replace(/\.[^/.]+$/, ''),
              caption: '',
              isActive: true,
              createdAt: new Date().toISOString(),
              url: e.target?.result as string
            }
            
            setMediaFiles(prev => [newFile, ...prev])
          }
          reader.readAsDataURL(file)

          toast.success(`${file.name} uploaded successfully`)
          
          // Remove from progress after delay
          setTimeout(() => {
            setUploadProgress(prev => prev.filter(up => up.fileName !== file.name))
          }, 2000)
        }, 2000 + Math.random() * 1000)
      } else {
        toast.error(`${file.name}: Only image and video files are supported`)
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const deleteFile = async (fileId: string) => {
    try {
      setMediaFiles(prev => prev.filter(file => file.id !== fileId))
      toast.success('File deleted successfully')
    } catch (error) {
      toast.error('Failed to delete file')
    }
  }

  const copyFileUrl = (file: MediaFile) => {
    navigator.clipboard.writeText(`${window.location.origin}${file.filePath}`)
    toast.success('File URL copied to clipboard')
  }

  const updateFileDetails = async (fileId: string, updates: Partial<MediaFile>) => {
    try {
      setMediaFiles(prev => prev.map(file =>
        file.id === fileId ? { ...file, ...updates } : file
      ))
      toast.success('File details updated successfully')
    } catch (error) {
      toast.error('Failed to update file details')
    }
  }

  const mediaStats = {
    total: mediaFiles.length,
    images: mediaFiles.filter(f => f.mimeType.startsWith('image/')).length,
    videos: mediaFiles.filter(f => f.mimeType.startsWith('video/')).length,
    totalSize: mediaFiles.reduce((sum, file) => sum + file.fileSize, 0)
  }

  return (
    <AdminPageLayout
        title="Media Library"
        description="Manage your product images and videos"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowUploadModal(true)}>
              <FolderPlus className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Button 
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => setShowUploadModal(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        }
      >

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaStats.images}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
            <Video className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaStats.videos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(mediaStats.totalSize)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadProgress.map((upload, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{upload.fileName}</span>
                    <span className={upload.status === 'completed' ? 'text-green-600' : upload.status === 'error' ? 'text-red-600' : 'text-blue-600'}>
                      {upload.status === 'completed' ? 'Completed' : upload.status === 'error' ? 'Error' : `${upload.progress}%`}
                    </span>
                  </div>
                  <Progress value={upload.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="File type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Files</SelectItem>
                <SelectItem value="images">Images</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">File Size</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid/List */}
      <Card>
        <CardHeader>
          <CardTitle>Media Files</CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border"
                >
                  {file.mimeType.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Video className="h-12 w-12 text-gray-400" />
                      {file.duration && (
                        <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                          {formatDuration(file.duration)}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedFile(file)
                          setShowFileDetails(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyFileUrl(file)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteFile(file.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <div className="text-white text-sm font-medium truncate">
                      {file.originalName}
                    </div>
                    <div className="text-white/70 text-xs">
                      {formatFileSize(file.fileSize)} • {format(new Date(file.createdAt), 'MMM d, yyyy')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                    {file.mimeType.startsWith('image/') ? (
                      <img src={file.url} alt={file.alt} className="w-full h-full object-cover rounded" />
                    ) : (
                      <Video className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium">{file.originalName}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatFileSize(file.fileSize)} • {format(new Date(file.createdAt), 'MMM d, yyyy')}
                      {file.width && file.height && ` • ${file.width}×${file.height}`}
                      {file.duration && ` • ${formatDuration(file.duration)}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedFile(file)
                        setShowFileDetails(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyFileUrl(file)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteFile(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No files found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || typeFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by uploading your first media files.'}
              </p>
              <div className="mt-6">
                <Button onClick={() => setShowUploadModal(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Media Files</DialogTitle>
            <DialogDescription>
              Upload images and videos for your products
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Button variant="outline" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Choose Files
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    />
                  </label>
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports: JPG, PNG, GIF, MP4, WebM (Max 100MB per file)
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Details Modal */}
      <Dialog open={showFileDetails} onOpenChange={setShowFileDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>File Details</DialogTitle>
            <DialogDescription>
              {selectedFile && `Manage ${selectedFile.originalName}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedFile && (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                {selectedFile.mimeType.startsWith('image/') ? (
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.alt}
                    className="w-full rounded-lg"
                  />
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <Video className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="alt-text">Alt Text</Label>
                  <Input
                    id="alt-text"
                    value={selectedFile.alt || ''}
                    onChange={(e) => setSelectedFile({ ...selectedFile, alt: e.target.value })}
                    placeholder="Describe the image for accessibility"
                  />
                </div>
                
                <div>
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea
                    id="caption"
                    value={selectedFile.caption || ''}
                    onChange={(e) => setSelectedFile({ ...selectedFile, caption: e.target.value })}
                    placeholder="Add a caption for this media"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-active"
                    checked={selectedFile.isActive}
                    onCheckedChange={(checked) => setSelectedFile({ ...selectedFile, isActive: checked })}
                  />
                  <Label htmlFor="is-active">Active</Label>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div><strong>File Name:</strong> {selectedFile.fileName}</div>
                  <div><strong>Original Name:</strong> {selectedFile.originalName}</div>
                  <div><strong>File Size:</strong> {formatFileSize(selectedFile.fileSize)}</div>
                  <div><strong>Type:</strong> {selectedFile.mimeType}</div>
                  {selectedFile.width && selectedFile.height && (
                    <div><strong>Dimensions:</strong> {selectedFile.width}×{selectedFile.height}</div>
                  )}
                  {selectedFile.duration && (
                    <div><strong>Duration:</strong> {formatDuration(selectedFile.duration)}</div>
                  )}
                  <div><strong>Uploaded:</strong> {format(new Date(selectedFile.createdAt), 'PPP')}</div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => updateFileDetails(selectedFile.id, {
                      alt: selectedFile.alt,
                      caption: selectedFile.caption,
                      isActive: selectedFile.isActive
                    })}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => copyFileUrl(selectedFile)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy URL
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </AdminPageLayout>
  )
}
