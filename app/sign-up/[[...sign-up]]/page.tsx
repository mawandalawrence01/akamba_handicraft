import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft, Gift, Star, Users, Truck } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
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

              <SignUp 
                appearance={{
                  elements: {
                    formButtonPrimary: 
                      'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white',
                    socialButtonsBlockButton:
                      'border-gray-200 hover:bg-gray-50',
                    card: 'shadow-none',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    socialButtonsBlockButtonText: 'font-medium',
                    formFieldInput: 'border-gray-200 focus:border-amber-500 focus:ring-amber-500',
                    footerActionLink: 'text-amber-600 hover:text-amber-700',
                  },
                }}
                redirectUrl="/dashboard"
                signInUrl="/sign-in"
              />

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
