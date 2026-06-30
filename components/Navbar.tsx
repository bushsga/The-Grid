"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { 
  Menu, X, ShoppingCart, Sun, Zap, Battery, Power, Fan, 
  Lightbulb, Smartphone, Shield, Info, Phone, Package, ChevronDown 
} from "lucide-react"
import Container from "./Container"
import { useCart } from "@/context/CartContext"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { totalItems } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const categories = [
    { name: "Solar Panels", href: "/products?category=Solar%20Panels", icon: Sun },
    { name: "Inverters & Controllers", href: "/products?category=Inverters%20%26%20Controllers", icon: Zap },
    { name: "Batteries", href: "/products?category=Batteries", icon: Battery },
    { name: "Portable Power Stations", href: "/products?category=Portable%20Power%20Stations", icon: Power },
    { name: "Fans & Home Appliances", href: "/products?category=Fans%20%26%20Home%20Appliances", icon: Fan },
    { name: "Solar Lighting", href: "/products?category=Solar%20Lighting", icon: Lightbulb },
    { name: "Gadgets & Accessories", href: "/products?category=Gadgets%20%26%20Accessories", icon: Smartphone },
    { name: "Installation & Security", href: "/products?category=Installation%20%26%20Security", icon: Shield },
  ]

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

          {/* Desktop Navigation - DROPDOWN */}
          <div className="hidden md:flex items-center gap-6">
            {/* Categories Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 text-sm hover:text-[#C8A75B] transition whitespace-nowrap"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-sm min-w-[220px] z-50 py-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon
                    return (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 hover:text-[#C8A75B] transition"
                      >
                        <Icon className="w-4 h-4 text-[#C8A75B]" />
                        {cat.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Other Nav Links */}
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

          {/* Cart & Mobile Menu Button */}
          <div className="flex items-center gap-6 shrink-0">
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