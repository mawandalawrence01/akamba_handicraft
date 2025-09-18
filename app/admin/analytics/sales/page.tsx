"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Target,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AdminPageLayout, AdminCard, AdminStatsCard, AdminSection } from '@/components/admin/admin-page-layout'
import { AnalyticsChart } from '@/components/admin/analytics-chart'
import { toast } from 'react-hot-toast'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

interface SalesData {
  date: string
  revenue: number
  orders: number
  averageOrderValue: number
}

interface ProductSales {
  id: string
  name: string
  category: string
  sales: number
  revenue: number
  growth: number
}

interface SalesStats {
  totalRevenue: number
  revenueGrowth: number
  totalOrders: number
  ordersGrowth: number
  averageOrderValue: number
  aovGrowth: number
  topSellingProduct: string
  conversionRate: number
}

export default function SalesAnalyticsPage() {
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [productSales, setProductSales] = useState<ProductSales[]>([])
  const [stats, setStats] = useState<SalesStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')

  useEffect(() => {
    // Mock sales data
    const mockSalesData: SalesData[] = [
      { date: '2024-01-01', revenue: 45000, orders: 12, averageOrderValue: 3750 },
      { date: '2024-01-02', revenue: 52000, orders: 15, averageOrderValue: 3467 },
      { date: '2024-01-03', revenue: 38000, orders: 10, averageOrderValue: 3800 },
      { date: '2024-01-04', revenue: 61000, orders: 18, averageOrderValue: 3389 },
      { date: '2024-01-05', revenue: 48000, orders: 14, averageOrderValue: 3429 },
      { date: '2024-01-06', revenue: 55000, orders: 16, averageOrderValue: 3438 },
      { date: '2024-01-07', revenue: 67000, orders: 20, averageOrderValue: 3350 },
    ]

    const mockProductSales: ProductSales[] = [
      {
        id: '1',
        name: 'Traditional Wooden Mask',
        category: 'Masks',
        sales: 45,
        revenue: 225000,
        growth: 12.5
      },
      {
        id: '2',
        name: 'Handwoven Basket',
        category: 'Baskets',
        sales: 38,
        revenue: 152000,
        growth: 8.3
      },
      {
        id: '3',
        name: 'Carved Figurine',
        category: 'Sculptures',
        sales: 32,
        revenue: 192000,
        growth: 15.2
      },
      {
        id: '4',
        name: 'Beaded Necklace',
        category: 'Jewelry',
        sales: 28,
        revenue: 84000,
        growth: 5.7
      },
      {
        id: '5',
        name: 'Pottery Vase',
        category: 'Pottery',
        sales: 25,
        revenue: 125000,
        growth: 9.8
      }
    ]

    const mockStats: SalesStats = {
      totalRevenue: 355000,
      revenueGrowth: 15.2,
      totalOrders: 105,
      ordersGrowth: 8.7,
      averageOrderValue: 3381,
      aovGrowth: 6.1,
      topSellingProduct: 'Traditional Wooden Mask',
      conversionRate: 3.2
    }

    setTimeout(() => {
      setSalesData(mockSalesData)
      setProductSales(mockProductSales)
      setStats(mockStats)
      setLoading(false)
    }, 1000)
  }, [dateRange])

  const handleExportSales = () => {
    toast.success('Sales report exported successfully!')
  }

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading sales analytics...</p>
          </div>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout
      title="Sales Analytics"
      description="Track your sales performance and revenue insights"
      actions={
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportSales}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      }
    >
      {/* Sales Stats */}
      <AdminSection title="Sales Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatsCard
            title="Total Revenue"
            value={formatCurrency(stats?.totalRevenue || 0)}
            icon={<DollarSign className="h-5 w-5" />}
            change={{ value: stats?.revenueGrowth || 0, type: 'increase' }}
          />
          <AdminStatsCard
            title="Total Orders"
            value={stats?.totalOrders.toString() || '0'}
            icon={<ShoppingCart className="h-5 w-5" />}
            change={{ value: stats?.ordersGrowth || 0, type: 'increase' }}
          />
          <AdminStatsCard
            title="Average Order Value"
            value={formatCurrency(stats?.averageOrderValue || 0)}
            icon={<Target className="h-5 w-5" />}
            change={{ value: stats?.aovGrowth || 0, type: 'increase' }}
          />
          <AdminStatsCard
            title="Conversion Rate"
            value={`${stats?.conversionRate || 0}%`}
            icon={<Award className="h-5 w-5" />}
            change={{ value: 2.1, type: 'increase' }}
          />
        </div>
      </AdminSection>

      {/* Revenue Chart */}
      <AdminCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart
            data={salesData}
            type="line"
            xAxisKey="date"
            height={300}
            lines={[{
              key: 'revenue',
              name: 'Revenue',
              color: '#f97316'
            }]}
          />
        </CardContent>
      </AdminCard>

      {/* Orders Chart */}
      <AdminCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Orders Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart
            data={salesData}
            type="bar"
            xAxisKey="date"
            height={300}
            bars={[{
              key: 'orders',
              name: 'Orders',
              color: '#10b981'
            }]}
          />
        </CardContent>
      </AdminCard>

      {/* Top Selling Products */}
      <AdminCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Top Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productSales.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(product.revenue)}</div>
                  <div className="text-sm text-gray-500">{product.sales} sales</div>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {formatPercentage(product.growth)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </AdminCard>

      {/* Sales Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={[
                { name: 'Masks', value: 35 },
                { name: 'Baskets', value: 25 },
                { name: 'Sculptures', value: 20 },
                { name: 'Jewelry', value: 12 },
                { name: 'Pottery', value: 8 }
              ]}
              type="bar"
              xAxisKey="name"
              height={250}
              bars={[{
                key: 'value',
                name: 'Sales',
                color: '#f97316'
              }]}
            />
          </CardContent>
        </AdminCard>

        <AdminCard>
          <CardHeader>
            <CardTitle>Average Order Value Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={salesData}
              type="line"
              xAxisKey="date"
              height={250}
              lines={[{
                key: 'averageOrderValue',
                name: 'Average Order Value',
                color: '#8b5cf6'
              }]}
            />
          </CardContent>
        </AdminCard>
      </div>
    </AdminPageLayout>
  )
}
