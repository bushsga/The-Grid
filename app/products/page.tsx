import Container from "@/components/Container"
import Link from "next/link"
import { Battery, Home, Sun, Cpu, ArrowRight } from "lucide-react"

const categories = [
  {
    name: "Portable Power",
    slug: "Portable Power",
    description: "Power banks, solar generators, and portable stations for on-the-go energy",
    icon: Battery,
    productCount: 12
  },
  {
    name: "Home Backup",
    slug: "Home Backup",
    description: "Complete home backup systems, inverters, and battery storage solutions",
    icon: Home,
    productCount: 8
  },
  {
    name: "Solar Panels",
    slug: "Solar Panels",
    description: "High-efficiency solar panels for residential and commercial use",
    icon: Sun,
    productCount: 15
  },
  {
    name: "Smart Tech",
    slug: "Smart Tech",
    description: "Smart home devices, security systems, and energy monitors",
    icon: Cpu,
    productCount: 10
  }
]

export default function ProductsPage() {
  return (
    <main className="py-20 bg-gray-50 min-h-screen">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop by Category</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse our premium solar and power solutions by category. Select a category to view available products.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.slug}
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                className="group bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#C8A75B]"
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-[#C8A75B]/10 rounded-lg flex items-center justify-center group-hover:bg-[#C8A75B] transition-colors duration-300">
                    <Icon className="w-8 h-8 text-[#C8A75B] group-hover:text-white transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 group-hover:text-[#C8A75B] transition-colors">
                      {category.name}
                    </h2>
                    <p className="text-gray-600 mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {category.productCount} products
                      </span>
                      <span className="text-[#C8A75B] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Browse Category <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Optional: Featured Categories Banner */}
        <div className="mt-16 bg-[#0B0F19] text-white p-8 rounded-sm">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Need Help Choosing?</h3>
            <p className="text-gray-300 mb-4">
              Not sure which category fits your needs? Contact us for a free consultation.
            </p>
            <Link href="/contact">
              <button className="bg-[#C8A75B] text-black px-6 py-3 font-medium hover:bg-[#b8964a] transition">
                Get Expert Advice
              </button>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  )
}