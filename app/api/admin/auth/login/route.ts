import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check for hardcoded admin credentials
    if (email === 'lawmwad@gmail.com' && password === 'geniusmind') {
      // Check if admin user exists in database
      let adminUser = await prisma.adminUser.findUnique({
        where: { email }
      })

      // Create admin user if doesn't exist
      if (!adminUser) {
        const passwordHash = await bcrypt.hash(password, 12)
        adminUser = await prisma.adminUser.create({
          data: {
            email,
            passwordHash,
            firstName: 'Lawrence',
            lastName: 'Admin',
            role: 'SUPER_ADMIN',
            isActive: true
          }
        })
      }

      // Update last login
      await prisma.adminUser.update({
        where: { id: adminUser.id },
        data: { lastLoginAt: new Date() }
      })

      // Log admin activity
      await prisma.adminActivity.create({
        data: {
          type: 'USER_ACTION',
          description: 'Admin login',
          metadata: {
            email,
            loginTime: new Date().toISOString()
          },
          ipAddress: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          adminUserId: adminUser.id
        }
      })

      // Generate JWT token
      const token = jwt.sign(
        { 
          adminId: adminUser.id, 
          email: adminUser.email, 
          role: adminUser.role 
        },
        JWT_SECRET,
        { expiresIn: '8h' }
      )

      // Set HTTP-only cookie
      const response = NextResponse.json({
        success: true,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          role: adminUser.role
        }
      })

      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 // 8 hours
      })

      return response
    }

    // Check database for other admin users
    const adminUser = await prisma.adminUser.findUnique({
      where: { email }
    })

    if (!adminUser || !adminUser.isActive) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, adminUser.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: { lastLoginAt: new Date() }
    })

    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        type: 'USER_ACTION',
        description: 'Admin login',
        metadata: {
          email,
          loginTime: new Date().toISOString()
        },
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        adminUserId: adminUser.id
      }
    })

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: adminUser.id, 
        email: adminUser.email, 
        role: adminUser.role 
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role
      }
    })

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 // 8 hours
    })

    return response

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
