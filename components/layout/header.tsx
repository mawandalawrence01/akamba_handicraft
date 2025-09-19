"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Search, Menu, X, Heart, Sparkles, Globe, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useCartStore } from '@/lib/stores/cart-store'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Categories', href: '/categories' },
  { name: 'Artisans', href: '/artisans' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: session } = useSession()
  const isSignedIn = !!session
  const { items } = useCartStore()

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg border-b border-amber-100 shadow-lg shadow-amber-100/20' 
          : 'bg-gradient-to-r from-amber-50/80 via-orange-50/80 to-yellow-50/80 backdrop-blur-sm border-b border-amber-100/50'
      }`}
    >
      {/* Decorative Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-2 left-10 w-3 h-3 bg-amber-600 rounded-full animate-pulse"></div>
        <div className="absolute top-4 right-20 w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-2 left-1/3 w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Artistic Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              {/* Artistic Logo Design */}
              <div className="relative">
                <div className="h-10 w-10 md:h-12 md:w-12 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  {/* Traditional Pattern */}
                  <div className="absolute inset-1 border-2 border-white/30 rounded-lg md:rounded-xl"></div>
                  <span className="text-white font-bold text-sm md:text-lg relative z-10">AH</span>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full opacity-80 group-hover:animate-bounce"></div>
                  <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-300 rounded-full opacity-60"></div>
                </div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 h-10 w-10 md:h-12 md:w-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl md:rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>

              {/* Brand Text with Creative Typography */}
              <div className="hidden sm:block">
                <div className="flex flex-col">
                  <span className="font-bold text-lg md:text-xl text-gray-900 tracking-wide">
                    Akamba
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 ml-1">
                      Handicraft
                    </span>
                  </span>
                  <span className="text-xs text-amber-600 font-medium tracking-[0.2em] uppercase hidden md:block">
                    Authentic • Handcrafted • Heritage
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Artistic Navigation */}
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden lg:flex items-center space-x-8"
          >
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="group text-sm font-medium text-gray-700 hover:text-amber-600 transition-all duration-300 relative"
                >
                  <span className="relative">
                    {item.name}
                    {/* Animated Underline */}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Artistic Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:flex items-center space-x-2 flex-1 max-w-md mx-8"
          >
            <div className="relative w-full group">
              {/* Decorative Search Icon */}
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <Search className="h-4 w-4 text-amber-500 group-focus-within:text-orange-500 transition-colors duration-300" />
              </div>
              
              {/* Artistic Search Input */}
              <Input
                type="search"
                placeholder="Discover authentic artifacts..."
                className="pl-10 pr-4 py-3 border-2 border-amber-200 bg-white/80 backdrop-blur-sm rounded-2xl focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all duration-300 placeholder:text-amber-600/70"
              />
              
              {/* Sparkle Effect */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className="h-4 w-4 text-amber-400 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </motion.div>

          {/* Artistic Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center space-x-2 md:space-x-3"
          >
            {/* Mobile Search */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden hover:bg-amber-100 transition-colors duration-300 h-9 w-9"
            >
              <Search className="h-4 w-4 text-amber-600" />
            </Button>

            {/* Artistic Wishlist */}
            {isSignedIn && (
              <Link href="/wishlist" className="hidden sm:block">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative group hover:bg-amber-100 transition-all duration-300 h-9 w-9"
                >
                  <Heart className="h-4 w-4 text-amber-600 group-hover:text-red-500 transition-colors duration-300" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-red-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </Button>
              </Link>
            )}

            {/* Artistic Cart */}
            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative group hover:bg-amber-100 transition-all duration-300 h-9 w-9"
              >
                <ShoppingCart className="h-4 w-4 text-amber-600 group-hover:text-orange-600 transition-colors duration-300" />
                
                <AnimatePresence>
                  {cartItemsCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 border-2 border-white shadow-lg flex items-center justify-center">
                        {cartItemsCount > 9 ? '9+' : cartItemsCount}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </Link>

            {/* Artistic User Menu */}
            {isSignedIn ? (
              <div className="relative group">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="flex items-center space-x-2">
                  {/* User Avatar */}
                  <div className="relative">
                    {session?.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session?.user?.name || 'User'}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-medium text-sm ${session?.user?.image ? 'hidden' : 'flex'}`}
                    >
                      {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                    </div>
                  </div>
                  
                  {/* User Name and Sign Out */}
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-700 hidden sm:block">
                      {session?.user?.name || 'User'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="text-xs text-gray-600 hover:text-amber-600 p-0 h-auto"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-1 md:space-x-2">
                <Link href="/sign-in" className="hidden sm:block">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-amber-100 hover:text-amber-700 transition-all duration-300 text-xs md:text-sm px-2 md:px-3"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-xs md:text-sm px-2 md:px-4"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Artistic Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden hover:bg-amber-100 transition-colors duration-300"
                >
                  <Menu className="h-5 w-5 text-amber-600" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[300px] bg-gradient-to-b from-amber-50 to-orange-50 border-l border-amber-200"
              >
                <div className="flex flex-col space-y-6 mt-8">
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-3 pb-4 border-b border-amber-200">
                    <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">AH</span>
                    </div>
                    <span className="font-bold text-lg text-gray-900">Akamba Handicraft</span>
                  </div>

                  {/* Mobile Navigation */}
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="text-lg font-medium text-gray-700 hover:text-amber-600 transition-colors duration-300 p-2 rounded-lg hover:bg-amber-100 block"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Mobile User Profile */}
                  {isSignedIn && (
                    <div className="pt-4 border-t border-amber-200">
                      <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                        {/* User Avatar */}
                        <div className="relative">
                          {session?.user?.image ? (
                            <img
                              src={session.user.image}
                              alt={session?.user?.name || 'User'}
                              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-medium ${session?.user?.image ? 'hidden' : 'flex'}`}
                          >
                            {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                          </div>
                        </div>
                        
                        {/* User Info */}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">
                            {session?.user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {session?.user?.email}
                          </p>
                        </div>
                        
                        {/* Sign Out Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            signOut({ callbackUrl: '/' })
                            setIsOpen(false)
                          }}
                          className="text-xs text-gray-600 hover:text-amber-600"
                        >
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Mobile Search */}
                  <div className="pt-4 border-t border-amber-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                      <Input
                        type="search"
                        placeholder="Search for artifacts..."
                        className="pl-10 border-amber-200 bg-white/80 rounded-xl focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Mobile Trust Indicators */}
                  <div className="pt-4 border-t border-amber-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <Globe className="h-5 w-5 text-amber-600" />
                        <span className="text-xs text-gray-600">Worldwide Shipping</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                        <Award className="h-5 w-5 text-amber-600" />
                        <span className="text-xs text-gray-600">Authentic Crafts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>
        </div>
      </div>

      {/* Artistic Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 opacity-60"></div>
    </header>
  )
}
