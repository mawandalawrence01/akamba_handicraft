"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  Upload,
  Plus,
  ChevronRight,
  ChevronDown,
  Home,
  FileText,
  MessageSquare,
  Shield,
  Zap,
  DollarSign
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { adminTheme, designSystem } from '@/lib/design-system'

interface AdminSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
  isOpen?: boolean
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: Package,
    children: [
      { name: 'All Products', href: '/admin/products', icon: Package },
      { name: 'Add Product', href: '/admin/products/new', icon: Plus },
      { name: 'Categories', href: '/admin/categories', icon: FileText },
    ]
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    badge: '12',
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: Users,
  },
  {
    name: 'Artisans',
    href: '/admin/artisans',
    icon: Shield,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    children: [
      { name: 'Overview', href: '/admin/analytics', icon: BarChart3 },
      { name: 'Sales Reports', href: '/admin/analytics/sales', icon: FileText },
      { name: 'User Activity', href: '/admin/analytics/users', icon: Users },
      { name: 'Marketing', href: '/admin/analytics/marketing', icon: Zap },
    ]
  },
  {
    name: 'Media',
    href: '/admin/media',
    icon: Upload,
  },
  {
    name: 'Content',
    href: '/admin/content',
    icon: FileText,
    children: [
      { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
      { name: 'Pages', href: '/admin/pages', icon: Home },
      { name: 'Comments', href: '/admin/comments', icon: MessageSquare },
    ]
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    children: [
      { name: 'General', href: '/admin/settings', icon: Settings },
      { name: 'Users & Roles', href: '/admin/settings/users', icon: Shield },
      { name: 'Integrations', href: '/admin/settings/integrations', icon: Zap },
      { name: 'Security', href: '/admin/settings/security', icon: Shield },
      { name: 'Notifications', href: '/admin/settings/notifications', icon: MessageSquare },
      { name: 'Backup', href: '/admin/settings/backup', icon: Upload },
    ]
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: FileText,
    children: [
      { name: 'Sales Report', href: '/admin/reports/sales', icon: BarChart3 },
      { name: 'Inventory Report', href: '/admin/reports/inventory', icon: Package },
      { name: 'Customer Report', href: '/admin/reports/customers', icon: Users },
      { name: 'Financial Report', href: '/admin/reports/financial', icon: DollarSign },
    ]
  },
  {
    name: 'Tools',
    href: '/admin/tools',
    icon: Zap,
    children: [
      { name: 'Import/Export', href: '/admin/tools/import-export', icon: Upload },
      { name: 'Bulk Actions', href: '/admin/tools/bulk-actions', icon: Zap },
      { name: 'Data Cleanup', href: '/admin/tools/cleanup', icon: Settings },
    ]
  },
]

export function AdminSidebar({ collapsed = false, onToggle, isOpen = false }: AdminSidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Products', 'Analytics'])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const NavItem = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.name)
    const active = isActive(item.href)

    return (
      <div>
        <div className="relative">
          <Link
            href={item.href}
            onClick={() => hasChildren && toggleExpanded(item.name)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
              "hover:bg-white/10 hover:text-white min-h-[40px]",
              active 
                ? "bg-orange-500 text-white shadow-lg" 
                : "text-gray-300",
              level > 0 && "ml-6",
              collapsed && "justify-center px-2"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 flex-shrink-0",
              active && "text-white",
              !active && "text-gray-400 group-hover:text-white"
            )} />
            
            {!collapsed && (
              <>
                <span className="flex-1 truncate">{item.name}</span>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5"
                  >
                    {item.badge}
                  </Badge>
                )}
                {hasChildren && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                )}
              </>
            )}
          </Link>
        </div>

        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-1 ml-2">
                {item.children?.map((child) => (
                  <NavItem key={child.href} item={child} level={level + 1} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        "fixed left-0 top-0 z-40 h-full bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 transition-all duration-300",
        "hidden lg:block",
        isOpen && "lg:hidden block",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AH</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Akamba</h2>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </motion.div>
        )}
        
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">AH</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="space-y-1 pb-4">
          {navigation.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-700">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {/* Quick Actions */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                  asChild
                >
                  <Link href="/admin/products/new">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Product
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                  asChild
                >
                  <Link href="/admin/media">
                    <Upload className="h-3 w-3 mr-1" />
                    Upload
                  </Link>
                </Button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-medium">System Online</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">All services running</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  )
}
