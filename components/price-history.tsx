"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { PriceHistoryChart } from "@/components/price-history-chart"

export function PriceHistory({ id }: { id: string }) {
  const [timeRange, setTimeRange] = useState("6")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Price History</h3>
        <select 
          className="text-sm bg-transparent border rounded-md px-2 py-1"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="6">6 months</option>
          <option value="12">12 months</option>
          <option value="24">24 months</option>
        </select>
      </div>
      <Card className="p-4">
        <PriceHistoryChart productId={id} />
      </Card>
    </div>
  )
}

