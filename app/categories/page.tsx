import Container from "@/components/Container"
import Link from "next/link"
import { 
  Sun, 
  Zap, 
  Battery, 
  Power, 
  Fan, 
  Lightbulb, 
  Smartphone, 
  Shield, 
  ArrowRight 
} from "lucide-react"
import { getProducts } from "@/lib/getProducts"

export default async function CategoriesPage() {
  const products = await getProducts()
  
  const categories = [
    {
      name: "SOLAR PANELS",
      slug: "Solar Panels",
      description: "High-efficiency monofacial and bifacial solar panels for residential and commercial use",
      icon: Sun,
      productCount: products.filter(p => p.category === "Solar Panels").length
    },
    {
      name: "INVERTERS & CONTROLLERS",
      slug: "Inverters & Controllers",
      description: "Standard inverters, hybrid inverters, and charge controllers for reliable power management",
      icon: Zap,
      productCount: products.filter(p => p.category === "Inverters & Controllers").length
    },
    {
      name: "BATTERIES",
      slug: "Batteries",
      description: "Lithium-ion, gel, and deep-cycle batteries for energy storage",
      icon: Battery,
      productCount: products.filter(p => p.category === "Batteries").length
    },
    {
      name: "PORTABLE POWER STATIONS",
      slug: "Portable Power Stations",
      description: "EcoFlow series and portable power stations for on-the-go energy",
      icon: Power,
      productCount: products.filter(p => p.category === "Portable Power Stations").length
    },
    {
      name: "FANS & HOME APPLIANCES",
      slug: "Fans & Home Appliances",
      description: "Rechargeable and solar standing fans, energy-efficient home appliances",
      icon: Fan,
      productCount: products.filter(p => p.category === "Fans & Home Appliances").length
    },
    {
      name: "SOLAR LIGHTING",
      slug: "Solar Lighting",
      description: "Solar street lights, flood lights, and garden lighting solutions",
      icon: Lightbulb,
      productCount: products.filter(p => p.category === "Solar Lighting").length
    },
    {
      name: "GADGETS & ACCESSORIES",
      slug: "Gadgets & Accessories",
      description: "Power banks, solar accessories, cables, and tech gadgets",
      icon: Smartphone,
      productCount: products.filter(p => p.category === "Gadgets & Accessories").length
    },
    {
      name: "INSTALLATION & SECURITY",
      slug: "Installation & Security",
      description: "Solar installation services, security systems, and monitoring solutions",
      icon: Shield,
      productCount: products.filter(p => p.category === "Installation & Security").length
    }
  ]

  return (
    <main className="py-20 bg-gray-50 min-h-screen">
      <Container>
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop by Category</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse our premium solar and power solutions by category. Select a category to view available products.
          </p>
        </div>

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
                  <div className="w-16 h-16 bg-[#C8A75B]/10 rounded-lg flex items-center justify-center group-hover:bg-[#C8A75B] transition-colors duration-300">
                    <Icon className="w-8 h-8 text-[#C8A75B] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 group-hover:text-[#C8A75B] transition-colors">
                      {category.name}
                    </h2>
                    <p className="text-gray-600 mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {category.productCount} product{category.productCount !== 1 ? 's' : ''}
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