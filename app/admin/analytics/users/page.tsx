"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Filter,
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

interface UserActivity {
  date: string
  newUsers: number
  activeUsers: number
  returningUsers: number
  totalSessions: number
}

interface UserDemographics {
  ageGroup: string
  count: number
  percentage: number
}

interface UserLocation {
  location: string
  users: number
  percentage: number
}

interface UserDevice {
  device: string
  users: number
  percentage: number
}

interface UserStats {
  totalUsers: number
  newUsers: number
  activeUsers: number
  returningUsers: number
  averageSessionDuration: number
  bounceRate: number
  topLocation: string
  topDevice: string
}

export default function UsersAnalyticsPage() {
  const [userActivity, setUserActivity] = useState<UserActivity[]>([])
  const [demographics, setDemographics] = useState<UserDemographics[]>([])
  const [locations, setLocations] = useState<UserLocation[]>([])
  const [devices, setDevices] = useState<UserDevice[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')

  useEffect(() => {
    // Mock user activity data
    const mockUserActivity: UserActivity[] = [
      { date: '2024-01-01', newUsers: 12, activeUsers: 45, returningUsers: 33, totalSessions: 78 },
      { date: '2024-01-02', newUsers: 15, activeUsers: 52, returningUsers: 37, totalSessions: 89 },
      { date: '2024-01-03', newUsers: 8, activeUsers: 38, returningUsers: 30, totalSessions: 68 },
      { date: '2024-01-04', newUsers: 18, activeUsers: 61, returningUsers: 43, totalSessions: 104 },
      { date: '2024-01-05', newUsers: 14, activeUsers: 48, returningUsers: 34, totalSessions: 82 },
      { date: '2024-01-06', newUsers: 16, activeUsers: 55, returningUsers: 39, totalSessions: 94 },
      { date: '2024-01-07', newUsers: 20, activeUsers: 67, returningUsers: 47, totalSessions: 114 },
    ]

    const mockDemographics: UserDemographics[] = [
      { ageGroup: '18-24', count: 45, percentage: 25 },
      { ageGroup: '25-34', count: 72, percentage: 40 },
      { ageGroup: '35-44', count: 36, percentage: 20 },
      { ageGroup: '45-54', count: 18, percentage: 10 },
      { ageGroup: '55+', count: 9, percentage: 5 }
    ]

    const mockLocations: UserLocation[] = [
      { location: 'Nairobi', users: 85, percentage: 35 },
      { location: 'Mombasa', users: 45, percentage: 18 },
      { location: 'Kisumu', users: 32, percentage: 13 },
      { location: 'Nakuru', users: 28, percentage: 11 },
      { location: 'Eldoret', users: 22, percentage: 9 },
      { location: 'Other', users: 32, percentage: 14 }
    ]

    const mockDevices: UserDevice[] = [
      { device: 'Mobile', users: 156, percentage: 65 },
      { device: 'Desktop', users: 72, percentage: 30 },
      { device: 'Tablet', users: 12, percentage: 5 }
    ]

    const mockStats: UserStats = {
      totalUsers: 240,
      newUsers: 103,
      activeUsers: 366,
      returningUsers: 263,
      averageSessionDuration: 4.2,
      bounceRate: 32.5,
      topLocation: 'Nairobi',
      topDevice: 'Mobile'
    }

    setTimeout(() => {
      setUserActivity(mockUserActivity)
      setDemographics(mockDemographics)
      setLocations(mockLocations)
      setDevices(mockDevices)
      setStats(mockStats)
      setLoading(false)
    }, 1000)
  }, [dateRange])

  const handleExportUsers = () => {
    toast.success('User analytics exported successfully!')
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading user analytics...</p>
          </div>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout
      title="User Analytics"
      description="Track user behavior, demographics, and engagement metrics"
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
          <Button variant="outline" onClick={handleExportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      }
    >
      {/* User Stats */}
      <AdminSection title="User Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatsCard
            title="Total Users"
            value={stats?.totalUsers.toString() || '0'}
            icon={<Users className="h-5 w-5" />}
            change={{ value: 12.5, type: 'increase' }}
          />
          <AdminStatsCard
            title="New Users"
            value={stats?.newUsers.toString() || '0'}
            icon={<UserPlus className="h-5 w-5" />}
            change={{ value: 8.3, type: 'increase' }}
          />
          <AdminStatsCard
            title="Active Users"
            value={stats?.activeUsers.toString() || '0'}
            icon={<UserCheck className="h-5 w-5" />}
            change={{ value: 15.2, type: 'increase' }}
          />
          <AdminStatsCard
            title="Returning Users"
            value={stats?.returningUsers.toString() || '0'}
            icon={<Activity className="h-5 w-5" />}
            change={{ value: 6.7, type: 'increase' }}
          />
        </div>
      </AdminSection>

      {/* User Activity Chart */}
      <AdminCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            User Activity Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart
            data={userActivity}
            type="line"
            xAxisKey="date"
            height={300}
            lines={[{
              key: 'activeUsers',
              name: 'Active Users',
              color: '#f97316'
            }]}
          />
        </CardContent>
      </AdminCard>

      {/* New vs Returning Users */}
      <AdminCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            New vs Returning Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart
            data={userActivity}
            type="bar"
            xAxisKey="date"
            height={300}
            bars={[{
              key: 'newUsers',
              name: 'New Users',
              color: '#10b981'
            }]}
          />
        </CardContent>
      </AdminCard>

      {/* Demographics and Location */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Age Demographics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={demographics}
              type="bar"
              xAxisKey="ageGroup"
              height={250}
              bars={[{
                key: 'count',
                name: 'Users',
                color: '#3b82f6'
              }]}
            />
          </CardContent>
        </AdminCard>

        <AdminCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              User Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {locations.map((location) => (
                <div key={location.location} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{location.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${location.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {location.users}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </AdminCard>
      </div>

      {/* Device Usage and Session Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Device Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {devices.map((device) => (
                <div key={device.device} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {device.device === 'Mobile' ? (
                      <Smartphone className="h-4 w-4 text-gray-400" />
                    ) : device.device === 'Desktop' ? (
                      <Monitor className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Monitor className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm font-medium">{device.device}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {formatPercentage(device.percentage)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </AdminCard>

        <AdminCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Session Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">Average Session Duration</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {stats?.averageSessionDuration} min
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">Bounce Rate</div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatPercentage(stats?.bounceRate || 0)}
                  </div>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </CardContent>
        </AdminCard>
      </div>

      {/* Top Locations and Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={locations.slice(0, 5)}
              type="bar"
              xAxisKey="location"
              height={200}
              bars={[{
                key: 'users',
                name: 'Users',
                color: '#10b981'
              }]}
            />
          </CardContent>
        </AdminCard>

        <AdminCard>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              data={devices}
              type="bar"
              xAxisKey="device"
              height={200}
              bars={[{
                key: 'users',
                name: 'Users',
                color: '#8b5cf6'
              }]}
            />
          </CardContent>
        </AdminCard>
      </div>
    </AdminPageLayout>
  )
}
