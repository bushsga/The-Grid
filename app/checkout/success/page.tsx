"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Container from "@/components/Container"
import { useCart } from "@/context/CartContext" // ← ADD THIS
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore"

export default function CheckoutSuccess() {
  const [status, setStatus] = useState("loading")
  const searchParams = useSearchParams()
  const reference = searchParams.get('paymentReference') || searchParams.get('reference')
  const { clearCart } = useCart() // ← ADD THIS

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus("no-reference")
        return
      }

      try {
        // Get the pending payment from sessionStorage
        const pendingStr = sessionStorage.getItem('pendingPayment')
        if (pendingStr) {
          const pending = JSON.parse(pendingStr)
          
          // Find and update the order
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
          
          // Clear the pending payment
          sessionStorage.removeItem('pendingPayment')
          
          // ✅ CLEAR THE CART AFTER SUCCESSFUL PAYMENT
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
    <main className="py-20 bg-white min-h-screen">
      <Container>
        <div className="max-w-2xl mx-auto text-center py-20">
          {status === "loading" && (
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⏳</span>
              </div>
              <h1 className="text-3xl font-semibold mb-4">Verifying Payment...</h1>
              <p className="text-gray-600">Please wait while we confirm your payment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">✅</span>
              </div>
              <h1 className="text-3xl font-semibold mb-4">Payment Successful!</h1>
              <p className="text-gray-600 mb-8">
                Thank you for your purchase. We'll send you a confirmation email shortly.
                {reference && <><br />Reference: <span className="font-mono">{reference}</span></>}
              </p>
            </>
          )}

          {status === "no-reference" && (
            <>
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚠️</span>
              </div>
              <h1 className="text-3xl font-semibold mb-4">No Payment Reference</h1>
              <p className="text-gray-600 mb-8">
                We couldn't find your payment reference. Please contact support.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">❌</span>
              </div>
              <h1 className="text-3xl font-semibold mb-4">Verification Error</h1>
              <p className="text-gray-600 mb-8">
                There was an error verifying your payment. Please contact support.
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
      </Container>
    </main>
  )
}