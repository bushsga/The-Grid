import Container from "@/components/Container"
import ProductCard from "@/components/ProductCard"
import { getProducts } from "@/lib/getProducts"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Metadata } from 'next'

type Props = {
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ category?: string }> }
): Promise<Metadata> {
  const { category } = await searchParams
  
  let title = "Solar Products Nigeria | THE GRID Ilorin"
  let description = "Browse our premium solar panels, inverters, batteries, and home backup systems. Professional installation available nationwide. Based in Ilorin, Kwara State."
  
  if (category) {
    title = `${category} Solutions in Ilorin | THE GRID Nigeria`
    description = `Shop premium ${category.toLowerCase()} for homes and businesses in Ilorin, Kwara and nationwide. High-quality solar solutions with professional installation.`
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://thegridglobal.com/products',
      siteName: 'THE GRID',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'THE GRID Solar Products - Ilorin',
        }
      ],
      locale: 'en_NG',
      type: 'website',
    },
  }
}



export default async function ProductsPage({ searchParams }: Props) {
  const { category } = await searchParams
  const allProducts = await getProducts()
  
  const products = category 
    ? allProducts.filter(p => p.category === category)
    : allProducts

  
  if (!category) {
    return (
      <main className="py-20 bg-gray-50 min-h-screen">
        <Container>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Select a Category</h1>
            <p className="text-gray-600 mb-8">
              Please choose a category from the navigation menu or our categories page.
            </p>
            <Link 
              href="/categories"
              className="bg-[#C8A75B] text-black px-6 py-3 inline-block hover:bg-[#b8964a] transition"
            >
              Browse Categories
            </Link>
          </div>
        </Container>
      </main>
    )
  }

  const categoryName = category

  return (
    <main className="py-20 bg-gray-50 min-h-screen">
      <Container>
        {/* Back button */}
        <div className="mb-6">
          <Link 
            href="/categories"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#C8A75B] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {categoryName}
          </h1>
          <p className="text-gray-600">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white">
            <p className="text-gray-500 mb-4">No products found in this category.</p>
            <Link 
              href="/categories"
              className="text-[#C8A75B] underline"
            >
              Browse other categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </main>
  )
}