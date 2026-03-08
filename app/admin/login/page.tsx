"use client"

import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import Container from "@/components/Container"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/admin/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-semibold mb-8 text-center">Admin Login</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 shadow-sm">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border p-3 rounded-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border p-3 rounded-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8A75B] text-black py-3 font-medium hover:bg-[#b8964a] transition disabled:bg-gray-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </Container>
    </main>
  )
}