"use client"

import { useState } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { useCart } from "@/context/CartContext"

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
  const { items, clearCart } = useCart()

  const saveOrderToFirebase = async (reference: string) => {
    try {
      const orderData = {
        customer: {
          name: fullName,
          email: email,
          phone: phone
        },
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity
        })),
        totalAmount: amount,
        paymentReference: reference,
        paymentStatus: "pending",
        orderStatus: "processing",
        waybill: "",
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const docRef = await addDoc(collection(db, "orders"), orderData)
      console.log("✅ Order saved with reference:", reference, "ID:", docRef.id)
      return docRef.id
    } catch (error) {
      console.error("❌ Error saving order:", error)
      throw error
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    
    // Generate reference BEFORE saving
    const reference = `GRID-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    try {
      // 1️⃣ SAVE ORDER FIRST (with pending status)
      await saveOrderToFirebase(reference)
      
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