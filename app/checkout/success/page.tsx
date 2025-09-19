"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowLeft, Package, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Thank you for your purchase! Your order has been successfully placed and you will receive a confirmation email shortly.
            </p>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Confirmation Email</h3>
                    <p className="text-sm text-gray-600">
                      You'll receive an order confirmation email with your order details and tracking information.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Processing & Shipping</h3>
                    <p className="text-sm text-gray-600">
                      Your authentic Akamba artifacts will be carefully packaged and shipped within 2-3 business days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                  Continue Shopping
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
