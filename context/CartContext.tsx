"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { Product } from "@/types/product"
import toast from 'react-hot-toast'

type CartItem = {
  product: Product
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addToCart: (product: Product) => { success: boolean; message?: string }
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string }
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on first render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to load cart", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addToCart = (product: Product) => {
    // Check if product is in stock
    if (product.stock <= 0) {
      toast.error("This product is out of stock")
      return { success: false, message: "This product is out of stock" }
    }

    // Check if product already in cart
    const existingItem = items.find(item => item.product.id === product.id)
    
    if (existingItem) {
      // Check if adding one more would exceed stock
      if (existingItem.quantity + 1 > product.stock) {
        toast.error(`Sorry, only ${product.stock} units available`)
        return { success: false, message: `Only ${product.stock} units available` }
      }
      
      // Update quantity
      setItems(currentItems =>
        currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
      
      // Show toast AFTER state update
      setTimeout(() => {
        toast.success(`${product.name} quantity updated in cart`)
      }, 100)
      
      return { success: true }
    } else {
      // Add new item
      setItems([...items, { product, quantity: 1 }])
      
      // Show toast AFTER state update
      setTimeout(() => {
        toast.success(`${product.name} added to cart`)
      }, 100)
      
      return { success: true }
    }
  }

  const removeFromCart = (productId: string) => {
    const product = items.find(item => item.product.id === productId)?.product
    setItems(currentItems => currentItems.filter(item => item.product.id !== productId))
    
    if (product) {
      setTimeout(() => {
        toast.success(`${product.name} removed from cart`)
      }, 100)
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const item = items.find(i => i.product.id === productId)
    
    if (!item) {
      return { success: false, message: "Item not found" }
    }

    // Check if requested quantity exceeds stock
    if (quantity > item.product.stock) {
      toast.error(`Sorry, only ${item.product.stock} units available`)
      return { success: false, message: "Exceeds available stock" }
    }

    if (quantity <= 0) {
      removeFromCart(productId)
      return { success: true }
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
    
    setTimeout(() => {
      toast.success(`${item.product.name} quantity updated`)
    }, 100)
    
    return { success: true }
  }

  const clearCart = () => {
    setItems([])
    setTimeout(() => {
      toast.success("Cart cleared")
    }, 100)
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}