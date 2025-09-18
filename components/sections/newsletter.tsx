"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Gift, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'react-hot-toast'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsSubscribing(true)
    
    try {
      // Here you would integrate with your newsletter service (Mailchimp, ConvertKit, etc.)
      // For now, we'll simulate a successful subscription
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Welcome to our newsletter! Check your email for a special discount.')
      setEmail('')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Left Side - Content */}
                <div className="p-8 md:p-12 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-white/20 rounded-full">
                        <Mail className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold">
                        Join Our Community
                      </h2>
                    </div>

                    <p className="text-amber-100 text-lg mb-8">
                      Get exclusive access to new arrivals, artisan stories, cultural insights, 
                      and special discounts delivered straight to your inbox.
                    </p>

                    {/* Benefits */}
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <Gift className="h-5 w-5 text-amber-200" />
                        <span className="text-amber-100">15% off your first order</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-amber-200" />
                        <span className="text-amber-100">Early access to new collections</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-amber-200" />
                        <span className="text-amber-100">Artisan spotlights & stories</span>
                      </div>
                    </div>

                    {/* Social Proof */}
                    <div className="text-amber-100">
                      <p className="text-sm">
                        Join <strong className="text-white">5,000+</strong> subscribers who love authentic African art
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8 md:p-12 bg-white">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      Subscribe to Our Newsletter
                    </h3>

                    <form onSubmit={handleSubscribe} className="space-y-4">
                      <div>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 text-base"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubscribing}
                        className="w-full h-12 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-base font-medium"
                      >
                        {isSubscribing ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Subscribing...
                          </div>
                        ) : (
                          <>
                            <Mail className="mr-2 h-4 w-4" />
                            Subscribe & Get 15% Off
                          </>
                        )}
                      </Button>
                    </form>

                    <p className="text-sm text-gray-500 mt-4">
                      By subscribing, you agree to receive marketing emails from Akamba Handicraft. 
                      You can unsubscribe at any time.
                    </p>

                    {/* Trust Indicators */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-amber-600">5k+</div>
                          <div className="text-sm text-gray-600">Subscribers</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-amber-600">98%</div>
                          <div className="text-sm text-gray-600">Satisfaction</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
