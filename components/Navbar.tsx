"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingCart, Sun, Battery, Home, Cpu, Info, Phone } from "lucide-react"
import Container from "./Container"
import { useCart } from "@/context/CartContext"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { totalItems } = useCart()

  const categories = [
    { name: "Portable Power", href: "/products?category=Portable%20Power", icon: Battery },
    { name: "Home Backup", href: "/products?category=Home%20Backup", icon: Home },
    { name: "Solar Panels", href: "/products?category=Solar%20Panels", icon: Sun },
    { name: "Smart Tech", href: "/products?category=Smart%20Tech", icon: Cpu },
  ]

  return (
    <header className="border-b border-gray-200 w-full bg-white sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between py-5">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold tracking-wide">
            THE GRID
          </Link>

          {/* Desktop Navigation - WITH ICONS */}
          <nav className="hidden md:flex items-center gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link 
                  key={cat.name} 
                  href={cat.href}
                  className="flex items-center gap-2 text-sm hover:text-[#C8A75B] transition"
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </Link>
              )
            })}
            <Link 
              href="/about" 
              className="flex items-center gap-2 text-sm hover:text-[#C8A75B] transition"
            >
              <Info className="w-4 h-4" />
              About
            </Link>
            <Link 
              href="/contact" 
              className="flex items-center gap-2 text-sm hover:text-[#C8A75B] transition"
            >
              <Phone className="w-4 h-4" />
              Contact
            </Link>
          </nav>

          {/* Cart & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-sm font-medium relative">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C8A75B] text-black text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 transition"
                  >
                    <Icon className="w-5 h-5 text-[#C8A75B]" />
                    <span>{cat.name}</span>
                  </Link>
                )
              })}
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 transition"
              >
                <Info className="w-5 h-5 text-[#C8A75B]" />
                <span>About Us</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 transition"
              >
                <Phone className="w-5 h-5 text-[#C8A75B]" />
                <span>Contact</span>
              </Link>
            </div>
          </nav>
        )}
      </Container>
    </header>
  )
}