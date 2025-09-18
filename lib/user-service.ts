import { User } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export async function syncUserWithDatabase(clerkUser: User) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id }
    })

    if (existingUser) {
      // Update existing user
      return await prisma.user.update({
        where: { clerkId: clerkUser.id },
        data: {
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
          lastLoginAt: new Date(),
        }
      })
    } else {
      // Create new user
      return await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
          lastLoginAt: new Date(),
        }
      })
    }
  } catch (error) {
    console.error('Error syncing user with database:', error)
    throw error
  }
}

export async function getUserFromDatabase(clerkId: string) {
  return await prisma.user.findUnique({
    where: { clerkId },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      wishlist: {
        include: {
          product: {
            include: {
              images: true
            }
          }
        }
      },
      cartItems: {
        include: {
          product: {
            include: {
              images: true
            }
          }
        }
      }
    }
  })
}
