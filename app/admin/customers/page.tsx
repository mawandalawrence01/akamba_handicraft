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
  status: 'active' | 'inactive' | 'banned'
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  joinDate: string
  location?: string
  tags: string[]
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showCustomerModal, setShowCustomerModal] = useState(false)

  // Mock data
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'John Mwangi',
        email: 'john.mwangi@email.com',
        phone: '+254 712 345 678',
        avatar: '/placeholder-avatar.jpg',
        status: 'active',
        totalOrders: 12,
        totalSpent: 45000,
        lastOrderDate: '2024-01-15',
        joinDate: '2023-06-15',
        location: 'Nairobi, Kenya',
        tags: ['VIP', 'Regular']
      },
      {
        id: '2',
        name: 'Sarah Wanjiku',
        email: 'sarah.wanjiku@email.com',
        phone: '+254 723 456 789',
        status: 'active',
        totalOrders: 8,
        totalSpent: 32000,
        lastOrderDate: '2024-01-10',
        joinDate: '2023-08-20',
        location: 'Mombasa, Kenya',
        tags: ['Regular']
      },
      {
        id: '3',
        name: 'Peter Kimani',
        email: 'peter.kimani@email.com',
        phone: '+254 734 567 890',
        status: 'inactive',
        totalOrders: 3,
        totalSpent: 15000,
        lastOrderDate: '2023-12-05',
        joinDate: '2023-10-10',
        location: 'Kisumu, Kenya',
        tags: ['New']
      },
      {
        id: '4',
        name: 'Grace Akinyi',
        email: 'grace.akinyi@email.com',
        phone: '+254 745 678 901',
        status: 'active',
        totalOrders: 15,
        totalSpent: 68000,
        lastOrderDate: '2024-01-18',
        joinDate: '2023-05-12',
        location: 'Nakuru, Kenya',
        tags: ['VIP', 'Premium']
      },
      {
        id: '5',
        name: 'David Ochieng',
        email: 'david.ochieng@email.com',
        status: 'banned',
        totalOrders: 2,
        totalSpent: 8000,
        lastOrderDate: '2023-11-20',
        joinDate: '2023-09-15',
        location: 'Eldoret, Kenya',
        tags: ['Problematic']
      }
    ]

    setTimeout(() => {
      setCustomers(mockCustomers)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: customers.length,
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
      case 'banned': return 'bg-red-100 text-red-800'
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
              <TableHead>Last Order</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
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
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{customer.email}</div>
                    {customer.phone && (
                      <div className="text-sm text-gray-500">{customer.phone}</div>
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
                </TableCell>
                <TableCell>
                  {customer.lastOrderDate ? (
                    <div className="text-sm">
                      {format(new Date(customer.lastOrderDate), 'MMM dd, yyyy')}
                    </div>
                  ) : (
                    <span className="text-gray-400">No orders</span>
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
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
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
