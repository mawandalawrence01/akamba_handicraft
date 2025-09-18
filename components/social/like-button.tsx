"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'
import { useUser } from '@clerk/nextjs'

export interface LikeButtonProps {
  productId: string
  initialLiked?: boolean
  initialLikeCount?: number
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'compact' | 'floating'
  showCount?: boolean
  className?: string
}

export function LikeButton({
  productId,
  initialLiked = false,
  initialLikeCount = 0,
  size = 'default',
  variant = 'default',
  showCount = true,
  className = ''
}: LikeButtonProps) {
  const { user, isSignedIn } = useUser()
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isSignedIn && user) {
      checkLikeStatus()
    }
  }, [isSignedIn, user, productId])

  const checkLikeStatus = async () => {
    if (!isSignedIn || !user) return

    try {
      const response = await fetch(`/api/products/${productId}/like`)
      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.isLiked)
        setLikeCount(data.likeCount)
      }
    } catch (error) {
      console.error('Failed to check like status:', error)
    }
  }

  const handleLike = async () => {
    if (!isSignedIn) {
      toast.error('Please sign in to like this artifact')
      return
    }

    setIsLoading(true)
    const wasLiked = isLiked
    const previousCount = likeCount

    // Optimistic update
    setIsLiked(!wasLiked)
    setLikeCount(prev => wasLiked ? prev - 1 : prev + 1)

    try {
      const response = await fetch(`/api/products/${productId}/like`, {
        method: wasLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to update like status')
      }

      const data = await response.json()
      setIsLiked(data.isLiked)
      setLikeCount(data.likeCount)

      if (data.isLiked) {
        toast.success('Added to your favorites! ❤️', {
          duration: 2000,
          icon: '❤️'
        })
      } else {
        toast.success('Removed from favorites', {
          duration: 2000,
          icon: '💔'
        })
      }
    } catch (error) {
      // Revert optimistic update
      setIsLiked(wasLiked)
      setLikeCount(previousCount)
      toast.error('Failed to update favorite status')
      console.error('Failed to toggle like:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  const sizeClasses = {
    sm: 'h-8 w-8',
    default: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    default: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  if (variant === 'compact') {
    return (
      <Button
        onClick={handleLike}
        disabled={isLoading}
        variant="ghost"
        size="sm"
        className={`group relative ${className}`}
      >
        {isLoading ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart 
              className={`${iconSizes[size]} transition-colors duration-200 ${
                isLiked 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-500 hover:text-red-500 group-hover:fill-red-100'
              }`} 
            />
          </motion.div>
        )}
        {showCount && likeCount > 0 && (
          <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
            {likeCount}
          </Badge>
        )}
      </Button>
    )
  }

  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed top-24 right-6 z-50 ${className}`}
      >
        <Button
          onClick={handleLike}
          disabled={isLoading}
          size="lg"
          className={`${sizeClasses[size]} rounded-full shadow-lg transition-all duration-300 ${
            isLiked
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-white hover:bg-red-50 text-gray-700 border-2 border-gray-200 hover:border-red-200'
          }`}
        >
          {isLoading ? (
            <Loader2 className={`${iconSizes[size]} animate-spin`} />
          ) : (
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            >
              <Heart 
                className={`${iconSizes[size]} transition-all duration-200 ${
                  isLiked ? 'text-white fill-white' : 'text-gray-600'
                }`} 
              />
            </motion.div>
          )}
        </Button>
        
        {showCount && likeCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-2 -right-2"
          >
            <Badge className="bg-red-500 text-white text-xs h-6 w-6 rounded-full flex items-center justify-center">
              {likeCount > 99 ? '99+' : likeCount}
            </Badge>
          </motion.div>
        )}
      </motion.div>
    )
  }

  // Default variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        onClick={handleLike}
        disabled={isLoading}
        variant={isLiked ? "default" : "outline"}
        size={size}
        className={`group relative overflow-hidden transition-all duration-300 ${
          isLiked
            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-red-500'
            : 'hover:bg-red-50 hover:border-red-200 hover:text-red-600'
        }`}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className={`${iconSizes[size]} animate-spin`} />
            </motion.div>
          ) : (
            <motion.div
              key="heart"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2"
            >
              <Heart 
                className={`${iconSizes[size]} transition-all duration-200 ${
                  isLiked 
                    ? 'text-white fill-white' 
                    : 'text-current group-hover:fill-red-100'
                }`} 
              />
              {size !== 'sm' && (
                <span className="font-medium">
                  {isLiked ? 'Favorited' : 'Add to Favorites'}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Heart particles animation */}
        <AnimatePresence>
          {isLiked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 1, 
                    scale: 0,
                    x: '50%',
                    y: '50%'
                  }}
                  animate={{ 
                    opacity: 0, 
                    scale: 1,
                    x: `${50 + (Math.random() - 0.5) * 100}%`,
                    y: `${50 + (Math.random() - 0.5) * 100}%`
                  }}
                  transition={{ 
                    duration: 1,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute"
                >
                  <Heart className="h-3 w-3 text-red-400 fill-red-400" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {showCount && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1"
        >
          <span className="text-sm text-gray-600">
            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
          </span>
        </motion.div>
      )}
    </div>
  )
}
