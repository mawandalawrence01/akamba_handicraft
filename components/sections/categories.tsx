"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Folder } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  productCount: number
  featured: boolean
  parentId?: string
}

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories)
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

  // Helper function to ensure image URLs are properly formatted
  const getImageUrl = (url: string) => {
    if (!url) return null
    // If URL already starts with /, return as is (local file)
    if (url.startsWith('/')) return url
    // If URL starts with http/https, return as is (external URL)
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    // If URL doesn't start with /, add it (assume local file)
    return `/${url}`
  }

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-80 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const featuredCategories = categories.filter(cat => cat.featured && !cat.parentId)
  const otherCategories = categories.filter(cat => !cat.featured && !cat.parentId)

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Our <span className="text-amber-600">Categories</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From intricate sculptures to functional home décor, discover the diverse range 
              of authentic African craftsmanship.
            </p>
          </motion.div>
        </div>

        {/* Featured Categories - Large Cards */}
        {featuredCategories.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {featuredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md">
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
                        <Folder className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-gray-200 mb-4">{category.description || 'Discover amazing products in this category'}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                          {category.productCount} Products
                        </span>
                        <Link href={`/categories/${category.slug}`}>
                          <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white text-gray-900">
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
        )}

        {/* Other Categories - Grid */}
        {otherCategories.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {otherCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/categories/${category.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                    <div className="relative aspect-square overflow-hidden">
                      {category.image && getImageUrl(category.image) ? (
                        <Image
                          src={getImageUrl(category.image)!}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          onError={(e) => {
                            console.error('Image failed to load:', category.image)
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Folder className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {category.description || 'Discover amazing products in this category'}
                      </p>
                      <span className="text-xs text-amber-600 font-medium">
                        {category.productCount} Products →
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {categories.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories available</h3>
            <p className="text-gray-600">Check back later for new categories.</p>
          </div>
        )}

        {/* Call to Action */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/categories">
              <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                View All Categories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
