"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  MessageCircle,
  Mail,
  Link,
  Copy,
  Download,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'

export interface SocialShareProps {
  url: string
  title: string
  description?: string
  imageUrl?: string
  productId?: string
  className?: string
  variant?: 'default' | 'compact' | 'floating'
  showLabel?: boolean
}

const socialPlatforms = [
  {
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-green-500 hover:bg-green-600',
    getUrl: (url: string, title: string) => 
      `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`
  },
  {
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600 hover:bg-blue-700',
    getUrl: (url: string, title: string) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`
  },
  {
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-sky-500 hover:bg-sky-600',
    getUrl: (url: string, title: string, description?: string) => 
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title}${description ? ' - ' + description : ''}`)}&hashtags=AkambaHandicraft,AfricanArt,Handmade`
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-700 hover:bg-blue-800',
    getUrl: (url: string, title: string, description?: string) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description || title)}`
  },
  {
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    getUrl: () => '#',
    isSpecial: true
  },
  {
    name: 'Email',
    icon: Mail,
    color: 'bg-gray-600 hover:bg-gray-700',
    getUrl: (url: string, title: string, description?: string) => 
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this amazing handcrafted artifact: ${title}${description ? '\n\n' + description : ''}\n\n${url}`)}`
  }
]

export function SocialShare({ 
  url, 
  title, 
  description, 
  imageUrl, 
  productId,
  className = '',
  variant = 'default',
  showLabel = true 
}: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const [shareCount, setShareCount] = useState(0)

  const handleShare = async (platform: string, shareUrl?: string) => {
    // Track share in analytics
    try {
      await fetch('/api/social/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          url,
          title,
          description,
          imageUrl,
          productId
        })
      })
      setShareCount(prev => prev + 1)
    } catch (error) {
      console.error('Failed to track share:', error)
    }

    if (platform === 'Instagram') {
      toast.success('To share on Instagram, screenshot this page and post it to your story!', {
        duration: 4000,
        icon: '📸'
      })
      return
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      
      // Track copy action
      await fetch('/api/social/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'COPY_LINK',
          url,
          title,
          productId
        })
      })
      
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleDownload = async () => {
    if (!imageUrl) {
      toast.error('No image available for download')
      return
    }

    try {
      // Track download
      await fetch('/api/social/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          downloadType: 'PRODUCT_IMAGE',
          fileName: `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`,
          fileUrl: imageUrl,
          productId
        })
      })

      // Create download link
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Image downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download image')
    }
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={`${className}`}>
            <Share2 className="h-4 w-4" />
            {showLabel && <span className="ml-2">Share</span>}
            {shareCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {shareCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="p-2">
            <p className="text-sm font-medium mb-2">Share this artifact</p>
          </div>
          <DropdownMenuSeparator />
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon
            return (
              <DropdownMenuItem
                key={platform.name}
                onClick={() => handleShare(platform.name, platform.getUrl(url, title, description))}
                className="cursor-pointer"
              >
                <Icon className="h-4 w-4 mr-2" />
                {platform.name}
                {platform.isSpecial && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    Screenshot
                  </Badge>
                )}
              </DropdownMenuItem>
            )
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
            {copied ? (
              <Check className="h-4 w-4 mr-2 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? 'Copied!' : 'Copy Link'}
          </DropdownMenuItem>
          {imageUrl && (
            <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
              <Download className="h-4 w-4 mr-2" />
              Download Image
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed bottom-6 right-6 z-50 ${className}`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="lg" 
              className="rounded-full shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="p-3">
              <h3 className="font-semibold text-sm mb-1">Share this beautiful artifact</h3>
              <p className="text-xs text-gray-600 line-clamp-2">{title}</p>
            </div>
            <DropdownMenuSeparator />
            <div className="grid grid-cols-2 gap-1 p-2">
              {socialPlatforms.slice(0, 4).map((platform) => {
                const Icon = platform.icon
                return (
                  <Button
                    key={platform.name}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(platform.name, platform.getUrl(url, title, description))}
                    className="h-12 flex-col gap-1"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{platform.name}</span>
                  </Button>
                )
              })}
            </div>
            <DropdownMenuSeparator />
            <div className="p-2 flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopyLink} className="flex-1">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              {imageUrl && (
                <Button variant="ghost" size="sm" onClick={handleDownload} className="flex-1">
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    )
  }

  // Default variant
  return (
    <div className={`space-y-4 ${className}`}>
      {showLabel && (
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-amber-600" />
          <h3 className="font-semibold text-lg">Share this artifact</h3>
          {shareCount > 0 && (
            <Badge variant="secondary">
              {shareCount} share{shareCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon
          return (
            <motion.button
              key={platform.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare(platform.name, platform.getUrl(url, title, description))}
              className={`${platform.color} text-white p-3 rounded-xl flex flex-col items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{platform.name}</span>
              {platform.isSpecial && (
                <Badge variant="outline" className="text-xs bg-white/20 border-white/30">
                  Screenshot
                </Badge>
              )}
            </motion.button>
          )
        })}
      </div>
      
      <div className="flex gap-3 pt-2 border-t border-gray-200">
        <Button
          onClick={handleCopyLink}
          variant="outline"
          className="flex-1 flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Link</span>
            </>
          )}
        </Button>
        
        {imageUrl && (
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        )}
      </div>
    </div>
  )
}
