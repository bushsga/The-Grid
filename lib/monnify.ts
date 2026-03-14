// lib/monnify.ts
export async function getMonnifyAccessToken() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_MONNIFY_API_KEY
    const secretKey = process.env.MONNIFY_SECRET_KEY

    if (!apiKey || !secretKey) {
      throw new Error("Monnify credentials not configured")
    }

    const authString = Buffer.from(`${apiKey}:${secretKey}`).toString('base64')

    const response = await fetch("https://sandbox.monnify.com/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Monnify auth failed:", response.status, errorText)
      throw new Error(`Auth failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.responseBody?.accessToken) {
      console.error("Monnify auth response missing token:", data)
      throw new Error("No access token in response")
    }

    return data.responseBody.accessToken
  } catch (error) {
    console.error("Error getting Monnify token:", error)
    throw error
  }
}