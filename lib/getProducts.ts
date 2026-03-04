import { db } from "./firebase"
import { collection, getDocs } from "firebase/firestore"
import { Product } from "@/types/product"

export async function getProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "products"))
    const products: Product[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      products.push({ 
        id: doc.id, 
        name: data.name,
        price: data.price,
        category: data.category,
        description: data.description,
        stock: data.stock,
        brand: data.brand || "",
        imageUrl: data.imageUrl || "",
        powerItems: data.powerItems || [],
        specs: data.specs || [],
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null
      })
    })
    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}