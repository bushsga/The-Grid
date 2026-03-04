"use client"

import { useState } from "react"

type Props = {
  onUploadSuccess: (imageUrl: string) => void
  onUploadStart?: () => void
  onUploadError?: (error: string) => void
}

export default function CloudinaryUpload({ onUploadSuccess, onUploadStart, onUploadError }: Props) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    onUploadStart?.()

    try {
      const formData = new FormData()
      formData.append("file", file)
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
        console.log("✅ Image uploaded to Cloudinary:", data.secure_url)
        onUploadSuccess(data.secure_url)
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("❌ Upload error:", error)
      onUploadError?.("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full border p-3 rounded-sm"
      />
      {uploading && (
        <p className="text-sm text-gray-600 mt-1">Uploading to Cloudinary...</p>
      )}
    </div>
  )
}