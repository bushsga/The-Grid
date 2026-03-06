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
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* IMAGE - LEFT SIDE */}
          <div className="md:w-1/2 flex justify-center">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                style={{
                  width: 'auto',
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '500px',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* CONTENT - RIGHT SIDE */}
          <div className="md:w-1/2">
            <div className="inline-block bg-[#C8A75B]/20 text-[#C8A75B] text-xs px-3 py-1 mb-4">
              Installation Included
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-4">
              {product.name}
            </h1>

            <p className="text-gray-500 text-lg mb-2">
              {product.category} {product.brand && `• ${product.brand}`}
            </p>

            <div className="text-3xl font-bold text-[#C8A75B] mb-4">
              ₦{product.price.toLocaleString()}
            </div>

            <div className="mb-6 text-gray-700 leading-relaxed">
              {product.description}
            </div>

            <div className="mb-6 text-sm">
              {product.stock > 0 ? (
                <span className="text-gray-600">{product.stock} units available</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>

            {product.powerItems && product.powerItems.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">What It Can Power</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.powerItems.map((item: any, index: number) => (
                    <div key={index} className="border p-3 text-center">
                      <div className="font-medium">{item.item}</div>
                      <div className="text-sm text-gray-600">{item.hours} hrs</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.specs && product.specs.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Technical Specifications</h3>
                <div className="border divide-y">
                  {product.specs.map((spec: any, index: number) => (
                    <div key={index} className="flex justify-between p-3">
                      <span className="font-medium">{spec.label}</span>
                      <span className="text-gray-700">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}