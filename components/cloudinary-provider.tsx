"use client"

export function CloudinaryProvider({ children }: { children: React.ReactNode }) {
  // For next-cloudinary, the context is automatically provided
  // when CldImage components are used, so we don't need a separate provider
  return <>{children}</>
}
