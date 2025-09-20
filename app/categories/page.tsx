"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { OptimizedImage } from '@/components/ui/optimized-image'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image?: string
  productCount: number
  featured: boolean
  sortOrder: number
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        } else {
          console.error('Failed to fetch categories')
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const featuredCategories = categories.filter(cat => cat.featured)
  const otherCategories = categories.filter(cat => !cat.featured)

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
              Browse <span className="text-amber-600">Categories</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our diverse collection of authentic Akamba handicrafts, each category 
              representing centuries of cultural heritage and masterful craftsmanship.
            </p>
          </motion.div>
        </div>

        {/* Featured Categories */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Collections</h2>
            <p className="text-gray-600">Our most popular and celebrated product categories</p>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-80 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : featuredCategories.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {featuredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full">
                  <div className="relative h-80 overflow-hidden">
                    {category.image && getImageUrl(category.image) ? (
                      <Image
                        src={getImageUrl(category.image)!}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onError={(e) => {
                          console.error('Image failed to load:', category.image)
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    
                    {/* Overlay Content */}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-amber-500 text-white">Featured</Badge>
                        <span className="text-sm bg-white/20 px-2 py-1 rounded">
                          {category.productCount} Products
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-gray-200 mb-4 line-clamp-2">{category.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {category.productCount} Products
                          </span>
                        </div>
                        
                        <Link href={`/products?category=${category.slug}`}>
                          <Button variant="secondary" className="bg-white/90 hover:bg-white text-gray-900">
                            Explore
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No featured categories found</h3>
              <p className="text-gray-600">Check back later for featured collections</p>
            </div>
          )}
        </section>

        {/* All Categories Grid */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">All Categories</h2>
            <p className="text-gray-600">Discover our complete range of authentic African crafts</p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : otherCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Link href={`/products?category=${category.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm h-full">
                    <div className="relative aspect-[4/3] overflow-hidden">
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
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      
                      {/* Quick Stats */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90 text-gray-900">
                          {category.productCount} items
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                        {category.name}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {category.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-amber-600 font-medium">
                          {category.productCount} Products
                        </span>
                        <span className="text-sm text-gray-500">
                          Featured: {category.featured ? 'Yes' : 'No'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 p-0">
                          View Collection →
                        </Button>
                        
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600">Check back later for new categories</p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
            Our artisans can create custom pieces tailored to your specific needs. 
            Contact us to discuss your vision and bring it to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="bg-white text-amber-600 hover:bg-gray-100">
                Contact Us
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600">
                Browse All Products
              </Button>
            </Link>
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  )
}
