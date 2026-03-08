"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
import Container from "@/components/Container"
import AdminProtected from "@/components/AdminProtected"

type Order = {
  id: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
  }
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  totalAmount: number
  paymentStatus: string
  orderStatus: string
  waybill: string
  createdAt: any
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [waybillInput, setWaybillInput] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"))
      const ordersList: Order[] = []
      querySnapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() } as Order)
      })
      // Sort by date (newest first)
      ordersList.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate())
      setOrders(ordersList)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, "orders", orderId)
      await updateDoc(orderRef, {
        orderStatus: newStatus,
        updatedAt: new Date()
      })
      fetchOrders() // Refresh list
      alert(`Order status updated to ${newStatus}`)
    } catch (error) {
      console.error("Error updating order:", error)
      alert("Failed to update order status")
    }
  }

  const updateWaybill = async (orderId: string) => {
    if (!waybillInput.trim()) {
      alert("Please enter waybill number")
      return
    }

    try {
      const orderRef = doc(db, "orders", orderId)
      await updateDoc(orderRef, {
        waybill: waybillInput,
        orderStatus: "shipped", // Auto-update to shipped when waybill added
        updatedAt: new Date()
      })
      setWaybillInput("")
      setSelectedOrder(null)
      fetchOrders()
      alert("Waybill number added successfully")
    } catch (error) {
      console.error("Error updating waybill:", error)
      alert("Failed to update waybill")
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(o => o.orderStatus === statusFilter)

  if (loading) {
    return (
      <Container>
        <div className="text-center py-20">Loading orders...</div>
      </Container>
    )
  }

  return (
    <AdminProtected>
          <Container>
      <h1 className="text-3xl font-semibold mb-8">Orders Management</h1>

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-sm"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white">
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white p-6 shadow-sm">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-semibold">{order.customer.name}</h2>
                  <p className="text-sm text-gray-600">{order.customer.email} • {order.customer.phone}</p>
                  <p className="text-sm text-gray-600">
                    {order.customer.address}, {order.customer.city}, {order.customer.state}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold">₦{order.totalAmount.toLocaleString()}</div>
                  <p className="text-xs text-gray-500">
                    {order.createdAt?.toDate().toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4 mb-4">
                <h3 className="font-medium mb-2">Items</h3>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₦{item.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Actions */}
              <div className="border-t pt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 text-xs rounded-full ${getStatusBadge(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  
                  {order.waybill && (
                    <span className="text-sm">
                      📦 Waybill: {order.waybill}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {/* Status Update Dropdown */}
                  <select
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    value={order.orderStatus}
                    className="border p-2 text-sm rounded-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {/* Add Waybill Button */}
                  {order.orderStatus !== "delivered" && (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-[#C8A75B] text-black px-3 py-2 text-sm rounded-sm hover:bg-[#b8964a]"
                    >
                      + Waybill
                    </button>
                  )}
                </div>
              </div>

              {/* Waybill Input Modal */}
              {selectedOrder?.id === order.id && (
                <div className="mt-4 p-4 bg-gray-50 border">
                  <h3 className="font-medium mb-2">Add Waybill Number</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={waybillInput}
                      onChange={(e) => setWaybillInput(e.target.value)}
                      placeholder="Enter waybill number"
                      className="flex-1 border p-2 rounded-sm"
                    />
                    <button
                      onClick={() => updateWaybill(order.id)}
                      className="bg-[#C8A75B] text-black px-4 py-2 rounded-sm hover:bg-[#b8964a]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="border px-4 py-2 rounded-sm hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Container>
    </AdminProtected>
  )
}