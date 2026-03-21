import { MetadataRoute } from 'next'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://thegridglobal.com'
  
  // Get all products for dynamic URLs
  let products: any[] = []
  try {
    const productsSnapshot = await getDocs(collection(db, "products"))
    products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      updatedAt: doc.data().updatedAt,
      category: doc.data().category
    }))
  } catch (error) {
    console.error("Error fetching products for sitemap:", error)
  }

  // Static pages with Ilorin, Kwara focus
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/calculator`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Dynamic product pages
  const productPages = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: product.updatedAt?.toDate() || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Category pages
  const categories = ['Portable Power', 'Home Backup', 'Solar Panels', 'Smart Tech']
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/products?category=${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...productPages, ...categoryPages]
}