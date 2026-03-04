export type Product = {
  id: string
  name: string
  price: number
  category: string
  description: string
  imageUrl?: string  
  stock: number
  brand?: string
  powerItems?: Array<{
    item: string
    hours: string
  }>
  specs?: Array<{
    label: string
    value: string
  }>
  createdAt?: any
  updatedAt?: any
}