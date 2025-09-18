"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Users, Award, Sparkles, Heart, Globe, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen flex items-center px-4 sm:px-0">
      {/* Artistic Background Patterns */}
      <div className="absolute inset-0">
        {/* Traditional African Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="african-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="currentColor" className="text-amber-600" />
                <path d="M5,5 L15,5 L15,15 L5,15 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-orange-500" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#african-pattern)" />
          </svg>
        </div>

        {/* Floating Geometric Elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg rotate-45 opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rotate-12 opacity-25 animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 right-1/3 w-6 h-6 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full opacity-40 animate-ping"></div>
        
        {/* Artistic Lines */}
        <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-amber-400 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 right-1/3 w-px h-48 bg-gradient-to-t from-transparent via-orange-400 to-transparent opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Enhanced Text Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Artistic Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 text-amber-800 text-sm font-medium mb-6 shadow-lg">
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                Authentic Handcrafted Heritage
                <div className="ml-2 w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
              </div>
              
              {/* Hero Title with Enhanced Typography */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="block text-gray-900 mb-1 md:mb-2">Discover the</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 animate-pulse">
                  Soul
                </span>
                <span className="block text-gray-900">of African</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600">
                  Artistry
                </span>
              </h1>
              
              {/* Enhanced Description */}
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-2xl leading-relaxed font-light">
                Immerse yourself in the rich tapestry of 
                <span className="font-semibold text-amber-700"> Akamba culture</span> through 
                our exquisite collection of handcrafted treasures, each piece carrying the 
                <span className="font-semibold text-orange-700"> spirit and stories</span> of 
                master artisans.
              </p>
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/products">
                <Button size="lg" className="group w-full sm:w-auto bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <Palette className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6 group-hover:animate-spin" />
                  Explore Collection
                  <ArrowRight className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/artisans">
                <Button size="lg" variant="outline" className="group w-full sm:w-auto border-2 border-amber-300 hover:bg-amber-50 text-amber-700 hover:text-amber-800 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Users className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6 group-hover:animate-pulse" />
                  Meet Artisans
                </Button>
              </Link>
            </motion.div>

            {/* Enhanced Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 md:gap-8 pt-8 md:pt-12 border-t border-amber-200"
            >
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center mb-3">
                  <div className="relative">
                    <Star className="h-6 w-6 md:h-8 md:w-8 text-amber-500 fill-current group-hover:animate-spin" />
                    <div className="absolute inset-0 h-6 w-6 md:h-8 md:w-8 bg-amber-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  </div>
                  <span className="text-2xl md:text-3xl font-bold text-gray-900 ml-1 md:ml-2 group-hover:text-amber-600 transition-colors">4.9</span>
                </div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">Customer Rating</p>
              </div>
              
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center mb-3">
                  <div className="relative">
                    <Users className="h-6 w-6 md:h-8 md:w-8 text-amber-500 group-hover:animate-pulse" />
                    <div className="absolute inset-0 h-6 w-6 md:h-8 md:w-8 bg-amber-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  </div>
                  <span className="text-2xl md:text-3xl font-bold text-gray-900 ml-1 md:ml-2 group-hover:text-amber-600 transition-colors">50+</span>
                </div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">Master Artisans</p>
              </div>
              
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center mb-3">
                  <div className="relative">
                    <Globe className="h-6 w-6 md:h-8 md:w-8 text-amber-500 group-hover:animate-bounce" />
                    <div className="absolute inset-0 h-6 w-6 md:h-8 md:w-8 bg-amber-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  </div>
                  <span className="text-2xl md:text-3xl font-bold text-gray-900 ml-1 md:ml-2 group-hover:text-amber-600 transition-colors">30+</span>
                </div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">Countries Served</p>
              </div>
            </motion.div>
          </div>

          {/* Creative Artistic UI Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            {/* Central Artistic Composition */}
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
              
              {/* Static Artistic Circle */}
              <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
                {/* Outer Ring with Pattern */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 p-1">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                    
                    {/* Inner Content */}
                    <div className="text-center space-y-3 md:space-y-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                        <Palette className="h-6 w-6 md:h-8 md:w-8 text-white" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">Handcrafted</h3>
                      <p className="text-amber-700 font-medium text-sm md:text-base">with Love</p>
                    </div>
                  </div>
                </div>

                {/* Static Floating Cards */}
                <div className="absolute inset-0">
                  {/* Floating Cards */}
                  <div className="absolute -top-6 md:-top-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-3 md:p-4 border border-amber-200">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <Award className="h-4 w-4 md:h-6 md:w-6 text-amber-600" />
                        <span className="text-xs md:text-sm font-semibold text-gray-900">Authentic</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-1/2 -right-8 md:-right-12 transform -translate-y-1/2">
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-3 md:p-4 border border-green-200">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <Heart className="h-4 w-4 md:h-6 md:w-6 text-red-500" />
                        <span className="text-xs md:text-sm font-semibold text-gray-900">Heritage</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-6 md:-bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-3 md:p-4 border border-blue-200">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <Globe className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
                        <span className="text-xs md:text-sm font-semibold text-gray-900">Global</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-1/2 -left-8 md:-left-12 transform -translate-y-1/2">
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-3 md:p-4 border border-purple-200">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
                        <span className="text-xs md:text-sm font-semibold text-gray-900">Quality</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-8 right-8">
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl rotate-45 opacity-60"
                ></motion.div>
              </div>

              <div className="absolute bottom-12 left-8">
                <motion.div
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-50"
                ></motion.div>
              </div>

              <div className="absolute top-1/3 left-12">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rotate-12 opacity-40"
                ></motion.div>
              </div>

              {/* Background Glow Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 via-transparent to-orange-200/20 rounded-full blur-3xl"></div>
            </div>
            in Kenya.

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute bottom-16 -right-8"
            >
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 text-sm font-semibold shadow-lg">
                Free Shipping
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Artistic Border */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-orange-500 via-red-500 via-orange-500 to-amber-400 opacity-80"></div>
    </section>
  )
}

// Custom CSS for slow rotation
const slowSpinKeyframes = `
  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .animate-spin-slow {
    animation: spin-slow 10s linear infinite;
  }
`

// Inject the custom CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = slowSpinKeyframes
  document.head.appendChild(style)
}
