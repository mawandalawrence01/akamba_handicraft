"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminHeader } from './admin-header'
import { AdminSidebar } from './admin-sidebar'
import { adminTheme } from '@/lib/design-system'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminUser, setAdminUser] = useState<{ id: string; name: string; email: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
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
  }, [router])

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
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
        isOpen={sidebarOpen}
      />

      {/* Main content area */}
      <div 
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        } ml-0`}
      >
        {/* Header */}
        <AdminHeader 
          onMenuToggle={handleSidebarToggle}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page content */}
        <main className="min-h-screen bg-gray-50">
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