// lib/getOrders.ts
import { db } from "./firebase"
import { collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore"

export async function getOrdersByEmail(customerEmail: string) {
  try {
    const ordersRef = collection(db, "orders")
    const q = query(
      ordersRef, 
      where("customer.email", "==", customerEmail),
      orderBy("createdAt", "desc")
    )
    const querySnapshot = await getDocs(q)
    
    const orders: any[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      orders.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      })
    })
    return orders
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

export async function getOrderById(orderId: string) {
  try {
    const orderRef = doc(db, "orders", orderId)
    const orderSnap = await getDoc(orderRef)
    
    if (orderSnap.exists()) {
      const data = orderSnap.data()
      return {
        id: orderSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString()
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}