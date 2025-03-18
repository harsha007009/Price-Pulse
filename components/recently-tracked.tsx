import { Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ProductImage } from "@/components/product-image"

export function RecentlyTracked() {
  // This would typically come from an API or database based on user's tracking history
  const recentProducts = [
    {
      id: "iphone-15-pro-256gb",
      name: "iPhone 15 Pro Max",
      image: "https://m.media-amazon.com/images/I/81fxjeu8fdL._SL1500_.jpg",
      currentPrice: 159900,
      lowestPrice: 149900,
      platforms: ["Amazon", "Flipkart", "Croma"],
      url: "https://www.amazon.in/Apple-iPhone-15-Pro-Max/dp/B0CHX2F5QT/",
    },
    {
      id: "lg-front-load-washing-machine",
      name: "LG 8kg Front Load Washing Machine",
      image: "https://m.media-amazon.com/images/I/71o1csyWIzL._SL1500_.jpg",
      currentPrice: 42990,
      lowestPrice: 41490,
      platforms: ["Amazon", "Flipkart", "Reliance Digital"],
      url: "https://www.amazon.in/LG-Inverter-Fully-Automatic-FHM1408BDM/dp/B08698C78N/",
    },
    {
      id: "nike-air-zoom-pegasus",
      name: "Nike Air Zoom Pegasus 39",
      image: "https://m.media-amazon.com/images/I/71+xW6RKHgL._UL1500_.jpg",
      currentPrice: 9495,
      lowestPrice: 8995,
      platforms: ["Amazon", "Flipkart", "Nike Store"],
      url: "https://www.amazon.in/Nike-Pegasus-Running-Shoes-DH4071-001/dp/B09TMNVF8L/",
    },
  ]

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/50">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recently Tracked
          </CardTitle>
          <CardDescription>Products you're monitoring</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {recentProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-md bg-muted/80 flex items-center justify-center">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="object-cover"
                  fallbackSrc={`/placeholder.svg?height=50&width=50&text=${encodeURIComponent(product.name)}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.platforms.map((platform, index) => (
                    <Badge key={index} variant="outline" className="text-xs font-normal">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(product.currentPrice)}</p>
                <p className="text-xs text-green-600">Lowest: {formatPrice(product.lowestPrice)}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

