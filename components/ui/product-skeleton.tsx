import { Skeleton } from './skeleton'

export function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Skeleton className="h-6 w-48" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images Skeleton */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              <Skeleton className="w-full h-full" />
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div>
              {/* Badges */}
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
              
              {/* Title */}
              <Skeleton className="h-8 w-3/4 mb-4" />
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-5 w-5" />
                  ))}
                  <Skeleton className="h-4 w-24 ml-2" />
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>

              {/* Description */}
              <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <div className="flex items-center border rounded-lg">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-16" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-12 w-12" />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-6">
          <div className="flex space-x-8 border-b">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-8 w-24" />
            ))}
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  )
}
