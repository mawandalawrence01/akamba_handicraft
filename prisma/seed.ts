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
