import { Header } from '@/components/layout/header'
import { Hero } from '@/components/sections/hero'
import { FeaturedProducts } from '@/components/sections/featured-products'
import { Categories } from '@/components/sections/categories'
import { Testimonials } from '@/components/sections/testimonials'
import { Newsletter } from '@/components/sections/newsletter'
import { Footer } from '@/components/layout/footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <Categories />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}