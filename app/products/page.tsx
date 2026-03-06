import Container from "@/components/Container"
import ProductCard from "@/components/ProductCard"
import { getProducts } from "@/lib/getProducts"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type Props = {
  searchParams: Promise<{ category?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category } = await searchParams
  const allProducts = await getProducts()
  
  // Filter products by category if specified
  const products = category 
    ? allProducts.filter(p => p.category === category)
    : allProducts

  // If no category selected, show message to select category
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

  // Get category name for display
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