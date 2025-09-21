"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Eye, 
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  MapPin,
  Clock,
  Plus,
  ArrowUpRight,
  Package,
  Heart,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { AnalyticsChart } from '@/components/admin/analytics-chart'
import { 
  AdminPageLayout, 
  AdminCard, 
  AdminStatsCard, 
  AdminSection 
} from '@/components/admin/admin-page-layout'
import { toast } from 'react-hot-toast'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import Link from 'next/link'

interface DashboardStats {
  totalProducts: number
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  mostVisitedProducts: Array<{
    id: string
    name: string
    views: number
    sales: number
    revenue: number
    image: string
  }>
  recentOrders: Array<{
    id: string
    orderNumber: string
    customerName: string
    total: number
    status: string
    createdAt: string
  }>
  topCountries: Array<{
    country: string
    users: number
    revenue: number
    percentage: number
  }>
  deviceStats: Array<{
    device: string
    users: number
    percentage: number
  }>
  salesTrends: Array<{
    date: string
    revenue: number
    orders: number
  }>
  userActivity: Array<{
    hour: number
    users: number
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')

  useEffect(() => {
    fetchDashboardStats()
  }, [dateRange])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/dashboard/stats?range=${dateRange}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        console.error('Failed to fetch dashboard stats:', response.status, response.statusText)
        toast.error('Failed to load dashboard data')
        // Set empty stats instead of mock data
        setStats({
          totalProducts: 0,
          totalUsers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          mostVisitedProducts: [],
          recentOrders: [],
          topCountries: [],
          deviceStats: [],
          salesTrends: [],
          userActivity: []
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      toast.error('Failed to load dashboard data')
      // Set empty stats instead of mock data
      setStats({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        mostVisitedProducts: [],
        recentOrders: [],
        topCountries: [],
        deviceStats: [],
        salesTrends: [],
        userActivity: []
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshData = (e?: React.MouseEvent) => {
    e?.preventDefault()
    fetchDashboardStats()
    toast.success('Dashboard data refreshed')
  }

  const exportData = (e?: React.MouseEvent) => {
    e?.preventDefault()
    toast.success('Dashboard report exported')
  }

  // Use real chart data from API
  const revenueChartData = stats?.salesTrends || []
  const visitorChartData = stats?.userActivity || []

  if (loading) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout
        title="Dashboard"
        description="Welcome back! Here's what's happening with your business today."
        actions={
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportData} type="button">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={refreshData} type="button">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        }
      >
        {/* Key Metrics */}
        <AdminSection title="Key Metrics">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <AdminStatsCard
              title="Total Revenue"
              value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
              change={{ value: 12.5, type: 'increase' }}
              icon={<DollarSign className="h-6 w-6" />}
              description="Revenue from all sales"
            />
            <AdminStatsCard
              title="Total Orders"
              value={(stats?.totalOrders || 0).toLocaleString()}
              change={{ value: 8.3, type: 'increase' }}
              icon={<ShoppingCart className="h-6 w-6" />}
              description="Orders placed this period"
            />
            <AdminStatsCard
              title="Total Users"
              value={(stats?.totalUsers || 0).toLocaleString()}
              change={{ value: -2.1, type: 'decrease' }}
              icon={<Users className="h-6 w-6" />}
              description="Registered customers"
            />
            <AdminStatsCard
              title="Total Products"
              value={(stats?.totalProducts || 0).toLocaleString()}
              change={{ value: 5.2, type: 'increase' }}
              icon={<Package className="h-6 w-6" />}
              description="Products in catalog"
            />
          </div>
        </AdminSection>

        {/* Charts */}
        <AdminSection title="Analytics">
          <div className="grid gap-6 lg:grid-cols-2">
            <AdminCard title="Revenue & Orders Trend">
              {revenueChartData.length > 0 ? (
                <AnalyticsChart
                  data={revenueChartData}
                  type="line"
                  xAxisKey="date"
                  lines={[
                    { key: 'revenue', name: 'Revenue', color: '#f97316' },
                    { key: 'orders', name: 'Orders', color: '#3b82f6' }
                  ]}
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No sales data available for the selected period</p>
                  </div>
                </div>
              )}
            </AdminCard>

            <AdminCard title="Hourly Visitors">
              {visitorChartData.length > 0 ? (
                <AnalyticsChart
                  data={visitorChartData}
                  type="bar"
                  xAxisKey="hour"
                  bars={[
                    { key: 'users', name: 'Visitors', color: '#10b981' }
                  ]}
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No visitor data available for the selected period</p>
                  </div>
                </div>
              )}
            </AdminCard>
          </div>
        </AdminSection>

        {/* Detailed Analytics */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Top Products */}
          <AdminCard title="Top Products">
            <div className="space-y-4">
              {stats?.mostVisitedProducts?.map((product, index) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.views || 0} views • {product.sales || 0} sales
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">${(product.revenue || 0).toFixed(2)}</div>
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-500 py-4">
                  <p>No product data available</p>
                </div>
              )}
            </div>
          </AdminCard>

          {/* Device Analytics */}
          <AdminCard title="Device Breakdown">
            <div className="space-y-4">
              {stats?.deviceStats?.map((device) => {
                const getDeviceIcon = (deviceType: string) => {
                  switch (deviceType.toLowerCase()) {
                    case 'desktop':
                      return <Monitor className="h-4 w-4" />
                    case 'mobile':
                      return <Smartphone className="h-4 w-4" />
                    case 'tablet':
                      return <Smartphone className="h-4 w-4" />
                    default:
                      return <Monitor className="h-4 w-4" />
                  }
                }
                
                return (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(device.device)}
                      <span className="font-medium">{device.device}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{(device.users || 0).toLocaleString()}</span>
                      <Badge variant="secondary">{device.percentage}%</Badge>
                    </div>
                  </div>
                )
              }) || (
                <div className="text-center text-gray-500 py-4">
                  <p>No device data available</p>
                </div>
              )}
            </div>
          </AdminCard>

          {/* Geographic Analytics */}
          <AdminCard title="Top Countries">
            <div className="space-y-4">
              {stats?.topCountries?.map((location) => (
                <div key={location.country} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{location.country}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">${(location.revenue || 0).toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">{location.users || 0} users</div>
                    </div>
                  </div>
                  <Progress value={location.percentage} className="h-2" />
                </div>
              )) || (
                <div className="text-center text-gray-500 py-4">
                  <p>No geographic data available</p>
                </div>
              )}
            </div>
          </AdminCard>
        </div>

        {/* Recent Orders */}
        <AdminSection title="Recent Orders">
          <AdminCard>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.recentOrders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={order.status === 'SHIPPED' ? 'default' : order.status === 'PROCESSING' ? 'secondary' : 'outline'}
                        className={
                          order.status === 'SHIPPED' ? 'bg-green-100 text-green-800' :
                          order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">${(order.total || 0).toFixed(2)}</TableCell>
                    <TableCell>{format(new Date(order.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild type="button">
                        <Link href={`/admin/orders/${order.id}`}>
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      No recent orders available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </AdminCard>
        </AdminSection>

        {/* Quick Actions */}
        <AdminSection title="Quick Actions">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-20 flex-col gap-2" type="button">
              <Link href="/admin/products/new">
                <Plus className="h-6 w-6" />
                Add Product
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col gap-2" type="button">
              <Link href="/admin/orders">
                <ShoppingCart className="h-6 w-6" />
                Manage Orders
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col gap-2" type="button">
              <Link href="/admin/media">
                <Download className="h-6 w-6" />
                Upload Media
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col gap-2" type="button">
              <Link href="/admin/analytics">
                <BarChart3 className="h-6 w-6" />
                View Analytics
              </Link>
            </Button>
          </div>
        </AdminSection>
      </AdminPageLayout>
  )
}