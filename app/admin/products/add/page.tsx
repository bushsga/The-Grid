"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import Container from "@/components/Container"
import CloudinaryUpload from "@/components/CloudinaryUpload"
import { Plus, Trash2 } from "lucide-react"

export default function AddProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  
  // Power items state
  const [powerItems, setPowerItems] = useState([
    { item: "TV", hours: "10" },
    { item: "Fridge", hours: "8" },
    { item: "Laptop", hours: "20" },
    { item: "Lights", hours: "24" }
  ])
  
  // Specs state
  const [specs, setSpecs] = useState([
    { label: "Battery Capacity", value: "3600Wh" },
    { label: "Output", value: "3600W" },
    { label: "Recharge Time", value: "2 Hours" },
    { label: "Warranty", value: "5 Years" }
  ])

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
    brand: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Power items handlers
  const addPowerItem = () => {
    setPowerItems([...powerItems, { item: "", hours: "" }])
  }

  const updatePowerItem = (index: number, field: 'item' | 'hours', value: string) => {
    const updated = [...powerItems]
    updated[index][field] = value
    setPowerItems(updated)
  }

  const removePowerItem = (index: number) => {
    setPowerItems(powerItems.filter((_, i) => i !== index))
  }

  // Specs handlers
  const addSpec = () => {
    setSpecs([...specs, { label: "", value: "" }])
  }

  const updateSpec = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...specs]
    updated[index][field] = value
    setSpecs(updated)
  }

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index))
  }

  const handleUploadSuccess = (url: string) => {
    setImageUrl(url)
    setUploadingImage(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!imageUrl) {
      alert("Please upload an image first")
      return
    }

    setLoading(true)

    try {
      // Filter out empty power items and specs
      const filteredPowerItems = powerItems.filter(p => p.item.trim() && p.hours.trim())
      const filteredSpecs = specs.filter(s => s.label.trim() && s.value.trim())

      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        imageUrl,
        powerItems: filteredPowerItems,
        specs: filteredSpecs,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      console.log("Saving product with specs:", productData)
      
      const docRef = await addDoc(collection(db, "products"), productData)
      console.log("Product saved with ID:", docRef.id)
      
      alert("Product added successfully!")
      router.push("/admin/products")
    } catch (error: any) {
      console.error("Error adding product:", error)
      alert(`Failed to add product: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Add New Product</h1>
        <button
          onClick={() => router.back()}
          className="border px-4 py-2 text-sm hover:bg-gray-100"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Basic Info */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
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
                <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
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
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Product Image</h2>
          <CloudinaryUpload
            onUploadStart={() => setUploadingImage(true)}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={(error) => alert(error)}
          />
          {uploadingImage && (
            <p className="text-sm text-blue-600 mt-1">⏳ Uploading to Cloudinary...</p>
          )}
          {imageUrl && (
            <div className="mt-3">
              <p className="text-sm text-green-600 mb-2">✅ Image uploaded successfully!</p>
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="h-32 w-32 object-cover border rounded"
              />
            </div>
          )}
        </div>

        {/* Power Items Section - FIXED LAYOUT */}
<div className="bg-white p-6 shadow-sm">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">What It Can Power</h2>
    <button
      type="button"
      onClick={addPowerItem}
      className="flex items-center gap-2 bg-[#C8A75B] text-black px-3 py-1 text-sm hover:bg-[#b8964a]"
    >
      <Plus className="w-4 h-4" /> Add Item
    </button>
  </div>
  
  <div className="space-y-3">
    {powerItems.map((item, index) => (
      <div key={index} className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded">
        <input
          type="text"
          placeholder="Item (e.g., TV)"
          value={item.item}
          onChange={(e) => updatePowerItem(index, 'item', e.target.value)}
          className="flex-1 min-w-[150px] border p-2 rounded-sm"
        />
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Hours"
            value={item.hours}
            onChange={(e) => updatePowerItem(index, 'hours', e.target.value)}
            className="w-20 border p-2 rounded-sm"
          />
          <span className="text-sm w-8">hrs</span>
        </div>
        <button
          type="button"
          onClick={() => removePowerItem(index)}
          className="p-2 text-red-500 hover:bg-red-100 rounded"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
</div>

{/* Specs Section - FIXED LAYOUT */}
<div className="bg-white p-6 shadow-sm">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">Technical Specifications</h2>
    <button
      type="button"
      onClick={addSpec}
      className="flex items-center gap-2 bg-[#C8A75B] text-black px-3 py-1 text-sm hover:bg-[#b8964a]"
    >
      <Plus className="w-4 h-4" /> Add Spec
    </button>
  </div>
  
  <div className="space-y-3">
    {specs.map((spec, index) => (
      <div key={index} className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded">
        <input
          type="text"
          placeholder="Label (e.g., Battery Capacity)"
          value={spec.label}
          onChange={(e) => updateSpec(index, 'label', e.target.value)}
          className="flex-1 min-w-[200px] border p-2 rounded-sm"
        />
        <input
          type="text"
          placeholder="Value (e.g., 3600Wh)"
          value={spec.value}
          onChange={(e) => updateSpec(index, 'value', e.target.value)}
          className="flex-1 min-w-[150px] border p-2 rounded-sm"
        />
        <button
          type="button"
          onClick={() => removeSpec(index)}
          className="p-2 text-red-500 hover:bg-red-100 rounded"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
</div>

        <button
          type="submit"
          disabled={loading || !imageUrl}
          className="w-full bg-[#C8A75B] text-black py-3 font-medium hover:bg-[#b8964a] transition disabled:bg-gray-300"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </Container>
  )
}