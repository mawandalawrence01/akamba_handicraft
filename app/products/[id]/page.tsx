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

// Mock product data - replace with actual API call
const getProduct = (id: string) => {
  return {
    id,
    name: 'Traditional Elephant Carving',
    price: 89.99,
    originalPrice: 120.00,
    description: 'This magnificent elephant carving represents strength, wisdom, and good fortune in African culture. Hand-carved from premium ebony wood by master artisan John Mwangi, this piece showcases the incredible skill and artistry of the Akamba people.',
    longDescription: `This extraordinary elephant sculpture is a testament to the rich cultural heritage and exceptional craftsmanship of the Akamba people. Each piece is meticulously hand-carved from sustainably sourced ebony wood, chosen for its durability and beautiful dark grain.

    The carving process takes several weeks to complete, with our master artisan paying careful attention to every detail - from the gentle curve of the trunk to the intricate texture of the skin. The elephant's pose captures a moment of serene majesty, making it a perfect centerpiece for any home or office.

    Beyond its aesthetic appeal, this sculpture carries deep cultural significance. In African tradition, elephants symbolize wisdom, strength, and good fortune. Many believe that having an elephant sculpture in the home brings prosperity and protection to the family.`,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=600&auto=format&fit=crop',
    ],
    rating: 4.8,
    reviewCount: 24,
    likeCount: 47,
    category: 'Sculptures',
    artisan: {
      name: 'John Mwangi',
      experience: '15 years',
      location: 'Machakos, Kenya',
      bio: 'Master carver specializing in wildlife sculptures',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
    },
    materials: ['Premium Ebony Wood', 'Natural Finish'],
    dimensions: {
      height: '25cm',
      width: '30cm',
      depth: '15cm',
      weight: '2.5kg'
    },
    inStock: true,
    stockQuantity: 5,
    shipping: {
      local: 'Free shipping within Kenya',
      international: 'Ships worldwide - calculated at checkout'
    },
    features: [
      'Hand-carved by master artisan',
      'Premium ebony wood',
      'Natural wood finish',
      'Cultural authenticity certificate',
      'Sustainable sourcing'
    ]
  }
}

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCartStore()

  useEffect(() => {
    if (params.id) {
      const productData = getProduct(params.id as string)
      setProduct(productData)
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return
    
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    })
    
    toast.success('Added to cart!')
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 1)) {
      setQuantity(newQuantity)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
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
          <Link href={`/categories/${product.category.toLowerCase()}`} className="hover:text-amber-600">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-amber-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category}</Badge>
                {product.originalPrice && (
                  <Badge variant="destructive">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {product.description}
              </p>
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
                  imageUrl={product.images[0]}
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
                <div className="flex items-start gap-6">
                  <img
                    src={product.artisan.image}
                    alt={product.artisan.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{product.artisan.name}</h3>
                    <p className="text-gray-600 mb-1">{product.artisan.experience} experience</p>
                    <p className="text-gray-600 mb-4">{product.artisan.location}</p>
                    <p className="text-gray-700">{product.artisan.bio}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Dimensions</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Height:</dt>
                        <dd className="font-medium">{product.dimensions.height}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Width:</dt>
                        <dd className="font-medium">{product.dimensions.width}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Depth:</dt>
                        <dd className="font-medium">{product.dimensions.depth}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Weight:</dt>
                        <dd className="font-medium">{product.dimensions.weight}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Materials</h3>
                    <ul className="space-y-2">
                      {product.materials.map((material: string, index: number) => (
                        <li key={index} className="text-gray-700">• {material}</li>
                      ))}
                    </ul>
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
              description={`Discover this beautiful ${product.category.toLowerCase()} handcrafted by ${product.artisan.name}. ${product.description}`}
              imageUrl={product.images[0]}
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
          imageUrl={product.images[0]}
          productId={product.id}
          variant="floating"
        />
      </main>
      
      <Footer />
    </div>
  )
}
