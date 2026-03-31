"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Container from "@/components/Container"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react"
import { getOrderById } from "@/lib/getOrders"
import { updateDoc, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string
  
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      const orderData = await getOrderById(orderId)
      if (orderData) {
        setOrder(orderData)
      }
      setLoading(false)
    }
    fetchOrder()
  }, [orderId])

// In the handleCancelOrder function, add stock restoration
const handleCancelOrder = async () => {
  if (!confirm("Are you sure you want to cancel this order? This cannot be undone.")) return
  
  setCancelling(true)
  try {
    // 1️⃣ RESTORE STOCK FOR EACH PRODUCT
    for (const item of order.items) {
      const productRef = doc(db, "products", item.productId)
      const productSnap = await getDoc(productRef)
      
      if (productSnap.exists()) {
        const currentStock = productSnap.data().stock || 0
        const newStock = currentStock + item.quantity // ✅ Add back the quantity
        
        await updateDoc(productRef, {
          stock: newStock,
          updatedAt: new Date()
        })
        console.log(`✅ Stock restored for ${item.productId}: ${currentStock} → ${newStock}`)
      }
    }
    
    // 2️⃣ UPDATE ORDER STATUS
    const orderRef = doc(db, "orders", orderId)
    await updateDoc(orderRef, {
      orderStatus: "cancelled",
      updatedAt: new Date()
    })
    
    setOrder({ ...order, orderStatus: "cancelled" })
    alert("Order cancelled and stock restored successfully")
  } catch (error) {
    console.error("Error cancelling order:", error)
    alert("Failed to cancel order")
  } finally {
    setCancelling(false)
  }
}

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'processing': return <Clock className="w-8 h-8 text-yellow-500" />
      case 'shipped': return <Truck className="w-8 h-8 text-blue-500" />
      case 'delivered': return <CheckCircle className="w-8 h-8 text-green-500" />
      case 'cancelled': return <XCircle className="w-8 h-8 text-red-500" />
      default: return <Package className="w-8 h-8 text-gray-500" />
    }
  }

  const canCancel = order && order.orderStatus === 'processing'

  if (loading) {
    return (
      <main className="py-20 bg-white min-h-screen">
        <Container>
          <div className="text-center py-20">Loading order details...</div>
        </Container>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="py-20 bg-white min-h-screen">
        <Container>
          <div className="text-center py-20">
            <h1 className="text-2xl font-semibold mb-4">Order Not Found</h1>
            <Link href="/my-orders" className="text-[#C8A75B] underline">
              Back to My Orders
            </Link>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="py-20 bg-gray-50 min-h-screen">
      <Container>
        <Link href="/my-orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#C8A75B] mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <div className="bg-white p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-2">Order Details</h1>
              <p className="text-sm text-gray-500">Reference: {order.paymentReference}</p>
              <p className="text-xs text-gray-400">Placed on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusIcon(order.orderStatus)}
              <span className="capitalize font-medium">{order.orderStatus}</span>
            </div>
          </div>

          {order.waybill && (
            <div className="bg-blue-50 p-4 mb-6">
              <p className="text-sm font-medium">Tracking Information</p>
              <p className="text-sm">Waybill Number: <span className="font-mono">{order.waybill}</span></p>
            </div>
          )}

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₦{item.total.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t text-right">
              <p className="text-xl font-bold">Total: ₦{order.totalAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="border-t mt-6 pt-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
            <p className="text-gray-700">{order.customer.name}</p>
            <p className="text-gray-700">{order.customer.address}</p>
            <p className="text-gray-700">{order.customer.city}, {order.customer.state}</p>
            <p className="text-gray-700 mt-2">📞 {order.customer.phone}</p>
            <p className="text-gray-700">📧 {order.customer.email}</p>
          </div>

          {canCancel && (
            <div className="border-t mt-6 pt-6">
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="bg-red-500 text-white px-6 py-2 rounded-sm hover:bg-red-600 transition disabled:bg-gray-300"
              >
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Cancel only available for orders still processing
              </p>
            </div>
          )}
        </div>
      </Container>
    </main>
  )
}