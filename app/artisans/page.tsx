"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Award, Star, Calendar, Heart, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const artisans = [
  {
    id: 'john-mwangi',
    name: 'John Mwangi',
    specialties: ['Wildlife Sculptures', 'Elephant Carvings', 'Abstract Art'],
    location: 'Machakos, Kenya',
    experience: 15,
    rating: 4.9,
    reviewCount: 67,
    productCount: 24,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    bio: 'Master carver specializing in wildlife sculptures with over 15 years of experience. John\'s work has been featured in galleries across Kenya and internationally.',
    joinedDate: '2008',
    featured: true,
    achievements: ['Master Craftsman Award 2020', 'Cultural Heritage Ambassador'],
    recentWork: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=200&auto=format&fit=crop'
    ]
  },
  {
    id: 'mary-mutua',
    name: 'Mary Mutua',
    specialties: ['Traditional Masks', 'Ceremonial Art', 'Cultural Pieces'],
    location: 'Kitui, Kenya',
    experience: 12,
    rating: 4.8,
    reviewCount: 45,
    productCount: 18,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?q=80&w=400&auto=format&fit=crop',
    bio: 'Renowned for her intricate mask designs that honor traditional Akamba ceremonies. Mary has preserved ancient techniques passed down through generations.',
    joinedDate: '2011',
    featured: true,
    achievements: ['Traditional Arts Excellence Award', 'UNESCO Recognition'],
    recentWork: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594736797933-d0ccef5ba6dd?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop'
    ]
  },
  {
    id: 'peter-kioko',
    name: 'Peter Kioko',
    specialties: ['Functional Art', 'Wooden Bowls', 'Kitchen Utensils'],
    location: 'Mombasa, Kenya',
    experience: 8,
    rating: 4.7,
    reviewCount: 32,
    productCount: 15,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    bio: 'Expert in creating beautiful functional pieces that blend traditional craftsmanship with modern utility. Peter\'s bowls are sought after by collectors worldwide.',
    joinedDate: '2015',
    featured: false,
    achievements: ['Sustainable Crafts Award', 'Young Artisan of the Year 2019'],
    recentWork: [
      'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=200&auto=format&fit=crop'
    ]
  },
  {
    id: 'grace-muthoni',
    name: 'Grace Muthoni',
    specialties: ['Animal Sculptures', 'Miniature Art', 'Gift Items'],
    location: 'Nairobi, Kenya',
    experience: 10,
    rating: 5.0,
    reviewCount: 28,
    productCount: 21,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop',
    bio: 'Perfectionist artist known for her detailed animal sculptures and miniature masterpieces. Grace\'s work captures the essence of African wildlife.',
    joinedDate: '2013',
    featured: false,
    achievements: ['Wildlife Conservation Art Award', 'Perfect Rating Achievement'],
    recentWork: [
      'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=200&auto=format&fit=crop'
    ]
  },
  {
    id: 'samuel-musya',
    name: 'Samuel Musya',
    specialties: ['Warrior Masks', 'Historical Pieces', 'Cultural Artifacts'],
    location: 'Machakos, Kenya',
    experience: 20,
    rating: 4.6,
    reviewCount: 89,
    productCount: 31,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    bio: 'Veteran artisan with two decades of experience in creating historically significant pieces. Samuel is a living repository of Akamba cultural knowledge.',
    joinedDate: '2003',
    featured: false,
    achievements: ['Lifetime Achievement Award', 'Cultural Heritage Master', 'Museum Quality Recognition'],
    recentWork: [
      'https://images.unsplash.com/photo-1594736797933-d0ccef5ba6dd?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=200&auto=format&fit=crop'
    ]
  },
  {
    id: 'elizabeth-wanza',
    name: 'Elizabeth Wanza',
    specialties: ['Furniture', 'Home Décor', 'Modern Designs'],
    location: 'Kitui, Kenya',
    experience: 6,
    rating: 4.5,
    reviewCount: 23,
    productCount: 12,
    image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=400&auto=format&fit=crop',
    bio: 'Rising star in furniture design, Elizabeth combines traditional techniques with contemporary aesthetics to create unique home furnishing pieces.',
    joinedDate: '2017',
    featured: false,
    achievements: ['Emerging Artist Award', 'Modern Craft Innovation Prize'],
    recentWork: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=200&auto=format&fit=crop'
    ]
  }
]

export default function ArtisansPage() {
  const featuredArtisans = artisans.filter(artisan => artisan.featured)
  const otherArtisans = artisans.filter(artisan => !artisan.featured)

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
                          <AvatarImage src={artisan.image} alt={artisan.name} />
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
                            {artisan.specialties.map((specialty, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Achievements */}
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-2">Recent Achievements:</h4>
                          <div className="space-y-1">
                            {artisan.achievements.slice(0, 2).map((achievement, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Award className="h-3 w-3 text-amber-500" />
                                <span className="text-sm text-gray-600">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recent Work */}
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-3">Recent Work:</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {artisan.recentWork.map((work, idx) => (
                              <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                                <img
                                  src={work}
                                  alt={`${artisan.name}'s work ${idx + 1}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                />
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
                            <div className="text-2xl font-bold text-amber-600">Since {artisan.joinedDate}</div>
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
                        <AvatarImage src={artisan.image} alt={artisan.name} />
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
                        {artisan.specialties.slice(0, 2).map((specialty, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {artisan.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{artisan.specialties.length - 2}
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
                        {artisan.recentWork.slice(0, 3).map((work, idx) => (
                          <div key={idx} className="aspect-square rounded overflow-hidden">
                            <img
                              src={work}
                              alt={`Work ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
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
