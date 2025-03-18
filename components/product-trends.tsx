import { ArrowUpRight, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function ProductTrends() {
  // This would typically come from an API or database
  const trendingProducts = [
    {
      id: "iphone-15-pro-256gb",
      name: "iPhone 15 Pro",
      currentPrice: 129900,
      previousPrice: 139900,
      platform: "Amazon",
      url: "https://www.amazon.in/Apple-iPhone-15-Pro-128GB/dp/B0CHX1K3RV/",
    },
    {
      id: "samsung-double-door-refrigerator",
      name: "Samsung 580L Refrigerator",
      currentPrice: 67490,
      previousPrice: 78990,
      platform: "Flipkart",
      url: "https://www.flipkart.com/samsung-580-l-frost-free-side-by-side-refrigerator/p/itm123456789",
    },
    {
      id: "nike-air-zoom-pegasus",
      name: "Nike Air Zoom Pegasus 39",
      currentPrice: 9495,
      previousPrice: 11995,
      platform: "Flipkart",
      url: "https://www.flipkart.com/nike-air-zoom-pegasus-39-running-shoes/p/itm246813579",
    },
    {
      id: "macbook-air-m2",
      name: "MacBook Air M2",
      currentPrice: 99900,
      previousPrice: 119900,
      platform: "Flipkart",
      url: "https://www.flipkart.com/apple-macbook-air-m2-8-gb-256-gb-ssd-mac-os-ventura-mly33hn-a/p/itm6a5f9e2a2d2e0",
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
            <TrendingUp className="h-5 w-5 text-primary" />
            Price Trends
          </CardTitle>
          <CardDescription>Products with significant price changes</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {trendingProducts.map((product) => {
            const discountPercentage = Math.round(
              ((product.previousPrice - product.currentPrice) / product.previousPrice) * 100,
            )

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs font-normal">
                      {product.platform}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-xs font-normal text-green-600 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-900"
                    >
                      -{discountPercentage}%
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(product.currentPrice)}</p>
                    <p className="text-sm text-muted-foreground line-through">{formatPrice(product.previousPrice)}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

