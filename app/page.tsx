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

      {/* INSTALLATION SHOWCASE */}
{/* INSTALLATION SHOWCASE */}
<section className="py-24 bg-white">
  <Container>
    <div className="grid md:grid-cols-2 gap-12 items-center">
      
      <div>
        <h2 className="text-3xl font-semibold">
          Professional Solar Installation
        </h2>

        <p className="mt-6 text-gray-600 leading-relaxed">
          Our certified engineers design and install high-performance
          solar systems tailored to your energy needs. From luxury homes
          to corporate offices, we deliver clean, uninterrupted power.
        </p>

        <ul className="mt-6 space-y-3 text-sm text-gray-700">
          <li>✔ Site inspection & energy audit</li>
          <li>✔ Premium components</li>
          <li>✔ Structured wiring & safety compliance</li>
          <li>✔ Post-installation technical support</li>
        </ul>

        <Link href="/contact">
          <button className="mt-8 bg-[#C8A75B] text-black px-6 py-3 text-sm font-medium">
            Book Installation
          </button>
        </Link>
      </div>

      {/* Image Side - NOW WITH solar-5.jpg */}
      <div className="h-80 bg-gray-200 w-full relative overflow-hidden rounded-sm">
        <img 
          src="/images/solar-5.jpg" 
          alt="Solar Installation" 
          className="w-full h-full object-cover"
        />
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
