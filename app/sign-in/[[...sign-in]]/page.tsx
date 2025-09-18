import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
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

        {/* Clerk Sign In Component */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <SignIn 
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
            signUpUrl="/sign-up"
          />
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
