import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Allow the request to continue
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Public routes that don't require authentication
        const publicRoutes = [
          '/',
          '/products',
          '/categories',
          '/artisans',
          '/blog',
          '/about',
          '/contact',
          '/cart',
          '/checkout',
          '/wishlist',
          '/sign-in',
          '/sign-up',
          '/api/auth',
          '/api/categories',
          '/api/products',
          '/api/artisans',
          '/api/testimonials',
          '/api/social',
        ]

        // Check if the route is public
        const isPublicRoute = publicRoutes.some(route => 
          pathname === route || pathname.startsWith(route + '/')
        )

        // Allow public routes and admin routes (admin has its own auth)
        if (isPublicRoute || pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
          return true
        }

        // For protected routes, require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
