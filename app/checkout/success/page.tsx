"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Container from "@/components/Container"

// Main component that uses useSearchParams
function SuccessContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('paymentReference') || searchParams.get('reference')

  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">✅</span>
      </div>
      <h1 className="text-3xl font-semibold mb-4">Payment Successful!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase. We'll send you a confirmation email shortly.
        {reference && <><br />Reference: <span className="font-mono">{reference}</span></>}
      </p>
      <Link 
        href="/products"
        className="bg-[#C8A75B] text-black px-8 py-3 inline-block hover:bg-[#b8964a] transition"
      >
        Continue Shopping
      </Link>
    </div>
  )
}

// Loading fallback
function SuccessLoading() {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">⏳</span>
      </div>
      <h1 className="text-3xl font-semibold mb-4">Loading...</h1>
    </div>
  )
}

export default function CheckoutSuccess() {
  return (
    <main className="py-20 bg-white min-h-screen">
      <Container>
        <Suspense fallback={<SuccessLoading />}>
          <SuccessContent />
        </Suspense>
      </Container>
    </main>
  )
}