"use client"

import { useCart } from "@/context/CartContext"
import { Product } from "@/types/product"

export default function AddToCartButtonCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  
  return (
    <button 
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product)
        alert(`${product.name} added to cart!`)
      }}
      className="mt-4 w-full bg-[#C8A75B] text-black py-2 text-sm font-medium hover:bg-[#b8964a] transition"
    >
      Add to Cart
    </button>
  )
}