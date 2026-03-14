import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

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

async function sendCustomerEmail(order: any, customerEmail: string) {
  try {
    const itemsList = order.items.map((item: any) => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₦${item.price.toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₦${item.total.toLocaleString()}</td>
      </tr>`
    ).join('')

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #C8A75B; padding: 30px; text-align: center;">
          <h1 style="color: #0B0F19;">THE GRID</h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2>Thank You for Your Order! 🎉</h2>
          <p>Hi ${order.customer.name}, your order has been received.</p>
          <p><strong>Reference:</strong> ${order.paymentReference}</p>
          <p><strong>Total:</strong> ₦${order.totalAmount.toLocaleString()}</p>
        </div>
      </div>
    `

    await resend.emails.send({
      from: 'THE GRID <orders@thegridglobal.com>',
      to: customerEmail,
      subject: `✅ Order Confirmed - ${order.paymentReference}`,
      html: emailHtml,
    })
    console.log('✅ Customer email sent')
  } catch (error) {
    console.error('❌ Failed to send customer email:', error)
  }
}

async function sendAdminEmail(order: any) {
  try {
    await resend.emails.send({
      from: 'THE GRID <notifications@thegridglobal.com>',
      to: process.env.ADMIN_EMAIL || 'admin@thegridglobal.com',
      subject: `🔔 New Order: ${order.paymentReference}`,
      text: `New order received for ₦${order.totalAmount.toLocaleString()}`,
    })
    console.log('✅ Admin email sent')
  } catch (error) {
    console.error('❌ Failed to send admin email:', error)
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const payload = JSON.parse(rawBody)
    const headersList = await headers()
    const signature = headersList.get('monnify-signature') || ''
    
    // Verify signature
    const secretKey = process.env.MONNIFY_SECRET_KEY || ''
    const isValid = verifyMonnifySignature(rawBody, signature, secretKey)
    
    if (!isValid) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Only handle successful transactions
    if (payload.eventType !== 'SUCCESSFUL_TRANSACTION') {
      return NextResponse.json({ received: true })
    }

    const eventData = payload.eventData
    
    // 🔍 TRY TO FIND ORDER WITH EITHER REFERENCE
    const yourReference = eventData.paymentReference
    const monnifyReference = eventData.transactionReference
    
    console.log("🔍 Looking for order with your reference:", yourReference)
    console.log("🔍 Or with Monnify reference:", monnifyReference)

    // Try your reference first
    let ordersRef = collection(db, "orders")
    let q = query(ordersRef, where("paymentReference", "==", yourReference))
    let querySnapshot = await getDocs(q)

    // If not found, try Monnify reference
    if (querySnapshot.empty && monnifyReference) {
      console.log("⚠️ Order not found with your reference, trying Monnify reference")
      q = query(ordersRef, where("paymentReference", "==", monnifyReference))
      querySnapshot = await getDocs(q)
    }

    if (querySnapshot.empty) {
      console.error("❌ Order not found for any reference")
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update order
    const orderDoc = querySnapshot.docs[0]
    const orderData = orderDoc.data()
    
    await updateDoc(doc(db, "orders", orderDoc.id), {
      paymentStatus: "paid",
      orderStatus: "processing",
      updatedAt: new Date(),
      monnifyData: eventData
    })

    console.log("✅ Order updated:", orderDoc.id)

    // Send emails
    try {
      await sendCustomerEmail({ id: orderDoc.id, ...orderData }, orderData.customer.email)
      await sendAdminEmail({ id: orderDoc.id, ...orderData })
    } catch (emailError) {
      console.error("❌ Email error:", emailError)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json({ received: true })
  }
}