"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { adminTheme } from '@/lib/design-system'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminUser, setAdminUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Check if current route is login page
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    // Skip auth check for login page
    if (isLoginPage) {
      return
    }

    // Check admin authentication
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/verify')
        if (!response.ok) {
          router.push('/admin/login')
          return
        }
        const user = await response.json()
        setAdminUser(user)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/admin/login')
      }
    }

    checkAuth()
  }, [router, isLoginPage])

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // For login page, render children without layout
  if (isLoginPage) {
    return <>{children}</>
  }

  if (!adminUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
      />

      {/* Main content area */}
      <div 
        className="transition-all duration-300"
        style={{ 
          marginLeft: sidebarCollapsed ? adminTheme.sidebar.collapsedWidth : adminTheme.sidebar.width 
        }}
      >
        {/* Header */}
        <AdminHeader 
          onMenuToggle={handleSidebarToggle}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}