"use client"

import { useState } from "react"
import Container from "@/components/Container"
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    service: "installation"
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("https://formspree.io/f/mqedrqwo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          service: formData.service,
          _subject: `New ${formData.service} request from ${formData.name}`
        })
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          service: "installation"
        })
      } else {
        alert("Something went wrong. Please try again.")
      }
    } catch (error) {
      alert("Failed to send message. Please check your internet.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="py-20 bg-white min-h-screen">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Thank You!</h1>
            <p className="text-gray-600 mb-6">
              We've received your message and will get back to you within 24 hours.
            </p>
            <Link href="/">
              <button className="bg-[#C8A75B] text-black px-6 py-3 hover:bg-[#b8964a] transition">
                Return Home
              </button>
            </Link>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="py-20 bg-white">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-semibold mb-4">Contact Us</h1>
          <p className="text-gray-600">
            Ready to go solar? Request an installation or ask us anything.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-gray-50">
            <Phone className="w-8 h-8 text-[#C8A75B] mx-auto mb-3" />
            <h3 className="font-medium mb-2">Call Us</h3>
            <p className="text-gray-600">+234 123 456 7890</p>
          </div>
          <div className="text-center p-6 bg-gray-50">
            <Mail className="w-8 h-8 text-[#C8A75B] mx-auto mb-3" />
            <h3 className="font-medium mb-2">Email Us</h3>
            <p className="text-gray-600">gridsolar98@gmail.com</p>
          </div>
          <div className="text-center p-6 bg-gray-50">
            <MapPin className="w-8 h-8 text-[#C8A75B] mx-auto mb-3" />
            <h3 className="font-medium mb-2">Visit Us</h3>
            <p className="text-gray-600">Kwara, Nigeria</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border p-3 rounded-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border p-3 rounded-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border p-3 rounded-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">I need help with *</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
                className="w-full border p-3 rounded-sm"
              >
                <option value="installation">Installation Request</option>
                <option value="quote">Get a Quote</option>
                <option value="support">Technical Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message *</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full border p-3 rounded-sm"
                placeholder="Tell us about your project or question..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8A75B] text-black py-3 font-medium hover:bg-[#b8964a] transition disabled:bg-gray-300"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </Container>
    </main>
  )
}