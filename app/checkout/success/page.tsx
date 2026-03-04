import Container from "@/components/Container"
import Link from "next/link"

export default function CheckoutSuccess() {
  return (
    <main className="py-20 bg-white min-h-screen">
      <Container>
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✅</span>
          </div>
          
          <h1 className="text-3xl font-semibold mb-4">
            Order Successful!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. We'll send you a confirmation email shortly.
          </p>
          
          <Link 
            href="/products"
            className="bg-[#C8A75B] text-black px-8 py-3 inline-block hover:bg-[#b8964a] transition"
          >
            Continue Shopping
          </Link>
        </div>
      </Container>
    </main>
  )
}