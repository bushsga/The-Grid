"use client"

import Link from "next/link"
import { Product } from "@/types/product"
import { useCart } from "@/context/CartContext"
import Image from "next/image"

type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product)
    alert(`${product.name} added to cart!`)
  }

  return (
    <div className="bg-white shadow-sm hover:shadow-md transition p-6 h-full flex flex-col">
      <Link href={`/products/${product.id}`} className="flex-1">
        {product.imageUrl ? (
          <div className="h-48 w-full relative mb-4">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-48 bg-gray-200 mb-4 w-full" />
        )}
        
        <h3 className="font-medium text-lg">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 mt-2">
          {product.category}
        </p>

        <div className="mt-4 font-semibold">
          ₦{product.price.toLocaleString()}
        </div>
      </Link>
      
      <button 
        onClick={handleAddToCart}
        className="mt-4 w-full bg-[#C8A75B] text-black py-2 text-sm font-medium hover:bg-[#b8964a] transition"
      >
        Add to Cart
      </button>
    </div>
  )
}