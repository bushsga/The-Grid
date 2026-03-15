"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, X } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore"

export default function StockAlertBanner() {
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Real-time listener for low stock products
    const productsRef = collection(db, "products")
    const q = query(productsRef, where("stock", "<", 10))
    
    // This updates in REAL TIME when stock changes
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const products: any[] = []
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() })
      })
      setLowStockProducts(products)
      console.log("🔄 Stock alert updated:", products.length, "products low")
    })

    return () => unsubscribe()
  }, [])

  if (dismissed || lowStockProducts.length === 0) return null

  return (
    <div className="mb-8 bg-orange-50 border-l-4 border-orange-500 p-4 relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 text-orange-500 hover:text-orange-700"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-orange-800">
            Low Stock Alert - {lowStockProducts.length} product(s) need attention
          </h3>
          <ul className="mt-2 text-sm text-orange-700 space-y-1">
            {lowStockProducts.map((product) => (
              <li key={product.id} className="flex items-center gap-2">
                • {product.name} - Only {product.stock} units left
                <Link 
                  href={`/admin/products/edit/${product.id}`}
                  className="text-blue-600 hover:underline ml-2 text-xs bg-blue-50 px-2 py-1 rounded"
                >
                  Restock
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}