"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart } from "lucide-react"

interface PriceHistoryProps {
  id: string
}

export function PriceHistory({ id }: PriceHistoryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Mock price history data for iPhone in INR
    const amazonPrices = [139900, 139900, 134900, 134900, 131900, 131900, 131900, 131900, 131900, 131900, 131900]
    const flipkartPrices = [139900, 137900, 137900, 132900, 132900, 129900, 129900, 129900, 129900, 129900, 129900]

    const labels = [
      "Jan 1",
      "Jan 15",
      "Feb 1",
      "Feb 15",
      "Mar 1",
      "Mar 15",
      "Apr 1",
      "Apr 15",
      "May 1",
      "May 15",
      "Jun 1",
    ]

    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const padding = 40
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2

    // Find min and max prices
    const allPrices = [...amazonPrices, ...flipkartPrices]
    const minPrice = Math.min(...allPrices) * 0.95
    const maxPrice = Math.max(...allPrices) * 1.05
    const priceRange = maxPrice - minPrice

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--border").trim() || "#e2e8f0"
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, rect.height - padding)
    ctx.lineTo(rect.width - padding, rect.height - padding)
    ctx.stroke()

    // Draw grid lines
    const gridLines = 5
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.font = "12px sans-serif"
    ctx.fillStyle =
      getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim() || "#64748b"

    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (chartHeight / gridLines) * i
      const price = maxPrice - (priceRange / gridLines) * i

      ctx.beginPath()
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--border").trim() || "#e2e8f0"
      ctx.moveTo(padding, y)
      ctx.lineTo(rect.width - padding, y)
      ctx.stroke()

      ctx.fillText(`₹${Math.round(price).toLocaleString("en-IN")}`, padding - 10, y)
    }

    // Draw x-axis labels
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    const labelStep = Math.ceil(labels.length / 6)
    for (let i = 0; i < labels.length; i += labelStep) {
      const x = padding + (chartWidth / (labels.length - 1)) * i
      ctx.fillText(labels[i], x, rect.height - padding + 10)
    }

    // Draw Amazon price line
    ctx.beginPath()
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 2

    for (let i = 0; i < amazonPrices.length; i++) {
      const x = padding + (chartWidth / (amazonPrices.length - 1)) * i
      const y = padding + chartHeight - ((amazonPrices[i] - minPrice) / priceRange) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()

    // Draw Flipkart price line
    ctx.beginPath()
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2

    for (let i = 0; i < flipkartPrices.length; i++) {
      const x = padding + (chartWidth / (flipkartPrices.length - 1)) * i
      const y = padding + chartHeight - ((flipkartPrices[i] - minPrice) / priceRange) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()

    // Draw legend
    const legendX = rect.width - padding - 120
    const legendY = padding + 20

    ctx.fillStyle = "#ef4444"
    ctx.fillRect(legendX, legendY, 20, 2)
    ctx.fillStyle =
      getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim() || "#64748b"
    ctx.textAlign = "left"
    ctx.fillText("Amazon", legendX + 30, legendY)

    ctx.fillStyle = "#3b82f6"
    ctx.fillRect(legendX, legendY + 20, 20, 2)
    ctx.fillStyle =
      getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim() || "#64748b"
    ctx.fillText("Flipkart", legendX + 30, legendY + 20)
  }, [id])

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/50">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            Price History
          </CardTitle>
          <CardDescription>Track how the price has changed over time</CardDescription>
        </div>
        <Select defaultValue="6m">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">1 month</SelectItem>
            <SelectItem value="3m">3 months</SelectItem>
            <SelectItem value="6m">6 months</SelectItem>
            <SelectItem value="1y">1 year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-80 w-full">
          <canvas ref={canvasRef} className="w-full h-full"></canvas>
        </div>
      </CardContent>
    </Card>
  )
}

