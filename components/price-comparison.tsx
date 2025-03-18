import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface PriceComparisonProps {
  id: string
}

export async function PriceComparison({ id }: PriceComparisonProps) {
  // In a real app, this would be an API call to fetch price comparison data
  await new Promise((resolve) => setTimeout(resolve, 600)) // Simulate API delay

  // Mock price comparison data
  const platforms = [
    {
      name: "Amazon",
      logo: "/placeholder.svg?height=40&width=120",
      price: 79999,
      shipping: "Free",
      delivery: "1-2 days",
      inStock: true,
      url: "https://amazon.in",
    },
    {
      name: "Flipkart",
      logo: "/placeholder.svg?height=40&width=120",
      price: 80999,
      shipping: "Free",
      delivery: "2-3 days",
      inStock: true,
      url: "https://flipkart.com",
    },
    {
      name: "Croma",
      logo: "/placeholder.svg?height=40&width=120",
      price: 82999,
      shipping: "₹99",
      delivery: "3-5 days",
      inStock: true,
      url: "https://croma.com",
    },
    {
      name: "Reliance Digital",
      logo: "/placeholder.svg?height=40&width=120",
      price: 84000,
      shipping: "Free",
      delivery: "3-4 days",
      inStock: false,
      url: "https://reliancedigital.in",
    },
  ]

  // Sort by price (lowest first)
  const sortedPlatforms = [...platforms].sort((a, b) => a.price - b.price)

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/50">
        <div className="space-y-1">
          <CardTitle>Online Price Comparison</CardTitle>
          <CardDescription>Compare prices across different online platforms</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {sortedPlatforms.map((platform, index) => (
            <div
              key={platform.name}
              className={`flex items-center justify-between p-4 rounded-lg ${
                index === 0 ? "bg-muted/50 border border-primary/20" : "border"
              }`}
            >
              <div className="flex items-center gap-4">
                <Image
                  src={platform.logo || "/placeholder.svg"}
                  alt={platform.name}
                  width={80}
                  height={30}
                  className="object-contain"
                />
                <div>
                  <p className="font-medium">{platform.name}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                    <span>Shipping: {platform.shipping}</span>
                    <span>Delivery: {platform.delivery}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xl font-bold">{formatPrice(platform.price)}</p>
                  {!platform.inStock && <p className="text-xs text-red-500">Out of stock</p>}
                  {index === 0 && <p className="text-xs text-green-600">Best price</p>}
                </div>
                <Button size="sm" variant={index === 0 ? "default" : "outline"} asChild>
                  <a href={platform.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

