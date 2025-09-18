"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const categories = [
  {
    id: 'sculptures',
    name: 'Sculptures & Carvings',
    description: 'Majestic animal figures, abstract art pieces, and traditional sculptures carved from premium woods. Each piece represents the rich cultural heritage of the Akamba people.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600&auto=format&fit=crop',
    productCount: 45,
    artisanCount: 12,
    featured: true,
    priceRange: '$25 - $500',
    highlights: ['Elephant carvings', 'Giraffe sculptures', 'Abstract forms', 'Wildlife collection']
  },
  {
    id: 'masks',
    name: 'Traditional Masks',
    description: 'Ceremonial and decorative African masks handcrafted with intricate details. Each mask tells a story and carries deep cultural significance.',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=600&auto=format&fit=crop',
    productCount: 28,
    artisanCount: 8,
    featured: true,
    priceRange: '$50 - $300',
    highlights: ['Ceremonial masks', 'Decorative pieces', 'Tribal designs', 'Wall art']
  },
  {
    id: 'bowls',
    name: 'Wooden Bowls & Vessels',
    description: 'Functional and decorative serving pieces perfect for modern homes. Handcrafted from sustainable wood sources with beautiful natural finishes.',
    image: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=600&auto=format&fit=crop',
    productCount: 32,
    artisanCount: 6,
    featured: false,
    priceRange: '$20 - $150',
    highlights: ['Serving bowls', 'Decorative vessels', 'Salad bowls', 'Fruit bowls']
  },
  {
    id: 'furniture',
    name: 'Handcrafted Furniture',
    description: 'Beautiful, functional furniture pieces including stools, chairs, and tables. Each piece combines traditional craftsmanship with modern design.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop',
    productCount: 18,
    artisanCount: 5,
    featured: false,
    priceRange: '$80 - $800',
    highlights: ['Traditional stools', 'Dining chairs', 'Coffee tables', 'Display stands']
  },
  {
    id: 'jewelry',
    name: 'Jewelry & Accessories',
    description: 'Beautiful beaded necklaces, bracelets, and earrings made from natural materials. Traditional designs with contemporary appeal.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    productCount: 24,
    artisanCount: 4,
    featured: false,
    priceRange: '$15 - $120',
    highlights: ['Beaded necklaces', 'Traditional bracelets', 'Earrings', 'Anklets']
  },
  {
    id: 'textiles',
    name: 'Textiles & Fabrics',
    description: 'Traditional clothing, bags, and home décor items featuring authentic African patterns and vibrant colors.',
    image: 'https://images.unsplash.com/photo-1594736797933-d0ccef5ba6dd?q=80&w=600&auto=format&fit=crop',
    productCount: 16,
    artisanCount: 3,
    featured: false,
    priceRange: '$25 - $200',
    highlights: ['Traditional clothing', 'Handbags', 'Table runners', 'Wall hangings']
  },
  {
    id: 'musical',
    name: 'Musical Instruments',
    description: 'Traditional African musical instruments including drums, rattles, and string instruments crafted using ancient techniques.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600&auto=format&fit=crop',
    productCount: 12,
    artisanCount: 2,
    featured: false,
    priceRange: '$40 - $350',
    highlights: ['Hand drums', 'Shakers', 'Thumb pianos', 'Flutes']
  },
  {
    id: 'home-decor',
    name: 'Home Décor',
    description: 'Unique decorative pieces to bring African elegance to your home. From wall art to centerpieces, each item is a conversation starter.',
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=600&auto=format&fit=crop',
    productCount: 21,
    artisanCount: 7,
    featured: false,
    priceRange: '$30 - $250',
    highlights: ['Wall sculptures', 'Centerpieces', 'Decorative figures', 'Art pieces']
  }
]

export default function CategoriesPage() {
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
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
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
                            {category.artisanCount} Artisans
                          </span>
                          <span>{category.priceRange}</span>
                        </div>
                        
                        <Link href={`/categories/${category.id}`}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Link href={`/categories/${category.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm h-full">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
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
                          {category.priceRange}
                        </span>
                        <span className="text-sm text-gray-500">
                          {category.artisanCount} artisans
                        </span>
                      </div>

                      {/* Highlights */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {category.highlights.slice(0, 3).map((highlight, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {highlight}
                            </span>
                          ))}
                          {category.highlights.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{category.highlights.length - 3} more
                            </span>
                          )}
                        </div>
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
