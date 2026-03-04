"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { useCart } from "@/context/CartContext"
import Container from "@/components/Container"
import PaystackPayment from "@/components/PaystackPayment"
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

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/products")
    }
  }, [items, router])

  if (items.length === 0) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const updateProductStock = async (productId: string, quantityPurchased: number) => {
    try {
      const productRef = doc(db, "products", productId)
      const productSnap = await getDoc(productRef)
      
      if (productSnap.exists()) {
        const currentStock = productSnap.data().stock || 0
        const newStock = Math.max(0, currentStock - quantityPurchased)
        
        await updateDoc(productRef, {
          stock: newStock,
          updatedAt: new Date()
        })
        
        console.log(`✅ Stock updated for ${productId}: ${currentStock} → ${newStock}`)
      }
    } catch (error) {
      console.error("❌ Error updating stock:", error)
    }
  }

  const saveOrderToFirebase = async (paymentReference: string) => {
    try {
      const orderData = {
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state
        },
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity
        })),
        totalAmount: totalPrice,
        paymentReference: paymentReference,
        paymentStatus: "paid",
        orderStatus: "processing",
        waybill: "",
        createdAt: new Date(),
        updatedAt: new Date()
      }

      console.log("📦 Saving order to Firebase:", orderData)
      
      const docRef = await addDoc(collection(db, "orders"), orderData)
      console.log("✅ Order saved with ID:", docRef.id)
      
      // Update inventory for each product
      for (const item of items) {
        await updateProductStock(item.product.id, item.quantity)
      }
      
      clearCart()
      router.push("/checkout/success")
      
    } catch (error) {
      console.error("❌ Error saving order:", error)
    }
  }

  // This function now receives the response from Paystack
  const handlePaymentSuccess = (response: any) => {
    console.log("💰 Payment successful!", response)
    saveOrderToFirebase(response.reference)
  }

  const handlePaymentClose = () => {
    setLoading(false)
    alert("Payment cancelled. You can try again.")
  }

  return (
    <main className="py-20 bg-white min-h-screen">
      <Container>
        <h1 className="text-3xl font-semibold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form - Left Column */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full border p-3 rounded-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border p-3 rounded-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full border p-3 rounded-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Delivery Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full border p-3 rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full border p-3 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full border p-3 rounded-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-3 max-h-96 overflow-auto mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
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

              {/* Payment Button */}
              {!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state ? (
                <button 
                  disabled
                  className="w-full bg-gray-300 text-black py-3 mt-4 font-medium cursor-not-allowed"
                >
                  Complete Form First
                </button>
              ) : (
                <div className="mt-4">
                  <PaystackPayment
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
                <button className="w-full border py-3 mt-4 text-sm hover:bg-gray-100 transition">
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