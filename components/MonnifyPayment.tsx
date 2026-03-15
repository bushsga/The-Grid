"use client"

import { useState } from "react"

type Props = {
  email: string
  fullName: string
  phone: string
  amount: number
  onSuccess: () => void
  onClose: () => void
  saveOrder: (reference: string) => Promise<void>  // ✅ Add this
}

export default function MonnifyPayment({ 
  email, 
  fullName, 
  phone, 
  amount, 
  onSuccess, 
  onClose,
  saveOrder  // ✅ Add this
}: Props) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    
    const reference = `GRID-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    try {
      // 1️⃣ SAVE ORDER FIRST using the prop from checkout
      await saveOrder(reference)
      console.log("✅ Order saved, now initializing payment...")
      
      // 2️⃣ THEN initialize payment with Monnify
      const res = await fetch("/api/monnify/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount, 
          customerName: fullName, 
          customerEmail: email, 
          customerMobile: phone, 
          reference 
        })
      })

      const data = await res.json()
      
      if (data.checkoutUrl) {
        // Store reference in sessionStorage for success page
        sessionStorage.setItem('pendingPayment', JSON.stringify({
          reference,
          amount,
          customerEmail: email,
          timestamp: Date.now()
        }))
        
        window.location.href = data.checkoutUrl
        onSuccess()
      } else {
        throw new Error(data.error || "Payment initialization failed")
      }
    } catch (error: any) {
      console.error("❌ Payment error:", error)
      alert(error.message || "Something went wrong")
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-[#C8A75B] text-black py-3 font-medium hover:bg-[#b8964a] transition disabled:bg-gray-300"
    >
      {loading ? "Processing..." : `Pay ₦${amount.toLocaleString()}`}
    </button>
  )
}