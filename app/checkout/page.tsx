"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { useCart } from "@/context/CartContext"
import Container from "@/components/Container"
import MonnifyPayment from "@/components/MonnifyPayment"
import Link from "next/link"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: ""
  })

  useEffect(() => {
    if (items.length === 0) {
      router.push("/products")
    }
  }, [items, router])

  if (items.length === 0) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const saveOrderToFirebase = async (paymentReference: string) => {
    try {
      const orderData = {
        customer: formData,
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity
        })),
        totalAmount: totalPrice,
        paymentReference: paymentReference,
        paymentStatus: "pending", // Will be updated by webhook
        orderStatus: "processing",
        waybill: "",
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await addDoc(collection(db, "orders"), orderData)
      console.log("Order saved with reference:", paymentReference)
      
      // Don't clear cart yet - wait for webhook confirmation
      // clearCart()
      
    } catch (error) {
      console.error("Error saving order:", error)
    }
  }

  const handlePaymentSuccess = () => {
    console.log("Redirecting to Monnify...")
    // Don't do anything else - redirect happens automatically
  }

  const handlePaymentClose = () => {
    alert("Payment cancelled. You can try again.")
  }

  return (
    <main className="py-20 bg-white min-h-screen">
      <Container>
        <h1 className="text-3xl font-semibold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="w-full border p-3 rounded-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full border p-3 rounded-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full border p-3 rounded-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Delivery Address *</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="w-full border p-3 rounded-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full border p-3 rounded-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} required className="w-full border p-3 rounded-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 max-h-96 overflow-auto mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>₦{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {!formData.fullName || !formData.email || !formData.phone ? (
                <button disabled className="w-full bg-gray-300 text-black py-3 mt-4 cursor-not-allowed">
                  Complete Form First
                </button>
              ) : (
                <div className="mt-4">
                  <MonnifyPayment
                    email={formData.email}
                    fullName={formData.fullName}
                    phone={formData.phone}
                    amount={totalPrice}
                    onSuccess={handlePaymentSuccess}
                    onClose={handlePaymentClose}
                  />
                </div>
              )}

              <Link href="/cart">
                <button className="w-full border py-3 mt-4 text-sm hover:bg-gray-100">
                  Return to Cart
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}