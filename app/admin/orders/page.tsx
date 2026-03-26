"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import Container from "@/components/Container"

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
  paymentReference?: string
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
      fetchOrders()
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
        orderStatus: "shipped",
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

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return
    }

    try {
      const orderRef = doc(db, "orders", orderId)
      await deleteDoc(orderRef)
      fetchOrders()
      alert("Order deleted successfully")
    } catch (error) {
      console.error("Error deleting order:", error)
      alert("Failed to delete order")
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
    <Container>
      <h1 className="text-3xl font-semibold mb-8">Orders Management</h1>

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-sm text-sm"
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
            <div key={order.id} className="bg-white p-4 md:p-6 shadow-sm">
              {/* Order Header - Responsive */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-4">
                <div>
                  <h2 className="font-semibold">{order.customer.name}</h2>
                  <p className="text-sm text-gray-600">{order.customer.email} • {order.customer.phone}</p>
                  <p className="text-sm text-gray-600">
                    {order.customer.address}, {order.customer.city}, {order.customer.state}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-xl font-semibold">₦{order.totalAmount.toLocaleString()}</div>
                  <p className="text-xs text-gray-500">
                    {order.createdAt?.toDate().toLocaleString()}
                  </p>
                  {order.paymentReference && (
                    <p className="text-xs text-gray-500 font-mono mt-1">Ref: {order.paymentReference}</p>
                  )}
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

              {/* Status and Actions - Responsive */}
              <div className="border-t pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 text-xs rounded-full ${getStatusBadge(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  {order.waybill && (
                    <span className="text-sm break-all">📦 Waybill: {order.waybill}</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <select
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    value={order.orderStatus}
                    className="border p-2 text-sm rounded-sm flex-1 sm:flex-initial"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {order.orderStatus !== "delivered" && (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-[#C8A75B] text-black px-3 py-2 text-sm rounded-sm hover:bg-[#b8964a] transition flex-1 sm:flex-initial"
                    >
                      + Waybill
                    </button>
                  )}

                  {order.orderStatus === "delivered" && (
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="bg-red-500 text-white px-3 py-2 text-sm rounded-sm hover:bg-red-600 transition flex-1 sm:flex-initial"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Waybill Input Modal - RESPONSIVE */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-sm w-full max-w-md mx-auto">
            <h3 className="font-medium mb-4 text-lg">Add Waybill Number</h3>
            <p className="text-sm text-gray-600 mb-3 break-all">
              Order: <span className="font-mono">{selectedOrder.paymentReference || selectedOrder.id}</span>
            </p>
            
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={waybillInput}
                onChange={(e) => setWaybillInput(e.target.value)}
                placeholder="Enter waybill number"
                className="w-full border p-3 rounded-sm text-sm"
                autoFocus
              />
              
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => updateWaybill(selectedOrder.id)}
                  className="bg-[#C8A75B] text-black px-4 py-2 rounded-sm hover:bg-[#b8964a] transition w-full sm:w-auto"
                >
                  Save Waybill
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="border px-4 py-2 rounded-sm hover:bg-gray-100 transition w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}