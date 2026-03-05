"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import toast from 'react-hot-toast'
import { Product } from "@/types/product"

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

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

const addToCart = (product: Product) => {
  if (product.stock <= 0) {
    toast.error("This product is out of stock")
    return { success: false }
  }

  setItems(currentItems => {
    const existingItem = currentItems.find(item => item.product.id === product.id)
    
    if (existingItem) {
      if (existingItem.quantity + 1 > product.stock) {
        toast.error(`Only ${product.stock} units available`)
        return currentItems
      }
      
      toast.success(`${product.name} quantity updated in cart`)
      return currentItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      toast.success(`${product.name} added to cart`)
      return [...currentItems, { product, quantity: 1 }]
    }
  })
  
  return { success: true }
}

  const updateQuantity = (productId: string, quantity: number) => {
    const item = items.find(i => i.product.id === productId)
    
    if (!item) {
      return { success: false, message: "Item not found" }
    }

    // Check if requested quantity exceeds stock
    if (quantity > item.product.stock) {
      alert(`Sorry, only ${item.product.stock} units available`)
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
    
    return { success: true }
  }

  const removeFromCart = (productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.product.id !== productId))
  }

  const clearCart = () => {
    setItems([])
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