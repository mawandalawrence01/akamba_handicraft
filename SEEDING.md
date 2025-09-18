# Database Seeding Guide

This guide explains how to populate the Akamba Handicraft database with sample data.

## Quick Start

To seed the database with sample data, run:

```bash
npm run db:seed
```

To reset the database and reseed:

```bash
npm run db:reset
```

## What Gets Seeded

The seeding process creates:

### Categories (6)
- Sculptures
- Masks  
- Baskets
- Jewelry
- Pottery
- Textiles

### Artisans (5)
- John Mwangi (Master Woodcarver)
- Mary Wanjiku (Basket Weaver)
- David Kiprotich (Potter & Jewelry Maker)
- Grace Akinyi (Contemporary Artist)
- Peter Mutua (Ceremonial Mask Maker)

### Sample Products (5)
- Traditional Elephant Carving
- Ceremonial Warrior Mask
- Handwoven Storage Basket
- Traditional Beaded Necklace
- Traditional Water Pot

### Admin User
- Email: `admin@akamba-handicraft.com`
- Password: `admin123`
- Role: SUPER_ADMIN

### Additional Content
- 2 sample blog posts
- 2 sample discount coupons

## Troubleshooting

### Foreign Key Constraint Errors
If you encounter foreign key constraint errors when creating products:

1. Make sure the database is seeded: `npm run db:seed`
2. Check that categories and artisans exist in the database
3. Verify the product creation form is using valid category and artisan IDs

### Database Connection Issues
Ensure your `.env` file contains a valid `DATABASE_URL`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/akamba_handicraft"
```

### Prisma Client Issues
If you encounter Prisma client issues:

```bash
npx prisma generate
npx prisma db push
```

## Development Workflow

1. **Initial Setup**: Run `npm run db:seed` after setting up the database
2. **Reset Database**: Use `npm run db:reset` to start fresh
3. **Add New Data**: Modify `prisma/seed.ts` to add more sample data
4. **Test Product Creation**: Use the admin panel to create products with the seeded categories and artisans

## File Structure

- `prisma/seed.ts` - Main seeding script
- `prisma/schema.prisma` - Database schema
- `app/api/admin/categories/route.ts` - Categories API
- `app/api/admin/artisans/route.ts` - Artisans API
- `app/api/admin/products/route.ts` - Products API with improved error handling

## Notes

- The seed script uses `upsert` operations, so it's safe to run multiple times
- All seeded data includes realistic descriptions and metadata
- Images reference files in the `public/picture/` directory
- The admin user has full permissions for testing
