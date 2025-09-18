"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const categories = [
  {
    id: 'sculptures',
    name: 'Sculptures & Carvings',
    description: 'Majestic animal figures and abstract art pieces',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=500&auto=format&fit=crop',
    productCount: 45,
    featured: true
  },
  {
    id: 'masks',
    name: 'Traditional Masks',
    description: 'Ceremonial and decorative African masks',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=500&auto=format&fit=crop',
    productCount: 28,
    featured: true
  },
  {
    id: 'bowls',
    name: 'Wooden Bowls',
    description: 'Functional and decorative serving pieces',
    image: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=500&auto=format&fit=crop',
    productCount: 32,
    featured: false
  },
  {
    id: 'furniture',
    name: 'Furniture',
    description: 'Handcrafted stools, chairs, and tables',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=500&auto=format&fit=crop',
    productCount: 18,
    featured: false
  },
  {
    id: 'jewelry',
    name: 'Jewelry & Accessories',
    description: 'Beaded necklaces, bracelets, and earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=500&auto=format&fit=crop',
    productCount: 24,
    featured: false
  },
  {
    id: 'textiles',
    name: 'Textiles & Fabrics',
    description: 'Traditional clothing and home décor',
    image: 'https://images.unsplash.com/photo-1594736797933-d0ccef5ba6dd?q=80&w=500&auto=format&fit=crop',
    productCount: 16,
    featured: false
  }
]

export function Categories() {
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
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {categories.filter(cat => cat.featured).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-gray-200 mb-4">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                        {category.productCount} Products
                      </span>
                      <Link href={`/categories/${category.id}`}>
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

        {/* Other Categories - Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.filter(cat => !cat.featured).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/categories/${category.id}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {category.description}
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

        {/* Call to Action */}
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
      </div>
    </section>
  )
}
