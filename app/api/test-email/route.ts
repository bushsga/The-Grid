import { NextResponse } from "next/server"
import emailjs from '@emailjs/nodejs'

export async function GET() {
  try {
    console.log("=".repeat(50))
    console.log("📧 Testing EmailJS Node.js...")
    
    // Log environment variables
    console.log("Service ID:", process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? "✅ Present" : "❌ Missing")
    console.log("Template ID:", process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? "✅ Present" : "❌ Missing")
    console.log("Public Key:", process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? "✅ Present" : "❌ Missing")
    
    const templateParams = {
      to_email: 'ibrahimjamiuakeem@gmail.com',
      customer_name: 'Ibrahim',
      order_reference: 'TEST-123',
      total_amount: '₦2,000',
      items_list: 'Solar Panel x1',
      delivery_address: 'Lagos, Nigeria'
    }

    console.log("📤 Sending with params:", templateParams)
    
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams,
      {
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY // Optional for better security
      }
    )

    console.log("✅ Success:", response)
    return NextResponse.json({ success: true, response })
    
  } catch (error: any) {
    console.error("❌ Error:", error)
    return NextResponse.json({ 
      success: false, 
      error: {
        message: error.message,
        text: error.text
      }
    })
  }
}