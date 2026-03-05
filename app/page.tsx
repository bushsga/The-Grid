import Container from "@/components/Container"
import ProductCard from "@/components/ProductCard"
import Testimonials from "@/components/Testimonials"
import HeroSlideshow from "@/components/HeroSlideshow"
import { getProducts } from "@/lib/getProducts"
import Link from "next/link"

export default async function Home() {
  const allProducts = await getProducts()
  // Show only first 3 products on homepage
  const featuredProducts = allProducts.slice(0, 3)

  return (
    <main className="w-full">

      {/* HERO */}
      <HeroSlideshow />
      {/* TRUST SECTION */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-semibold">500+</div>
              <div className="text-sm text-gray-600">
                Installations Completed
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-semibold">₦2M+</div>
              <div className="text-sm text-gray-600">
                High-End Units Delivered
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-semibold">Nationwide</div>
              <div className="text-sm text-gray-600">
                Delivery Coverage
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-semibold">24/7</div>
              <div className="text-sm text-gray-600">
                Technical Support
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Featured Power Systems
            </h2>
            <p className="text-gray-600 mt-3 max-w-xl">
              Carefully selected premium solar and backup solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              // Show placeholder if no products yet
              <>
                <div className="bg-white p-6 shadow-sm">
                  <div className="h-40 bg-gray-200 mb-4 w-full" />
                  <h3 className="font-medium">EcoFlow Delta Pro</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    High-capacity portable power
                  </p>
                </div>

                <div className="bg-white p-6 shadow-sm">
                  <div className="h-40 bg-gray-200 mb-4 w-full" />
                  <h3 className="font-medium">Hybrid Home Backup System</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Full home solar integration
                  </p>
                </div>

                <div className="bg-white p-6 shadow-sm">
                  <div className="h-40 bg-gray-200 mb-4 w-full" />
                  <h3 className="font-medium">Smart Security Setup</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    CCTV & smart monitoring
                  </p>
                </div>
              </>
            )}
          </div>
        </Container>
      </section>

 {/* WHY CHOOSE US SECTION - REPLACES INSTALLATION SHOWCASE */}
<section className="py-24 bg-white">
  <Container>
    <div className="text-center mb-12">
      <h2 className="text-3xl font-semibold">Why Choose THE GRID</h2>
      <p className="text-gray-600 mt-3 max-w-xl mx-auto">
        We don't just sell equipment; we sell the comfort of uninterrupted power.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      {/* Left side - Image */}
      <div className="h-96 bg-gray-200 w-full rounded-sm overflow-hidden">
        <img 
          src="/images/solar-5.jpg" 
          alt="Solar Installation"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Why Choose Us points */}
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-[#C8A75B]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#C8A75B] text-xl">✓</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Reliability (Tested & Trusted)</h3>
            <p className="text-gray-600">
              We only stock and install products guaranteed to deliver long-term performance.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-12 h-12 bg-[#C8A75B]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#C8A75B] text-xl">✓</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Excellence</h3>
            <p className="text-gray-600">
              From our neat, modern installations to our high-end showroom, we maintain premium standards in everything we do.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-12 h-12 bg-[#C8A75B]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#C8A75B] text-xl">✓</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
            <p className="text-gray-600">
              Distance is never a barrier; we ensure fast, secure, and guaranteed nationwide delivery.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-12 h-12 bg-[#C8A75B]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#C8A75B] text-xl">✓</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Customer Peace of Mind</h3>
            <p className="text-gray-600">
              We don't just sell equipment; we sell the comfort of uninterrupted power and zero generator stress.
            </p>
          </div>
        </div>

        <Link href="/contact">
          <button className="mt-6 bg-[#C8A75B] text-black px-8 py-3 text-sm font-medium hover:bg-[#b8964a] transition">
            Book Installation
          </button>
        </Link>
      </div>
    </div>
  </Container>
</section>
      <Testimonials />

      {/* WATT CALCULATOR CTA */}
      <section className="py-20 bg-[#0B0F19] text-white text-center">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Not Sure What System You Need?
          </h2>

          <p className="mt-4 text-gray-300 text-sm sm:text-base">
            Use our smart watt calculator to estimate the right solar capacity
            for your home or business.
          </p>

         <Link href="/calculator">
  <button className="mt-8 bg-[#C8A75B] text-black px-8 py-3 text-sm font-medium w-full sm:w-auto">
    Calculate My Power Needs
  </button>
</Link>
        </Container>
      </section>

    </main>
  )
}
