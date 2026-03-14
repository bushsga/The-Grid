"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import Link from "next/link"
import Container from "@/components/Container"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Package, Plus } from "lucide-react"
import AdminProtected from "@/components/AdminProtected"

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
  const [uploadingImage, setUploadingImage] = useState(false)
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
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
    setNewImageFile(null)
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImageFile(e.target.files[0])
    }
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    
    setSaving(true)

    try {
      let imageUrl = editingProduct.imageUrl
      
      
      if (newImageFile) {
        setUploadingImage(true)
        const formData = new FormData()
        formData.append("file", newImageFile)
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
        formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!)

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData
          }
        )

        const data = await response.json()
        if (data.secure_url) {
          imageUrl = data.secure_url
        }
        setUploadingImage(false)
      }

      const productRef = doc(db, "products", editingProduct.id)
      await updateDoc(productRef, {
        name: editForm.name,
        price: Number(editForm.price),
        category: editForm.category,
        description: editForm.description,
        stock: Number(editForm.stock),
        brand: editForm.brand,
        imageUrl: imageUrl,
        updatedAt: new Date()
      })
      
      setEditingProduct(null)
      setNewImageFile(null)
      fetchProducts()
      alert("Product updated successfully")
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Failed to update product")
    } finally {
      setSaving(false)
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
    <AdminProtected>
           <Container>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Products Management</h1>
        <Link
          href="/admin/products/add"
          className="bg-[#C8A75B] text-black px-4 py-2 text-sm font-medium hover:bg-[#b8964a] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New
        </Link>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Edit Product</h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            
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

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium mb-1">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border p-2 rounded-sm"
                />
                {editingProduct.imageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Current Image:</p>
                    <img 
                      src={editingProduct.imageUrl} 
                      alt={editingProduct.name}
                      className="h-20 w-20 object-cover border"
                    />
                  </div>
                )}
                {uploadingImage && (
                  <p className="text-sm text-blue-600 mt-1">Uploading new image...</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#C8A75B] text-black px-6 py-2 hover:bg-[#b8964a] transition disabled:bg-gray-300"
                >
                  {saving ? "Updating..." : "Update Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="border px-6 py-2 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Display */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
                  <div className="w-16 h-16 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
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
                        product.stock < 5 ? 'bg-red-100 text-red-600' : 
                        product.stock < 10 ? 'bg-orange-100 text-orange-600' : 
                        'bg-green-100 text-green-600'
                      }`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
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
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded" />
                      )}
                    </td>
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">₦{product.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        product.stock < 5 ? 'bg-red-100 text-red-600 font-medium' : 
                        product.stock < 10 ? 'bg-orange-100 text-orange-600' : 
                        'bg-green-100 text-green-600'
                      }`}>
                        {product.stock} units
                        {product.stock < 5 && (
                          <span className="ml-2">⚠️ Low Stock!</span>
                        )}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
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
    </AdminProtected>
  )
}