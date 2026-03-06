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
    <div className="bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      {/* IMAGE - INSIDE WHITE CONTAINER */}
      <Link href={`/products/${product.id}`} className="block">
        {product.imageUrl ? (
          <div className="w-full bg-gray-50" style={{ height: '250px' }}>
            <img 
              src={product.imageUrl} 
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        ) : (
          <div style={{ width: '100%', height: '250px' }} className="bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </Link>

      {/* CONTENT - SAME WHITE CONTAINER, MINIMAL GAP */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-lg hover:text-[#C8A75B] transition">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 mt-1">
          {product.category}
        </p>

        <div className="mt-2 text-xl font-semibold">
          ₦{product.price.toLocaleString()}
        </div>

        <div className="mt-1 text-sm">
          {product.stock > 0 ? (
            <span className="text-gray-600">{product.stock} left in stock</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`mt-3 w-full py-2.5 text-sm font-medium transition ${
            product.stock <= 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-[#C8A75B] text-black hover:bg-[#b8964a]'
          }`}
        >
          {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}