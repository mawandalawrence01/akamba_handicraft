import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/products(.*)',
  '/categories(.*)',
  '/artisans(.*)',
  '/blog(.*)',
  '/about',
  '/contact',
  '/api/webhooks(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/admin(.*)', // Allow admin routes to handle their own auth
  '/api/admin(.*)', // Allow admin API routes to handle their own auth
])

export default clerkMiddleware((auth, req) => {
  // Allow public routes (including admin routes)
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // For protected routes, check Clerk authentication
  const { userId } = auth()
  if (!userId) {
    return Response.redirect(new URL('/sign-in', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
