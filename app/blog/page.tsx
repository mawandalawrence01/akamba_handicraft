"use client"

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, Tag, ArrowRight, Search, Clock, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const blogPosts = [
  {
    id: 'akamba-carving-traditions',
    title: 'The Ancient Art of Akamba Wood Carving: A Journey Through Time',
    excerpt: 'Discover the rich history and traditional techniques of Akamba wood carving that have been passed down through generations.',
    content: 'Full article content would go here...',
    author: 'Joseph Mwema',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
    publishedAt: '2024-01-15',
    readTime: 8,
    category: 'Culture',
    tags: ['Traditions', 'Wood Carving', 'History', 'Akamba Culture'],
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600&auto=format&fit=crop',
    featured: true,
    views: 1245
  },
  {
    id: 'sustainable-crafting',
    title: 'Sustainable Crafting: How We Protect the Environment While Creating Art',
    excerpt: 'Learn about our commitment to environmental sustainability and the eco-friendly practices we use in our crafting process.',
    content: 'Full article content would go here...',
    author: 'Grace Wanjiru',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
    publishedAt: '2024-01-10',
    readTime: 6,
    category: 'Sustainability',
    tags: ['Environment', 'Sustainable Crafting', 'Green Practices'],
    image: 'https://images.unsplash.com/photo-1440581572325-0bea30075d9d?q=80&w=600&auto=format&fit=crop',
    featured: true,
    views: 892
  },
  {
    id: 'artisan-spotlight-mary',
    title: 'Artisan Spotlight: Mary Mutua and Her Ceremonial Mask Mastery',
    excerpt: 'Meet Mary Mutua, one of our master artisans, and learn about her journey in creating stunning ceremonial masks.',
    content: 'Full article content would go here...',
    author: 'Catherine Musyoki',
    authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?q=80&w=150&auto=format&fit=crop',
    publishedAt: '2024-01-05',
    readTime: 5,
    category: 'Artisan Stories',
    tags: ['Artisan Spotlight', 'Masks', 'Traditional Crafts'],
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=600&auto=format&fit=crop',
    featured: false,
    views: 673
  },
  {
    id: 'caring-for-wooden-artifacts',
    title: 'Caring for Your Wooden Artifacts: A Complete Maintenance Guide',
    excerpt: 'Essential tips and techniques to preserve the beauty and longevity of your handcrafted wooden artifacts.',
    content: 'Full article content would go here...',
    author: 'Daniel Kiema',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    publishedAt: '2023-12-28',
    readTime: 7,
    category: 'Care Guide',
    tags: ['Maintenance', 'Wood Care', 'Artifacts', 'Tips'],
    image: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=600&auto=format&fit=crop',
    featured: false,
    views: 1156
  },
  {
    id: 'african-art-global-impact',
    title: 'The Global Impact of African Art in Contemporary Design',
    excerpt: 'Explore how traditional African art forms are influencing modern design trends around the world.',
    content: 'Full article content would go here...',
    author: 'Joseph Mwema',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
    publishedAt: '2023-12-20',
    readTime: 9,
    category: 'Art Trends',
    tags: ['Global Impact', 'Modern Design', 'African Art', 'Trends'],
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=600&auto=format&fit=crop',
    featured: false,
    views: 789
  },
  {
    id: 'behind-scenes-cooperative',
    title: 'Behind the Scenes: A Day in the Life of Our Cooperative',
    excerpt: 'Take a glimpse into the daily operations of our cooperative and see how we support our artisan community.',
    content: 'Full article content would go here...',
    author: 'Catherine Musyoki',
    authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?q=80&w=150&auto=format&fit=crop',
    publishedAt: '2023-12-15',
    readTime: 6,
    category: 'Behind the Scenes',
    tags: ['Cooperative', 'Community', 'Daily Life', 'Operations'],
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
    featured: false,
    views: 534
  }
]

const categories = [
  { name: 'All Posts', count: blogPosts.length },
  { name: 'Culture', count: blogPosts.filter(post => post.category === 'Culture').length },
  { name: 'Artisan Stories', count: blogPosts.filter(post => post.category === 'Artisan Stories').length },
  { name: 'Sustainability', count: blogPosts.filter(post => post.category === 'Sustainability').length },
  { name: 'Care Guide', count: blogPosts.filter(post => post.category === 'Care Guide').length },
  { name: 'Art Trends', count: blogPosts.filter(post => post.category === 'Art Trends').length },
]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Posts')
  
  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  const filteredPosts = regularPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'All Posts' || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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
              Our <span className="text-amber-600">Blog</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore stories about our artisans, learn about Akamba culture, and discover 
              the rich heritage behind every handcrafted piece in our collection.
            </p>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search articles, topics, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                  className={selectedCategory === category.name ? 
                    'bg-amber-600 hover:bg-amber-700' : 
                    'hover:bg-amber-50 hover:border-amber-200'
                  }
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Articles</h2>
              <p className="text-gray-600">Our most popular and trending stories</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg h-full">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      
                      <Badge className="absolute top-4 left-4 bg-amber-500 text-white">
                        Featured
                      </Badge>

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <Badge variant="secondary" className="mb-2">
                          {post.category}
                        </Badge>
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                      {/* Author and Meta */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.authorImage}
                            alt={post.author}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{post.author}</p>
                            <p className="text-gray-500">{formatDate(post.publishedAt)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime} min read
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views}
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Link href={`/blog/${post.id}`}>
                        <Button className="w-full bg-amber-600 hover:bg-amber-700">
                          Read Full Article
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Articles</h2>
            <p className="text-gray-600">
              {selectedCategory === 'All Posts' 
                ? 'All our latest stories and insights'
                : `Articles in ${selectedCategory}`}
            </p>
          </motion.div>

          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm h-full">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900">
                        {post.category}
                      </Badge>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-amber-600 transition-colors">
                        <Link href={`/blog/${post.id}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                        {post.excerpt}
                      </p>

                      {/* Author and Meta */}
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={post.authorImage}
                          alt={post.author}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">{post.author}</span>
                          <span className="mx-1">•</span>
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views}
                          </span>
                        </div>

                        <Link href={`/blog/${post.id}`}>
                          <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 p-0">
                            Read More →
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse different categories
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All Posts')
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest stories, artisan spotlights, 
            and cultural insights delivered to your inbox.
          </p>
          <Link href="/#newsletter">
            <Button size="lg" variant="secondary" className="bg-white text-amber-600 hover:bg-gray-100">
              Subscribe to Newsletter
            </Button>
          </Link>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  )
}
