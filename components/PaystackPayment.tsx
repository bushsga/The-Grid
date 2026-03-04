"use client"

// @ts-ignore
import { PaystackButton } from 'paystack-react-lite'
import { useCart } from "@/context/CartContext"
import { useRouter } from "next/navigation"

type PaystackPaymentProps = {
  email: string
  fullName: string
  phone: string
  amount: number
  onSuccess: (response: any) => void  // ← Changed to accept response
  onClose: () => void
}

export default function PaystackPayment({ 
  email, 
  fullName, 
  phone, 
  amount, 
  onSuccess, 
  onClose 
}: PaystackPaymentProps) {
  const { clearCart } = useCart()
  const router = useRouter()

  // Convert to kobo (Paystack uses smallest currency unit)
  const amountInKobo = amount * 100

  // Generate unique reference
  const reference = `SOLAR-${Date.now()}-${Math.floor(Math.random() * 1000000)}`

  // Metadata for the transaction
  const metadata = {
    custom_fields: [
      {
        display_name: "Customer Name",
        variable_name: "customer_name",
        value: fullName
      },
      {
        display_name: "Phone Number",
        variable_name: "phone_number",
        value: phone
      }
    ]
  }

  // Handle successful payment
  const handleSuccess = (response: any) => {
    console.log("Payment successful:", response)
    // Call the onSuccess prop with the response
    onSuccess(response)
  }

  // Handle payment cancellation
  const handleClose = () => {
    console.log("Payment window closed")
    onClose()
  }

  // Props for PaystackButton
  const componentProps = {
    email,
    amount: amountInKobo,
    reference,
    metadata,
    currency: "NGN",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    text: `Pay ₦${amount.toLocaleString()}`,
    onSuccess: handleSuccess,
    onClose: handleClose,
    className: "w-full bg-[#C8A75B] text-black py-3 font-medium hover:bg-[#b8964a] transition disabled:bg-gray-300"
  }

  return <PaystackButton {...componentProps} />
}