import { NextResponse } from "next/server"
import emailjs from '@emailjs/nodejs'

export async function GET() {
  try {
    // Test 1: Environment variables
    const envCheck = {
      serviceId: !!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      templateId: !!process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      publicKey: !!process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      adminEmail: !!process.env.ADMIN_EMAIL
    }

    // Test 2: Send test email
    const testResult = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        to_email: process.env.ADMIN_EMAIL,
        customer_name: "Test User",
        order_reference: "TEST-123",
        total_amount: "₦5,000",
        items_list: "Test Item x1",
        delivery_address: "Lagos, Nigeria"
      },
      { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY! }
    )

    return NextResponse.json({ 
      success: true, 
      envCheck,
      emailStatus: testResult.status 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      text: error.text 
    }, { status: 500 })
  }
}