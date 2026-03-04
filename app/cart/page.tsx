"use client"

import Container from "@/components/Container"
import { useCart } from "@/context/CartContext"
import Link from "next/link"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <main className="py-20 bg-white min-h-screen">
        <Container>
          <div className="text-center py-20">
            <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart.</p>
            <Link 
              href="/products"
              className="bg-[#C8A75B] text-black px-8 py-3 inline-block"
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
        <h1 className="text-3xl font-semibold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-4 border-b py-4">
                {/* Product Image Placeholder */}
                <div className="w-24 h-24 bg-gray-200 flex-shrink-0" />
                
                {/* Product Details */}
                <div className="flex-1">
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="font-medium hover:text-[#C8A75B]">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500">{item.product.category}</p>
                  <p className="text-sm font-medium mt-1">
                    ₦{item.product.price.toLocaleString()}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                {/* Price and Remove */}
                <div className="text-right">
                  <div className="font-semibold">
                    ₦{(item.product.price * item.quantity).toLocaleString()}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-sm text-red-500 mt-1 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="mt-4 text-right">
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-500 underline"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t pt-2 mt-2 font-semibold text-base">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>₦{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout">
                <button className="w-full bg-[#C8A75B] text-black py-3 mt-6 font-medium hover:bg-[#b8964a] transition">
                  Proceed to Checkout
                </button>
              </Link>

              <Link href="/products">
                <button className="w-full border py-3 mt-2 text-sm hover:bg-gray-100 transition">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}