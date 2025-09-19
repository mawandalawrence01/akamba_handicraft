'use client'

import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GoogleOneTap } from '@/components/auth/google-one-tap'

export default function SignInPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session, router])

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      {/* Google One Tap */}
      <GoogleOneTap 
        onSuccess={() => router.push('/')}
        onError={(error) => console.error('Google One Tap error:', error)}
      />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-amber-600 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-500 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-yellow-500 rounded-full blur-xl"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Back to Home Link */}
        <Link 
          href="/" 
          className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        {/* Welcome Message */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">AH</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Akamba Handicraft</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">
            Sign in to your account to continue exploring authentic African craftsmanship
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            New to Akamba Handicraft?{' '}
            <Link href="/sign-up" className="text-amber-600 hover:text-amber-700 font-medium">
              Create an account
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Why sign in?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
              Save your favorite artifacts to wishlist
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
              Track your orders and shipping
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
              Get personalized recommendations
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
              Access exclusive member benefits
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
