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
      image: product.images[0]?.url || '/placeholder-product.svg',
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
                src={product.images[selectedImage]?.url || '/placeholder-product.svg'}
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
                      src={image.url || '/placeholder-product.svg'}
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

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-4">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">In Stock</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Out of Stock</span>
                </div>
              )}
              <span className="text-sm text-gray-600">
                ({product.stockQuantity} available)
              </span>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-semibold min-w-[3rem] text-center border-x border-gray-200">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stockQuantity}
                    className="h-10 w-10 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
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
                  imageUrl={product.images[0]?.url || '/placeholder-product.svg'}
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
                  <div className="space-y-6">
                    <div className="flex items-start gap-6">
                      <div className="relative">
                        {product.artisan.image ? (
                          <OptimizedImage
                            src={product.artisan.image}
                            alt={product.artisan.name}
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-full object-cover border-4 border-amber-100"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-amber-100">
                            {product.artisan.name.charAt(0)}
                          </div>
                        )}
                        {product.artisan.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{product.artisan.name}</h3>
                          {product.artisan.isVerified && (
                            <Badge className="bg-green-100 text-green-800">
                              Verified Artisan
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1 text-amber-600">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-medium">{product.artisan.experience || 0} years experience</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <span className="text-sm">📍 {product.artisan.location || 'Kenya'}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {product.artisan.bio || 'Skilled artisan creating beautiful handcrafted pieces.'}
                        </p>
                        
                        {product.artisan.specialties && product.artisan.specialties.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Specialties</h4>
                            <div className="flex flex-wrap gap-2">
                              {product.artisan.specialties.map((specialty: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-amber-800 mb-2">About This Artisan</h4>
                      <p className="text-amber-700 text-sm">
                        This piece was carefully crafted by {product.artisan.name}, a {product.artisan.experience || 'experienced'} artisan 
                        from {product.artisan.location || 'Kenya'}. Each piece is made with traditional techniques passed down through generations, 
                        ensuring authentic craftsmanship and cultural significance.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-gray-400 text-2xl">👤</span>
                    </div>
                    <p className="text-gray-600">Artisan information not available</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="text-amber-600">📏</span>
                        Dimensions
                      </h3>
                      <dl className="space-y-3">
                        {product.dimensions ? (
                          Object.entries(product.dimensions).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                              <dt className="text-gray-600 capitalize font-medium">{key}:</dt>
                              <dd className="font-semibold text-gray-900">{value as string} cm</dd>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600">Dimensions not specified</p>
                        )}
                        {product.weight && (
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <dt className="text-gray-600 font-medium">Weight:</dt>
                            <dd className="font-semibold text-gray-900">{product.weight} kg</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="text-amber-600">🏷️</span>
                        Product Details
                      </h3>
                      <dl className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <dt className="text-gray-600 font-medium">SKU:</dt>
                          <dd className="font-semibold text-gray-900">{product.sku || 'N/A'}</dd>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <dt className="text-gray-600 font-medium">Handmade:</dt>
                          <dd className="font-semibold text-gray-900">{product.isHandmade ? 'Yes' : 'No'}</dd>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <dt className="text-gray-600 font-medium">Stock:</dt>
                          <dd className="font-semibold text-gray-900">{product.stockQuantity} available</dd>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <dt className="text-gray-600 font-medium">Category:</dt>
                          <dd className="font-semibold text-gray-900">{product.category?.name || 'N/A'}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="text-amber-600">🌿</span>
                        Materials
                      </h3>
                      {product.materials && product.materials.length > 0 ? (
                        <div className="space-y-3">
                          {product.materials.map((material: string, index: number) => (
                            <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-200 last:border-b-0">
                              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                              <span className="text-gray-700 font-medium">{material}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">Materials not specified</p>
                      )}
                    </div>
                    
                    {product.colors && product.colors.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <span className="text-amber-600">🎨</span>
                          Available Colors
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {product.colors.map((color: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-sm">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {product.tags && product.tags.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <span className="text-amber-600">🏷️</span>
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
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

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <Card className="mb-16">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">{product.rating || 0}</span>
                    <span className="text-gray-600">({product.reviewCount || 0} reviews)</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Write a Review
                </Button>
              </div>
              
              <div className="space-y-6">
                {product.reviews.map((review: any, index: number) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {review.user.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            {review.isVerified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-13">
                      <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                      <p className="text-gray-700 leading-relaxed">{review.content}</p>
                      
                      {review.helpfulCount > 0 && (
                        <div className="flex items-center gap-4 mt-3">
                          <Button variant="ghost" size="sm" className="text-gray-600">
                            <span className="mr-1">👍</span>
                            Helpful ({review.helpfulCount})
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Products Section */}
        <Card className="mb-16">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* This would typically fetch related products from the same category or artisan */}
              <div className="text-center py-8 text-gray-500">
                <p>Related products will be displayed here</p>
                <p className="text-sm">(Feature coming soon)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Social Sharing Section */}
        <Card className="mb-16">
          <CardContent className="p-6">
            <SocialShare
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title={product.name}
              description={`Discover this beautiful ${product.category?.name?.toLowerCase() || 'product'} handcrafted by ${product.artisan?.name || 'skilled artisans'}. ${product.description}`}
              imageUrl={product.images[0]?.url || '/placeholder-product.svg'}
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
