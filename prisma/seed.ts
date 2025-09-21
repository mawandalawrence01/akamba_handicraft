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
        isActive: true,
        sortOrder: 6
      }
    }),
    prisma.category.upsert({
      where: { slug: 'bowls' },
      update: {},
      create: {
        name: 'Bowls',
        slug: 'bowls',
        description: 'Functional and decorative serving pieces perfect for modern homes',
        isActive: true,
        sortOrder: 7
      }
    }),
    prisma.category.upsert({
      where: { slug: 'furniture' },
      update: {},
      create: {
        name: 'Furniture',
        slug: 'furniture',
        description: 'Beautiful, functional furniture pieces including stools, chairs, and tables',
        isActive: true,
        sortOrder: 8
      }
    }),
    prisma.category.upsert({
      where: { slug: 'musical-instruments' },
      update: {},
      create: {
        name: 'Musical Instruments',
        slug: 'musical-instruments',
        description: 'Traditional African musical instruments including drums, rattles, and string instruments',
        isActive: true,
        sortOrder: 9
      }
    }),
    prisma.category.upsert({
      where: { slug: 'home-decor' },
      update: {},
      create: {
        name: 'Home Décor',
        slug: 'home-decor',
        description: 'Unique decorative pieces to bring African elegance to your home',
        isActive: true,
        sortOrder: 10
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
        phone: '+254 756 789 012',
        location: 'Machakos, Kenya',
        experience: 25,
        specialties: ['Ceremonial Masks', 'Cultural Art', 'Traditional Rituals'],
        isVerified: true,
        isActive: true
      }
    }),
    prisma.artisan.upsert({
      where: { slug: 'peter-kioko' },
      update: {},
      create: {
        name: 'Peter Kioko',
        slug: 'peter-kioko',
        bio: 'Expert in creating beautiful functional pieces that blend traditional craftsmanship with modern utility. Peter\'s bowls are sought after by collectors worldwide.',
        phone: '+254 723 456 789',
        location: 'Mombasa, Kenya',
        experience: 8,
        specialties: ['Functional Art', 'Wooden Bowls', 'Kitchen Utensils'],
        isVerified: true,
        isActive: true
      }
    }),
    prisma.artisan.upsert({
      where: { slug: 'grace-muthoni' },
      update: {},
      create: {
        name: 'Grace Muthoni',
        slug: 'grace-muthoni',
        bio: 'Perfectionist artist known for her detailed animal sculptures and miniature masterpieces. Grace\'s work captures the essence of African wildlife.',
        phone: '+254 734 567 890',
        location: 'Nairobi, Kenya',
        experience: 10,
        specialties: ['Animal Sculptures', 'Miniature Art', 'Gift Items'],
        isVerified: true,
        isActive: true
      }
    }),
    prisma.artisan.upsert({
      where: { slug: 'samuel-musya' },
      update: {},
      create: {
        name: 'Samuel Musya',
        slug: 'samuel-musya',
        bio: 'Veteran artisan with two decades of experience in creating historically significant pieces. Samuel is a living repository of Akamba cultural knowledge.',
        phone: '+254 745 678 901',
        location: 'Machakos, Kenya',
        experience: 20,
        specialties: ['Warrior Masks', 'Historical Pieces', 'Cultural Artifacts'],
        isVerified: true,
        isActive: true
      }
    }),
    prisma.artisan.upsert({
      where: { slug: 'elizabeth-wanza' },
      update: {},
      create: {
        name: 'Elizabeth Wanza',
        slug: 'elizabeth-wanza',
        bio: 'Rising star in furniture design, Elizabeth combines traditional techniques with contemporary aesthetics to create unique home furnishing pieces.',
        phone: '+254 756 789 012',
        location: 'Kitui, Kenya',
        experience: 6,
        specialties: ['Furniture', 'Home Décor', 'Modern Designs'],
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
        artisanId: artisans[0].id // John Mwangi
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
        artisanId: artisans[4].id // Peter Mutua
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
        artisanId: artisans[1].id // Mary Wanjiku
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
        artisanId: artisans[2].id // David Kiprotich
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
        artisanId: artisans[2].id // David Kiprotich
      }
    })
  ])

  console.log(`✅ Created ${products.length} sample products`)

  // Create sample users for reviews and customers
  console.log('👥 Creating sample users...')
  const sampleUsers = await Promise.all([
    // Existing customers with reviews
    prisma.user.upsert({
      where: { email: 'sarah.johnson@email.com' },
      update: {},
      create: {
        id: 'user_sarah_johnson',
        email: 'sarah.johnson@email.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
        city: 'New York',
        country: 'USA',
        loyaltyPoints: 1500,
        isActive: true
      }
    }),
    prisma.user.upsert({
      where: { email: 'michael.chen@email.com' },
      update: {},
      create: {
        id: 'user_michael_chen',
        email: 'michael.chen@email.com',
        firstName: 'Michael',
        lastName: 'Chen',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
        city: 'London',
        country: 'UK',
        loyaltyPoints: 800,
        isActive: true
      }
    }),
    prisma.user.upsert({
      where: { email: 'emma.rodriguez@email.com' },
      update: {},
      create: {
        id: 'user_emma_rodriguez',
        email: 'emma.rodriguez@email.com',
        firstName: 'Emma',
        lastName: 'Rodriguez',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
        city: 'Toronto',
        country: 'Canada',
        loyaltyPoints: 1200,
        isActive: true
      }
    }),
    // VIP Customers
    prisma.user.upsert({
      where: { email: 'grace.akinyi@email.com' },
      update: {},
      create: {
        id: 'user_grace_akinyi',
        email: 'grace.akinyi@email.com',
        firstName: 'Grace',
        lastName: 'Akinyi',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
        city: 'Nairobi',
        country: 'Kenya',
        phone: '+254 712 345 678',
        loyaltyPoints: 2500,
        isActive: true
      }
    }),
    prisma.user.upsert({
      where: { email: 'david.thompson@email.com' },
      update: {},
      create: {
        id: 'user_david_thompson',
        email: 'david.thompson@email.com',
        firstName: 'David',
        lastName: 'Thompson',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
        city: 'Sydney',
        country: 'Australia',
        phone: '+61 412 345 678',
        loyaltyPoints: 1800,
        isActive: true
      }
    }),
    // Regular Customers
    prisma.user.upsert({
      where: { email: 'lisa.wang@email.com' },
      update: {},
      create: {
        id: 'user_lisa_wang',
        email: 'lisa.wang@email.com',
        firstName: 'Lisa',
        lastName: 'Wang',
        image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
        city: 'Singapore',
        country: 'Singapore',
        phone: '+65 8123 4567',
        loyaltyPoints: 600,
        isActive: true
      }
    }),
    prisma.user.upsert({
      where: { email: 'robert.martinez@email.com' },
      update: {},
      create: {
        id: 'user_robert_martinez',
        email: 'robert.martinez@email.com',
        firstName: 'Robert',
        lastName: 'Martinez',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
        city: 'Madrid',
        country: 'Spain',
        phone: '+34 612 345 678',
        loyaltyPoints: 400,
        isActive: true
      }
    }),
    // Prospects (no orders yet)
    prisma.user.upsert({
      where: { email: 'james.wilson@email.com' },
      update: {},
      create: {
        id: 'user_james_wilson',
        email: 'james.wilson@email.com',
        firstName: 'James',
        lastName: 'Wilson',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
        city: 'Chicago',
        country: 'USA',
        phone: '+1 312 555 0123',
        loyaltyPoints: 0,
        isActive: true
      }
    }),
    prisma.user.upsert({
      where: { email: 'maria.garcia@email.com' },
      update: {},
      create: {
        id: 'user_maria_garcia',
        email: 'maria.garcia@email.com',
        firstName: 'Maria',
        lastName: 'Garcia',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
        city: 'Barcelona',
        country: 'Spain',
        phone: '+34 612 345 679',
        loyaltyPoints: 0,
        isActive: true
      }
    }),
    prisma.user.upsert({
      where: { email: 'john.mwangi@email.com' },
      update: {},
      create: {
        id: 'user_john_mwangi',
        email: 'john.mwangi@email.com',
        firstName: 'John',
        lastName: 'Mwangi',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
        city: 'Nairobi',
        country: 'Kenya',
        phone: '+254 723 456 789',
        loyaltyPoints: 0,
        isActive: true
      }
    }),
    // Inactive customers
    prisma.user.upsert({
      where: { email: 'peter.kimani@email.com' },
      update: {},
      create: {
        id: 'user_peter_kimani',
        email: 'peter.kimani@email.com',
        firstName: 'Peter',
        lastName: 'Kimani',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3',
        city: 'Kisumu',
        country: 'Kenya',
        phone: '+254 734 567 890',
        loyaltyPoints: 200,
        isActive: false
      }
    })
  ])

  console.log(`✅ Created ${sampleUsers.length} sample users`)

  // Create sample reviews
  console.log('⭐ Creating sample reviews...')
  const reviews = await Promise.all([
    // Sarah Johnson reviews
    prisma.review.upsert({
      where: { 
        userId_productId: {
          userId: sampleUsers[0].id,
          productId: products[0].id
        }
      },
      update: {},
      create: {
        rating: 5,
        title: 'Absolutely stunning craftsmanship!',
        content: 'The elephant sculpture I purchased is absolutely stunning! The craftsmanship is incredible and it arrived safely packaged. This piece has become the centerpiece of my living room.',
        isVerified: true,
        isActive: true,
        userId: sampleUsers[0].id,
        productId: products[0].id
      }
    }),
    prisma.review.upsert({
      where: { 
        userId_productId: {
          userId: sampleUsers[0].id,
          productId: products[3].id
        }
      },
      update: {},
      create: {
        rating: 5,
        title: 'Beautiful traditional jewelry',
        content: 'The necklace is beautifully crafted with attention to detail. The traditional patterns are authentic and the quality is excellent. Perfect for special occasions.',
        isVerified: true,
        isActive: true,
        userId: sampleUsers[0].id,
        productId: products[3].id
      }
    }),
    // Michael Chen reviews
    prisma.review.upsert({
      where: { 
        userId_productId: {
          userId: sampleUsers[1].id,
          productId: products[1].id
        }
      },
      update: {},
      create: {
        rating: 5,
        title: 'Outstanding quality and authentic artistry',
        content: 'Outstanding quality and authentic African artistry. The shipping was fast and the customer service was exceptional. I will definitely be ordering more pieces for my collection.',
        isVerified: true,
        isActive: true,
        userId: sampleUsers[1].id,
        productId: products[1].id
      }
    }),
    prisma.review.upsert({
      where: { 
        userId_productId: {
          userId: sampleUsers[1].id,
          productId: products[0].id
        }
      },
      update: {},
      create: {
        rating: 5,
        title: 'Incredible attention to detail',
        content: 'The elephant carving exceeded all my expectations. The wood grain is beautiful and the carving is so detailed. It\'s clear this was made by a master craftsman.',
        isVerified: true,
        isActive: true,
        userId: sampleUsers[1].id,
        productId: products[0].id
      }
    }),
    // Emma Rodriguez reviews
    prisma.review.upsert({
      where: { 
        userId_productId: {
          userId: sampleUsers[2].id,
          productId: products[2].id
        }
      },
      update: {},
      create: {
        rating: 5,
        title: 'Beautiful and functional',
        content: 'Each piece tells a story and you can feel the love and skill that went into creating it. The wooden bowl I ordered is both beautiful and functional. Highly recommended!',
        isVerified: true,
        isActive: true,
        userId: sampleUsers[2].id,
        productId: products[2].id
      }
    }),
    prisma.review.upsert({
      where: { 
        userId_productId: {
          userId: sampleUsers[2].id,
          productId: products[1].id
        }
      },
      update: {},
      create: {
        rating: 4,
        title: 'Authentic cultural piece',
        content: 'The ceremonial mask is a beautiful addition to my collection. The craftsmanship is authentic and the colors are vibrant. It arrived well-packaged and in perfect condition.',
        isVerified: true,
        isActive: true,
        userId: sampleUsers[2].id,
        productId: products[1].id
      }
    }),
    // Grace Akinyi reviews (VIP customer)
    prisma.review.upsert({
      where: { 
        userId_productId: {
          userId: sampleUsers[3].id,
          productId: products[0].id
        }
      },
      update: {},
      create: {
        rating: 5,
        title: 'Perfect representation of our culture',
        content: 'As a Kenyan, I\'m proud to see our traditional crafts being shared with the world. This elephant carving is exceptional and represents our culture beautifully.',
        isVerified: true,
        isActive: true,
        userId: sampleUsers[3].id,
        productId: products[0].id
      }
    }),
    prisma.review.upsert({
      where: { 
        userId_productId: {
          userId: sampleUsers[3].id,
          productId: products[2].id
        }
      },
      update: {},
      create: {
        rating: 5,
        title: 'Traditional craftsmanship at its finest',
        content: 'The basket weaving technique is exactly as I remember from my grandmother\'s time. The quality is outstanding and it\'s being used daily in my kitchen.',
        isVerified: true,
        isActive: true,
        userId: sampleUsers[3].id,
        productId: products[2].id
      }
    }),
    // David Thompson reviews
    prisma.review.upsert({
      where: { 
        userId_productId: {
          userId: sampleUsers[4].id,
          productId: products[1].id
        }
      },
      update: {},
      create: {
        rating: 5,
        title: 'Amazing experience from start to finish',
        content: 'The giraffe sculpture exceeded my expectations and arrived in perfect condition. The attention to detail is remarkable and it\'s become a conversation piece in my home.',
        isVerified: true,
        isActive: true,
        userId: sampleUsers[4].id,
        productId: products[1].id
      }
    }),
    // Lisa Wang reviews
    prisma.review.upsert({
      where: { 
        userId_productId: {
          userId: sampleUsers[5].id,
          productId: products[3].id
        }
      },
      update: {},
      create: {
        rating: 5,
        title: 'The authenticity and quality is unmatched',
        content: 'I love knowing that my purchase supports skilled artisans and preserves traditional craftsmanship. The jewelry set is beautiful and well-made.',
        isVerified: true,
        isActive: true,
        userId: sampleUsers[5].id,
        productId: products[3].id
      }
    }),
    // Robert Martinez reviews
    prisma.review.upsert({
      where: { 
        userId_productId: {
          userId: sampleUsers[6].id,
          productId: products[1].id
        }
      },
      update: {},
      create: {
        rating: 5,
        title: 'Incredible craftsmanship and beautiful pieces',
        content: 'The mask I ordered is a work of art that brings cultural richness to my home. The shipping to Europe was surprisingly quick!',
        isVerified: true,
        isActive: true,
        userId: sampleUsers[6].id,
        productId: products[1].id
      }
    })
  ])

  console.log(`✅ Created ${reviews.length} sample reviews`)

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

  // Create sample orders for analytics
  console.log('📦 Creating sample orders...')
  const orders = await Promise.all([
    // Recent orders for analytics
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-001',
        status: 'DELIVERED',
        totalAmount: 189.98,
        subtotalAmount: 179.98,
        taxAmount: 10.00,
        shippingAmount: 0,
        discountAmount: 0,
        currency: 'USD',
        paymentStatus: 'PAID',
        paymentMethod: 'Credit Card',
        shippingFirstName: 'Sarah',
        shippingLastName: 'Johnson',
        shippingEmail: 'sarah.johnson@email.com',
        shippingPhone: '+1 555 123 4567',
        shippingAddress: '123 Main St',
        shippingCity: 'New York',
        shippingState: 'NY',
        shippingPostalCode: '10001',
        shippingCountry: 'USA',
        userId: sampleUsers[0].id,
        createdAt: new Date('2024-01-15T10:30:00Z'),
        items: {
          create: [
            {
              quantity: 1,
              price: 89.99,
              total: 89.99,
              productId: products[0].id
            },
            {
              quantity: 1,
              price: 89.99,
              total: 89.99,
              productId: products[3].id
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-002',
        status: 'SHIPPED',
        totalAmount: 159.99,
        subtotalAmount: 149.99,
        taxAmount: 10.00,
        shippingAmount: 0,
        discountAmount: 0,
        currency: 'USD',
        paymentStatus: 'PAID',
        paymentMethod: 'PayPal',
        shippingFirstName: 'Michael',
        shippingLastName: 'Chen',
        shippingEmail: 'michael.chen@email.com',
        shippingPhone: '+44 20 7946 0958',
        shippingAddress: '456 Oxford St',
        shippingCity: 'London',
        shippingState: 'England',
        shippingPostalCode: 'W1C 1JN',
        shippingCountry: 'UK',
        userId: sampleUsers[1].id,
        createdAt: new Date('2024-01-14T15:45:00Z'),
        items: {
          create: [
            {
              quantity: 1,
              price: 65.00,
              total: 65.00,
              productId: products[1].id
            },
            {
              quantity: 1,
              price: 84.99,
              total: 84.99,
              productId: products[0].id
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-003',
        status: 'PROCESSING',
        totalAmount: 299.97,
        subtotalAmount: 279.97,
        taxAmount: 20.00,
        shippingAmount: 0,
        discountAmount: 0,
        currency: 'USD',
        paymentStatus: 'PAID',
        paymentMethod: 'Credit Card',
        shippingFirstName: 'Emma',
        shippingLastName: 'Rodriguez',
        shippingEmail: 'emma.rodriguez@email.com',
        shippingPhone: '+1 416 555 0123',
        shippingAddress: '789 Queen St',
        shippingCity: 'Toronto',
        shippingState: 'ON',
        shippingPostalCode: 'M5H 2N2',
        shippingCountry: 'Canada',
        userId: sampleUsers[2].id,
        createdAt: new Date('2024-01-13T09:15:00Z'),
        items: {
          create: [
            {
              quantity: 2,
              price: 35.00,
              total: 70.00,
              productId: products[2].id
            },
            {
              quantity: 1,
              price: 65.00,
              total: 65.00,
              productId: products[1].id
            },
            {
              quantity: 1,
              price: 144.97,
              total: 144.97,
              productId: products[0].id
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-004',
        status: 'DELIVERED',
        totalAmount: 89.99,
        subtotalAmount: 79.99,
        taxAmount: 10.00,
        shippingAmount: 0,
        discountAmount: 0,
        currency: 'USD',
        paymentStatus: 'PAID',
        paymentMethod: 'Credit Card',
        shippingFirstName: 'Grace',
        shippingLastName: 'Akinyi',
        shippingEmail: 'grace.akinyi@email.com',
        shippingPhone: '+254 712 345 678',
        shippingAddress: '123 Kileleshwa',
        shippingCity: 'Nairobi',
        shippingState: 'Nairobi',
        shippingPostalCode: '00100',
        shippingCountry: 'Kenya',
        userId: sampleUsers[3].id,
        createdAt: new Date('2024-01-12T14:20:00Z'),
        items: {
          create: [
            {
              quantity: 1,
              price: 89.99,
              total: 89.99,
              productId: products[0].id
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-005',
        status: 'PENDING',
        totalAmount: 199.98,
        subtotalAmount: 189.98,
        taxAmount: 10.00,
        shippingAmount: 0,
        discountAmount: 0,
        currency: 'USD',
        paymentStatus: 'PENDING',
        paymentMethod: 'Credit Card',
        shippingFirstName: 'David',
        shippingLastName: 'Thompson',
        shippingEmail: 'david.thompson@email.com',
        shippingPhone: '+61 412 345 678',
        shippingAddress: '456 George St',
        shippingCity: 'Sydney',
        shippingState: 'NSW',
        shippingPostalCode: '2000',
        shippingCountry: 'Australia',
        userId: sampleUsers[4].id,
        createdAt: new Date('2024-01-11T16:30:00Z'),
        items: {
          create: [
            {
              quantity: 1,
              price: 65.00,
              total: 65.00,
              productId: products[1].id
            },
            {
              quantity: 1,
              price: 124.98,
              total: 124.98,
              productId: products[0].id
            }
          ]
        }
      }
    }),
    // Historical orders for analytics trends
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2023-120',
        status: 'DELIVERED',
        totalAmount: 125.00,
        subtotalAmount: 115.00,
        taxAmount: 10.00,
        shippingAmount: 0,
        discountAmount: 0,
        currency: 'USD',
        paymentStatus: 'PAID',
        paymentMethod: 'Credit Card',
        shippingFirstName: 'Lisa',
        shippingLastName: 'Wang',
        shippingEmail: 'lisa.wang@email.com',
        shippingPhone: '+65 8123 4567',
        shippingAddress: '789 Orchard Rd',
        shippingCity: 'Singapore',
        shippingState: 'Singapore',
        shippingPostalCode: '238863',
        shippingCountry: 'Singapore',
        userId: sampleUsers[5].id,
        createdAt: new Date('2023-12-20T11:00:00Z'),
        items: {
          create: [
            {
              quantity: 1,
              price: 25.00,
              total: 25.00,
              productId: products[3].id
            },
            {
              quantity: 1,
              price: 90.00,
              total: 90.00,
              productId: products[0].id
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2023-115',
        status: 'DELIVERED',
        totalAmount: 89.99,
        subtotalAmount: 79.99,
        taxAmount: 10.00,
        shippingAmount: 0,
        discountAmount: 0,
        currency: 'USD',
        paymentStatus: 'PAID',
        paymentMethod: 'PayPal',
        shippingFirstName: 'Robert',
        shippingLastName: 'Martinez',
        shippingEmail: 'robert.martinez@email.com',
        shippingPhone: '+34 612 345 678',
        shippingAddress: '123 Gran Via',
        shippingCity: 'Madrid',
        shippingState: 'Madrid',
        shippingPostalCode: '28013',
        shippingCountry: 'Spain',
        userId: sampleUsers[6].id,
        createdAt: new Date('2023-12-15T13:45:00Z'),
        items: {
          create: [
            {
              quantity: 1,
              price: 65.00,
              total: 65.00,
              productId: products[1].id
            },
            {
              quantity: 1,
              price: 24.99,
              total: 24.99,
              productId: products[3].id
            }
          ]
        }
      }
    })
  ])

  console.log(`✅ Created ${orders.length} sample orders`)

  // Create additional orders for better analytics
  console.log('📦 Creating additional orders for analytics...')
  const additionalOrders = await Promise.all([
    // More recent orders
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-011',
        status: 'DELIVERED',
        totalAmount: 245.50,
        subtotalAmount: 235.50,
        taxAmount: 10.00,
        shippingAmount: 0,
        discountAmount: 0,
        currency: 'USD',
        paymentStatus: 'PAID',
        paymentMethod: 'Credit Card',
        shippingFirstName: 'Jennifer',
        shippingLastName: 'Brown',
        shippingEmail: 'jennifer.brown@email.com',
        shippingPhone: '+1 555 987 6543',
        shippingAddress: '321 Elm Street',
        shippingCity: 'Los Angeles',
        shippingState: 'CA',
        shippingPostalCode: '90210',
        shippingCountry: 'USA',
        userId: sampleUsers[0].id,
        createdAt: new Date('2024-01-10T14:20:00Z'),
        items: {
          create: [
            {
              quantity: 2,
              price: 89.99,
              total: 179.98,
              productId: products[0].id
            },
            {
              quantity: 1,
              price: 55.52,
              total: 55.52,
              productId: products[1].id
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-012',
        status: 'SHIPPED',
        totalAmount: 89.99,
        subtotalAmount: 79.99,
        taxAmount: 10.00,
        shippingAmount: 0,
        discountAmount: 0,
        currency: 'USD',
        paymentStatus: 'PAID',
        paymentMethod: 'PayPal',
        shippingFirstName: 'Thomas',
        shippingLastName: 'Wilson',
        shippingEmail: 'thomas.wilson@email.com',
        shippingPhone: '+44 20 7946 0959',
        shippingAddress: '789 Baker Street',
        shippingCity: 'London',
        shippingState: 'England',
        shippingPostalCode: 'NW1 6XE',
        shippingCountry: 'UK',
        userId: sampleUsers[1].id,
        createdAt: new Date('2024-01-09T11:30:00Z'),
        items: {
          create: [
            {
              quantity: 1,
              price: 89.99,
              total: 89.99,
              productId: products[0].id
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-013',
        status: 'PROCESSING',
        totalAmount: 175.00,
        subtotalAmount: 165.00,
        taxAmount: 10.00,
        shippingAmount: 0,
        discountAmount: 0,
        currency: 'USD',
        paymentStatus: 'PAID',
        paymentMethod: 'Credit Card',
        shippingFirstName: 'Sophie',
        shippingLastName: 'Martin',
        shippingEmail: 'sophie.martin@email.com',
        shippingPhone: '+33 1 42 86 83 26',
        shippingAddress: '456 Champs-Élysées',
        shippingCity: 'Paris',
        shippingState: 'Île-de-France',
        shippingPostalCode: '75008',
        shippingCountry: 'France',
        userId: sampleUsers[2].id,
        createdAt: new Date('2024-01-08T16:45:00Z'),
        items: {
          create: [
            {
              quantity: 1,
              price: 65.00,
              total: 65.00,
              productId: products[1].id
            },
            {
              quantity: 1,
              price: 35.00,
              total: 35.00,
              productId: products[2].id
            },
            {
              quantity: 1,
              price: 75.00,
              total: 75.00,
              productId: products[3].id
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-014',
        status: 'DELIVERED',
        totalAmount: 320.00,
        subtotalAmount: 300.00,
        taxAmount: 20.00,
        shippingAmount: 0,
        discountAmount: 0,
        currency: 'USD',
        paymentStatus: 'PAID',
        paymentMethod: 'Credit Card',
        shippingFirstName: 'Hiroshi',
        shippingLastName: 'Tanaka',
        shippingEmail: 'hiroshi.tanaka@email.com',
        shippingPhone: '+81 3 1234 5678',
        shippingAddress: '123 Shibuya Crossing',
        shippingCity: 'Tokyo',
        shippingState: 'Tokyo',
        shippingPostalCode: '150-0002',
        shippingCountry: 'Japan',
        userId: sampleUsers[3].id,
        createdAt: new Date('2024-01-07T09:15:00Z'),
        items: {
          create: [
            {
              quantity: 3,
              price: 89.99,
              total: 269.97,
              productId: products[0].id
            },
            {
              quantity: 1,
              price: 50.03,
              total: 50.03,
              productId: products[4].id
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-015',
        status: 'PENDING',
        totalAmount: 125.00,
        subtotalAmount: 115.00,
        taxAmount: 10.00,
        shippingAmount: 0,
        discountAmount: 0,
        currency: 'USD',
        paymentStatus: 'PENDING',
        paymentMethod: 'Credit Card',
        shippingFirstName: 'Isabella',
        shippingLastName: 'Rodriguez',
        shippingEmail: 'isabella.rodriguez@email.com',
        shippingPhone: '+52 55 1234 5678',
        shippingAddress: '789 Reforma Avenue',
        shippingCity: 'Mexico City',
        shippingState: 'CDMX',
        shippingPostalCode: '06600',
        shippingCountry: 'Mexico',
        userId: sampleUsers[4].id,
        createdAt: new Date('2024-01-06T13:20:00Z'),
        items: {
          create: [
            {
              quantity: 2,
              price: 25.00,
              total: 50.00,
              productId: products[3].id
            },
            {
              quantity: 1,
              price: 75.00,
              total: 75.00,
              productId: products[1].id
            }
          ]
        }
      }
    }),
    // Historical orders for better trends
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2023-131',
        status: 'DELIVERED',
        totalAmount: 199.99,
        subtotalAmount: 189.99,
        taxAmount: 10.00,
        shippingAmount: 0,
        discountAmount: 0,
        currency: 'USD',
        paymentStatus: 'PAID',
        paymentMethod: 'Credit Card',
        shippingFirstName: 'Ahmed',
        shippingLastName: 'Hassan',
        shippingEmail: 'ahmed.hassan@email.com',
        shippingPhone: '+971 4 123 4567',
        shippingAddress: '456 Sheikh Zayed Road',
        shippingCity: 'Dubai',
        shippingState: 'Dubai',
        shippingPostalCode: '00000',
        shippingCountry: 'UAE',
        userId: sampleUsers[5].id,
        createdAt: new Date('2023-12-10T10:00:00Z'),
        items: {
          create: [
            {
              quantity: 1,
              price: 89.99,
              total: 89.99,
              productId: products[0].id
            },
            {
              quantity: 1,
              price: 110.00,
              total: 110.00,
              productId: products[1].id
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-2023-132',
        status: 'DELIVERED',
        totalAmount: 89.99,
        subtotalAmount: 79.99,
        taxAmount: 10.00,
        shippingAmount: 0,
        discountAmount: 0,
        currency: 'USD',
        paymentStatus: 'PAID',
        paymentMethod: 'PayPal',
        shippingFirstName: 'Anna',
        shippingLastName: 'Kowalski',
        shippingEmail: 'anna.kowalski@email.com',
        shippingPhone: '+48 22 123 4567',
        shippingAddress: '123 Krakowskie Przedmieście',
        shippingCity: 'Warsaw',
        shippingState: 'Mazovia',
        shippingPostalCode: '00-001',
        shippingCountry: 'Poland',
        userId: sampleUsers[6].id,
        createdAt: new Date('2023-12-05T15:30:00Z'),
        items: {
          create: [
            {
              quantity: 1,
              price: 89.99,
              total: 89.99,
              productId: products[0].id
            }
          ]
        }
      }
    })
  ])

  console.log(`✅ Created ${additionalOrders.length} additional orders`)

  // Create analytics events for tracking
  console.log('📊 Creating analytics events...')
  const analyticsEvents = []
  
  // Generate realistic analytics events with more diversity
  const eventTypes = ['page_view', 'product_view', 'add_to_cart', 'purchase', 'search', 'product_liked', 'product_unliked', 'social_share']
  const countries = ['USA', 'UK', 'Canada', 'Kenya', 'Germany', 'Australia', 'Singapore', 'Spain', 'France', 'Japan', 'Mexico', 'UAE', 'Poland']
  const devices = ['Desktop', 'Mobile', 'Tablet']
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge']
  const pages = ['/', '/products', '/categories', '/about', '/contact', '/cart', '/checkout']
  const referrers = ['google.com', 'facebook.com', 'instagram.com', 'twitter.com', 'direct', 'email', 'organic']
  
  // Generate events over the last 60 days for better trends
  for (let i = 0; i < 2000; i++) {
    const randomDate = new Date()
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 60))
    randomDate.setHours(Math.floor(Math.random() * 24))
    randomDate.setMinutes(Math.floor(Math.random() * 60))
    
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const country = countries[Math.floor(Math.random() * countries.length)]
    const device = devices[Math.floor(Math.random() * devices.length)]
    
    const event = {
      event: eventType,
      properties: {
        page: pages[Math.floor(Math.random() * pages.length)],
        productId: Math.random() > 0.6 ? products[Math.floor(Math.random() * products.length)].id : null,
        category: Math.random() > 0.5 ? categories[Math.floor(Math.random() * categories.length)].name : null,
        country: country,
        device: device,
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        referrer: referrers[Math.floor(Math.random() * referrers.length)],
        searchTerm: eventType === 'search' ? ['elephant', 'mask', 'basket', 'jewelry', 'pottery'][Math.floor(Math.random() * 5)] : null,
        value: eventType === 'purchase' ? Math.floor(Math.random() * 500) + 50 : null
      },
      userId: Math.random() > 0.4 ? sampleUsers[Math.floor(Math.random() * sampleUsers.length)].id : null,
      sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: `Mozilla/5.0 (${device}) AppleWebKit/537.36`,
      timestamp: randomDate
    }
    
    analyticsEvents.push(event)
  }
  
  await prisma.analyticsEvent.createMany({
    data: analyticsEvents
  })

  console.log(`✅ Created ${analyticsEvents.length} analytics events`)

  // Create user sessions for device analytics
  console.log('👤 Creating user sessions...')
  const userSessions = []
  
  // More realistic device distribution (60% mobile, 30% desktop, 10% tablet)
  const deviceDistribution = [
    ...Array(600).fill('Mobile'),
    ...Array(300).fill('Desktop'),
    ...Array(100).fill('Tablet')
  ]
  
  for (let i = 0; i < 1000; i++) {
    const randomDate = new Date()
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 60))
    randomDate.setHours(Math.floor(Math.random() * 24))
    randomDate.setMinutes(Math.floor(Math.random() * 60))
    
    const device = deviceDistribution[Math.floor(Math.random() * deviceDistribution.length)]
    const country = countries[Math.floor(Math.random() * countries.length)]
    
    // More realistic user agents based on device
    let userAgent = ''
    if (device === 'Mobile') {
      const mobileAgents = [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
        'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
      ]
      userAgent = mobileAgents[Math.floor(Math.random() * mobileAgents.length)]
    } else if (device === 'Tablet') {
      const tabletAgents = [
        'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
        'Mozilla/5.0 (Linux; Android 11; SM-T870) AppleWebKit/537.36'
      ]
      userAgent = tabletAgents[Math.floor(Math.random() * tabletAgents.length)]
    } else {
      const desktopAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
      ]
      userAgent = desktopAgents[Math.floor(Math.random() * desktopAgents.length)]
    }
    
    const session = {
      userId: sampleUsers[Math.floor(Math.random() * sampleUsers.length)].id,
      sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: userAgent,
      location: country,
      createdAt: randomDate,
      expiresAt: new Date(randomDate.getTime() + 24 * 60 * 60 * 1000) // 24 hours
    }
    
    userSessions.push(session)
  }
  
  await prisma.userSession.createMany({
    data: userSessions
  })

  console.log(`✅ Created ${userSessions.length} user sessions`)

  // Update product view counts for analytics
  console.log('👁️ Updating product view counts...')
  for (const product of products) {
    const viewCount = Math.floor(Math.random() * 1000) + 100
    const likeCount = Math.floor(Math.random() * 100) + 10
    
    await prisma.product.update({
      where: { id: product.id },
      data: { 
        viewCount,
        likeCount
      }
    })
  }

  console.log('✅ Updated product view counts')

  // Create social shares for analytics
  console.log('📱 Creating social shares...')
  const socialShares = []
  const platforms = ['FACEBOOK', 'TWITTER', 'INSTAGRAM', 'WHATSAPP', 'LINKEDIN', 'PINTEREST', 'EMAIL']
  
  for (let i = 0; i < 200; i++) {
    const randomDate = new Date()
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30))
    
    const share = {
      platform: platforms[Math.floor(Math.random() * platforms.length)] as any,
      url: `https://akamba-handicraft.com/products/${products[Math.floor(Math.random() * products.length)].slug}`,
      title: `Check out this amazing ${products[Math.floor(Math.random() * products.length)].name}`,
      content: 'Beautiful traditional African handicraft!',
      imageUrl: '/placeholder-product.jpg',
      userId: Math.random() > 0.4 ? sampleUsers[Math.floor(Math.random() * sampleUsers.length)].id : null,
      productId: products[Math.floor(Math.random() * products.length)].id,
      createdAt: randomDate
    }
    
    socialShares.push(share)
  }
  
  await prisma.socialShare.createMany({
    data: socialShares
  })

  console.log(`✅ Created ${socialShares.length} social shares`)

  console.log('🎉 Database seeding completed successfully!')
  console.log(`
📊 Summary:
- ${categories.length} categories created
- ${artisans.length} artisans created  
- ${products.length} products created
- ${sampleUsers.length} sample users created
- ${reviews.length} reviews created
- ${orders.length + additionalOrders.length} orders created (${orders.length} original + ${additionalOrders.length} additional)
- ${analyticsEvents.length} analytics events created
- ${userSessions.length} user sessions created
- ${socialShares.length} social shares created
- 1 admin user created
- ${blogPosts.length} blog posts created
- ${coupons.length} coupons created

🔑 Admin Login:
Email: admin@akamba-handicraft.com
Password: admin123

🌐 Enhanced Dashboard Data:
- 📈 2,000 analytics events across 60 days
- 🌍 Orders from 13 different countries
- 📱 Realistic device distribution (60% mobile, 30% desktop, 10% tablet)
- 📊 Diverse event types (page views, purchases, social shares, etc.)
- 💰 Comprehensive revenue data across multiple time periods
- 🎯 Realistic user behavior patterns

🌐 You can now:
- View comprehensive analytics data in admin dashboard
- See detailed Top Countries, Recent Orders, and Device Breakdown
- Analyze sales trends across different time periods
- Track user engagement and behavior patterns
- Create products with valid categories and artisans
- Login to admin panel
- Browse the seeded content with realistic, diverse data
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
