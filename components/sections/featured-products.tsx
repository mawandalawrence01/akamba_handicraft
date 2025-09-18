"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/stores/cart-store'

// Mock data - replace with actual API calls
const featuredProducts = [
  {
    id: '1',
    name: 'Traditional Elephant Carving',
    price: 89.99,
    originalPrice: 120.00,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=500&auto=format&fit=crop',
    rating: 4.8,
    reviews: 24,
    artisan: 'John Mwangi',
    category: 'Sculptures',
    isNew: true,
    isFeatured: true
  },
  {
    id: '2',
    name: 'Hand-carved Mask Set',
    price: 156.00,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=500&auto=format&fit=crop',
    rating: 4.9,
    reviews: 18,
    artisan: 'Mary Mutua',
    category: 'Masks',
    isNew: false,
    isFeatured: true
  },
  {
    id: '3',
    name: 'Decorative Wooden Bowl',
    price: 45.50,
    originalPrice: 60.00,
    image: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=500&auto=format&fit=crop',
    rating: 4.7,
    reviews: 31,
    artisan: 'Peter Kioko',
    category: 'Bowls',
    isNew: false,
    isFeatured: true
  },
  {
    id: '4',
    name: 'Giraffe Family Sculpture',
    price: 234.00,
    image: 'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?q=80&w=500&auto=format&fit=crop',
    rating: 5.0,
    reviews: 12,
    artisan: 'Grace Muthoni',
    category: 'Sculptures',
    isNew: true,
    isFeatured: true
  }
]

export function FeaturedProducts() {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const { addItem } = useCartStore()

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId)
    } else {
      newWishlist.add(productId)
    }
    setWishlist(newWishlist)
  }

  const handleAddToCart = (product: typeof featuredProducts[0]) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
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
            <Badge variant="outline" className="mb-4">
              Featured Collection
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Handpicked <span className="text-amber-600">Masterpieces</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most beloved artifacts, carefully selected for their exceptional 
              craftsmanship and cultural significance.
            </p>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <div className="relative aspect-square overflow-hidden">
                  {/* Product Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                      <Badge className="bg-green-500 text-white">New</Badge>
                    )}
                    {product.originalPrice && (
                      <Badge variant="destructive">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 hover:bg-white"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          wishlist.has(product.id) ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                    </Button>
                    
                    <Link href={`/products/${product.id}`}>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-white/90 hover:bg-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Quick Add to Cart */}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Category & Artisan */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>{product.category}</span>
                    <span>by {product.artisan}</span>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-gray-900">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/products">
            <Button size="lg" variant="outline" className="border-amber-200 hover:bg-amber-50">
              View All Products
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
