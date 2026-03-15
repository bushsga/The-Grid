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

  // Determine stock status
  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock < 5

  return (
    <div className="bg-white shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="block">
        {product.imageUrl ? (
          <div className="w-full h-48 bg-gray-50" style={{ height: '200px' }}>
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
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-lg hover:text-[#C8A75B] transition line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 mt-1">{product.category}</p>

        <div className="mt-2 text-xl font-semibold">
          ₦{product.price.toLocaleString()}
        </div>

        {/* Stock Status Display */}
        <div className="mt-2">
          {isOutOfStock ? (
            <span className="text-red-600 font-medium">Out of Stock</span>
          ) : isLowStock ? (
            <span className="text-orange-600">Only {product.stock} left!</span>
          ) : (
            <span className="text-green-600">In Stock ({product.stock})</span>
          )}
        </div>
        
        <div className="mt-4">
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2 px-4 text-sm font-medium transition ${
              isOutOfStock 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-[#C8A75B] text-black hover:bg-[#b8964a]'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}