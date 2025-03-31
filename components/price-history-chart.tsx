"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Product } from "@/lib/types"

interface PriceHistoryChartProps {
  productId: string
}

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`)
  if (!res.ok) throw new Error('Failed to fetch product')
  const data = await res.json()
  return data.product
}

export function PriceHistoryChart({ productId }: PriceHistoryChartProps) {
  const [data, setData] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProduct(productId)
      .then(setData)
      .finally(() => setLoading(false))
  }, [productId])

  if (loading || !data) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const chartData = data.prices.history.map((point) => ({
    date: new Date(point.date).toLocaleDateString(),
    price: point.price,
    source: point.source,
  }))

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(value) => `₹${value.toLocaleString()}`}
            domain={['auto', 'auto']}
          />
          <Tooltip
            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Price']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ fill: "#8884d8" }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 