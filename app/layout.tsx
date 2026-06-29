import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { CartProvider } from "@/context/CartContext"
import { Toaster } from 'react-hot-toast'
import { Montserrat, Playfair_Display } from "next/font/google"
import type { Metadata } from "next"
import JsonLd from "@/components/JsonLd"

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  variable: "--font-montserrat",
  weight: ['300', '400', '500', '600', '700', '800'] 
})

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair" 
})

export const metadata: Metadata = {
  metadataBase: new URL('https://thegridglobal.com'),
  title: {
    default: "THE GRID - Premium Solar Power Solutions in Ilorin, Kwara",
    template: "%s | THE GRID"
  },
  description: "Nigeria's premier solar energy company based in Ilorin, Kwara State. We provide high-performance solar systems, portable power stations, and professional installation for homes and businesses across Nigeria.",
  keywords: [
    "solar panels Ilorin",
    "home backup system Kwara",
    "portable power station Nigeria",
    "solar installation Ilorin",
    "inverter Kwara",
    "renewable energy Nigeria",
    "off-grid solar",
    "battery storage Ilorin",
    "solar company Kwara State"
  ],
  authors: [{ name: "THE GRID", url: "https://thegridglobal.com" }],
  creator: "THE GRID",
  publisher: "THE GRID",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "THE GRID - Premium Solar Power Solutions",
    description: "Nigeria's premier solar energy company based in Ilorin, Kwara. Professional installation for homes and businesses.",
    url: 'https://thegridglobal.com',
    siteName: "THE GRID",
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'THE GRID Solar Solutions - Ilorin, Kwara',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code', // Client gives you this
  },
  category: 'solar energy',
  // Icons configuration - THIS IS THE KEY PART! 👇


}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        {/* Preconnect for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* You don't need to manually add icon links here!
            Next.js automatically injects them from the metadata.icons config above */}
      </head>
      <body className={`${montserrat.variable} ${playfair.variable} font-sans`}>
        <JsonLd />
        <CartProvider>
          <Navbar />
          <div className="pt-[73px]">
            <Toaster position="top-right" />
            {children}
          </div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}