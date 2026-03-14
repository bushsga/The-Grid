"use client"

import { useState } from "react"
import Container from "@/components/Container"
import { Calculator, Zap, Lightbulb, Tv } from "lucide-react"
import Link from "next/link"

export default function CalculatorPage() {
  const [appliances, setAppliances] = useState([
    { name: "TV", watts: 150, hours: 5, quantity: 1 },
    { name: "Fridge", watts: 200, hours: 24, quantity: 1 },
    { name: "Lights", watts: 20, hours: 8, quantity: 4 },
    { name: "Laptop", watts: 50, hours: 6, quantity: 1 },
    { name: "Fan", watts: 75, hours: 8, quantity: 2 },
  ])

  const [result, setResult] = useState<number | null>(null)

  const updateAppliance = (index: number, field: string, value: number) => {
    const updated = [...appliances]
    updated[index] = { ...updated[index], [field]: value }
    setAppliances(updated)
  }

  const calculate = () => {
    const totalWh = appliances.reduce((sum, item) => {
      return sum + (item.watts * item.hours * item.quantity)
    }, 0)
    
    const systemSize = (totalWh / 1000) * 1.2
    setResult(Math.ceil(systemSize))
  }

  return (
    <main className="py-20 bg-white min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-semibold mb-4">Solar System Calculator</h1>
          <p className="text-gray-600 mb-8">
            Estimate the solar system size you need based on your appliances.
          </p>

          <div className="bg-gray-50 p-6 rounded-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Appliances</h2>
            
            <div className="space-y-4">
              {appliances.map((item, index) => (
                <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-3 items-center bg-white p-3 rounded">
                  <span className="font-medium">{item.name}</span>
                  <div>
                    <label className="text-xs text-gray-500">Watts</label>
                    <input
                      type="number"
                      value={item.watts}
                      onChange={(e) => updateAppliance(index, 'watts', Number(e.target.value))}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Hours/day</label>
                    <input
                      type="number"
                      value={item.hours}
                      onChange={(e) => updateAppliance(index, 'hours', Number(e.target.value))}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateAppliance(index, 'quantity', Number(e.target.value))}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div className="text-sm">
                    {(item.watts * item.hours * item.quantity / 1000).toFixed(2)} kWh/day
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={calculate}
              className="mt-6 bg-[#C8A75B] text-black px-8 py-3 hover:bg-[#b8964a] transition flex items-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Calculate My Needs
            </button>

            {result && (
              <div className="mt-6 p-4 bg-white border-l-4 border-[#C8A75B]">
                <h3 className="font-semibold mb-2">Recommended System:</h3>
                <p className="text-2xl font-bold text-[#C8A75B]">{result} kWh system</p>
                <p className="text-sm text-gray-600 mt-2">
                  This should cover your daily energy needs with 20% safety margin.
                </p>
                <Link href="/contact">
                  <button className="mt-4 bg-[#0B0F19] text-white px-6 py-2 text-sm hover:bg-opacity-90 transition">
                    Get Installation Quote
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  )
}