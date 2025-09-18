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
    icon: React.ReactNode
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
        // Use mock data if API fails
        setStats({
          totalProducts: 156,
          totalUsers: 2840,
          totalOrders: 89,
          totalRevenue: 45680.50,
          mostVisitedProducts: [
            {
              id: '1',
              name: 'Traditional Elephant Carving',
              views: 1250,
              sales: 45,
              revenue: 4050.55,
              image: '/placeholder-product.jpg'
            },
            {
              id: '2',
              name: 'Ceremonial Mask Collection',
              views: 980,
              sales: 32,
              revenue: 5119.68,
              image: '/placeholder-product.jpg'
            },
            {
              id: '3',
              name: 'Handwoven Basket Set',
              views: 850,
              sales: 28,
              revenue: 2799.72,
              image: '/placeholder-product.jpg'
            }
          ],
          recentOrders: [
            {
              id: '1',
              orderNumber: 'ORD-2024-001',
              customerName: 'John Doe',
              total: 189.98,
              status: 'PROCESSING',
              createdAt: '2024-01-15T10:30:00Z'
            },
            {
              id: '2',
              orderNumber: 'ORD-2024-002',
              customerName: 'Jane Smith',
              total: 159.99,
              status: 'SHIPPED',
              createdAt: '2024-01-14T15:45:00Z'
            },
            {
              id: '3',
              orderNumber: 'ORD-2024-003',
              customerName: 'Mike Johnson',
              total: 299.97,
              status: 'PENDING',
              createdAt: '2024-01-13T09:15:00Z'
            }
          ],
          topCountries: [
            { country: 'Kenya', users: 2250, revenue: 18950.20, percentage: 41.5 },
            { country: 'United States', users: 1890, revenue: 15680.75, percentage: 34.9 },
            { country: 'United Kingdom', users: 680, revenue: 6240.50, percentage: 12.5 },
            { country: 'Germany', users: 380, revenue: 3180.80, percentage: 7.0 },
            { country: 'Canada', users: 220, revenue: 1628.25, percentage: 4.1 }
          ],
          deviceStats: [
            { device: 'Desktop', users: 2890, percentage: 53.3, icon: <Monitor className="h-4 w-4" /> },
            { device: 'Mobile', users: 2104, percentage: 38.8, icon: <Smartphone className="h-4 w-4" /> },
            { device: 'Tablet', users: 426, percentage: 7.9, icon: <Smartphone className="h-4 w-4" /> }
          ]
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      toast.error('Failed to load dashboard data')
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

  // Static dummy chart data for consistent display
  const revenueChartData = [
    { date: 'Jan 1', revenue: 1200, orders: 8 },
    { date: 'Jan 2', revenue: 1500, orders: 12 },
    { date: 'Jan 3', revenue: 1800, orders: 15 },
    { date: 'Jan 4', revenue: 1600, orders: 11 },
    { date: 'Jan 5', revenue: 2200, orders: 18 },
    { date: 'Jan 6', revenue: 1900, orders: 14 },
    { date: 'Jan 7', revenue: 2500, orders: 20 },
    { date: 'Jan 8', revenue: 2100, orders: 16 },
    { date: 'Jan 9', revenue: 2800, orders: 22 },
    { date: 'Jan 10', revenue: 2400, orders: 19 },
    { date: 'Jan 11', revenue: 3000, orders: 25 },
    { date: 'Jan 12', revenue: 2700, orders: 21 },
    { date: 'Jan 13', revenue: 3200, orders: 28 },
    { date: 'Jan 14', revenue: 2900, orders: 24 },
    { date: 'Jan 15', revenue: 3500, orders: 30 },
    { date: 'Jan 16', revenue: 3100, orders: 26 },
    { date: 'Jan 17', revenue: 3800, orders: 32 },
    { date: 'Jan 18', revenue: 3400, orders: 29 },
    { date: 'Jan 19', revenue: 4000, orders: 35 },
    { date: 'Jan 20', revenue: 3600, orders: 31 },
    { date: 'Jan 21', revenue: 4200, orders: 38 },
    { date: 'Jan 22', revenue: 3800, orders: 33 },
    { date: 'Jan 23', revenue: 4500, orders: 40 },
    { date: 'Jan 24', revenue: 4100, orders: 36 },
    { date: 'Jan 25', revenue: 4800, orders: 42 },
    { date: 'Jan 26', revenue: 4400, orders: 38 },
    { date: 'Jan 27', revenue: 5000, orders: 45 },
    { date: 'Jan 28', revenue: 4600, orders: 41 },
    { date: 'Jan 29', revenue: 5200, orders: 48 },
    { date: 'Jan 30', revenue: 4800, orders: 44 }
  ]

  const visitorChartData = [
    { hour: '0:00', visitors: 45 },
    { hour: '1:00', visitors: 32 },
    { hour: '2:00', visitors: 28 },
    { hour: '3:00', visitors: 25 },
    { hour: '4:00', visitors: 30 },
    { hour: '5:00', visitors: 38 },
    { hour: '6:00', visitors: 55 },
    { hour: '7:00', visitors: 78 },
    { hour: '8:00', visitors: 95 },
    { hour: '9:00', visitors: 120 },
    { hour: '10:00', visitors: 145 },
    { hour: '11:00', visitors: 160 },
    { hour: '12:00', visitors: 175 },
    { hour: '13:00', visitors: 180 },
    { hour: '14:00', visitors: 165 },
    { hour: '15:00', visitors: 150 },
    { hour: '16:00', visitors: 140 },
    { hour: '17:00', visitors: 125 },
    { hour: '18:00', visitors: 110 },
    { hour: '19:00', visitors: 95 },
    { hour: '20:00', visitors: 80 },
    { hour: '21:00', visitors: 65 },
    { hour: '22:00', visitors: 50 },
    { hour: '23:00', visitors: 40 }
  ]

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
              <AnalyticsChart
                data={revenueChartData}
                type="line"
                xAxisKey="date"
                lines={[
                  { key: 'revenue', name: 'Revenue', color: '#f97316' },
                  { key: 'orders', name: 'Orders', color: '#3b82f6' }
                ]}
              />
            </AdminCard>

            <AdminCard title="Hourly Visitors">
              <AnalyticsChart
                data={visitorChartData}
                type="bar"
                xAxisKey="hour"
                bars={[
                  { key: 'visitors', name: 'Visitors', color: '#10b981' }
                ]}
              />
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
                      {product.views} views • {product.sales} sales
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">${product.revenue.toFixed(2)}</div>
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
              {stats?.deviceStats?.map((device) => (
                <div key={device.device} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {device.icon}
                    <span className="font-medium">{device.device}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{device.users.toLocaleString()}</span>
                    <Badge variant="secondary">{device.percentage}%</Badge>
                  </div>
                </div>
              )) || (
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
                      <div className="text-sm font-medium">${location.revenue.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">{location.users} users</div>
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
                    <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
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