import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create categories
  console.log('📁 Creating categories...')
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'sculptures' },
      update: {},
      create: {
        name: 'Sculptures',
        slug: 'sculptures',
        description: 'Traditional and contemporary wooden sculptures',
        image: '/picture/caption (1).jpg',
        isActive: true,
        sortOrder: 1
      }
    }),
    prisma.category.upsert({
      where: { slug: 'masks' },
      update: {},
      create: {
        name: 'Masks',
        slug: 'masks',
        description: 'Traditional ceremonial and decorative masks',
        image: '/picture/caption (2).jpg',
        isActive: true,
        sortOrder: 2
      }
    }),
    prisma.category.upsert({
      where: { slug: 'baskets' },
      update: {},
      create: {
        name: 'Baskets',
        slug: 'baskets',
        description: 'Handwoven baskets and containers',
        image: '/picture/caption (3).jpg',
        isActive: true,
        sortOrder: 3
      }
    }),
    prisma.category.upsert({
      where: { slug: 'jewelry' },
      update: {},
      create: {
        name: 'Jewelry',
        slug: 'jewelry',
        description: 'Traditional beads, necklaces, and accessories',
        image: '/picture/caption (4).jpg',
        isActive: true,
        sortOrder: 4
      }
    }),
    prisma.category.upsert({
      where: { slug: 'pottery' },
      update: {},
      create: {
        name: 'Pottery',
        slug: 'pottery',
        description: 'Traditional clay pots and ceramic items',
        image: '/picture/caption (5).jpg',
        isActive: true,
        sortOrder: 5
      }
    }),
    prisma.category.upsert({
      where: { slug: 'textiles' },
      update: {},
      create: {
        name: 'Textiles',
        slug: 'textiles',
        description: 'Traditional fabrics, clothing, and home decor',
        image: '/picture/caption (6).jpg',
        isActive: true,
        sortOrder: 6
      }
    })
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // Create artisans
  console.log('👨‍🎨 Creating artisans...')
  const artisans = await Promise.all([
    prisma.artisan.upsert({
      where: { slug: 'john-mwangi' },
      update: {},
      create: {
        name: 'John Mwangi',
        slug: 'john-mwangi',
        bio: 'Master woodcarver with over 20 years of experience in traditional Kikuyu carving techniques. Specializes in animal sculptures and ceremonial masks.',
        image: '/picture/caption (7).jpg',
        phone: '+254 712 345 678',
        location: 'Nyeri, Kenya',
        experience: 20,
        specialties: ['Wood Carving', 'Animal Sculptures', 'Ceremonial Masks'],
        isVerified: true,
        isActive: true
      }
    }),
    prisma.artisan.upsert({
      where: { slug: 'mary-wanjiku' },
      update: {},
      create: {
        name: 'Mary Wanjiku',
        slug: 'mary-wanjiku',
        bio: 'Expert basket weaver and textile artist. Creates beautiful handwoven baskets and traditional Kikuyu textiles using natural materials.',
        image: '/picture/caption (8).jpg',
        phone: '+254 723 456 789',
        location: 'Murang\'a, Kenya',
        experience: 15,
        specialties: ['Basket Weaving', 'Textile Art', 'Natural Dyes'],
        isVerified: true,
        isActive: true
      }
    }),
    prisma.artisan.upsert({
      where: { slug: 'david-kiprotich' },
      update: {},
      create: {
        name: 'David Kiprotich',
        slug: 'david-kiprotich',
        bio: 'Traditional potter and jewelry maker. Creates authentic Kikuyu pottery and beaded jewelry using age-old techniques passed down through generations.',
        image: '/picture/caption (9).jpg',
        phone: '+254 734 567 890',
        location: 'Kiambu, Kenya',
        experience: 12,
        specialties: ['Pottery', 'Beadwork', 'Traditional Jewelry'],
        isVerified: true,
        isActive: true
      }
    }),
    prisma.artisan.upsert({
      where: { slug: 'grace-akinyi' },
      update: {},
      create: {
        name: 'Grace Akinyi',
        slug: 'grace-akinyi',
        bio: 'Multi-talented artisan specializing in contemporary interpretations of traditional crafts. Creates modern pieces inspired by Kikuyu heritage.',
        image: '/picture/caption (10).jpg',
        phone: '+254 745 678 901',
        location: 'Nairobi, Kenya',
        experience: 8,
        specialties: ['Contemporary Art', 'Mixed Media', 'Design Innovation'],
        isVerified: true,
        isActive: true
      }
    }),
    prisma.artisan.upsert({
      where: { slug: 'peter-mutua' },
      update: {},
      create: {
        name: 'Peter Mutua',
        slug: 'peter-mutua',
        bio: 'Master mask maker and ceremonial art specialist. Creates authentic traditional masks used in Kikuyu ceremonies and cultural events.',
        image: '/picture/caption (11).jpg',
        phone: '+254 756 789 012',
        location: 'Machakos, Kenya',
        experience: 25,
        specialties: ['Ceremonial Masks', 'Cultural Art', 'Traditional Rituals'],
        isVerified: true,
        isActive: true
      }
    })
  ])

  console.log(`✅ Created ${artisans.length} artisans`)

  // Create sample products
  console.log('🛍️ Creating sample products...')
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'traditional-elephant-carving' },
      update: {},
      create: {
        name: 'Traditional Elephant Carving',
        slug: 'traditional-elephant-carving',
        description: 'Hand-carved elephant sculpture made from premium ebony wood. This traditional piece represents strength and wisdom in Kikuyu culture. Each carving is unique and takes weeks to complete using traditional tools and techniques.',
        shortDescription: 'Hand-carved ebony elephant sculpture representing strength and wisdom',
        sku: 'ELE-001',
        price: 89.99,
        compareAtPrice: 120.00,
        costPrice: 45.00,
        weight: 2.5,
        dimensions: { length: 25, width: 15, height: 20 },
        materials: ['Premium Ebony Wood', 'Natural Wood Stain'],
        colors: ['Dark Brown', 'Black'],
        isHandmade: true,
        isFeatured: true,
        isActive: true,
        inStock: true,
        stockQuantity: 5,
        minOrderQty: 1,
        maxOrderQty: 3,
        tags: ['traditional', 'handmade', 'elephant', 'ebony', 'sculpture'],
        metaTitle: 'Traditional Elephant Carving - Handmade Ebony Sculpture',
        metaDescription: 'Authentic hand-carved elephant sculpture from premium ebony wood. Traditional Kikuyu craftsmanship.',
        categoryId: categories[0].id, // Sculptures
        artisanId: artisans[0].id, // John Mwangi
        images: {
          create: [
            {
              url: '/picture/caption (12).jpg',
              altText: 'Traditional Elephant Carving - Front View',
              sortOrder: 0,
              isPrimary: true,
              is360View: false
            },
            {
              url: '/picture/caption (13).jpg',
              altText: 'Traditional Elephant Carving - Side View',
              sortOrder: 1,
              isPrimary: false,
              is360View: false
            }
          ]
        }
      }
    }),
    prisma.product.upsert({
      where: { slug: 'ceremonial-mask-warrior' },
      update: {},
      create: {
        name: 'Ceremonial Warrior Mask',
        slug: 'ceremonial-mask-warrior',
        description: 'Authentic ceremonial mask used in traditional Kikuyu warrior ceremonies. Hand-carved from soft wood and decorated with natural pigments. This mask represents courage and protection.',
        shortDescription: 'Authentic ceremonial warrior mask for traditional ceremonies',
        sku: 'MASK-001',
        price: 65.00,
        compareAtPrice: 85.00,
        costPrice: 30.00,
        weight: 0.8,
        dimensions: { length: 30, width: 20, height: 15 },
        materials: ['Soft Wood', 'Natural Pigments', 'Plant Fibers'],
        colors: ['Brown', 'Red', 'Black'],
        isHandmade: true,
        isFeatured: true,
        isActive: true,
        inStock: true,
        stockQuantity: 8,
        minOrderQty: 1,
        maxOrderQty: 5,
        tags: ['ceremonial', 'mask', 'warrior', 'traditional', 'ritual'],
        metaTitle: 'Ceremonial Warrior Mask - Traditional Kikuyu Art',
        metaDescription: 'Authentic ceremonial warrior mask hand-carved for traditional Kikuyu ceremonies.',
        categoryId: categories[1].id, // Masks
        artisanId: artisans[4].id, // Peter Mutua
        images: {
          create: [
            {
              url: '/picture/caption (14).jpg',
              altText: 'Ceremonial Warrior Mask - Front View',
              sortOrder: 0,
              isPrimary: true,
              is360View: false
            }
          ]
        }
      }
    }),
    prisma.product.upsert({
      where: { slug: 'handwoven-storage-basket' },
      update: {},
      create: {
        name: 'Handwoven Storage Basket',
        slug: 'handwoven-storage-basket',
        description: 'Beautiful handwoven storage basket made from natural sisal and banana fibers. Perfect for storing fruits, vegetables, or decorative items. Each basket is unique with traditional Kikuyu weaving patterns.',
        shortDescription: 'Handwoven storage basket with traditional Kikuyu patterns',
        sku: 'BASKET-001',
        price: 35.00,
        compareAtPrice: 45.00,
        costPrice: 15.00,
        weight: 0.5,
        dimensions: { length: 35, width: 35, height: 25 },
        materials: ['Sisal Fiber', 'Banana Fiber', 'Natural Dyes'],
        colors: ['Natural', 'Brown', 'Beige'],
        isHandmade: true,
        isFeatured: false,
        isActive: true,
        inStock: true,
        stockQuantity: 12,
        minOrderQty: 1,
        maxOrderQty: 10,
        tags: ['basket', 'handwoven', 'storage', 'natural', 'traditional'],
        metaTitle: 'Handwoven Storage Basket - Traditional Kikuyu Weaving',
        metaDescription: 'Beautiful handwoven storage basket made from natural fibers with traditional patterns.',
        categoryId: categories[2].id, // Baskets
        artisanId: artisans[1].id, // Mary Wanjiku
        images: {
          create: [
            {
              url: '/picture/caption (15).jpg',
              altText: 'Handwoven Storage Basket - Top View',
              sortOrder: 0,
              isPrimary: true,
              is360View: false
            }
          ]
        }
      }
    }),
    prisma.product.upsert({
      where: { slug: 'traditional-beaded-necklace' },
      update: {},
      create: {
        name: 'Traditional Beaded Necklace',
        slug: 'traditional-beaded-necklace',
        description: 'Elegant traditional beaded necklace featuring authentic Kikuyu beadwork patterns. Made with high-quality glass beads in traditional colors. Perfect for special occasions or cultural events.',
        shortDescription: 'Traditional beaded necklace with authentic Kikuyu patterns',
        sku: 'NECK-001',
        price: 25.00,
        compareAtPrice: 35.00,
        costPrice: 10.00,
        weight: 0.2,
        dimensions: { length: 45, width: 2, height: 1 },
        materials: ['Glass Beads', 'Cotton Thread', 'Metal Clasp'],
        colors: ['Red', 'Blue', 'Yellow', 'Green'],
        isHandmade: true,
        isFeatured: false,
        isActive: true,
        inStock: true,
        stockQuantity: 20,
        minOrderQty: 1,
        maxOrderQty: 15,
        tags: ['necklace', 'beads', 'traditional', 'jewelry', 'colorful'],
        metaTitle: 'Traditional Beaded Necklace - Authentic Kikuyu Jewelry',
        metaDescription: 'Beautiful traditional beaded necklace with authentic Kikuyu patterns and colors.',
        categoryId: categories[3].id, // Jewelry
        artisanId: artisans[2].id, // David Kiprotich
        images: {
          create: [
            {
              url: '/picture/caption (16).jpg',
              altText: 'Traditional Beaded Necklace - Full View',
              sortOrder: 0,
              isPrimary: true,
              is360View: false
            }
          ]
        }
      }
    }),
    prisma.product.upsert({
      where: { slug: 'traditional-water-pot' },
      update: {},
      create: {
        name: 'Traditional Water Pot',
        slug: 'traditional-water-pot',
        description: 'Authentic traditional water pot made from local clay using age-old pottery techniques. Perfect for storing water or as a decorative piece. Each pot is hand-thrown and fired using traditional methods.',
        shortDescription: 'Traditional clay water pot made using ancient pottery techniques',
        sku: 'POT-001',
        price: 45.00,
        compareAtPrice: 60.00,
        costPrice: 20.00,
        weight: 1.2,
        dimensions: { length: 20, width: 20, height: 30 },
        materials: ['Local Clay', 'Natural Glaze', 'Wood Ash'],
        colors: ['Terracotta', 'Brown', 'Natural'],
        isHandmade: true,
        isFeatured: false,
        isActive: true,
        inStock: true,
        stockQuantity: 6,
        minOrderQty: 1,
        maxOrderQty: 5,
        tags: ['pottery', 'water pot', 'traditional', 'clay', 'functional'],
        metaTitle: 'Traditional Water Pot - Authentic Kikuyu Pottery',
        metaDescription: 'Traditional clay water pot made using ancient pottery techniques and natural materials.',
        categoryId: categories[4].id, // Pottery
        artisanId: artisans[2].id, // David Kiprotich
        images: {
          create: [
            {
              url: '/picture/caption (17).jpg',
              altText: 'Traditional Water Pot - Side View',
              sortOrder: 0,
              isPrimary: true,
              is360View: false
            }
          ]
        }
      }
    })
  ])

  console.log(`✅ Created ${products.length} sample products`)

  // Create admin user
  console.log('👤 Creating admin user...')
  const hashedPassword = await hash('admin123', 12)
  
  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'admin@akamba-handicraft.com' },
    update: {},
    create: {
      email: 'admin@akamba-handicraft.com',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
      isActive: true
    }
  })

  console.log('✅ Created admin user')

  // Create sample blog posts
  console.log('📝 Creating sample blog posts...')
  const blogPosts = await Promise.all([
    prisma.blogPost.upsert({
      where: { slug: 'traditional-kikuyu-crafts-heritage' },
      update: {},
      create: {
        title: 'Traditional Kikuyu Crafts: Preserving Heritage Through Art',
        slug: 'traditional-kikuyu-crafts-heritage',
        excerpt: 'Discover the rich history and cultural significance of traditional Kikuyu crafts, from wood carving to basket weaving.',
        content: `# Traditional Kikuyu Crafts: Preserving Heritage Through Art

The Kikuyu people of Kenya have a rich tradition of craftsmanship that has been passed down through generations. These traditional crafts are not just beautiful objects, but carriers of cultural knowledge, stories, and values.

## Wood Carving Traditions

Wood carving holds a special place in Kikuyu culture. Master carvers like John Mwangi continue to use traditional tools and techniques to create sculptures that tell stories of the community's history and beliefs.

### Symbolic Meanings
- **Elephant sculptures** represent strength and wisdom
- **Warrior masks** symbolize courage and protection
- **Animal carvings** connect people with nature

## Basket Weaving Artistry

The art of basket weaving is traditionally practiced by women in the Kikuyu community. Using natural materials like sisal and banana fibers, artisans create functional and decorative pieces.

### Traditional Techniques
- Natural fiber preparation
- Traditional weaving patterns
- Natural dyeing methods

## Preserving the Craft

In today's modern world, it's more important than ever to preserve these traditional crafts. By supporting local artisans, we help keep these cultural traditions alive for future generations.

Each piece you purchase directly supports the artisans and their families, ensuring that these beautiful traditions continue to thrive.`,
        featuredImage: '/picture/caption (18).jpg',
        tags: ['traditional crafts', 'kikuyu culture', 'heritage', 'artisans'],
        isPublished: true,
        publishedAt: new Date('2024-01-15'),
        viewCount: 150
      }
    }),
    prisma.blogPost.upsert({
      where: { slug: 'meet-our-artisans-john-mwangi' },
      update: {},
      create: {
        title: 'Meet Our Artisans: John Mwangi, Master Woodcarver',
        slug: 'meet-our-artisans-john-mwangi',
        excerpt: 'Get to know John Mwangi, a master woodcarver with over 20 years of experience in traditional Kikuyu carving techniques.',
        content: `# Meet Our Artisans: John Mwangi, Master Woodcarver

John Mwangi is one of our most skilled artisans, with over 20 years of experience in traditional Kikuyu wood carving. Based in Nyeri, Kenya, John has dedicated his life to preserving and sharing the ancient art of wood carving.

## A Life Dedicated to Craft

John began learning wood carving at the age of 12, taught by his grandfather who was also a master carver. "Wood carving is not just a skill," John explains, "it's a way of connecting with our ancestors and preserving our culture."

## Traditional Techniques

John uses only traditional tools and techniques:
- Hand-carved chisels made from local materials
- Natural wood stains from tree barks
- Traditional finishing methods

## Signature Pieces

John is particularly known for his elephant sculptures, which have become symbols of strength and wisdom in Kikuyu culture. Each piece takes weeks to complete and is truly one-of-a-kind.

## Supporting the Community

Through his craft, John supports his family and community. He also teaches young people the art of wood carving, ensuring that these traditional skills are passed on to the next generation.

"Every piece I create carries a piece of our culture," John says. "When someone buys my work, they're not just getting a beautiful object – they're becoming part of our story."`,
        featuredImage: '/picture/caption (19).jpg',
        tags: ['artisan spotlight', 'john mwangi', 'wood carving', 'traditional crafts'],
        isPublished: true,
        publishedAt: new Date('2024-01-20'),
        viewCount: 89
      }
    })
  ])

  console.log(`✅ Created ${blogPosts.length} blog posts`)

  // Create sample coupons
  console.log('🎫 Creating sample coupons...')
  const coupons = await Promise.all([
    prisma.coupon.upsert({
      where: { code: 'WELCOME10' },
      update: {},
      create: {
        code: 'WELCOME10',
        type: 'PERCENTAGE',
        value: 10.00,
        minOrderAmount: 50.00,
        maxDiscount: 25.00,
        usageLimit: 100,
        usageCount: 0,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    }),
    prisma.coupon.upsert({
      where: { code: 'SAVE20' },
      update: {},
      create: {
        code: 'SAVE20',
        type: 'FIXED_AMOUNT',
        value: 20.00,
        minOrderAmount: 100.00,
        maxDiscount: 20.00,
        usageLimit: 50,
        usageCount: 0,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
      }
    })
  ])

  console.log(`✅ Created ${coupons.length} sample coupons`)

  console.log('🎉 Database seeding completed successfully!')
  console.log(`
📊 Summary:
- ${categories.length} categories created
- ${artisans.length} artisans created  
- ${products.length} products created
- 1 admin user created
- ${blogPosts.length} blog posts created
- ${coupons.length} coupons created

🔑 Admin Login:
Email: admin@akamba-handicraft.com
Password: admin123

🌐 You can now:
- Create products with valid categories and artisans
- Login to admin panel
- Browse the seeded content
  `)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
