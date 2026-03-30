"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Container from "@/components/Container"
import Link from "next/link"
import { Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react"
import { getOrdersByEmail } from "@/lib/getOrders"

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [customerEmail, setCustomerEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get customer email from localStorage or prompt
    const storedEmail = localStorage.getItem('customerEmail')
    if (storedEmail) {
      setCustomerEmail(storedEmail)
      fetchOrders(storedEmail)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchOrders = async (email: string) => {
    const fetchedOrders = await getOrdersByEmail(email)
    setOrders(fetchedOrders)
    setLoading(false)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    if (email) {
      localStorage.setItem('customerEmail', email)
      setCustomerEmail(email)
      fetchOrders(email)
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'processing': return <Clock className="w-5 h-5 text-yellow-500" />
      case 'shipped': return <Truck className="w-5 h-5 text-blue-500" />
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <Package className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      processing: "bg-yellow-100 text-yellow-800",
      shipped: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  if (!customerEmail) {
    return (
      <main className="py-20 bg-white min-h-screen">
        <Container>
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-semibold mb-8 text-center">My Orders</h1>
            <form onSubmit={handleEmailSubmit} className="space-y-4 bg-gray-50 p-8">
              <p className="text-gray-600 mb-4">Enter your email to view your orders</p>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="w-full border p-3 rounded-sm"
              />
              <button
                type="submit"
                className="w-full bg-[#C8A75B] text-black py-3 font-medium hover:bg-[#b8964a] transition"
              >
                View Orders
              </button>
            </form>
          </div>
        </Container>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="py-20 bg-white min-h-screen">
        <Container>
          <div className="text-center py-20">Loading your orders...</div>
        </Container>
      </main>
    )
  }

  return (
    <main className="py-20 bg-gray-50 min-h-screen">
      <Container>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">My Orders</h1>
          <button
            onClick={() => {
              localStorage.removeItem('customerEmail')
              setCustomerEmail(null)
              setOrders([])
            }}
            className="text-sm text-gray-500 hover:text-[#C8A75B]"
          >
            Change Email
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No orders found for this email</p>
            <Link href="/products" className="text-[#C8A75B] underline">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order #{order.paymentReference}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.orderStatus)}
                    <span className={`px-3 py-1 text-xs rounded-full ${getStatusBadge(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₦{item.total.toLocaleString()}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-gray-400">+{order.items.length - 2} more items</p>
                    )}
                  </div>
                  <div className="mt-3 font-semibold text-right">
                    Total: ₦{order.totalAmount.toLocaleString()}
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  {order.waybill && (
                    <span className="text-sm text-gray-500">
                      📦 Waybill: {order.waybill}
                    </span>
                  )}
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-[#C8A75B] hover:underline text-sm"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </main>
  )
}