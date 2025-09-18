import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AdminUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
}

export async function verifyAdminToken(request: NextRequest): Promise<AdminUser | null> {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Verify admin user still exists and is active
    const adminUser = await prisma.adminUser.findUnique({
      where: { 
        id: decoded.adminId,
        isActive: true
      }
    })

    if (!adminUser) {
      return null
    }

    return {
      id: adminUser.id,
      email: adminUser.email,
      firstName: adminUser.firstName || undefined,
      lastName: adminUser.lastName || undefined,
      role: adminUser.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN'
    }

  } catch (error) {
    console.error('Admin token verification error:', error)
    return null
  }
}

export async function requireAdmin(request: NextRequest): Promise<AdminUser> {
  const admin = await verifyAdminToken(request)
  
  if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
    throw new Error('Unauthorized: Admin access required')
  }

  return admin
}

export async function logAdminActivity(
  adminId: string,
  type: string,
  description: string,
  metadata?: any,
  request?: NextRequest
) {
  try {
    await prisma.adminActivity.create({
      data: {
        type: type as any,
        description,
        metadata: metadata || {},
        ipAddress: request?.headers.get('x-forwarded-for') || 
                   request?.headers.get('x-real-ip') || 
                   'unknown',
        userAgent: request?.headers.get('user-agent') || 'unknown',
        adminUserId: adminId
      }
    })
  } catch (error) {
    console.error('Failed to log admin activity:', error)
  }
}
