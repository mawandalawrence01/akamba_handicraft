"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Star, 
  Calendar, 
  Heart, 
  Eye, 
  Users, 
  ArrowLeft,
  Award,
  Clock,
  Package,
  MessageCircle,
  Share2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { toast } from 'react-hot-toast'
import { OptimizedImage } from '@/components/ui/optimized-image'

interface Artisan {
  id: string
  name: string
  slug: string
  bio: string
  location: string
  image?: string
  experience: number
  rating: number
  reviewCount: number
  productCount: number
  recentWork: Array<{
    id: string
    name: string
    price: number
    image?: string
    imageAlt?: string
  }>
  joinDate: string
  specialties: string[]
}

// Helper function to get image URL
const getImageUrl = (url: string | null) => {
  if (!url) return null
  // If URL already starts with /, return as is (local file)
  if (url.startsWith('/')) return url
  // If URL starts with http/https, return as is (external URL)
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  // If URL doesn't start with /, add it (assume local file)
  return `/${url}`
}

export default function ArtisanDetailPage() {
  const params = useParams()
  const artisanId = params.id as string
  
  const [artisan, setArtisan] = useState<Artisan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/artisans/${artisanId}`)
        if (response.ok) {
          const data = await response.json()
          setArtisan(data.artisan)
        } else if (response.status === 404) {
          setError('Artisan not found')
        } else {
          setError('Failed to fetch artisan details')
        }
      } catch (error) {
        console.error('Error fetching artisan:', error)
        setError('Error loading artisan details')
      } finally {
        setLoading(false)
      }
    }

    if (artisanId) {
      fetchArtisan()
    }
  }, [artisanId])

  const handleContactArtisan = () => {
    toast.success('Contact form will be implemented soon!')
  }

  const handleShareArtisan = () => {
    if (navigator.share) {
      navigator.share({
        title: `${artisan?.name} - Akamba Handicraft`,
        text: `Check out ${artisan?.name}'s amazing work on Akamba Handicraft`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6">
                  <div className="h-32 w-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg p-6">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !artisan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {error || 'Artisan not found'}
            </h1>
            <p className="text-gray-600 mb-6">
              The artisan you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/artisans">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Artisans
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/artisans" className="text-gray-500 hover:text-gray-700">Artisans</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{artisan.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Artisan Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  {/* Artisan Avatar */}
                  <div className="text-center mb-6">
                    <Avatar className="h-32 w-32 mx-auto mb-4">
                      <AvatarImage 
                        src={getImageUrl(artisan.image || '') || undefined} 
                        alt={artisan.name}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <AvatarFallback className="text-2xl">
                        {artisan.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{artisan.name}</h1>
                    <div className="flex items-center justify-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{artisan.location}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(artisan.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{artisan.rating} ({artisan.reviewCount} reviews)</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{artisan.experience}</div>
                      <p className="text-sm text-gray-600">Years Experience</p>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {(artisan.specialties || []).map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      onClick={handleContactArtisan}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Artisan
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleShareArtisan}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Profile
                    </Button>
                  </div>

                  {/* Join Date */}
                  <div className="mt-6 pt-6 border-t text-center">
                    <div className="flex items-center justify-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">Member since {artisan.joinDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About {artisan.name}</h2>
                  <p className="text-gray-700 leading-relaxed">{artisan.bio}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Work Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Work</h2>
                    <Link href={`/products?artisan=${artisan.slug}`}>
                      <Button variant="outline" size="sm">
                        View All Products
                      </Button>
                    </Link>
                  </div>
                  
                  {(artisan.recentWork || []).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(artisan.recentWork || []).map((work) => (
                        <Link key={work.id} href={`/products/${work.id}`}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="group cursor-pointer"
                          >
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                              {work.image && getImageUrl(work.image) ? (
                                <OptimizedImage
                                  src={getImageUrl(work.image)!}
                                  alt={work.imageAlt || work.name}
                                  width={300}
                                  height={300}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  quality="auto"
                                  format="auto"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Package className="h-12 w-12" />
                                </div>
                              )}
                            </div>
                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {work.name}
                            </h3>
                            <p className="text-lg font-bold text-gray-900 mt-1">
                              ${work.price}
                            </p>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No recent work available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Artisan Statistics</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{artisan.productCount}</div>
                      <p className="text-sm text-gray-600">Products Created</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">{artisan.experience}</div>
                      <p className="text-sm text-gray-600">Years Experience</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">{artisan.rating}</div>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">{artisan.reviewCount}</div>
                      <p className="text-sm text-gray-600">Customer Reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
