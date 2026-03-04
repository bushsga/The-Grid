import Container from "@/components/Container"
import { Zap, Shield, Clock, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="py-20 bg-white">
      <Container>
        {/* Hero with Image */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold mb-6">
              Powering Nigeria's Future
            </h1>
            <p className="text-gray-600 text-lg">
              THE GRID is Nigeria's premier solar and power solutions provider,
              delivering premium energy independence to homes and businesses since 2020.
            </p>
          </div>
          
          {/* About Image - solar-4.png */}
          <div className="h-80 bg-gray-200 w-full relative overflow-hidden rounded-sm">
            <img 
              src="/images/solar-4.jpg" 
              alt="Solar Installation" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#C8A75B]">500+</div>
            <div className="text-sm text-gray-600">Installations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#C8A75B]">₦2B+</div>
            <div className="text-sm text-gray-600">In Sales</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#C8A75B]">15+</div>
            <div className="text-sm text-gray-600">Cities Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#C8A75B]">24/7</div>
            <div className="text-sm text-gray-600">Support</div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              To provide reliable, affordable, and sustainable solar energy solutions
              that empower Nigerian homes and businesses to thrive without grid dependency.
            </p>
            <p className="text-gray-600">
              We believe in a future where clean energy is accessible to all,
              and we're building the infrastructure to make it happen.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 text-center">
              <Zap className="w-8 h-8 text-[#C8A75B] mx-auto mb-2" />
              <h3 className="font-medium">Fast Installation</h3>
            </div>
            <div className="bg-gray-50 p-4 text-center">
              <Shield className="w-8 h-8 text-[#C8A75B] mx-auto mb-2" />
              <h3 className="font-medium">5-Year Warranty</h3>
            </div>
            <div className="bg-gray-50 p-4 text-center">
              <Clock className="w-8 h-8 text-[#C8A75B] mx-auto mb-2" />
              <h3 className="font-medium">24/7 Support</h3>
            </div>
            <div className="bg-gray-50 p-4 text-center">
              <Heart className="w-8 h-8 text-[#C8A75B] mx-auto mb-2" />
              <h3 className="font-medium">Customer First</h3>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gray-50 p-12">
          <h2 className="text-2xl font-semibold mb-4">Ready to Go Solar?</h2>
          <p className="text-gray-600 mb-6">
            Join hundreds of satisfied customers enjoying clean, reliable power.
          </p>
          <Link href="/contact">
            <button className="bg-[#C8A75B] text-black px-8 py-3 font-medium hover:bg-[#b8964a] transition">
              Get Your Free Consultation
            </button>
          </Link>
        </div>
      </Container>
    </main>
  )
}