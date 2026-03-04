"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import Link from "next/link"
import Container from "@/components/Container"
import { useRouter } from "next/navigation"

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
          + Add New Product
        </Link>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditInputChange}
                  required
                  className="w-full border p-3 rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₦) *</label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditInputChange}
                    required
                    className="w-full border p-3 rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={editForm.stock}
                    onChange={handleEditInputChange}
                    required
                    className="w-full border p-3 rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditInputChange}
                  required
                  className="w-full border p-3 rounded-sm"
                >
                  <option value="">Select category</option>
                  <option value="Portable Power">Portable Power</option>
                  <option value="Home Backup">Home Backup</option>
                  <option value="Solar Panels">Solar Panels</option>
                  <option value="Smart Tech">Smart Tech</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={editForm.brand}
                  onChange={handleEditInputChange}
                  className="w-full border p-3 rounded-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditInputChange}
                  required
                  rows={4}
                  className="w-full border p-3 rounded-sm"
                />
              </div>

              {editingProduct.imageUrl && (
                <div>
                  <label className="block text-sm font-medium mb-1">Current Image</label>
                  <img 
                    src={editingProduct.imageUrl} 
                    alt={editingProduct.name}
                    className="h-20 w-20 object-cover"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="bg-[#C8A75B] text-black px-6 py-2 hover:bg-[#b8964a]"
                >
                  Update Product
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="border px-6 py-2 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
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
        <div className="bg-white shadow-sm overflow-hidden">
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
      )}
    </Container>
  )
}