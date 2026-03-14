// app/api/monnify/initialize/route.ts
import { NextResponse } from "next/server"
import { getMonnifyAccessToken } from "@/lib/monnify"

export async function POST(request: Request) {
  try {
    const { amount, customerName, customerEmail, customerMobile, reference } = await request.json()
    
    console.log("💰 Initializing Monnify payment:", { amount, customerEmail, reference })
    
    const accessToken = await getMonnifyAccessToken()
    console.log("✅ Got access token")

    const transactionData = {
      amount,
      customerName,
      customerEmail,
      customerMobile,
      paymentReference: reference,
      contractCode: process.env.NEXT_PUBLIC_MONNIFY_CONTRACT_CODE,
      paymentDescription: "Solar Equipment Purchase",
      currencyCode: "NGN",
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`
    }

    console.log("📤 Sending to Monnify:", transactionData)

    const response = await fetch(
      "https://sandbox.monnify.com/api/v1/merchant/transactions/init-transaction",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(transactionData)
      }
    )

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Monnify API error:", response.status, errorText)
      return NextResponse.json({ 
        success: false, 
        error: `Monnify API error: ${response.status}` 
      }, { status: response.status })
    }

    const data = await response.json()
    console.log("✅ Monnify response:", data)

    if (data.requestSuccessful && data.responseBody?.checkoutUrl) {
      return NextResponse.json({
        success: true,
        checkoutUrl: data.responseBody.checkoutUrl,
        transactionReference: data.responseBody.transactionReference
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: data.responseMessage || "Transaction initialization failed" 
      }, { status: 400 })
    }

  } catch (error: any) {
    console.error("❌ Server error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Server error" 
    }, { status: 500 })
  }
}