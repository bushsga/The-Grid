import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { CartProvider } from "@/context/CartContext"
import { Inter, Playfair_Display } from "next/font/google"

// Modern sans-serif for body text
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

// Elegant serif for headings
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata = {
  title: "THE GRID - Premium Solar Power Solutions",
  description: "Nigeria's premier solar energy company.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
