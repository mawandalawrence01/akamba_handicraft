import { prisma } from './prisma'

export async function syncUserWithDatabase(userData: {
  id: string
  email: string
  name?: string
  image?: string
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userData.id }
    })

    if (existingUser) {
      // Update existing user
      return await prisma.user.update({
        where: { id: userData.id },
        data: {
          email: userData.email,
          name: userData.name,
          image: userData.image,
          lastLoginAt: new Date(),
        }
      })
    } else {
      // Create new user
      return await prisma.user.create({
        data: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          image: userData.image,
          lastLoginAt: new Date(),
        }
      })
    }
  } catch (error) {
    console.error('Error syncing user with database:', error)
    throw error
  }
}

export async function getUserFromDatabase(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
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
