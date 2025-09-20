import { prisma } from './prisma'
import { deleteImageFromCloudinary } from './cloudinary'

/**
 * Delete Cloudinary images associated with a product
 */
export async function deleteProductCloudinaryImages(productId: string) {
  try {
    // Get all product images that are stored in Cloudinary
    const productImages = await prisma.productImage.findMany({
      where: {
        productId,
        isCloudinary: true,
        cloudinaryId: { not: null }
      }
    })

    // Delete each image from Cloudinary
    for (const image of productImages) {
      if (image.cloudinaryId) {
        try {
          await deleteImageFromCloudinary(image.cloudinaryId)
          console.log(`Deleted Cloudinary image: ${image.cloudinaryId}`)
        } catch (error) {
          console.error(`Failed to delete Cloudinary image ${image.cloudinaryId}:`, error)
          // Continue with other images even if one fails
        }
      }
    }

    return { success: true, deletedCount: productImages.length }
  } catch (error) {
    console.error('Error deleting product Cloudinary images:', error)
    throw error
  }
}

/**
 * Delete Cloudinary images associated with a category
 */
export async function deleteCategoryCloudinaryImages(categoryId: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (category?.isCloudinary && category.cloudinaryId) {
      try {
        await deleteImageFromCloudinary(category.cloudinaryId)
        console.log(`Deleted Cloudinary category image: ${category.cloudinaryId}`)
        return { success: true, deletedCount: 1 }
      } catch (error) {
        console.error(`Failed to delete Cloudinary category image ${category.cloudinaryId}:`, error)
        throw error
      }
    }

    return { success: true, deletedCount: 0 }
  } catch (error) {
    console.error('Error deleting category Cloudinary images:', error)
    throw error
  }
}

/**
 * Delete Cloudinary images associated with an artisan
 */
export async function deleteArtisanCloudinaryImages(artisanId: string) {
  try {
    const artisan = await prisma.artisan.findUnique({
      where: { id: artisanId }
    })

    if (artisan?.isCloudinary && artisan.cloudinaryId) {
      try {
        await deleteImageFromCloudinary(artisan.cloudinaryId)
        console.log(`Deleted Cloudinary artisan image: ${artisan.cloudinaryId}`)
        return { success: true, deletedCount: 1 }
      } catch (error) {
        console.error(`Failed to delete Cloudinary artisan image ${artisan.cloudinaryId}:`, error)
        throw error
      }
    }

    return { success: true, deletedCount: 0 }
  } catch (error) {
    console.error('Error deleting artisan Cloudinary images:', error)
    throw error
  }
}

/**
 * Delete Cloudinary images associated with a user
 */
export async function deleteUserCloudinaryImages(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (user?.isCloudinary && user.cloudinaryId) {
      try {
        await deleteImageFromCloudinary(user.cloudinaryId)
        console.log(`Deleted Cloudinary user image: ${user.cloudinaryId}`)
        return { success: true, deletedCount: 1 }
      } catch (error) {
        console.error(`Failed to delete Cloudinary user image ${user.cloudinaryId}:`, error)
        throw error
      }
    }

    return { success: true, deletedCount: 0 }
  } catch (error) {
    console.error('Error deleting user Cloudinary images:', error)
    throw error
  }
}

/**
 * Delete Cloudinary images associated with a blog post
 */
export async function deleteBlogPostCloudinaryImages(blogPostId: string) {
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: blogPostId }
    })

    if (blogPost?.isCloudinary && blogPost.cloudinaryId) {
      try {
        await deleteImageFromCloudinary(blogPost.cloudinaryId)
        console.log(`Deleted Cloudinary blog post image: ${blogPost.cloudinaryId}`)
        return { success: true, deletedCount: 1 }
      } catch (error) {
        console.error(`Failed to delete Cloudinary blog post image ${blogPost.cloudinaryId}:`, error)
        throw error
      }
    }

    return { success: true, deletedCount: 0 }
  } catch (error) {
    console.error('Error deleting blog post Cloudinary images:', error)
    throw error
  }
}

/**
 * Get Cloudinary image statistics
 */
export async function getCloudinaryImageStats() {
  try {
    const [
      productImages,
      categoryImages,
      artisanImages,
      userImages,
      blogPostImages
    ] = await Promise.all([
      prisma.productImage.count({
        where: { isCloudinary: true }
      }),
      prisma.category.count({
        where: { isCloudinary: true }
      }),
      prisma.artisan.count({
        where: { isCloudinary: true }
      }),
      prisma.user.count({
        where: { isCloudinary: true }
      }),
      prisma.blogPost.count({
        where: { isCloudinary: true }
      })
    ])

    return {
      productImages,
      categoryImages,
      artisanImages,
      userImages,
      blogPostImages,
      total: productImages + categoryImages + artisanImages + userImages + blogPostImages
    }
  } catch (error) {
    console.error('Error getting Cloudinary image stats:', error)
    throw error
  }
}
