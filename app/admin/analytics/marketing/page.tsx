"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Mail, 
  MessageSquare,
  Share2,
  Eye,
  MousePointer,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Users,
  DollarSign,
  Zap,
  Globe,
  Smartphone,
  Monitor
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

interface CampaignData {
  date: string
  emailSent: number
  emailOpened: number
  emailClicked: number
  socialShares: number
  websiteVisits: number
  conversions: number
}

interface CampaignPerformance {
  id: string
  name: string
  type: 'email' | 'social' | 'paid' | 'organic'
  status: 'active' | 'paused' | 'completed'
  reach: number
  engagement: number
  conversions: number
  cost: number
  roi: number
}

interface MarketingStats {
  totalReach: number
  totalEngagement: number
  totalConversions: number
  totalCost: number
  averageROI: number
  emailOpenRate: number
  clickThroughRate: number
  conversionRate: number
}

export default function MarketingAnalyticsPage() {
  const [campaignData, setCampaignData] = useState<CampaignData[]>([])
  const [campaigns, setCampaigns] = useState<CampaignPerformance[]>([])
  const [stats, setStats] = useState<MarketingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')

  useEffect(() => {
    // Mock campaign data
    const mockCampaignData: CampaignData[] = [
      { date: '2024-01-01', emailSent: 500, emailOpened: 150, emailClicked: 45, socialShares: 25, websiteVisits: 120, conversions: 8 },
      { date: '2024-01-02', emailSent: 600, emailOpened: 180, emailClicked: 54, socialShares: 32, websiteVisits: 145, conversions: 12 },
      { date: '2024-01-03', emailSent: 450, emailOpened: 135, emailClicked: 40, socialShares: 18, websiteVisits: 95, conversions: 6 },
      { date: '2024-01-04', emailSent: 700, emailOpened: 210, emailClicked: 63, socialShares: 45, websiteVisits: 180, conversions: 15 },
      { date: '2024-01-05', emailSent: 550, emailOpened: 165, emailClicked: 49, socialShares: 28, websiteVisits: 130, conversions: 10 },
      { date: '2024-01-06', emailSent: 650, emailOpened: 195, emailClicked: 58, socialShares: 38, websiteVisits: 160, conversions: 13 },
      { date: '2024-01-07', emailSent: 750, emailOpened: 225, emailClicked: 67, socialShares: 52, websiteVisits: 200, conversions: 18 },
    ]

    const mockCampaigns: CampaignPerformance[] = [
      {
        id: '1',
        name: 'New Product Launch',
        type: 'email',
        status: 'active',
        reach: 5000,
        engagement: 12.5,
        conversions: 8.2,
        cost: 500,
        roi: 340
      },
      {
        id: '2',
        name: 'Social Media Campaign',
        type: 'social',
        status: 'active',
        reach: 15000,
        engagement: 6.8,
        conversions: 3.5,
        cost: 300,
        roi: 180
      },
      {
        id: '3',
        name: 'Google Ads Campaign',
        type: 'paid',
        status: 'active',
        reach: 8000,
        engagement: 4.2,
        conversions: 2.8,
        cost: 800,
        roi: 120
      },
      {
        id: '4',
        name: 'SEO Content Strategy',
        type: 'organic',
        status: 'active',
        reach: 12000,
        engagement: 8.5,
        conversions: 5.2,
        cost: 200,
        roi: 280
      },
      {
        id: '5',
        name: 'Holiday Promotion',
        type: 'email',
        status: 'completed',
        reach: 3000,
        engagement: 15.2,
        conversions: 12.8,
        cost: 150,
        roi: 450
      }
    ]

    const mockStats: MarketingStats = {
      totalReach: 43000,
      totalEngagement: 9.5,
      totalConversions: 6.2,
      totalCost: 1950,
      averageROI: 274,
      emailOpenRate: 30.2,
      clickThroughRate: 8.5,
      conversionRate: 4.8
    }

    setTimeout(() => {
      setCampaignData(mockCampaignData)
      setCampaigns(mockCampaigns)
      setStats(mockStats)
      setLoading(false)
    }, 1000)
  }, [dateRange])

  const handleExportMarketing = () => {
    toast.success('Marketing analytics exported successfully!')
  }

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getCampaignTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800'
      case 'social': return 'bg-green-100 text-green-800'
      case 'paid': return 'bg-purple-100 text-purple-800'
      case 'organic': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading marketing analytics...</p>
          </div>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout
      title="Marketing Analytics"
      description="Track your marketing campaigns and performance metrics"
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
          <Button variant="outline" onClick={handleExportMarketing}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      }
    >
      {/* Marketing Stats */}
      <AdminSection title="Marketing Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatsCard
            title="Total Reach"
            value={(stats?.totalReach || 0).toLocaleString()}
            icon={<Users className="h-5 w-5" />}
            change={{ value: 15.2, type: 'increase' }}
          />
          <AdminStatsCard
            title="Engagement Rate"
            value={formatPercentage(stats?.totalEngagement || 0)}
            icon={<Activity className="h-5 w-5" />}
            change={{ value: 8.3, type: 'increase' }}
          />
          <AdminStatsCard
            title="Conversion Rate"
            value={formatPercentage(stats?.conversionRate || 0)}
            icon={<Target className="h-5 w-5" />}
            change={{ value: 12.5, type: 'increase' }}
          />
          <AdminStatsCard
            title="Average ROI"
            value={`${stats?.averageROI || 0}%`}
            icon={<DollarSign className="h-5 w-5" />}
            change={{ value: 18.7, type: 'increase' }}
          />
        </div>
      </AdminSection>

      {/* Email Performance Chart */}
      <AdminCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Campaign Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart
            data={campaignData}
            type="line"
            xAxisKey="date"
            height={300}
            lines={[{
              key: 'emailOpened',
              name: 'Emails Opened',
              color: '#3b82f6'
            }]}
          />
        </CardContent>
      </AdminCard>

      {/* Social Media Performance */}
      <AdminCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Social Media Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart
            data={campaignData}
            type="bar"
            xAxisKey="date"
            height={300}
            bars={[{
              key: 'socialShares',
              name: 'Social Shares',
              color: '#10b981'
            }]}
          />
        </CardContent>
      </AdminCard>

      {/* Campaign Performance Table */}
      <AdminCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Campaign Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {campaign.type === 'email' ? (
                      <Mail className="h-5 w-5 text-blue-500" />
                    ) : campaign.type === 'social' ? (
                      <Share2 className="h-5 w-5 text-green-500" />
                    ) : campaign.type === 'paid' ? (
                      <Target className="h-5 w-5 text-purple-500" />
                    ) : (
                      <Globe className="h-5 w-5 text-orange-500" />
                    )}
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getCampaignTypeColor(campaign.type)}`}>
                          {campaign.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-sm text-gray-500">Reach</div>
                    <div className="font-medium">{(campaign.reach || 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Engagement</div>
                    <div className="font-medium">{formatPercentage(campaign.engagement)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Conversions</div>
                    <div className="font-medium">{formatPercentage(campaign.conversions)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">ROI</div>
                    <div className="font-medium text-green-600">{campaign.roi}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </AdminCard>

      {/* Marketing Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Email Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">Open Rate</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPercentage(stats?.emailOpenRate || 0)}
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">Click-Through Rate</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatPercentage(stats?.clickThroughRate || 0)}
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </AdminCard>

        <AdminCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              Website Traffic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={campaignData}
              type="line"
              xAxisKey="date"
              height={200}
              lines={[{
                key: 'websiteVisits',
                name: 'Website Visits',
                color: '#8b5cf6'
              }]}
            />
          </CardContent>
        </AdminCard>
      </div>

      {/* Campaign Types and ROI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <CardHeader>
            <CardTitle>Campaign Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={[
                { name: 'Email', value: 40 },
                { name: 'Social', value: 30 },
                { name: 'Paid', value: 20 },
                { name: 'Organic', value: 10 }
              ]}
              type="bar"
              xAxisKey="name"
              height={200}
              bars={[{
                key: 'value',
                name: 'Campaigns',
                color: '#3b82f6'
              }]}
            />
          </CardContent>
        </AdminCard>

        <AdminCard>
          <CardHeader>
            <CardTitle>ROI by Campaign Type</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={[
                { type: 'Email', roi: 340 },
                { type: 'Social', roi: 180 },
                { type: 'Paid', roi: 120 },
                { type: 'Organic', roi: 280 }
              ]}
              type="bar"
              xAxisKey="type"
              height={200}
              bars={[{
                key: 'roi',
                name: 'ROI',
                color: '#f97316'
              }]}
            />
          </CardContent>
        </AdminCard>
      </div>
    </AdminPageLayout>
  )
}
