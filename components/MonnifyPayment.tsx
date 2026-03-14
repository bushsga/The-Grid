"use client"

import { useState } from "react"

type Props = {
  email: string
  fullName: string
  phone: string
  amount: number
  onSuccess: () => void
  onClose: () => void
}

export default function MonnifyPayment({ email, fullName, phone, amount, onSuccess, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setLoading(true)
    setError(null)
    
    const reference = `GRID-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    try {
      console.log("🚀 Starting payment with reference:", reference)
      
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

      // Check if response is ok
      if (!res.ok) {
        const errorText = await res.text()
        console.error("❌ Server response not OK:", res.status, errorText)
        throw new Error(`Server error: ${res.status}`)
      }

      // Try to parse JSON
      let data
      try {
        data = await res.json()
      } catch (parseError) {
        console.error("❌ Failed to parse JSON response:", parseError)
        throw new Error("Invalid response from server")
      }
      
      if (data.checkoutUrl) {
        // Store reference in sessionStorage before redirect
        sessionStorage.setItem('pendingPayment', JSON.stringify({
          reference,
          amount,
          customerEmail: email,
          timestamp: Date.now()
        }))
        
        console.log("✅ Redirecting to:", data.checkoutUrl)
        window.location.href = data.checkoutUrl
        onSuccess()
      } else {
        throw new Error(data.error || "Payment initialization failed")
      }
    } catch (error: any) {
      console.error("❌ Payment error:", error)
      setError(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-3 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded">
          ⚠️ {error}
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-[#C8A75B] text-black py-3 font-medium hover:bg-[#b8964a] transition disabled:bg-gray-300"
      >
        {loading ? "Processing..." : `Pay ₦${amount.toLocaleString()}`}
      </button>
    </div>
  )
}