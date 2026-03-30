"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Menu, X, ShoppingCart, Sun, Zap, Battery, Power, Fan, 
  Lightbulb, Smartphone, Shield, Info, Phone, Package 
} from "lucide-react"
import Container from "./Container"
import { useCart } from "@/context/CartContext"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { totalItems } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const categories = [
    { name: "Solar Panels", href: "/products?category=Solar%20Panels", icon: Sun },
    { name: "Inverters & Controllers", href: "/products?category=Inverters%20%26%20Controllers", icon: Zap },
    { name: "Batteries", href: "/products?category=Batteries", icon: Battery },
    { name: "Portable Power", href: "/products?category=Portable%20Power%20Stations", icon: Power },
    { name: "Fans & Appliances", href: "/products?category=Fans%20%26%20Home%20Appliances", icon: Fan },
    { name: "Solar Lighting", href: "/products?category=Solar%20Lighting", icon: Lightbulb },
    { name: "Tech Hub", href: "/products?category=Gadgets%20%26%20Accessories", icon: Smartphone },
    { name: "Installation", href: "/products?category=Installation%20%26%20Security", icon: Shield },
  ]

  // Split categories into two rows for desktop
  const firstRowCategories = categories.slice(0, 4)
  const secondRowCategories = categories.slice(4, 8)

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 w-full bg-white transition-all duration-300 z-100
        ${scrolled ? "shadow-lg" : "shadow-sm"}
      `}
    >
      <Container>
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold tracking-wide shrink-0">
            THE GRID
          </Link>

          {/* Desktop Navigation - Two Rows Layout */}
          <div className="hidden md:flex flex-col items-end flex-1 ml-8">
            {/* First Row - Main Categories */}
            <div className="flex items-center gap-5 mb-1">
              {firstRowCategories.map((cat) => {
                const Icon = cat.icon
                return (
                  <Link 
                    key={cat.name} 
                    href={cat.href}
                    className="flex items-center gap-1.5 text-sm hover:text-[#C8A75B] transition whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </Link>
                )
              })}
            </div>
            {/* Second Row - Remaining Categories + About/Contact + My Orders */}
            <div className="flex items-center gap-5">
              {secondRowCategories.map((cat) => {
                const Icon = cat.icon
                return (
                  <Link 
                    key={cat.name} 
                    href={cat.href}
                    className="flex items-center gap-1.5 text-sm hover:text-[#C8A75B] transition whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </Link>
                )
              })}
              <Link 
                href="/my-orders" 
                className="flex items-center gap-2 text-sm hover:text-[#C8A75B] transition"
              >
                <Package className="w-4 h-4" />
                My Orders
              </Link>
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
            </div>
          </div>

          {/* Cart & Mobile Menu Button */}
          <div className="flex items-center gap-6 shrink-0 ml-6">
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
          <nav className="md:hidden py-4 border-t max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-3">
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
                href="/my-orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 transition"
              >
                <Package className="w-5 h-5 text-[#C8A75B]" />
                <span>My Orders</span>
              </Link>
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