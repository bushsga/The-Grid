"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import Container from "@/components/Container"
import { Package, Truck, CheckCircle, Clock } from "lucide-react"

export default function TrackingPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      const orderRef = doc(db, "orders", orderId as string)
      const orderSnap = await getDoc(orderRef)
      
      if (orderSnap.exists()) {
        setOrder({ id: orderSnap.id, ...orderSnap.data() })
      }
      setLoading(false)
    }
    
    fetchOrder()
  }, [orderId])

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'processing': return <Clock className="w-6 h-6 text-blue-500" />
      case 'shipped': return <Truck className="w-6 h-6 text-orange-500" />
      case 'delivered': return <CheckCircle className="w-6 h-6 text-green-500" />
      default: return <Package className="w-6 h-6 text-gray-500" />
    }
  }

  if (loading) return <div className="text-center py-20">Loading...</div>
  if (!order) return <div className="text-center py-20">Order not found</div>

  return (
    <main className="py-20 bg-white min-h-screen">
      <Container>
        <h1 className="text-3xl font-semibold mb-8">Track Your Order</h1>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-sm mb-6">
            <p className="text-sm text-gray-500">Order Reference</p>
            <p className="font-mono text-lg">{order.paymentReference}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white border">
              {getStatusIcon(order.orderStatus)}
              <div>
                <p className="font-medium">Current Status: {order.orderStatus}</p>
                <p className="text-sm text-gray-500">
                  {order.orderStatus === 'processing' && 'Your order is being prepared'}
                  {order.orderStatus === 'shipped' && `Your order has been shipped${order.waybill ? ` with waybill: ${order.waybill}` : ''}`}
                  {order.orderStatus === 'delivered' && 'Your order has been delivered'}
                </p>
              </div>
            </div>

            {order.waybill && (
              <div className="p-4 bg-blue-50 border border-blue-200">
                <p className="font-medium">Tracking Number: {order.waybill}</p>
                <p className="text-sm text-gray-600">Use this number to track with your logistics provider</p>
              </div>
            )}
          </div>

          <div className="mt-8 border-t pt-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between py-2 border-b">
                <span>{item.name} x {item.quantity}</span>
                <span>₦{item.total.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between pt-4 font-semibold">
              <span>Total</span>
              <span>₦{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}