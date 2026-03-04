import Container from "@/components/Container"
import ProductCard from "@/components/ProductCard"
import { getProducts } from "@/lib/getProducts"

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

  // Get category name for heading
  const categoryName = category || "Our Products"

  return (
    <main className="py-20 bg-gray-50 min-h-screen">
      <Container>
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-semibold">
            {category === "Portable Power" && "Portable Power Solutions"}
            {category === "Home Backup" && "Home Backup Systems"}
            {category === "Solar Panels" && "Solar Panels"}
            {category === "Smart Tech" && "Smart Technology"}
            {!category && "Our Products"}
          </h1>
          <p className="text-gray-600 mt-3">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </main>
  )
}