"use client"

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'New York, USA',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
    rating: 5,
    text: 'The elephant sculpture I purchased is absolutely stunning! The craftsmanship is incredible and it arrived safely packaged. This piece has become the centerpiece of my living room.',
    product: 'Traditional Elephant Carving',
    verified: true
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
    rating: 5,
    text: 'Outstanding quality and authentic African artistry. The shipping was fast and the customer service was exceptional. I will definitely be ordering more pieces for my collection.',
    product: 'Hand-carved Mask Set',
    verified: true
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    location: 'Toronto, Canada',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
    rating: 5,
    text: 'Each piece tells a story and you can feel the love and skill that went into creating it. The wooden bowl I ordered is both beautiful and functional. Highly recommended!',
    product: 'Decorative Wooden Bowl',
    verified: true
  },
  {
    id: 4,
    name: 'David Thompson',
    location: 'Sydney, Australia',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
    rating: 5,
    text: 'Amazing experience from start to finish. The giraffe sculpture exceeded my expectations and arrived in perfect condition. The attention to detail is remarkable.',
    product: 'Giraffe Family Sculpture',
    verified: true
  },
  {
    id: 5,
    name: 'Lisa Wang',
    location: 'Singapore',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
    rating: 5,
    text: 'The authenticity and quality of these artifacts is unmatched. I love knowing that my purchase supports skilled artisans and preserves traditional craftsmanship.',
    product: 'Traditional Jewelry Set',
    verified: true
  },
  {
    id: 6,
    name: 'Robert Martinez',
    location: 'Madrid, Spain',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
    rating: 5,
    text: 'Incredible craftsmanship and beautiful pieces. The mask I ordered is a work of art that brings cultural richness to my home. The shipping to Europe was surprisingly quick!',
    product: 'Ceremonial Mask',
    verified: true
  }
]

export function Testimonials() {
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
                    "{testimonial.text}"
                  </p>

                  {/* Product */}
                  <p className="text-sm text-amber-600 font-medium mb-4">
                    Purchased: {testimonial.product}
                  </p>

                  {/* Customer Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
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
