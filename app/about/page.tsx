import Container from "@/components/Container"
import { Zap, Shield, Clock, Heart, Target, Eye } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="py-20 bg-white">
      <Container>
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-semibold mb-6">
            About THE GRID
          </h1>
          <p className="text-gray-600 text-lg">
            Nigeria's most trusted hub for modern, reliable energy and smart technology.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-gray-50 p-8 rounded-sm">
            <Eye className="w-12 h-12 text-[#C8A75B] mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To be Nigeria's most trusted hub for modern, reliable energy and smart technology, 
              empowering homes and businesses to thrive without limits.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-sm">
            <Target className="w-12 h-12 text-[#C8A75B] mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To completely eliminate the stress of power outages and high fuel costs by providing 
              premium, budget-friendly solar solutions and high-quality tech gadgets. At THE GRID, 
              we are dedicated to delivering zero noise, zero fuel, and 100% peace of mind through 
              expert installations, nationwide accessibility, and unmatched customer service.
            </p>
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

        {/* CTA */}
        <div className="text-center bg-gray-50 p-12">
          <h2 className="text-2xl font-semibold mb-4">Ready to Join The Grid?</h2>
          <p className="text-gray-600 mb-6">
            Experience uninterrupted power and energy independence today.
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