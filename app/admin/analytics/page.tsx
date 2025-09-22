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
  Clock
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
import { toast } from 'react-hot-toast'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { AdminPageLayout, AdminCard, AdminStatsCard, AdminSection } from '@/components/admin/admin-page-layout'

interface AnalyticsData {
  totalRevenue: number
  revenueGrowth: number
  totalOrders: number
  ordersGrowth: number
  totalVisitors: number
  visitorsGrowth: number
  conversionRate: number
  conversionGrowth: number
  avgOrderValue: number
  aovGrowth: number
}

interface TopProduct {
  id: string
  name: string
  views: number
  sales: number
  revenue: number
  image: string
}

interface TrafficSource {
  source: string
  visitors: number
  percentage: number
  conversionRate: number
}

interface DeviceData {
  device: string
  users: number
  percentage: number
  icon: React.ReactNode
}

interface LocationData {
  country: string
  users: number
  percentage: number
  revenue: number
}

// Mock data - in real app, fetch from API
const mockAnalytics: AnalyticsData = {
  totalRevenue: 45680.50,
  revenueGrowth: 12.5,
  totalOrders: 234,
  ordersGrowth: 8.3,
  totalVisitors: 5420,
  visitorsGrowth: -2.1,
  conversionRate: 4.3,
  conversionGrowth: 0.8,
  avgOrderValue: 195.20,
  aovGrowth: 5.2
}

const mockTopProducts: TopProduct[] = [
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
  },
  {
    id: '4',
    name: 'Wooden Jewelry Collection',
    views: 720,
    sales: 22,
    revenue: 1759.78,
    image: '/placeholder-product.jpg'
  },
  {
    id: '5',
    name: 'Traditional Pottery',
    views: 650,
    sales: 18,
    revenue: 1439.82,
    image: '/placeholder-product.jpg'
  }
]

const mockTrafficSources: TrafficSource[] = [
  { source: 'Organic Search', visitors: 2340, percentage: 43.2, conversionRate: 5.2 },
  { source: 'Direct', visitors: 1450, percentage: 26.8, conversionRate: 6.1 },
  { source: 'Social Media', visitors: 980, percentage: 18.1, conversionRate: 3.8 },
  { source: 'Email', visitors: 420, percentage: 7.8, conversionRate: 8.5 },
  { source: 'Referral', visitors: 230, percentage: 4.2, conversionRate: 4.1 }
]

const mockDeviceData: DeviceData[] = [
  { device: 'Desktop', users: 2890, percentage: 53.3, icon: <Monitor className="h-4 w-4" /> },
  { device: 'Mobile', users: 2104, percentage: 38.8, icon: <Smartphone className="h-4 w-4" /> },
  { device: 'Tablet', users: 426, percentage: 7.9, icon: <Smartphone className="h-4 w-4" /> }
]

const mockLocationData: LocationData[] = [
  { country: 'United States', users: 1250, percentage: 35.2, revenue: 18500 },
  { country: 'United Kingdom', users: 890, percentage: 23.6, revenue: 12400 },
  { country: 'Canada', users: 650, percentage: 17.5, revenue: 9200 },
  { country: 'Australia', users: 420, percentage: 12.9, revenue: 6800 },
  { country: 'Germany', users: 380, percentage: 10.7, revenue: 5600 }
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d')
  const [analytics, setAnalytics] = useState<AnalyticsData>(mockAnalytics)
  const [loading, setLoading] = useState(false)

  // Generate dynamic dummy chart data based on date range
  const generateRevenueChartData = (range: string) => {
    const data = []
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 7
    
    // Start from today and go back
    const today = new Date()
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - (days - 1 - i))
      
      // Generate realistic revenue and orders data with some variation
      const baseRevenue = 1200 + (i * 50) + Math.sin(i * 0.3) * 200
      const baseOrders = 8 + Math.floor(i * 0.8) + Math.floor(Math.sin(i * 0.2) * 5)
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.round(baseRevenue),
        orders: Math.max(1, baseOrders)
      })
    }
    
    return data
  }

  const revenueChartData = generateRevenueChartData(dateRange)

  // Generate realistic hourly visitor patterns
  const generateVisitorChartData = () => {
    const data = []
    
    for (let hour = 0; hour < 24; hour++) {
      let visitors = 0
      
      // Peak hours (9-17) have more visitors
      if (hour >= 9 && hour <= 17) {
        visitors = 120 + Math.sin((hour - 9) * Math.PI / 8) * 60 + Math.random() * 40
      } else if (hour >= 18 && hour <= 22) {
        // Evening hours
        visitors = 80 + Math.random() * 30
      } else if (hour >= 7 && hour <= 8) {
        // Morning hours
        visitors = 60 + Math.random() * 20
      } else {
        // Night hours
        visitors = 20 + Math.random() * 20
      }
      
      // Format hour for display
      const hourLabel = hour === 0 ? '12 AM' : 
                       hour === 12 ? '12 PM' : 
                       hour < 12 ? `${hour} AM` : `${hour - 12} PM`
      
      data.push({
        hour: hourLabel,
        visitors: Math.round(visitors)
      })
    }
    
    return data
  }

  const visitorChartData = generateVisitorChartData()

  // Mock conversion funnel data
  const conversionFunnelData = [
    { stage: 'Page Views', count: 10000, percentage: 100 },
    { stage: 'Product Views', count: 5420, percentage: 54.2 },
    { stage: 'Add to Cart', count: 1250, percentage: 12.5 },
    { stage: 'Checkout', count: 560, percentage: 5.6 },
    { stage: 'Purchase', count: 234, percentage: 2.3 }
  ]

  const refreshData = async (e?: React.MouseEvent) => {
    e?.preventDefault()
    setLoading(true)
    try {
      // In real app, fetch fresh data from API
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Analytics data refreshed')
    } catch (error) {
      toast.error('Failed to refresh data')
    } finally {
      setLoading(false)
    }
  }

  const exportData = (e?: React.MouseEvent) => {
    e?.preventDefault()
    // In real app, generate and download report
    toast.success('Analytics report exported')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  return (
    <AdminPageLayout
        title="Analytics"
        description="Track your business performance and insights"
        actions={
          <div className="flex items-center gap-2">
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
            <Button onClick={refreshData} disabled={loading} type="button">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      >

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
            <div className={`text-xs flex items-center ${analytics.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.revenueGrowth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {formatPercentage(analytics.revenueGrowth)} from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(analytics.totalOrders || 0).toLocaleString()}</div>
            <div className={`text-xs flex items-center ${analytics.ordersGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.ordersGrowth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {formatPercentage(analytics.ordersGrowth)} from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(analytics.totalVisitors || 0).toLocaleString()}</div>
            <div className={`text-xs flex items-center ${analytics.visitorsGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.visitorsGrowth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {formatPercentage(analytics.visitorsGrowth)} from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
            <div className={`text-xs flex items-center ${analytics.conversionGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.conversionGrowth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {formatPercentage(analytics.conversionGrowth)} from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.avgOrderValue)}</div>
            <div className={`text-xs flex items-center ${analytics.aovGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.aovGrowth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {formatPercentage(analytics.aovGrowth)} from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Orders Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={revenueChartData}
              type="line"
              xAxisKey="date"
              lines={[
                { key: 'revenue', name: 'Revenue', color: '#f97316' },
                { key: 'orders', name: 'Orders', color: '#3b82f6' }
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hourly Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={visitorChartData}
              type="bar"
              xAxisKey="hour"
              bars={[
                { key: 'visitors', name: 'Visitors', color: '#f97316' }
              ]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopProducts.map((product, index) => (
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
                    <div className="font-medium text-sm">{formatCurrency(product.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTrafficSources.map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{source.source}</span>
                    <span className="text-sm text-muted-foreground">{source.visitors}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={source.percentage} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground w-12">{source.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Conversion: {source.conversionRate}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionFunnelData.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <span className="text-sm text-muted-foreground">{(stage.count || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={stage.percentage} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground w-12">{stage.percentage}%</span>
                  </div>
                  {index > 0 && (
                    <div className="text-xs text-red-600">
                      Drop-off: {((conversionFunnelData[index-1].count - stage.count) / conversionFunnelData[index-1].count * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Device Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDeviceData.map((device) => (
                <div key={device.device} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {device.icon}
                    <span className="font-medium">{device.device}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{(device.users || 0).toLocaleString()}</span>
                    <Badge variant="secondary">{device.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLocationData.map((location) => (
                <div key={location.country} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{location.country}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatCurrency(location.revenue)}</div>
                      <div className="text-xs text-muted-foreground">{location.users} users</div>
                    </div>
                  </div>
                  <Progress value={location.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </AdminPageLayout>
  )
}
