#!/bin/bash

# Setup script for Cloudinary integration
echo "Setting up Cloudinary for Akamba Handicraft..."

# Create .env.local file with Cloudinary configuration
cat > .env.local << EOF
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dgyrfetyu
CLOUDINARY_API_KEY=572745581978517
CLOUDINARY_API_SECRET=MhhYh7bm4X-g-CZKsc-cvxlSd6Q
CLOUDINARY_URL=cloudinary://572745581978517:MhhYh7bm4X-g-CZKsc-cvxlSd6Q@dgyrfetyu

# Add your other environment variables here
# DATABASE_URL="postgresql://username:password@localhost:5432/akamba_handicraft"
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="your-nextauth-secret-key"
# JWT_SECRET="your-jwt-secret-key"
EOF

echo "✅ Created .env.local file with Cloudinary configuration"
echo ""
echo "📋 Next steps:"
echo "1. Add your other environment variables to .env.local"
echo "2. Set up the same environment variables in Vercel:"
echo "   - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dgyrfetyu"
echo "   - CLOUDINARY_API_KEY=572745581978517"
echo "   - CLOUDINARY_API_SECRET=MhhYh7bm4X-g-CZKsc-cvxlSd6Q"
echo "   - CLOUDINARY_URL=cloudinary://572745581978517:MhhYh7bm4X-g-CZKsc-cvxlSd6Q@dgyrfetyu"
echo ""
echo "3. Create an upload preset in Cloudinary:"
echo "   - Go to https://cloudinary.com/console/settings/upload"
echo "   - Create a new upload preset named 'akamba_handicraft'"
echo "   - Set it to 'Unsigned' for public uploads"
echo ""
echo "4. Test the upload functionality in your admin panel"
echo ""
echo "🚀 Your upload functionality should now work on both development and production!"
