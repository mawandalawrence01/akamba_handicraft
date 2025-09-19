'use client'

import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ArrowLeft, Gift, Star, Users, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GoogleOneTap } from '@/components/auth/google-one-tap'

export default function SignUpPage() {
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

      <div className="w-full max-w-4xl relative">
        {/* Back to Home Link */}
        <Link 
          href="/" 
          className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Benefits */}
          <div className="order-2 lg:order-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">AH</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Akamba Handicraft</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Join Our Community
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Become part of our global community that celebrates authentic African craftsmanship 
              and supports local artisans.
            </p>

            {/* Member Benefits */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Member Benefits</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Gift className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">15% Welcome Discount</h4>
                    <p className="text-gray-600 text-sm">Get 15% off your first order as a new member</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Loyalty Rewards</h4>
                    <p className="text-gray-600 text-sm">Earn points with every purchase and unlock exclusive rewards</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Artisan Stories</h4>
                    <p className="text-gray-600 text-sm">Get exclusive access to artisan stories and behind-the-scenes content</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Free Shipping</h4>
                    <p className="text-gray-600 text-sm">Enjoy free shipping on orders over $100</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 p-6 bg-white/50 backdrop-blur-sm rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-amber-600">5,000+</div>
                  <div className="text-sm text-gray-600">Happy Members</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-600">4.9★</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                <p className="text-gray-600">Start your journey with authentic African art</p>
              </div>

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

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/sign-in" className="text-amber-600 hover:text-amber-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Terms */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="text-amber-600 hover:text-amber-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-amber-600 hover:text-amber-700">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
