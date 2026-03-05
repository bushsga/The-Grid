"use client"

import Link from "next/link"
import { Product } from "@/types/product"
import { useCart } from "@/context/CartContext"
import { toast } from 'react-hot-toast'

type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.stock <= 0) {
      toast.error("This product is out of stock")
      return
    }
    const result = addToCart(product)
    if (result.success) {
      toast.success(`${product.name} added to cart!`)
    }
  }

  return (
    <div className="bg-white shadow-sm hover:shadow-md transition p-6 h-full flex flex-col">
      <Link href={`/products/${product.id}`} className="flex-1">
        {/* IMAGE CONTAINER - INCREASED HEIGHT */}
        <div className="w-full h-64 bg-gray-50 mb-4 overflow-hidden"> {/* ← Changed from h-48 to h-64 (taller) */}
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        
        <h3 className="font-medium text-lg">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 mt-2">
          {product.category}
        </p>

        <div className="mt-4 font-semibold">
          ₦{product.price.toLocaleString()}
        </div>

        <div className="mt-2 text-sm text-gray-600">
          {product.stock > 0 ? (
            <span>{product.stock} left</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </div>
      </Link>
      
      <button 
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
        className={`mt-4 w-full py-2 text-sm font-medium transition ${
          product.stock <= 0 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-[#C8A75B] text-black hover:bg-[#b8964a]'
        }`}
      >
        {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  )
}