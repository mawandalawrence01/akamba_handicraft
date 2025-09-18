"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Eye,
  Edit,
  RefreshCw,
  Download,
  Calendar,
  DollarSign,
  User,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import { AdminPageLayout, AdminCard, AdminStatsCard, AdminSection } from '@/components/admin/admin-page-layout'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  total: number
  itemCount: number
  createdAt: string
  shippingAddress: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  items: Array<{
    id: string
    productName: string
    quantity: number
    price: number
    image: string
  }>
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

const paymentStatusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800'
}

// Mock data - in real app, fetch from API
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    total: 189.98,
    itemCount: 2,
    createdAt: '2024-01-15T10:30:00Z',
    shippingAddress: {
      street: '123 Main St',
      city: 'Nairobi',
      state: 'Nairobi',
      country: 'Kenya',
      postalCode: '00100'
    },
    items: [
      {
        id: '1',
        productName: 'Traditional Elephant Carving',
        quantity: 1,
        price: 89.99,
        image: '/placeholder-product.jpg'
      },
      {
        id: '2',
        productName: 'Handwoven Basket',
        quantity: 1,
        price: 99.99,
        image: '/placeholder-product.jpg'
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    total: 159.99,
    itemCount: 1,
    createdAt: '2024-01-14T15:45:00Z',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Mombasa',
      state: 'Coast',
      country: 'Kenya',
      postalCode: '80100'
    },
    items: [
      {
        id: '3',
        productName: 'Ceremonial Mask',
        quantity: 1,
        price: 159.99,
        image: '/placeholder-product.jpg'
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    status: 'PENDING',
    paymentStatus: 'PENDING',
    total: 299.97,
    itemCount: 3,
    createdAt: '2024-01-13T09:15:00Z',
    shippingAddress: {
      street: '789 Pine Rd',
      city: 'Kisumu',
      state: 'Nyanza',
      country: 'Kenya',
      postalCode: '40100'
    },
    items: [
      {
        id: '4',
        productName: 'Wood Sculpture Set',
        quantity: 3,
        price: 99.99,
        image: '/placeholder-product.jpg'
      }
    ]
  }
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [loading, setLoading] = useState(false)

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, paymentFilter])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setLoading(true)
    try {
      // In real app, make API call
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ))
      toast.success('Order status updated successfully')
    } catch (error) {
      toast.error('Failed to update order status')
    } finally {
      setLoading(false)
    }
  }

  const exportOrders = () => {
    // In real app, generate and download CSV/Excel file
    toast.success('Orders exported successfully')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <RefreshCw className="h-4 w-4" />
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4" />
      case 'PROCESSING':
        return <Package className="h-4 w-4" />
      case 'SHIPPED':
        return <Truck className="h-4 w-4" />
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />
      default:
        return <RefreshCw className="h-4 w-4" />
    }
  }

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    processing: orders.filter(o => o.status === 'PROCESSING').length,
    shipped: orders.filter(o => o.status === 'SHIPPED').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
  }

  return (
    <AdminPageLayout
        title="Orders"
        description="Manage customer orders and fulfillment"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportOrders}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        }
      >

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <RefreshCw className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.processing}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.shipped}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.delivered}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${orderStats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {order.id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.customerEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]} variant="secondary">
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={paymentStatusColors[order.paymentStatus]} variant="secondary">
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${order.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                          setSelectedOrder(order)
                          setShowOrderDetails(true)
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Confirmed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'PROCESSING')}>
                          <Package className="mr-2 h-4 w-4" />
                          Mark as Processing
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'SHIPPED')}>
                          <Truck className="mr-2 h-4 w-4" />
                          Mark as Shipped
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'DELIVERED')}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Delivered
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by creating your first product to receive orders.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder && `Order ${selectedOrder.orderNumber}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Name:</span> {selectedOrder.customerName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedOrder.customerEmail}
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <div>{selectedOrder.shippingAddress.street}</div>
                      <div>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                      </div>
                      <div>
                        {selectedOrder.shippingAddress.country} {selectedOrder.shippingAddress.postalCode}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            ${(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="font-medium">Total:</span>
                      <span className="text-xl font-bold">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </AdminPageLayout>
  )
}
