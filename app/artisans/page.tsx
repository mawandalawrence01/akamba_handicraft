"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Star, Calendar, Heart, Eye, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

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

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const response = await fetch('/api/artisans')
        if (response.ok) {
          const data = await response.json()
          setArtisans(data.artisans || [])
        } else {
          console.error('Failed to fetch artisans')
        }
      } catch (error) {
        console.error('Error fetching artisans:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchArtisans()
  }, [])

  // Since isFeatured doesn't exist in schema, show first 3 as featured and rest as others
  const featuredArtisans = artisans.slice(0, 3)
  const otherArtisans = artisans.slice(3)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-amber-600">Master Artisans</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the talented craftspeople behind our beautiful artifacts. Each artisan brings 
              years of experience, cultural knowledge, and passionate dedication to their craft.
            </p>
          </motion.div>
        </div>

        {/* Featured Artisans */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Master Artisans</h2>
            <p className="text-gray-600">Our most celebrated craftspeople with decades of experience</p>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-96 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : featuredArtisans.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {featuredArtisans.map((artisan, index) => (
              <motion.div
                key={artisan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg h-full">
                  <CardContent className="p-0">
                    <div className="relative">
                      {/* Header Image */}
                      <div className="h-48 bg-gradient-to-r from-amber-400 to-orange-500 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-4 left-4 w-16 h-16 bg-white/20 rounded-full"></div>
                          <div className="absolute bottom-6 right-6 w-12 h-12 bg-white/10 rounded-full"></div>
                        </div>
                        <Badge className="absolute top-4 right-4 bg-white text-amber-600">
                          Featured Master
                        </Badge>
                      </div>

                      {/* Profile Image */}
                      <div className="absolute -bottom-16 left-6">
                        <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                          <AvatarImage 
                            src={getImageUrl(artisan.image || '') || undefined} 
                            alt={artisan.name}
                            onError={(e) => {
                              console.error('Avatar image failed to load:', artisan.image)
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          <AvatarFallback className="text-2xl font-bold">
                            {artisan.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    <div className="pt-20 p-6">
                      {/* Artisan Info */}
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{artisan.name}</h3>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600 text-sm">{artisan.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600 text-sm">{artisan.experience} years exp</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mb-4">
                          <div className="flex">
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
                          <span className="text-sm text-gray-600 ml-1">
                            {artisan.rating} ({artisan.reviewCount} reviews)
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4">{artisan.bio}</p>

                        {/* Specialties */}
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Specialties:</h4>
                          <div className="flex flex-wrap gap-2">
                            {(artisan.specialties || []).map((specialty, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>


                        {/* Recent Work */}
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-3">Recent Work:</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {(artisan.recentWork || []).map((work, idx) => (
                              <div key={work.id} className="aspect-square rounded-lg overflow-hidden">
                                {work.image && getImageUrl(work.image) ? (
                                  <Image
                                    src={getImageUrl(work.image)!}
                                    alt={work.imageAlt || work.name}
                                    width={100}
                                    height={100}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                    onError={(e) => {
                                      console.error('Recent work image failed to load:', work.image)
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">No Image</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">{artisan.productCount}</div>
                            <div className="text-sm text-gray-600">Products</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">Since {artisan.joinDate}</div>
                            <div className="text-sm text-gray-600">With Us</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Link href={`/artisans/${artisan.id}`} className="flex-1">
                            <Button className="w-full bg-amber-600 hover:bg-amber-700">
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </Button>
                          </Link>
                          <Button variant="outline" size="icon">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No featured artisans found</h3>
              <p className="text-gray-600">Check back later for featured master artisans</p>
            </div>
          )}
        </section>

        {/* All Artisans */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Talented Artisans</h2>
            <p className="text-gray-600">Meet all the skilled craftspeople in our community</p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : otherArtisans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherArtisans.map((artisan, index) => (
              <motion.div
                key={artisan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm h-full">
                  <CardContent className="p-6">
                    {/* Profile */}
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage 
                          src={getImageUrl(artisan.image || '') || undefined} 
                          alt={artisan.name}
                          onError={(e) => {
                            console.error('Avatar image failed to load:', artisan.image)
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                        <AvatarFallback>
                          {artisan.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{artisan.name}</h3>
                        <div className="flex items-center gap-1 mb-2">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span className="text-sm text-gray-600">{artisan.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(artisan.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600 ml-1">
                            {artisan.rating} ({artisan.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">{artisan.bio}</p>

                    {/* Specialties */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {(artisan.specialties || []).slice(0, 2).map((specialty, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {(artisan.specialties || []).length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{(artisan.specialties || []).length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-amber-600">{artisan.experience}</div>
                        <div className="text-xs text-gray-600">Years Exp</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-amber-600">{artisan.productCount}</div>
                        <div className="text-xs text-gray-600">Products</div>
                      </div>
                    </div>

                    {/* Recent Work Preview */}
                    <div className="mb-4">
                      <div className="grid grid-cols-3 gap-1">
                        {(artisan.recentWork || []).slice(0, 3).map((work, idx) => (
                          <div key={work.id} className="aspect-square rounded overflow-hidden">
                            {work.image && getImageUrl(work.image) ? (
                              <Image
                                src={getImageUrl(work.image)!}
                                alt={work.imageAlt || work.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error('Recent work image failed to load:', work.image)
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No Image</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/artisans/${artisan.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          View Profile
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No artisans found</h3>
              <p className="text-gray-600">Check back later for new artisans</p>
            </div>
          )}
        </section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Join Our Artisan Community</h2>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
            Are you a skilled craftsperson interested in sharing your work with the world? 
            We're always looking for talented artisans to join our cooperative.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="bg-white text-amber-600 hover:bg-gray-100">
                Apply to Join
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  )
}
