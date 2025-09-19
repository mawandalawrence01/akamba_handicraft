"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  UserCheck,
  UserX,
  TrendingUp,
  ShoppingBag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AdminPageLayout, AdminCard, AdminStatsCard, AdminSection } from '@/components/admin/admin-page-layout'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  status: 'active' | 'inactive'
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  joinDate: string
  location?: string
  loyaltyPoints: number
  averageRating: number
  totalReviews: number
  lastLoginAt?: string
  tags: string[]
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          ...(searchQuery && { search: searchQuery }),
          ...(statusFilter !== 'all' && { status: statusFilter })
        })

        const response = await fetch(`/api/admin/customers?${params}`)
        if (response.ok) {
          const data = await response.json()
          setCustomers(data.customers)
          setPagination(data.pagination)
        } else {
          console.error('Failed to fetch customers')
          toast.error('Failed to fetch customers')
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
        toast.error('Error fetching customers')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [pagination.page, searchQuery, statusFilter])

  const stats = {
    total: pagination.total,
    active: customers.filter(c => c.status === 'active').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    totalSpent: customers.reduce((sum, c) => sum + c.totalSpent, 0)
  }

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowCustomerModal(true)
  }

  const handleExportCustomers = () => {
    toast.success('Customer data exported successfully!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading customers...</p>
          </div>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout
      title="Customers"
      description="Manage your customer database and relationships"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportCustomers}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      }
    >
      {/* Stats Cards */}
      <AdminSection title="Customer Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatsCard
            title="Total Customers"
            value={stats.total.toString()}
            icon={<Users className="h-5 w-5" />}
            change={{ value: 12, type: 'increase' }}
          />
          <AdminStatsCard
            title="Active Customers"
            value={stats.active.toString()}
            icon={<UserCheck className="h-5 w-5" />}
            change={{ value: 8, type: 'increase' }}
          />
          <AdminStatsCard
            title="Inactive Customers"
            value={stats.inactive.toString()}
            icon={<UserX className="h-5 w-5" />}
            change={{ value: 3, type: 'decrease' }}
          />
          <AdminStatsCard
            title="Total Revenue"
            value={`KSh ${stats.totalSpent.toLocaleString()}`}
            icon={<TrendingUp className="h-5 w-5" />}
            change={{ value: 15, type: 'increase' }}
          />
        </div>
      </AdminSection>

      {/* Filters and Search */}
      <AdminCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AdminCard>

      {/* Customers Table */}
      <AdminCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={customer.avatar} alt={customer.name} />
                      <AvatarFallback>
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">
                        Joined {format(new Date(customer.joinDate), 'MMM yyyy')}
                      </div>
                      {customer.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {customer.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{customer.email}</div>
                    {customer.phone && (
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    )}
                    {customer.location && (
                      <div className="text-sm text-gray-500">{customer.location}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(customer.status)}>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <ShoppingBag className="h-4 w-4 text-gray-400" />
                    {customer.totalOrders}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    KSh {customer.totalSpent.toLocaleString()}
                  </div>
                  {customer.loyaltyPoints > 0 && (
                    <div className="text-xs text-gray-500">
                      {customer.loyaltyPoints} pts
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {customer.averageRating > 0 ? (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm">{customer.averageRating}</span>
                      <span className="text-xs text-gray-500">({customer.totalReviews})</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">No reviews</span>
                  )}
                </TableCell>
                <TableCell>
                  {customer.lastOrderDate ? (
                    <div className="text-sm">
                      Order: {format(new Date(customer.lastOrderDate), 'MMM dd')}
                    </div>
                  ) : customer.lastLoginAt ? (
                    <div className="text-sm">
                      Login: {format(new Date(customer.lastLoginAt), 'MMM dd')}
                    </div>
                  ) : (
                    <span className="text-gray-400">No activity</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminCard>

      {/* Customer Details Modal */}
      <Dialog open={showCustomerModal} onOpenChange={setShowCustomerModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedCustomer.avatar} alt={selectedCustomer.name} />
                  <AvatarFallback className="text-lg">
                    {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                  <Badge className={getStatusColor(selectedCustomer.status)}>
                    {selectedCustomer.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                  </div>
                  {selectedCustomer.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedCustomer.phone}</span>
                      </div>
                    </div>
                  )}
                  {selectedCustomer.location && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{selectedCustomer.location}</span>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Loyalty Points</label>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span>{selectedCustomer.loyaltyPoints} points</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Join Date</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{format(new Date(selectedCustomer.joinDate), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Orders</label>
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-gray-400" />
                      <span>{selectedCustomer.totalOrders}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Spent</label>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span>KSh {selectedCustomer.totalSpent.toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Average Rating</label>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">★</span>
                      <span>{selectedCustomer.averageRating > 0 ? selectedCustomer.averageRating : 'No reviews'}</span>
                      {selectedCustomer.totalReviews > 0 && (
                        <span className="text-sm text-gray-500">({selectedCustomer.totalReviews} reviews)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {selectedCustomer.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCustomer.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  )
}
