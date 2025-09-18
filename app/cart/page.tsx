"use client"

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/lib/stores/cart-store'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = () => {
    setIsCheckingOut(true)
    // Redirect to checkout page
    window.location.href = '/checkout'
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any authentic Akamba artifacts to your cart yet.
              </p>
              
              <Link href="/products">
                <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Continue Shopping
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/products" 
            className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">
                            {item.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.productId)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="text-amber-600 font-medium mb-4">
                          {formatPrice(item.price)}
                        </p>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-8 w-8"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 py-1 text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= (item.maxQuantity || 10)}
                              className="h-8 w-8"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Clear Cart Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="pt-4"
            >
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">
                      {getTotalPrice() > 100 ? 'Free' : formatPrice(15)}
                    </span>
                  </div>

                  {/* Free shipping threshold */}
                  {getTotalPrice() < 100 && (
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <p className="text-sm text-amber-800">
                        Add {formatPrice(100 - getTotalPrice())} more for free shipping!
                      </p>
                    </div>
                  )}

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>
                      {formatPrice(getTotalPrice() + (getTotalPrice() > 100 ? 0 : 15))}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                    size="lg"
                  >
                    {isCheckingOut ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </Button>

                  {/* Security Badge */}
                  <div className="text-center pt-4">
                    <p className="text-xs text-gray-500 mb-2">
                      Secure checkout powered by Stripe
                    </p>
                    <div className="flex justify-center gap-2">
                      <div className="w-8 h-5 bg-gray-200 rounded text-xs flex items-center justify-center">
                        SSL
                      </div>
                      <div className="w-8 h-5 bg-gray-200 rounded text-xs flex items-center justify-center">
                        256
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Continue Shopping */}
              <div className="mt-6 text-center">
                <Link href="/products">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Recently Viewed */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">You might also like</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Mock recently viewed items */}
                    {[
                      {
                        id: '1',
                        name: 'Hand-carved Mask',
                        price: 156,
                        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=150&auto=format&fit=crop'
                      },
                      {
                        id: '2',
                        name: 'Wooden Bowl',
                        price: 45,
                        image: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=150&auto=format&fit=crop'
                      }
                    ].map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-amber-600">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
