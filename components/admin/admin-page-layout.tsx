"use client"

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminTheme, designSystem } from '@/lib/design-system'

interface AdminPageLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function AdminPageLayout({ 
  children, 
  title, 
  description, 
  actions,
  className = "" 
}: AdminPageLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`min-h-screen ${className}`}
      style={{ backgroundColor: adminTheme.content.backgroundColor }}
    >
      <div className="p-6 space-y-6">
        {/* Page Header */}
        {(title || description || actions) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <div>
              {title && (
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-gray-600 mt-2 text-lg">
                  {description}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
          </motion.div>
        )}

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  )
}

interface AdminCardProps {
  children: ReactNode
  title?: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function AdminCard({ 
  children, 
  title, 
  description, 
  actions,
  className = "" 
}: AdminCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`${className}`}
        style={{
          backgroundColor: adminTheme.card.backgroundColor,
          borderRadius: adminTheme.card.borderRadius,
          boxShadow: adminTheme.card.shadow,
        }}
      >
        {(title || description || actions) && (
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {title}
                  </CardTitle>
                )}
                {description && (
                  <p className="text-gray-600 mt-1 text-sm">
                    {description}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex items-center gap-2">
                  {actions}
                </div>
              )}
            </div>
          </CardHeader>
        )}
        <CardContent className={title || description || actions ? "pt-0" : ""}>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface AdminStatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon: ReactNode
  description?: string
  className?: string
}

export function AdminStatsCard({ 
  title, 
  value, 
  change, 
  icon, 
  description,
  className = "" 
}: AdminStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              {change && (
                <div className={`flex items-center mt-2 text-sm ${
                  change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className="font-medium">
                    {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
                  </span>
                  <span className="ml-1 text-gray-500">from last period</span>
                </div>
              )}
              {description && (
                <p className="text-xs text-gray-500 mt-1">{description}</p>
              )}
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <div className="text-orange-600">
                {icon}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface AdminSectionProps {
  children: ReactNode
  title?: string
  description?: string
  className?: string
}

export function AdminSection({ 
  children, 
  title, 
  description,
  className = "" 
}: AdminSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`space-y-4 ${className}`}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-600 text-sm">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </motion.section>
  )
}
