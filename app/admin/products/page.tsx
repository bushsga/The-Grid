"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import Link from "next/link"
import Container from "@/components/Container"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Package } from "lucide-react"

type Product = {
  id: string
  name: string
  price: number
  category: string
  description: string
  stock: number
  brand: string
  imageUrl: string
  createdAt?: any
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
    brand: ""
  })
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"))
      const productsList: Product[] = []
      querySnapshot.forEach((doc) => {
        productsList.push({ id: doc.id, ...doc.data() } as Product)
      })
      setProducts(productsList)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      await deleteDoc(doc(db, "products", id))
      fetchProducts()
      alert("Product deleted successfully")
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product")
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setEditForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      stock: product.stock.toString(),
      brand: product.brand || ""
    })
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    try {
      const productRef = doc(db, "products", editingProduct.id)
      await updateDoc(productRef, {
        name: editForm.name,
        price: Number(editForm.price),
        category: editForm.category,
        description: editForm.description,
        stock: Number(editForm.stock),
        brand: editForm.brand,
        updatedAt: new Date()
      })
      
      setEditingProduct(null)
      fetchProducts()
      alert("Product updated successfully")
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Failed to update product")
    }
  }

  if (loading) {
    return (
      <Container>
        <div className="text-center py-20">Loading products...</div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Products Management</h1>
        <Link
          href="/admin/products/add"
          className="bg-[#C8A75B] text-black px-4 py-2 text-sm font-medium hover:bg-[#b8964a]"
        >
          + Add New
        </Link>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* ... edit form content (keep as is) ... */}
            </form>
          </div>
        </div>
      )}

      {/* Products Display - Responsive */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white">
          <p className="text-gray-600 mb-4">No products yet</p>
          <Link
            href="/admin/products/add"
            className="text-[#C8A75B] underline"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile View - Cards */}
          <div className="block md:hidden space-y-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-4 shadow-sm rounded-sm">
                <div className="flex gap-3">
                  {/* Image */}
                  <div className="w-16 h-16 bg-gray-100 shrink-0">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold">₦{product.price.toLocaleString()}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        product.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions - Now below on mobile */}
                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex items-center gap-1 text-blue-600 text-sm px-3 py-1 border rounded hover:bg-blue-50"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center gap-1 text-red-600 text-sm px-3 py-1 border rounded hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4">Image</th>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-12 h-12 object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200" />
                      )}
                    </td>
                    <td className="p-4">{product.name}</td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">₦{product.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={product.stock < 5 ? "text-red-500 font-medium" : ""}>
                        {product.stock}
                        {product.stock < 5 && (
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Low Stock!
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-500 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Container>
  )
}