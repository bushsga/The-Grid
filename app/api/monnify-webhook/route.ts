import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

// Verify Monnify webhook signature
function verifyMonnifySignature(payload: string, signature: string, secretKey: string): boolean {
  try {
    const hash = crypto
      .createHmac('sha512', secretKey)
      .update(payload)
      .digest('hex')
    
    // Use timing-safe comparison
    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(signature)
    )
  } catch (error) {
    console.error('❌ Signature verification error:', error)
    return false
  }
}

// Send email to customer
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #C8A75B; padding: 30px; text-align: center;">
          <h1 style="color: #0B0F19; margin: 0; font-size: 28px;">THE GRID</h1>
          <p style="color: #0B0F19; margin-top: 5px;">Premium Solar Solutions</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #0B0F19; margin-bottom: 20px;">Thank You for Your Order! 🎉</h2>
          
          <p style="color: #4b5563; margin-bottom: 30px;">Hi ${order.customer.name}, your order has been received and is being processed.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <p style="margin: 0 0 10px 0;"><strong>Order Reference:</strong> ${order.paymentReference}</p>
            <p style="margin: 0;"><strong>Order Date:</strong> ${new Date(order.createdAt?.toDate()).toLocaleString()}</p>
          </div>
          
          <h3 style="color: #0B0F19; margin-bottom: 15px;">Order Summary</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 12px; text-align: left;">Item</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
                <th style="padding: 12px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 15px 10px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 15px 10px; text-align: right; font-weight: bold; color: #C8A75B;">₦${order.totalAmount.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h4 style="color: #0B0F19; margin: 0 0 10px 0;">Delivery Address</h4>
            <p style="color: #4b5563; margin: 0;">
              ${order.customer.address}<br>
              ${order.customer.city}, ${order.customer.state}
            </p>
          </div>
          
          <p style="color: #4b5563; margin-bottom: 30px;">
            You can track your order status here:<br>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/tracking/${order.id}" style="color: #C8A75B; text-decoration: none;">
              ${process.env.NEXT_PUBLIC_SITE_URL}/tracking/${order.id}
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 14px; text-align: center;">
            Need help? Contact us at support@thegridglobal.com<br>
            THE GRID - Powering Nigeria's Future
          </p>
        </div>
      </div>
    `

    await resend.emails.send({
      from: 'THE GRID <orders@thegridglobal.com>',
      to: customerEmail,
      subject: `🎉 Order Confirmed - ${order.paymentReference}`,
      html: emailHtml,
    })
    console.log('✅ Customer email sent')
  } catch (error) {
    console.error('❌ Failed to send customer email:', error)
  }
}

// Send email to admin
async function sendAdminEmail(order: any) {
  try {
    const itemsList = order.items.map((item: any) => 
      `- ${item.name} x${item.quantity} = ₦${item.total.toLocaleString()}`
    ).join('\n')

    const emailText = `
🔔 NEW ORDER RECEIVED!

Order Reference: ${order.paymentReference}
Total Amount: ₦${order.totalAmount.toLocaleString()}
Order Date: ${new Date(order.createdAt?.toDate()).toLocaleString()}

👤 CUSTOMER DETAILS:
Name: ${order.customer.name}
Email: ${order.customer.email}
Phone: ${order.customer.phone}
Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state}

📦 ORDER ITEMS:
${itemsList}

💰 PAYMENT STATUS: PAID

🔗 View Order: ${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders
    `

    await resend.emails.send({
      from: 'THE GRID <notifications@thegridglobal.com>',
      to: process.env.ADMIN_EMAIL || 'admin@thegridglobal.com',
      subject: `🔔 New Order: ${order.paymentReference}`,
      text: emailText,
    })
    console.log('✅ Admin email sent')
  } catch (error) {
    console.error('❌ Failed to send admin email:', error)
  }
}

export async function POST(request: Request) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text()
    
    // FIX: Await the headers() promise
    const headersList = await headers()
    const signature = headersList.get('monnify-signature') || ''
    
    // Verify webhook signature
    const secretKey = process.env.MONNIFY_SECRET_KEY || ''
    const isValid = verifyMonnifySignature(rawBody, signature, secretKey)
    
    if (!isValid) {
      console.error('❌ Invalid webhook signature')
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Parse the webhook payload
    const payload = JSON.parse(rawBody)
    console.log('📬 Webhook received:', payload.eventType)

    // Only handle successful transactions
    if (payload.eventType !== 'SUCCESSFUL_TRANSACTION') {
      return NextResponse.json({ received: true })
    }

    const eventData = payload.eventData
    const paymentReference = eventData.paymentReference || eventData.transactionReference

    // Find the order in Firebase
    const ordersRef = collection(db, "orders")
    const q = query(ordersRef, where("paymentReference", "==", paymentReference))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.log('❌ Order not found for reference:', paymentReference)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update the order status
    const orderDoc = querySnapshot.docs[0]
    const orderData = orderDoc.data()
    
    await updateDoc(doc(db, "orders", orderDoc.id), {
      paymentStatus: "paid",
      orderStatus: "processing",
      updatedAt: new Date(),
      monnifyData: eventData
    })

    console.log('✅ Order updated:', orderDoc.id)

    // Send email notifications
    try {
      await Promise.all([
        sendCustomerEmail({ id: orderDoc.id, ...orderData }, orderData.customer.email),
        sendAdminEmail({ id: orderDoc.id, ...orderData })
      ])
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ received: true })
  }
}