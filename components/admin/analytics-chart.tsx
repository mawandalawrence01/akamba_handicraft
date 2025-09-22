"use client"

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

interface AnalyticsChartProps {
  data: any[]
  type: 'sales' | 'heatmap' | 'line' | 'bar' | 'area'
  height?: number
  className?: string
  xAxisKey?: string
  lines?: Array<{
    key: string
    name: string
    color: string
  }>
  bars?: Array<{
    key: string
    name: string
    color: string
  }>
}

const colors = {
  primary: '#F59E0B', // amber-500
  secondary: '#EA580C', // orange-600
  success: '#10B981', // emerald-500
  warning: '#F59E0B', // amber-500
  danger: '#EF4444', // red-500
  info: '#3B82F6', // blue-500
}

export function AnalyticsChart({ 
  data, 
  type, 
  height = 300, 
  className = '', 
  xAxisKey = 'name',
  lines = [],
  bars = []
}: AnalyticsChartProps) {
  const formatTooltipValue = (value: any, name: string) => {
    if (name === 'revenue') {
      return [`$${value?.toLocaleString()}`, 'Revenue']
    }
    if (name === 'orders') {
      return [value?.toLocaleString(), 'Orders']
    }
    if (name === 'users') {
      return [value?.toLocaleString(), 'Users']
    }
    return [value, name]
  }

  const formatXAxisLabel = (value: any) => {
    if (type === 'heatmap') {
      const hour = parseInt(value)
      if (hour === 0) return '12 AM'
      if (hour === 12) return '12 PM'
      if (hour < 12) return `${hour} AM`
      return `${hour - 12} PM`
    }
    return value
  }

  const renderChart = () => {
    switch (type) {
      case 'sales':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={formatTooltipValue}
                labelStyle={{ color: '#374151' }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke={colors.primary}
                fill={colors.primary}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stackId="2"
                stroke={colors.secondary}
                fill={colors.secondary}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'heatmap':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="hour" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                tickFormatter={formatXAxisLabel}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={formatTooltipValue}
                labelFormatter={(value) => `${formatXAxisLabel(value)}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => {
                  // Create color intensity based on value
                  const maxUsers = Math.max(...data.map(d => d.users))
                  const intensity = entry.users / maxUsers
                  const alpha = Math.max(0.2, intensity)
                  
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`rgba(245, 158, 11, ${alpha})`} 
                    />
                  )
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )


      case 'area':
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={formatTooltipValue}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={colors.primary}
                fill={colors.primary}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={formatTooltipValue}
                labelStyle={{ color: '#374151' }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              {lines.map((line, index) => (
                <Line 
                  key={line.key}
                  type="monotone" 
                  dataKey={line.key} 
                  stroke={line.color} 
                  strokeWidth={2}
                  dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
                  name={line.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={formatTooltipValue}
                labelStyle={{ color: '#374151' }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              {bars.map((bar, index) => (
                <Bar 
                  key={bar.key}
                  dataKey={bar.key} 
                  fill={bar.color}
                  name={bar.name}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {renderChart()}
    </div>
  )
}
