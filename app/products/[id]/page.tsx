import Container from "@/components/Container"
import { getProducts } from "@/lib/getProducts"
import { notFound } from "next/navigation"
import AddToCartButton from "@/components/AddToCartButton"

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProductDetails({ params }: Props) {
  const { id } = await params
  const products = await getProducts()
  const product = products.find((p) => p.id === id)

  if (!product) return notFound()

  return (
    <main className="py-20 bg-white">
      <Container>
        <div className="grid md:grid-cols-2 gap-14">
          {/* IMAGE SECTION */}
          <div>
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="h-96 w-full object-cover rounded-sm"
              />
            ) : (
              <div className="h-96 bg-gray-200 w-full rounded-sm" />
            )}
          </div>

          {/* PRODUCT INFO */}
          <div>
            <div className="inline-block bg-[#C8A75B]/20 text-[#C8A75B] text-xs px-3 py-1 mb-4">
              Installation Included
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">
              {product.name}
            </h1>

            <p className="text-gray-500 mt-3">
              {product.category} {product.brand && `• ${product.brand}`}
            </p>

            <div className="mt-6 text-2xl font-semibold">
              ₦{product.price.toLocaleString()}
            </div>

            <p className="mt-6 text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* WHAT IT CAN POWER */}
            {product.powerItems && product.powerItems.length > 0 && (
              <div className="mt-10">
                <h3 className="font-semibold mb-4">
                  What It Can Power
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {product.powerItems.map((item: any, index: number) => (
                    <div key={index} className="border p-3">
                      {item.item} ({item.hours} hrs)
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SPECS */}
            {product.specs && product.specs.length > 0 && (
              <div className="mt-10">
                <h3 className="font-semibold mb-4">
                  Technical Specifications
                </h3>

                <div className="border divide-y text-sm">
                  {product.specs.map((spec: any, index: number) => (
                    <div key={index} className="flex justify-between p-3">
                      <span>{spec.label}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <AddToCartButton product={product} />
          </div>
        </div>
      </Container>
    </main>
  )
}