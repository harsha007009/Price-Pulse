"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Loader2 } from "lucide-react"

interface PriceHistoryProps {
  id: string
}

interface PriceRecord {
  source: string;
  storeName: string;
  price: number;
  timestamp: string;
}

export function PriceHistory({ id }: PriceHistoryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [timePeriod, setTimePeriod] = useState<string>("6m")
  const [loading, setLoading] = useState<boolean>(true)
  const [priceData, setPriceData] = useState<PriceRecord[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch price history data from API
  useEffect(() => {
    const fetchPriceHistory = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/products/${id}/price-history?period=${timePeriod}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch price history: ${response.statusText}`);
        }
        
        const data = await response.json();
        setPriceData(data);
      } catch (err) {
        console.error("Error fetching price history:", err);
        setError("Failed to load price history data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPriceHistory();
  }, [id, timePeriod]);

  // Render the chart when data is loaded or canvas is ready
  useEffect(() => {
    if (!canvasRef.current || loading || error || priceData.length === 0) return;

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return;

    // Group price data by store
    const storeData: Record<string, {prices: number[], dates: string[]}> = {};
    
    // Sort by timestamp to ensure chronological order
    const sortedData = [...priceData].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Group by store
    sortedData.forEach(record => {
      const storeName = record.storeName;
      if (!storeData[storeName]) {
        storeData[storeName] = { prices: [], dates: [] };
      }
      
      storeData[storeName].prices.push(record.price);
      storeData[storeName].dates.push(record.timestamp);
    });
    
    // Get unique dates for x-axis labels
    const allDates = sortedData.map(record => record.timestamp);
    const uniqueDates = [...new Set(allDates)].sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );
    
    // Format dates for display
    const labels = uniqueDates.map(dateStr => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    });

    // Extract all prices for min/max calculation
    const allPrices = sortedData.map(record => record.price);
    const minPrice = Math.min(...allPrices) * 0.95;
    const maxPrice = Math.max(...allPrices) * 1.05;
    const priceRange = maxPrice - minPrice;

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

    // Define store colors
    const storeColors: Record<string, string> = {
      'Amazon': '#ef4444',  // Red
      'Flipkart': '#3b82f6', // Blue
      'Reliance Digital': '#16a34a', // Green
      'Croma': '#f59e0b',  // Orange
      'Poorvika Mobiles': '#8b5cf6', // Purple
      'Bajaj Electronics': '#ec4899', // Pink
      'iStore': '#06b6d4',  // Cyan
      'Samsung Smart Plaza': '#6366f1', // Indigo
      'LG Best Shop': '#d946ef' // Fuchsia
    };

    // Draw price lines for each store
    const legendItems: {name: string, color: string}[] = [];
    
    Object.entries(storeData).forEach(([storeName, data], index) => {
      const color = storeColors[storeName] || `hsl(${index * 40}, 70%, 50%)`;
      legendItems.push({ name: storeName, color });
      
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      // Find points where this store has data
      const points: {x: number, y: number}[] = [];
      
      // Map this store's dates to the overall labels array
      data.dates.forEach((dateStr, i) => {
        const date = new Date(dateStr);
        const labelIndex = uniqueDates.findIndex(d => new Date(d).getTime() === date.getTime());
        
        if (labelIndex !== -1) {
          const x = padding + (chartWidth / (uniqueDates.length - 1)) * labelIndex;
          const y = padding + chartHeight - ((data.prices[i] - minPrice) / priceRange) * chartHeight;
          points.push({ x, y });
        }
      });
      
      // Draw the line connecting the points
      if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
      }
    });

    // Draw legend
    const legendX = rect.width - padding - 120;
    let legendY = padding + 20;
    
    legendItems.forEach(item => {
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, legendY, 20, 2);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim() || "#64748b";
      ctx.textAlign = "left";
      ctx.fillText(item.name, legendX + 30, legendY);
      legendY += 20;
    });
  }, [loading, priceData, error]);

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
        <Select value={timePeriod} onValueChange={setTimePeriod}>
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
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {error}
            </div>
          ) : priceData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No price history data available
            </div>
          ) : (
            <canvas ref={canvasRef} className="w-full h-full"></canvas>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

