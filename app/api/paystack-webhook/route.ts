import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore"
import crypto from 'crypto'
import emailjs from '@emailjs/nodejs'

// Verify Paystack webhook signature
function verifyPaystackSignature(
  payload: string,
  signature: string,
  secretKey: string
): boolean {
  try {
    const hash = crypto
      .createHmac('sha512', secretKey)
      .update(payload)
      .digest('hex')
    
    return hash === signature
  } catch (error) {
    console.error('❌ Signature verification error:', error)
    return false
  }
}

// Send emails using EmailJS
async function sendEmails(order: any) {
  try {
    const itemsList = order.items.map((item: any) => 
      `• ${item.name} x${item.quantity} = ₦${item.total.toLocaleString()}`
    ).join('\n')

    const fullAddress = `${order.customer.address}, ${order.customer.city}, ${order.customer.state}`

    // Customer email
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        to_email: order.customer.email,
        customer_name: order.customer.name,
        order_reference: order.paymentReference,
        total_amount: `₦${order.totalAmount.toLocaleString()}`,
        items_list: itemsList,
        delivery_address: fullAddress,
      },
      {
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY
      }
    )
    console.log("✅ Customer email sent")

    // Vendor email
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_VENDOR!,
      {
        to_email: process.env.ADMIN_EMAIL || 'admin@thegridglobal.com',
        customer_name: order.customer.name,
        customer_email: order.customer.email,
        customer_phone: order.customer.phone,
        order_reference: order.paymentReference,
        total_amount: `₦${order.totalAmount.toLocaleString()}`,
        items_list: itemsList,
        delivery_address: fullAddress,
        order_date: new Date().toLocaleString(),
        admin_link: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders`
      },
      {
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY
      }
    )
    console.log("✅ Vendor email sent")

  } catch (error) {
    console.error("❌ Email error:", error)
  }
}

export async function POST(request: Request) {
  try {
    console.log("=".repeat(50))
    console.log("📬 Paystack webhook received at:", new Date().toISOString())
    
    const rawBody = await request.text()
    const headersList = await headers()
    const signature = headersList.get('x-paystack-signature') || ''
    
    // Verify webhook signature
    const secretKey = process.env.PAYSTACK_SECRET_KEY || ''
    const isValid = verifyPaystackSignature(rawBody, signature, secretKey)
    
    if (!isValid) {
      console.error('❌ Invalid Paystack signature')
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const payload = JSON.parse(rawBody)
    const event = payload.event
    
    console.log("📦 Event:", event)
    
    // Only handle successful charge events
    if (event !== 'charge.success') {
      console.log('⏭️ Ignoring event:', event)
      return NextResponse.json({ received: true })
    }

    const transactionData = payload.data
    const reference = transactionData.reference
    
    console.log("🔍 Looking for order with reference:", reference)

    // Find the order in Firebase
    const ordersRef = collection(db, "orders")
    const q = query(ordersRef, where("paymentReference", "==", reference))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.error("❌ Order not found for reference:", reference)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const orderDoc = querySnapshot.docs[0]
    const orderData = orderDoc.data()
    
    // ✅ UPDATE STOCK FOR EACH PRODUCT
    console.log("📦 Updating stock for items...")
    for (const item of orderData.items) {
      const productRef = doc(db, "products", item.productId)
      const productSnap = await getDoc(productRef)
      
      if (productSnap.exists()) {
        const currentStock = productSnap.data().stock || 0
        const newStock = Math.max(0, currentStock - item.quantity)
        
        await updateDoc(productRef, {
          stock: newStock,
          updatedAt: new Date()
        })
        console.log(`✅ Stock updated for ${item.productId}: ${currentStock} → ${newStock}`)
      }
    }
    
    // Update order status to "paid"
    await updateDoc(doc(db, "orders", orderDoc.id), {
      paymentStatus: "paid",
      orderStatus: "processing",
      updatedAt: new Date(),
      paystackData: transactionData
    })

    console.log("✅ Order updated successfully. ID:", orderDoc.id)

    // Send emails
    await sendEmails({ id: orderDoc.id, ...orderData })

    console.log("✅ Webhook processing complete")
    console.log("=".repeat(50))

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json({ received: true })
  }
}