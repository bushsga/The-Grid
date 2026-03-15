// app/checkout/success/page.tsx
"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Container from "@/components/Container"
import { useCart } from "@/context/CartContext"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore"

// Create a client component that uses useSearchParams
function SuccessContent() {
  const [status, setStatus] = useState("loading")
  const searchParams = useSearchParams()
  const reference = searchParams.get('paymentReference') || searchParams.get('reference')
  const { clearCart } = useCart()

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus("no-reference")
        return
      }

      try {
        const pendingStr = sessionStorage.getItem('pendingPayment')
        if (pendingStr) {
          const pending = JSON.parse(pendingStr)
          
          const ordersRef = collection(db, "orders")
          const q = query(ordersRef, where("paymentReference", "==", pending.reference))
          const querySnapshot = await getDocs(q)
          
          if (!querySnapshot.empty) {
            const orderDoc = querySnapshot.docs[0]
            await updateDoc(orderDoc.ref, {
              paymentStatus: "paid",
              updatedAt: new Date()
            })
          }
          
          sessionStorage.removeItem('pendingPayment')
          clearCart()
        }
        
        setStatus("success")
      } catch (error) {
        console.error("Error verifying payment:", error)
        setStatus("error")
      }
    }

    verifyPayment()
  }, [reference, clearCart])

  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      {status === "loading" && (
        <>
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⏳</span>
          </div>
          <h1 className="text-3xl font-semibold mb-4">Verifying Payment...</h1>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✅</span>
          </div>
          <h1 className="text-3xl font-semibold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your cart has been cleared.
            {reference && <><br />Reference: <span className="font-mono">{reference}</span></>}
          </p>
        </>
      )}

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

// Main page component with Suspense boundary
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