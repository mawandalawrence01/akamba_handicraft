"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Menu,
  Sun,
  Moon,
  ChevronDown,
  HelpCircle,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTheme } from 'next-themes'
import { adminTheme, designSystem } from '@/lib/design-system'

interface AdminHeaderProps {
  onMenuToggle?: () => void
  sidebarCollapsed?: boolean
}

export function AdminHeader({ onMenuToggle, sidebarCollapsed = false }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, setTheme } = useTheme()
  const [notifications] = useState([
    { id: '1', message: 'New order received', time: '2 min ago', unread: true },
    { id: '2', message: 'Product review pending', time: '1 hour ago', unread: true },
    { id: '3', message: 'Low stock alert', time: '3 hours ago', unread: false },
  ])

  const unreadCount = notifications.filter(n => n.unread).length

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logging out...')
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm"
      style={{ height: adminTheme.header.height }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AH</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-gray-900">Akamba Handicraft</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products, orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-300 focus:ring-orange-200"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="hover:bg-gray-100"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Help */}
        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* Messages */}
        <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
          <MessageSquare className="h-4 w-4" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            3
          </Badge>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium">{notification.message}</span>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{notification.time}</span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-orange-600 font-medium">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                <AvatarFallback className="bg-orange-100 text-orange-600">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">lawmwad@gmail.com</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}
