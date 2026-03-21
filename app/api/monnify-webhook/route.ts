import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"
import emailjs from '@emailjs/nodejs'
import crypto from 'crypto'

// Verify Monnify webhook signature
function verifyMonnifySignature(payload: string, signature: string, secretKey: string): boolean {
  try {
    const hash = crypto
      .createHmac('sha512', secretKey)
      .update(payload)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(signature)
    )
  } catch (error) {
    console.error('❌ Signature verification error:', error)
    return false
  }
}

// Send emails using EmailJS
async function sendEmails(order: any) {
  try {
    console.log("=".repeat(50))
    console.log("📧 Sending emails for order:", order.paymentReference)
    
    // 🔴 DEBUG: Check environment variables
    console.log("=".repeat(50))
    console.log("🔍 EMAILJS CONFIG CHECK:");
    console.log("Service ID:", process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? "✅ Present" : "❌ Missing");
    console.log("Customer Template ID:", process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? "✅ Present" : "❌ Missing");
    console.log("Vendor Template ID:", process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_VENDOR ? "✅ Present" : "❌ Missing");
    console.log("Public Key:", process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? "✅ Present" : "❌ Missing");
    console.log("Private Key:", process.env.EMAILJS_PRIVATE_KEY ? "✅ Present" : "❌ Missing");
    console.log("Admin Email:", process.env.ADMIN_EMAIL ? "✅ Present" : "❌ Missing");
    
    // Check if vendor template ID is actually different
    if (process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID === process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_VENDOR) {
      console.log("⚠️ WARNING: Customer and Vendor templates are the SAME!");
    } else {
      console.log("✅ Customer and Vendor templates are DIFFERENT");
    }
    console.log("=".repeat(50))
    
    // Format items list for email
    const itemsList = order.items.map((item: any) => 
      `• ${item.name} x${item.quantity} = ₦${item.total.toLocaleString()}`
    ).join('\n')

    // Format address
    const fullAddress = `${order.customer.address}, ${order.customer.city}, ${order.customer.state}`

    // 1️⃣ SEND TO CUSTOMER (Order Confirmation)
    console.log("📧 Sending customer email to:", order.customer.email)
    console.log("📧 Using template:", process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID);
    
    const customerParams = {
      to_email: order.customer.email,
      customer_name: order.customer.name,
      order_reference: order.paymentReference,
      total_amount: `₦${order.totalAmount.toLocaleString()}`,
      items_list: itemsList,
      delivery_address: fullAddress,
      company_name: 'THE GRID',
      support_email: 'support@thegridglobal.com'
    }

    const customerResponse = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      customerParams,
      {
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY
      }
    )
    console.log("✅ Customer email sent. Status:", customerResponse.status)

    // 2️⃣ SEND TO VENDOR (YOU) - New Order Notification
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@thegridglobal.com'
    console.log("📧 Sending vendor notification to:", adminEmail)
    console.log("📧 Using template:", process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_VENDOR);
    
    const vendorParams = {
      to_email: adminEmail,
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone,
      order_reference: order.paymentReference,
      total_amount: `₦${order.totalAmount.toLocaleString()}`,
      items_list: itemsList,
      delivery_address: fullAddress,
      order_date: new Date().toLocaleString(),
      admin_link: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders`
    }

    const vendorResponse = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_VENDOR!,
      vendorParams,
      {
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY
      }
    )
    console.log("✅ Vendor email sent. Status:", vendorResponse.status)

    console.log("✅ Both emails sent successfully!")
    return true

  } catch (error: any) {
    console.error("❌ Email error:", error)
    if (error.text) console.error("Error details:", error.text)
    return false
  }
}

export async function POST(request: Request) {
  try {
    console.log("=".repeat(50))
    console.log("📬 Webhook received at:", new Date().toISOString())
    
    const rawBody = await request.text()
    const payload = JSON.parse(rawBody)
    const headersList = await headers()
    const signature = headersList.get('monnify-signature') || ''
    
    console.log("📦 Event type:", payload.eventType)
    
    // Verify signature
    const secretKey = process.env.MONNIFY_SECRET_KEY || ''
    const isValid = verifyMonnifySignature(rawBody, signature, secretKey)
    
    if (!isValid) {
      console.error('❌ Invalid webhook signature')
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Only handle successful transactions
    if (payload.eventType !== 'SUCCESSFUL_TRANSACTION') {
      console.log('⏭️ Ignoring event type:', payload.eventType)
      return NextResponse.json({ received: true })
    }

    const eventData = payload.eventData
    
    // Get references
    const yourReference = eventData.paymentReference
    const monnifyReference = eventData.transactionReference
    
    console.log("🔍 Looking for order with reference:", yourReference)

    // Find the order in Firebase
    const ordersRef = collection(db, "orders")
    const q = query(ordersRef, where("paymentReference", "==", yourReference))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.error("❌ Order not found for reference:", yourReference)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update the order
    const orderDoc = querySnapshot.docs[0]
    const orderData = orderDoc.data()
    
    await updateDoc(doc(db, "orders", orderDoc.id), {
      paymentStatus: "paid",
      orderStatus: "processing",
      updatedAt: new Date(),
      monnifyData: eventData,
      monnifyReference: monnifyReference
    })

    console.log("✅ Order updated successfully. ID:", orderDoc.id)

    // Send both emails
    await sendEmails({ id: orderDoc.id, ...orderData })

    console.log("✅ Webhook processing complete")
    console.log("=".repeat(50))

    return NextResponse.json({ 
      received: true,
      orderId: orderDoc.id,
      reference: orderData.paymentReference
    })

  } catch (error: any) {
    console.error("❌ Webhook error:", error)
    console.log("=".repeat(50))
    return NextResponse.json({ 
      received: true,
      error: error.message 
    })
  }
}