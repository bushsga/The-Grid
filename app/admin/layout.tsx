"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()
  
  // Check if current page is login page
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && !isLoginPage) {
        // Only redirect if not on login page
        router.push("/admin/login")
      } else {
        setUser(user)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router, isLoginPage])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show navbar if user is logged in AND not on login page */}
      {user && !isLoginPage && (
        <nav className="bg-[#0B0F19] text-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="text-xl font-semibold">THE GRID - Admin</div>
              <div className="flex items-center gap-6">
                <Link 
                  href="/admin/dashboard" 
                  className="flex items-center gap-2 hover:text-[#C8A75B] transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link 
                  href="/admin/products" 
                  className="flex items-center gap-2 hover:text-[#C8A75B] transition"
                >
                  <Package className="w-4 h-4" />
                  <span className="hidden sm:inline">Products</span>
                </Link>
                <Link 
                  href="/admin/orders" 
                  className="flex items-center gap-2 hover:text-[#C8A75B] transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Orders</span>
                </Link>
                <button
                  onClick={() => auth.signOut()}
                  className="flex items-center gap-2 hover:text-[#C8A75B] transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <div className="py-8">
        {children}
      </div>
    </div>
  )
}