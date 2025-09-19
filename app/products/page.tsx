"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List, Star, Heart, ShoppingCart, Eye, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/lib/stores/cart-store'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { toast } from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  stockQuantity: number
  isActive: boolean
  isFeatured: boolean
  inStock: boolean
  viewCount: number
  likeCount: number
  createdAt: string
  category: {
    id: string
    name: string
    slug: string
  }
  artisan?: {
    id: string
    name: string
  }
  images: Array<{
    id: string
    url: string
    isPrimary: boolean
    altText?: string
  }>
}

// Mock product data - replace with actual API calls
const mockProducts = [
  {
    id: '1',
    name: 'Traditional Elephant Carving',
    price: 89.99,
    originalPrice: 120.00,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=500&auto=format&fit=crop',
    rating: 4.8,
    reviews: 24,
    artisan: 'John Mwangi',
    category: 'sculptures',
    categoryName: 'Sculptures',
    isNew: true,
    isFeatured: true
  },
  {
    id: '2',
    name: 'Hand-carved Ceremonial Mask',
    price: 156.00,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=500&auto=format&fit=crop',
    rating: 4.9,
    reviews: 18,
    artisan: 'Mary Mutua',
    category: 'masks',
    categoryName: 'Masks',
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
    category: 'bowls',
    categoryName: 'Bowls',
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
    category: 'sculptures',
    categoryName: 'Sculptures',
    isNew: true,
    isFeatured: true
  },
  {
    id: '5',
    name: 'African Warrior Mask',
    price: 198.00,
    image: 'https://images.unsplash.com/photo-1594736797933-d0ccef5ba6dd?q=80&w=500&auto=format&fit=crop',
    rating: 4.6,
    reviews: 8,
    artisan: 'Samuel Musya',
    category: 'masks',
    categoryName: 'Masks',
    isNew: true,
    isFeatured: false
  },
  {
    id: '6',
    name: 'Handcrafted Wooden Stool',
    price: 125.00,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=500&auto=format&fit=crop',
    rating: 4.5,
    reviews: 15,
    artisan: 'Elizabeth Wanza',
    category: 'furniture',
    categoryName: 'Furniture',
    isNew: false,
    isFeatured: false
  }
]

const categories = [
  { id: 'all', name: 'All Products', count: 6 },
  { id: 'sculptures', name: 'Sculptures', count: 2 },
  { id: 'masks', name: 'Masks', count: 2 },
  { id: 'bowls', name: 'Bowls', count: 1 },
  { id: 'furniture', name: 'Furniture', count: 1 },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Array<{id: string, name: string, count: number}>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const { addItem } = useCartStore()

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch both products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ])

        let productsData = null
        let categoriesData = null

        // Process products response
        if (productsResponse.ok) {
          productsData = await productsResponse.json()
          setProducts(productsData.products || [])
        }

        // Process categories response
        if (categoriesResponse.ok) {
          categoriesData = await categoriesResponse.json()
          const categoriesWithCount = categoriesData.categories?.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            count: cat.productCount || 0 // Use the actual product count from API
          })) || []
          
          // Calculate total products count for "All Products"
          const totalProducts = productsData?.products?.length || 0
          
          setCategories([
            { id: 'all', name: 'All Products', count: totalProducts },
            ...categoriesWithCount
          ])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter and sort products
  useEffect(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.artisan?.name && product.artisan.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category.id === selectedCategory)
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    )

    // Filter only active products
    filtered = filtered.filter(product => product.isActive)

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default: // featured
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory, sortBy, priceRange])

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId)
      toast.success('Removed from wishlist')
    } else {
      newWishlist.add(productId)
      toast.success('Added to wishlist')
    }
    setWishlist(newWishlist)
  }

  const handleAddToCart = (product: Product) => {
    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: primaryImage?.url || '/placeholder-product.jpg',
    })
    toast.success('Added to cart!')
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left p-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-amber-100 text-amber-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{category.name}</span>
                <span className="text-sm text-gray-500">({category.count})</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
              className="w-24"
            />
            <span className="self-center">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
              className="w-24"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'Under $50', min: 0, max: 50 },
              { label: '$50 - $100', min: 50, max: 100 },
              { label: '$100 - $200', min: 100, max: 200 },
              { label: 'Over $200', min: 200, max: 1000 },
            ].map((range) => (
              <Button
                key={range.label}
                variant="outline"
                size="sm"
                onClick={() => setPriceRange({ min: range.min, max: range.max })}
                className="text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">
            Discover authentic handcrafted artifacts from skilled Akamba artisans
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products, artisans, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h2 className="font-semibold mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </h2>
              <FilterContent />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    {viewMode === 'grid' ? (
                      <Card className="overflow-hidden">
                        <div className="aspect-square bg-gray-200"></div>
                        <CardContent className="p-4 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1 space-y-3">
                              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product, index) => {
                  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]
                  const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price 
                    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                    : 0

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {viewMode === 'grid' ? (
                        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                          <div className="relative aspect-square overflow-hidden">
                            {primaryImage ? (
                              <Image
                                src={primaryImage.url}
                                alt={primaryImage.altText || product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400 text-sm">No Image</span>
                              </div>
                            )}
                            
                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                              {product.isFeatured && (
                                <Badge className="bg-amber-500 text-white">Featured</Badge>
                              )}
                              {discountPercentage > 0 && (
                                <Badge variant="destructive">
                                  {discountPercentage}% OFF
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
                              
                              <Link href={`/products/${product.slug}`}>
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
                                disabled={!product.inStock}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                              </Button>
                            </div>
                          </div>

                          <CardContent className="p-4">
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                              <span>{product.category.name}</span>
                              <span>by {product.artisan?.name || 'Akamba Artisan'}</span>
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                              {product.name}
                            </h3>

                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {product.viewCount}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {product.likeCount}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg text-gray-900">
                                ${product.price}
                              </span>
                              {product.compareAtPrice && product.compareAtPrice > product.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${product.compareAtPrice}
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                    ) : (
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                              {primaryImage ? (
                                <Image
                                  src={primaryImage.url}
                                  alt={primaryImage.altText || product.name}
                                  width={128}
                                  height={128}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">No Image</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline">{product.category.name}</Badge>
                                    {product.isFeatured && <Badge className="bg-amber-500 text-white">Featured</Badge>}
                                    {discountPercentage > 0 && (
                                      <Badge variant="destructive">
                                        {discountPercentage}% OFF
                                      </Badge>
                                    )}
                                  </div>
                                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                    {product.name}
                                  </h3>
                                  <p className="text-gray-600 text-sm">by {product.artisan?.name || 'Akamba Artisan'}</p>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => toggleWishlist(product.id)}
                                  >
                                    <Heart
                                      className={`h-4 w-4 ${
                                        wishlist.has(product.id) ? 'fill-red-500 text-red-500' : ''
                                      }`}
                                    />
                                  </Button>
                                  <Link href={`/products/${product.slug}`}>
                                    <Button variant="outline" size="icon">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {product.viewCount} views
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  {product.likeCount} likes
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xl text-gray-900">
                                    ${product.price}
                                  </span>
                                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                                    <span className="text-lg text-gray-500 line-through">
                                      ${product.compareAtPrice}
                                    </span>
                                  )}
                                </div>
                                
                                <Button
                                  onClick={() => handleAddToCart(product)}
                                  className="bg-amber-600 hover:bg-amber-700"
                                  disabled={!product.inStock}
                                >
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setPriceRange({ min: 0, max: 1000 })
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
