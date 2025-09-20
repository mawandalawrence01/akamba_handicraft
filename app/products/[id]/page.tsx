"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Truck, Shield, ArrowLeft, Plus, Minus, Eye, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCartStore } from '@/lib/stores/cart-store'
import { toast } from 'react-hot-toast'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SocialShare } from '@/components/social/social-share'
import { LikeButton } from '@/components/social/like-button'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { ProductSkeleton } from '@/components/ui/product-skeleton'

// Fetch product data from API
const fetchProduct = async (id: string) => {
  try {
    const response = await fetch(`/api/products/${id}`)
    if (!response.ok) {
      throw new Error('Product not found')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageZoomed, setImageZoomed] = useState(false)
  const { addItem } = useCartStore()

  useEffect(() => {
    const loadProduct = async () => {
      if (params.id) {
        try {
          setLoading(true)
          setError(null)
          const productData = await fetchProduct(params.id as string)
          setProduct(productData)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load product')
        } finally {
          setLoading(false)
        }
      }
    }

    loadProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return
    
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || '/placeholder-product.jpg',
    })
    
    toast.success('Added to cart!')
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 1)) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return <ProductSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/products">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Product Data</h1>
          <p className="text-gray-600 mb-6">Unable to load product information</p>
          <Link href="/products">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-amber-600">Products</Link>
          <span>/</span>
          <Link href={`/categories/${product.category?.slug || product.category?.name?.toLowerCase()}`} className="hover:text-amber-600">
            {product.category?.name || 'Category'}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg cursor-pointer group"
              onClick={() => setImageZoomed(!imageZoomed)}
            >
              <OptimizedImage
                src={product.images[selectedImage]?.url || '/placeholder-product.jpg'}
                alt={product.images[selectedImage]?.altText || product.name}
                fill
                className={`object-contain p-4 transition-transform duration-300 ${
                  imageZoomed ? 'scale-110' : 'group-hover:scale-105'
                }`}
                sizes="(max-width: 768px) 100vw, 50vw"
                quality="auto"
                format="auto"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-2">
                  <Eye className="h-5 w-5 text-gray-700" />
                </div>
              </div>
            </motion.div>
            
            {product.images.length > 1 && (
              <div className={`grid gap-4 ${
                product.images.length === 2 ? 'grid-cols-2' :
                product.images.length === 3 ? 'grid-cols-3' :
                product.images.length === 4 ? 'grid-cols-4' :
                'grid-cols-3'
              }`}>
                {product.images.slice(0, 6).map((image: any, index: number) => (
                  <button
                    key={image.id || index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                      selectedImage === index 
                        ? 'border-amber-500 ring-2 ring-amber-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <OptimizedImage
                      src={image.url || '/placeholder-product.jpg'}
                      alt={image.altText || `${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 16vw"
                      quality="auto"
                      format="auto"
                    />
                  </button>
                ))}
                {product.images.length > 6 && (
                  <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                    <span className="text-sm text-gray-500">+{product.images.length - 6}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs">{product.category?.name || 'Product'}</Badge>
                {product.originalPrice && (
                  <Badge variant="destructive" className="text-xs">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
              
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating || 0} ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl lg:text-3xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed mb-6">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stockQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stockQuantity} available
                </span>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                
                <LikeButton
                  productId={product.id}
                  initialLiked={isWishlisted}
                  initialLikeCount={product.likeCount || 0}
                  size="lg"
                  variant="compact"
                  showCount={false}
                />
                
                <SocialShare
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                  title={product.name}
                  description={product.description}
                  imageUrl={product.images[0]?.url || '/placeholder-product.jpg'}
                  productId={product.id}
                  variant="compact"
                  showLabel={false}
                />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-600">Orders over $100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Authenticity Guaranteed</p>
                  <p className="text-xs text-gray-600">Certificate included</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-16">
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="artisan">Artisan</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">About This Piece</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.longDescription}
                  </p>
                  
                  <h4 className="text-lg font-semibold mt-6 mb-3">Features</h4>
                  <ul className="list-disc list-inside space-y-2">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="text-gray-700">{feature}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="artisan" className="mt-6">
                {product.artisan ? (
                  <div className="flex items-start gap-6">
                    <img
                      src={product.artisan.image || '/placeholder-artisan.jpg'}
                      alt={product.artisan.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{product.artisan.name}</h3>
                      <p className="text-gray-600 mb-1">{product.artisan.experience || 'Experienced'} artisan</p>
                      <p className="text-gray-600 mb-4">{product.artisan.location || 'Kenya'}</p>
                      <p className="text-gray-700">{product.artisan.bio || 'Skilled artisan creating beautiful handcrafted pieces.'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Artisan information not available</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Dimensions</h3>
                    <dl className="space-y-2">
                      {product.dimensions ? (
                        Object.entries(product.dimensions).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <dt className="text-gray-600 capitalize">{key}:</dt>
                            <dd className="font-medium">{value as string}</dd>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">Dimensions not specified</p>
                      )}
                      {product.weight && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Weight:</dt>
                          <dd className="font-medium">{product.weight}g</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Materials</h3>
                    {product.materials && product.materials.length > 0 ? (
                      <ul className="space-y-2">
                        {product.materials.map((material: string, index: number) => (
                          <li key={index} className="text-gray-700">• {material}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">Materials not specified</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Local Shipping</h3>
                    <p className="text-gray-700">{product.shipping.local}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">International Shipping</h3>
                    <p className="text-gray-700">{product.shipping.international}</p>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">Shipping Information</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• All items are carefully packaged to ensure safe delivery</li>
                      <li>• Tracking number provided for all shipments</li>
                      <li>• Insurance included for international orders</li>
                      <li>• Estimated delivery: 3-7 business days locally, 7-14 days internationally</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Enhanced Social Sharing Section */}
        <Card className="mb-16">
          <CardContent className="p-6">
            <SocialShare
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title={product.name}
              description={`Discover this beautiful ${product.category?.name?.toLowerCase() || 'product'} handcrafted by ${product.artisan?.name || 'skilled artisans'}. ${product.description}`}
              imageUrl={product.images[0]?.url || '/placeholder-product.jpg'}
              productId={product.id}
              variant="default"
              showLabel={true}
              className="max-w-4xl mx-auto"
            />
          </CardContent>
        </Card>

        {/* Floating Action Buttons */}
        <LikeButton
          productId={product.id}
          initialLiked={isWishlisted}
          initialLikeCount={product.likeCount || 0}
          variant="floating"
          size="lg"
        />
        
        <SocialShare
          url={typeof window !== 'undefined' ? window.location.href : ''}
          title={product.name}
          description={product.description}
          imageUrl={product.images[0]?.url || '/placeholder-product.jpg'}
          productId={product.id}
          variant="floating"
        />
      </main>
      
      <Footer />
    </div>
  )
}
