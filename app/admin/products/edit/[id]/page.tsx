"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import Container from "@/components/Container"
import Link from "next/link"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default function EditProductPage({ params }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
    brand: ""
  })

  useEffect(() => {
    // Unwrap the params Promise
    const unwrapParams = async () => {
      const { id } = await params
      fetchProduct(id)
    }
    
    unwrapParams()
  }, [params])

  const fetchProduct = async (productId: string) => {
    try {
      const productRef = doc(db, "products", productId)
      const productSnap = await getDoc(productRef)
      
      if (productSnap.exists()) {
        const data = productSnap.data()
        setProduct({ id: productSnap.id, ...data })
        setFormData({
          name: data.name || "",
          price: data.price?.toString() || "",
          category: data.category || "",
          description: data.description || "",
          stock: data.stock?.toString() || "",
          brand: data.brand || ""
        })
      } else {
        alert("Product not found")
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      alert("Error loading product")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { id } = await params
      const productRef = doc(db, "products", id)
      await updateDoc(productRef, {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        description: formData.description,
        stock: Number(formData.stock),
        brand: formData.brand,
        updatedAt: new Date()
      })
      
      alert("Product updated successfully!")
      router.push("/admin/products")
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
        <div className="text-center py-20">Loading...</div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Edit Product</h1>
        <Link
          href="/admin/products"
          className="border px-4 py-2 text-sm hover:bg-gray-100"
        >
          Back to Products
        </Link>
      </div>

      <div className="max-w-2xl bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
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
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full border p-3 rounded-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                className="w-full border p-3 rounded-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
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
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full border p-3 rounded-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full border p-3 rounded-sm"
            />
          </div>

          {product?.imageUrl && (
            <div>
              <label className="block text-sm font-medium mb-1">Current Image</label>
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="h-20 w-20 object-cover border"
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#C8A75B] text-black px-6 py-2 hover:bg-[#b8964a] transition disabled:bg-gray-300"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/admin/products"
              className="border px-6 py-2 hover:bg-gray-100 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </Container>
  )
}