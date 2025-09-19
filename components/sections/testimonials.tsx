"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  content: string
  title?: string
  avatar?: string
  productName: string
  productImage?: string
  date: string
  verified: boolean
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials?limit=6')
        if (response.ok) {
          const data = await response.json()
          setTestimonials(data.testimonials)
        } else {
          console.error('Failed to fetch testimonials')
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

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
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="text-amber-600">Customers Say</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have brought authentic African artistry 
              into their homes and lives.
            </p>
          </div>
          
          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="h-full border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-8 w-8 bg-gray-200 rounded mb-4"></div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-4 w-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-white">
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
              What Our <span className="text-amber-600">Customers Say</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have brought authentic African artistry 
              into their homes and lives.
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    {/* Quote Icon */}
                    <div className="mb-4">
                      <Quote className="h-8 w-8 text-amber-500 fill-current" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-gray-700 mb-4 line-clamp-4">
                      "{testimonial.content}"
                    </p>

                    {/* Product */}
                    <p className="text-sm text-amber-600 font-medium mb-4">
                      Purchased: {testimonial.productName}
                    </p>

                    {/* Customer Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={getImageUrl(testimonial.avatar || '') || undefined} 
                          alt={testimonial.name}
                          onError={(e) => {
                            console.error('Avatar failed to load:', testimonial.avatar)
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">
                            {testimonial.name}
                          </h4>
                          {testimonial.verified && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No testimonials available yet.</p>
            <p className="text-gray-400 text-sm mt-2">Customer reviews will appear here once they start coming in.</p>
          </div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">4.9</div>
            <p className="text-gray-600">Average Rating</p>
          </div>
          
          <div>
            <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">1000+</div>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          
          <div>
            <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">50+</div>
            <p className="text-gray-600">Countries Served</p>
          </div>
          
          <div>
            <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">99%</div>
            <p className="text-gray-600">Satisfaction Rate</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
