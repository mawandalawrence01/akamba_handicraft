"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Shield,
  Truck,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'Sculptures', href: '/categories/sculptures' },
    { name: 'Masks', href: '/categories/masks' },
    { name: 'Bowls', href: '/categories/bowls' },
    { name: 'Furniture', href: '/categories/furniture' },
    { name: 'New Arrivals', href: '/products?filter=new' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Artisans', href: '/artisans' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '/press' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Track Order', href: '/track' },
    { name: 'Gift Cards', href: '/gift-cards' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Refund Policy', href: '/refund' },
  ]
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/akambahandicraft' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/akambahandicraft' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/akambahandicraft' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/akambahandicraft' },
]

const trustBadges = [
  { icon: Shield, text: 'Secure Payments' },
  { icon: Truck, text: 'Free Shipping Over $100' },
  { icon: CreditCard, text: 'Multiple Payment Options' },
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Logo */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AH</span>
                </div>
                <span className="font-bold text-xl">Akamba Handicraft</span>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Preserving the rich cultural heritage of the Akamba people through authentic 
                handcrafted artifacts. Each piece tells a story of tradition, skill, and artistry 
                passed down through generations.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Mombasa, Kenya</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">+254 xxx xxx xxx</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">hello@akambahandicraft.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-lg hover:bg-amber-600 transition-colors duration-300"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Shop Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-lg mb-4">Shop</h3>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Company Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Support Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Legal Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-3 justify-center md:justify-start">
                <div className="p-2 bg-amber-600 rounded-lg">
                  <badge.icon className="h-5 w-5" />
                </div>
                <span className="text-gray-300 text-sm">{badge.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>© 2024 Akamba Handicraft Industry Co-operative Society. Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>by <a href="https://lawmwad.vercel.app" className='text-blue-400'><u>Lawmwad Technologies</u></a></span>
            <span className="hidden md:inline">•</span>
            <Link href="/admin/login" className="text-gray-500 hover:text-gray-300 transition-colors text-xs opacity-50 hover:opacity-100">
              Admin
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Payment Methods:</span>
              <div className="flex gap-1">
                <div className="w-8 h-5 bg-gray-700 rounded text-xs flex items-center justify-center">M</div>
                <div className="w-8 h-5 bg-gray-700 rounded text-xs flex items-center justify-center">P</div>
                <div className="w-8 h-5 bg-gray-700 rounded text-xs flex items-center justify-center">V</div>
                <div className="w-8 h-5 bg-gray-700 rounded text-xs flex items-center justify-center">MC</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
