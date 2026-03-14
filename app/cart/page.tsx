"use client"

import Container from "@/components/Container"
import { useCart } from "@/context/CartContext"
import Link from "next/link"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <main className="py-20 bg-white min-h-screen">
        <Container>
          <div className="max-w-2xl mx-auto text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart.</p>
            <Link 
              href="/products"
              className="bg-[#C8A75B] text-black px-8 py-3 inline-block hover:bg-[#b8964a] transition"
            >
              Browse Products
            </Link>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="py-20 bg-white min-h-screen">
      <Container>
        <h1 className="text-3xl font-semibold mb-8 text-center md:text-left">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="bg-white border border-gray-200 p-6 rounded-sm">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Product Image */}
                  <div className="w-full sm:w-24 h-24 bg-gray-100 flex-shrink-0 mx-auto sm:mx-0">
                    {item.product.imageUrl ? (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 text-center sm:text-left">
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="font-medium text-lg hover:text-[#C8A75B] transition">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">{item.product.category}</p>
                    <p className="text-base font-semibold mt-2 text-[#C8A75B]">
                      ₦{item.product.price.toLocaleString()} each
                    </p>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex flex-col items-center sm:items-end gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100 transition text-lg"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100 transition text-lg"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-lg font-bold">
                      ₦{(item.product.price * item.quantity).toLocaleString()}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-sm text-red-500 hover:text-red-700 transition flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-500 transition flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary - Right Column - FIXED */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-sm border border-gray-200 p-6 md:p-8 sticky top-4">
              <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-300">
                Order Summary
              </h2>
              
              {/* Items List with Proper Spacing */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-start gap-4 border-b border-gray-200 pb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.product.name}</p>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold whitespace-nowrap">
                      ₦{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-300 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-[#C8A75B]">₦{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout" className="block w-full">
                <button className="w-full bg-[#C8A75B] text-black py-4 px-6 font-semibold hover:bg-[#b8964a] transition flex items-center justify-center gap-2 group rounded-sm">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
              </Link>

              {/* Continue Shopping */}
              <div className="mt-4 text-center">
                <Link 
                  href="/products" 
                  className="text-sm text-gray-500 hover:text-[#C8A75B] transition inline-flex items-center gap-1"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}