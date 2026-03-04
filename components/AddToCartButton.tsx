"use client"

import { useCart } from "@/context/CartContext"
import { Product } from "@/types/product"  // ← Import the full Product type

type Props = {
  product: Product  // ← Use the full Product type, not a custom one
}

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart()
  
  return (
    <button 
      onClick={() => {
        addToCart(product)  // ← Now passing the full product with all properties
        alert(`${product.name} added to cart!`)
      }}
      className="mt-10 bg-[#C8A75B] text-black px-10 py-4 text-sm font-medium w-full sm:w-auto hover:bg-[#b8964a] transition"
    >
      Add to Cart
    </button>
  )
}