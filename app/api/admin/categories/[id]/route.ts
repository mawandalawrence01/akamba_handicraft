import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminActivity } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await requireAdmin(request)
    const { id: categoryId } = await params

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        parent: {
          select: {
            id: true,
            name: true
          }
        },
        children: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ category })

  } catch (error) {
    console.error('Admin category fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const admin = await requireAdmin(request)
    const { id: categoryId } = await params
    const body = await request.json()

    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Validate parent category exists if provided
    if (body.parentId && body.parentId !== '' && body.parentId !== null) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: body.parentId }
      })
      
      if (!parentCategory) {
        return NextResponse.json(
          { 
            error: 'Invalid parent category',
            details: 'The selected parent category does not exist.'
          },
          { status: 400 }
        )
      }

      // Prevent setting self as parent
      if (body.parentId === categoryId) {
        return NextResponse.json(
          { 
            error: 'Invalid parent category',
            details: 'A category cannot be its own parent.'
          },
          { status: 400 }
        )
      }
    }

    // Generate new slug if name changed
    let newSlug = undefined
    if (body.name && body.name !== category.name) {
      const baseSlug = body.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      let slug = baseSlug
      let counter = 1
      
      // Check for existing slug (excluding current category)
      while (await prisma.category.findFirst({ 
        where: { 
          slug,
          id: { not: categoryId }
        } 
      })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
      
      newSlug = slug
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
      ...(newSlug && { slug: newSlug })
    }

    // Only include fields that are provided and valid
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.image !== undefined) updateData.image = body.image
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder
    if (body.isActive !== undefined) updateData.isActive = body.isActive
    
    // Handle parentId carefully
    if (body.parentId !== undefined) {
      if (body.parentId === '' || body.parentId === null) {
        updateData.parentId = null
      } else {
        updateData.parentId = body.parentId
      }
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
      include: {
        parent: {
          select: {
            id: true,
            name: true
          }
        },
        children: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    // Log admin activity
    const changes = Object.keys(body).join(', ')
    await logAdminActivity(
      admin.id,
      'CATEGORY_UPDATE',
      `Updated category: ${category.name} (${changes})`,
      { 
        categoryId: category.id, 
        categoryName: category.name,
        changes: body
      },
      request
    )

    return NextResponse.json({ 
      success: true, 
      category: updatedCategory 
    })

  } catch (error) {
    console.error('Admin category update error:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const admin = await requireAdmin(request)
    const { id: categoryId } = await params

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { 
        id: true, 
        name: true,
        _count: {
          select: {
            products: true,
            children: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if category has products
    if (category._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing products. Consider deactivating instead.' },
        { status: 400 }
      )
    }

    // Check if category has children
    if (category._count.children > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories. Please delete or move subcategories first.' },
        { status: 400 }
      )
    }

    // Delete category
    await prisma.category.delete({ 
      where: { id: categoryId } 
    })

    // Log admin activity
    await logAdminActivity(
      admin.id,
      'CATEGORY_DELETE',
      `Deleted category: ${category.name}`,
      { categoryId: category.id, categoryName: category.name },
      request
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Category deleted successfully' 
    })

  } catch (error) {
    console.error('Admin category deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
