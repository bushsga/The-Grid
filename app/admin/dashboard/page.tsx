import Container from "@/components/Container"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <Container>
      <h1 className="text-3xl font-semibold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Products Card */}
        <Link href="/admin/products">
          <div className="bg-white p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">Products</h2>
            <p className="text-gray-600">Manage your solar products</p>
            <div className="mt-4 text-[#C8A75B]">View Products →</div>
          </div>
        </Link>

        {/* Orders Card */}
        <Link href="/admin/orders">
          <div className="bg-white p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">Orders</h2>
            <p className="text-gray-600">View and update customer orders</p>
            <div className="mt-4 text-[#C8A75B]">View Orders →</div>
          </div>
        </Link>

        {/* Add Product Card */}
        <Link href="/admin/products/add">
          <div className="bg-white p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">Add Product</h2>
            <p className="text-gray-600">Add new products to your store</p>
            <div className="mt-4 text-[#C8A75B]">Add Product →</div>
          </div>
        </Link>
      </div>
    </Container>
  )
}