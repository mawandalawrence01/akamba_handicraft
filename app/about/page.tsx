"use client"

import { motion } from 'framer-motion'
import { Heart, Users, Globe, Award, Target, Eye, Handshake, Leaf } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'

const values = [
  {
    icon: Heart,
    title: 'Cultural Heritage',
    description: 'Preserving and celebrating the rich traditions of the Akamba people through authentic craftsmanship.',
  },
  {
    icon: Users,
    title: 'Community Empowerment',
    description: 'Supporting local artisans and their families by providing fair wages and global market access.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connecting African artistry with art lovers worldwide, building bridges across cultures.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'Using eco-friendly materials and sustainable practices to protect our environment.',
  },
]

const stats = [
  { number: '50+', label: 'Master Artisans' },
  { number: '1,000+', label: 'Happy Customers' },
  { number: '30+', label: 'Countries Reached' },
  { number: '15', label: 'Years Experience' },
]

const timeline = [
  {
    year: '2008',
    title: 'Foundation',
    description: 'Akamba Handicraft Industry Co-operative Society was founded by a group of 12 master artisans in Machakos, Kenya.',
  },
  {
    year: '2012',
    title: 'First International Exhibition',
    description: 'Our first international showcase at the Nairobi Cultural Festival, gaining recognition from global art collectors.',
  },
  {
    year: '2015',
    title: 'Digital Transformation',
    description: 'Launched our first website and began selling authentic artifacts online to customers worldwide.',
  },
  {
    year: '2018',
    title: 'Sustainability Initiative',
    description: 'Implemented our eco-friendly practices and sustainable sourcing program for all materials.',
  },
  {
    year: '2020',
    title: 'Global Expansion',
    description: 'Reached customers in over 30 countries and established partnerships with international galleries.',
  },
  {
    year: '2023',
    title: 'Next Generation Platform',
    description: 'Launched our comprehensive e-commerce platform with enhanced features and global reach.',
  },
]

const team = [
  {
    name: 'Joseph Mwema',
    role: 'Chairman & Founder',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop',
    bio: 'Visionary leader with 20+ years in African arts and crafts industry.',
  },
  {
    name: 'Catherine Musyoki',
    role: 'Head of Artisan Relations',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?q=80&w=300&auto=format&fit=crop',
    bio: 'Cultural expert ensuring authentic representation and fair practices.',
  },
  {
    name: 'Daniel Kiema',
    role: 'Quality Assurance Manager',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    bio: 'Master craftsman overseeing quality standards and authenticity.',
  },
  {
    name: 'Grace Wanjiru',
    role: 'International Sales Director',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop',
    bio: 'Expert in global markets and customer relationship management.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-amber-600 rounded-full blur-xl"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-orange-500 rounded-full blur-lg"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-yellow-500 rounded-full blur-xl"></div>
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-6 bg-amber-100 text-amber-800 border-amber-200">
                  About Akamba Handicraft
                </Badge>
                
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Preserving Culture,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                    Empowering Communities
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                  For over 15 years, we&apos;ve been bridging the gap between traditional African craftsmanship 
                  and the global marketplace, ensuring that the rich cultural heritage of the Akamba people 
                  continues to thrive in the modern world.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/artisans">
                    <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                      Meet Our Artisans
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button size="lg" variant="outline" className="border-amber-200 hover:bg-amber-50">
                      View Our Collection
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full border-0 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                      <Target className="h-6 w-6 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    To preserve and promote the rich cultural heritage of the Akamba people by supporting 
                    traditional artisans, providing them with fair compensation, and connecting their 
                    authentic handcrafted works with art enthusiasts around the world. We strive to 
                    maintain the highest standards of quality while ensuring that each piece tells 
                    the story of our ancestral traditions.
                  </p>
                </Card>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full border-0 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Eye className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    To become the global leader in authentic African handicrafts, creating a sustainable 
                    ecosystem where traditional artisans thrive economically while preserving their 
                    cultural practices for future generations. We envision a world where African art 
                    is celebrated, valued, and accessible to all who appreciate authentic craftsmanship 
                    and cultural diversity.
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Our <span className="text-amber-600">Core Values</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  The principles that guide every decision we make and every relationship we build
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 text-center h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Our <span className="text-amber-600">Journey</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  From humble beginnings to global recognition - the story of our growth
                </p>
              </motion.div>
            </div>

            <div className="max-w-4xl mx-auto">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center mb-12 last:mb-0"
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <Card className="p-6 border-0 shadow-md">
                      <div className="flex items-center mb-3">
                        <Badge className="bg-amber-100 text-amber-800 mr-3">
                          {item.year}
                        </Badge>
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </Card>
                  </div>
                  
                  <div className="flex-shrink-0 w-4 h-4 bg-amber-600 rounded-full mx-4"></div>
                  
                  <div className={`flex-1 ${index % 2 === 0 ? 'pl-8' : 'pr-8'}`}></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Meet Our <span className="text-amber-600">Leadership Team</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  The passionate individuals leading our mission to preserve and promote Akamba heritage
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-amber-600 font-medium mb-3">{member.role}</p>
                      <p className="text-gray-600 text-sm">{member.bio}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-16 md:py-24 bg-gradient-to-r from-amber-600 to-orange-600"
        >
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Join Our Mission
              </h2>
              <p className="text-xl text-amber-100 mb-8">
                Be part of preserving African cultural heritage while supporting local artisans. 
                Every purchase makes a difference in a craftsperson&apos;s life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button size="lg" variant="secondary" className="bg-white text-amber-600 hover:bg-gray-100">
                    <Handshake className="mr-2 h-5 w-5" />
                    Shop Collection
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  )
}
