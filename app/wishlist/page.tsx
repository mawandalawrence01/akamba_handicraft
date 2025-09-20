"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { 
  Heart, 
  Share2, 
  ShoppingCart, 
  Trash2, 
  Grid,
  List,
  Download,
  Filter,
  SortAsc,
  SortDesc,
  Search,
  Star,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { SocialShare } from '@/components/social/social-share'
import { LikeButton } from '@/components/social/like-button'
import { useCartStore } from '@/lib/stores/cart-store'
import { toast } from 'react-hot-toast'
import { OptimizedImage } from '@/components/ui/optimized-image'

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice?: number
    images: Array<{
      id: string
      url: string
      alt?: string
    }>
    category: {
      name: string
    }
    artisan?: {
      name: string
    }
    likeCount: number
    inStock: boolean
    stockQuantity: number
  }
  createdAt: string
}

export default function WishlistPage() {
  const { data: session } = useSession()
  const isSignedIn = !!session
  const { addItem } = useCartStore()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterBy, setFilterBy] = useState('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  useEffect(() => {
    if (isSignedIn) {
      fetchWishlistItems()
    }
  }, [isSignedIn])

  const fetchWishlistItems = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data = await response.json()
        setWishlistItems(data.items)
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
      toast.error('Failed to load wishlist')
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWishlist = async (itemId: string) => {
    try {
      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId))
        toast.success('Removed from wishlist')
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
      toast.error('Failed to remove item')
    }
  }

  const addToCart = (product: WishlistItem['product']) => {
    if (!product.inStock) {
      toast.error('This item is out of stock')
      return
    }

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || '',
      maxQuantity: product.stockQuantity
    })

    toast.success('Added to cart!')
  }

  const addSelectedToCart = () => {
    const selectedProducts = wishlistItems
      .filter(item => selectedItems.includes(item.id))
      .map(item => item.product)
      .filter(product => product.inStock)

    selectedProducts.forEach(product => addToCart(product))
    setSelectedItems([])
    
    if (selectedProducts.length > 0) {
      toast.success(`Added ${selectedProducts.length} items to cart!`)
    }
  }

  const removeSelectedItems = async () => {
    try {
      await Promise.all(
        selectedItems.map(itemId => 
          fetch(`/api/wishlist/${itemId}`, { method: 'DELETE' })
        )
      )
      
      setWishlistItems(prev => 
        prev.filter(item => !selectedItems.includes(item.id))
      )
      setSelectedItems([])
      toast.success('Removed selected items')
    } catch (error) {
      toast.error('Failed to remove items')
    }
  }

  const downloadWishlist = () => {
    const wishlistData = {
      user: session?.user?.name || 'User',
      email: session?.user?.email,
      exportDate: new Date().toISOString(),
      items: wishlistItems.map(item => ({
        name: item.product.name,
        price: item.product.price,
        category: item.product.category.name,
        artisan: item.product.artisan?.name,
        addedDate: item.createdAt,
        inStock: item.product.inStock
      }))
    }

    const blob = new Blob([JSON.stringify(wishlistData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `akamba-wishlist-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Wishlist downloaded!')
  }

  const shareWishlist = () => {
    const wishlistUrl = `${window.location.origin}/wishlist/shared/${session?.user?.id}`
    const title = `${session?.user?.name || 'My'} Wishlist - Akamba Handicraft`
    const description = `Check out my favorite handcrafted African artifacts! ${wishlistItems.length} amazing pieces.`
    
    return (
      <SocialShare
        url={wishlistUrl}
        title={title}
        description={description}
        variant="compact"
        showLabel={false}
      />
    )
  }

  const filteredAndSortedItems = wishlistItems
    .filter(item => {
      if (searchQuery) {
        return item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               item.product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return true
    })
    .filter(item => {
      switch (filterBy) {
        case 'in-stock': return item.product.inStock
        case 'out-of-stock': return !item.product.inStock
        case 'on-sale': return item.product.compareAtPrice && item.product.compareAtPrice > item.product.price
        default: return true
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.product.name.localeCompare(b.product.name)
        case 'price-low': return a.product.price - b.product.price
        case 'price-high': return b.product.price - a.product.price
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your wishlist</h1>
          <p className="text-gray-600 mb-8">Save your favorite artifacts and access them anywhere.</p>
          <Link href="/sign-in">
            <Button size="lg">Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            {shareWishlist()}
            <Button onClick={downloadWishlist} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Start exploring our amazing handcrafted artifacts!</p>
            <Link href="/products">
              <Button size="lg">Explore Products</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Filters and Controls */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search wishlist..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-full lg:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    <SelectItem value="on-sale">On Sale</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                  <span className="text-sm text-gray-600">
                    {selectedItems.length} selected
                  </span>
                  <Button onClick={addSelectedToCart} size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button onClick={removeSelectedItems} variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                  <Button 
                    onClick={() => setSelectedItems([])} 
                    variant="ghost" 
                    size="sm"
                  >
                    Clear Selection
                  </Button>
                </div>
              )}
            </div>

            {/* Products Grid/List */}
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              <AnimatePresence>
                {filteredAndSortedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    {viewMode === 'grid' ? (
                      <Card className="group hover:shadow-lg transition-all duration-300">
                        <div className="relative aspect-square overflow-hidden rounded-t-lg">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems(prev => [...prev, item.id])
                              } else {
                                setSelectedItems(prev => prev.filter(id => id !== item.id))
                              }
                            }}
                            className="absolute top-3 left-3 z-10 h-4 w-4 rounded border-gray-300"
                          />
                          
                          <Link href={`/products/${item.product.slug}`}>
                            <OptimizedImage
                              src={item.product.images[0]?.url || '/placeholder.jpg'}
                              alt={item.product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              quality="auto"
                              format="auto"
                            />
                          </Link>
                          
                          <div className="absolute top-3 right-3 flex gap-2">
                            <LikeButton 
                              productId={item.product.id}
                              initialLiked={true}
                              initialLikeCount={item.product.likeCount}
                              variant="floating"
                              size="sm"
                            />
                            <SocialShare
                              url={`${window.location.origin}/products/${item.product.slug}`}
                              title={item.product.name}
                              imageUrl={item.product.images[0]?.url}
                              productId={item.product.id}
                              variant="compact"
                              showLabel={false}
                            />
                          </div>
                          
                          {!item.product.inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge variant="secondary">Out of Stock</Badge>
                            </div>
                          )}
                        </div>
                        
                        <CardContent className="p-4">
                          <Link href={`/products/${item.product.slug}`}>
                            <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                              {item.product.name}
                            </h3>
                          </Link>
                          
                          <p className="text-sm text-gray-600 mt-1">
                            by {item.product.artisan?.name || 'Akamba Artisan'}
                          </p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-bold text-gray-900">
                              ${item.product.price.toFixed(2)}
                            </span>
                            {item.product.compareAtPrice && item.product.compareAtPrice > item.product.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ${item.product.compareAtPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </CardContent>
                        
                        <CardFooter className="p-4 pt-0 flex gap-2">
                          <Button
                            onClick={() => addToCart(item.product)}
                            disabled={!item.product.inStock}
                            className="flex-1"
                            size="sm"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button
                            onClick={() => removeFromWishlist(item.id)}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ) : (
                      // List view implementation would go here
                      <Card className="p-4">
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems(prev => [...prev, item.id])
                              } else {
                                setSelectedItems(prev => prev.filter(id => id !== item.id))
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                            <Link href={`/products/${item.product.slug}`}>
                              <OptimizedImage
                                src={item.product.images[0]?.url || '/placeholder.jpg'}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                quality="auto"
                                format="auto"
                              />
                            </Link>
                          </div>
                          
                          <div className="flex-1">
                            <Link href={`/products/${item.product.slug}`}>
                              <h3 className="font-semibold text-gray-900 hover:text-amber-600 transition-colors">
                                {item.product.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-600">
                              {item.product.category.name} • by {item.product.artisan?.name || 'Akamba Artisan'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-bold text-gray-900">
                                ${item.product.price.toFixed(2)}
                              </span>
                              {!item.product.inStock && (
                                <Badge variant="secondary" className="text-xs">
                                  Out of Stock
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <LikeButton 
                              productId={item.product.id}
                              initialLiked={true}
                              initialLikeCount={item.product.likeCount}
                              variant="compact"
                              size="sm"
                            />
                            <SocialShare
                              url={`${window.location.origin}/products/${item.product.slug}`}
                              title={item.product.name}
                              imageUrl={item.product.images[0]?.url}
                              productId={item.product.id}
                              variant="compact"
                              showLabel={false}
                            />
                            <Button
                              onClick={() => addToCart(item.product)}
                              disabled={!item.product.inStock}
                              size="sm"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                            <Button
                              onClick={() => removeFromWishlist(item.id)}
                              variant="outline"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
