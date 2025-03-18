import { MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function NearbyDeals() {
  // This would typically come from an API with geolocation data
  const nearbyStores = [
    {
      id: 1,
      name: "Croma - Phoenix Marketcity",
      address: "Phoenix Marketcity, Whitefield, Bengaluru",
      distance: "1.2 km",
      deals: [
        { product: "iPhone 15 Pro (128GB)", price: 129990, savings: 5000 },
        { product: "Samsung 580L Refrigerator", price: 68500, savings: 6500 },
      ],
    },
    {
      id: 2,
      name: "Reliance Digital - Inorbit Mall",
      address: "Inorbit Mall, Whitefield, Bengaluru",
      distance: "2.5 km",
      deals: [
        { product: "iPhone 15 (128GB)", price: 77990, savings: 2000 },
        { product: "LG 8kg Washing Machine", price: 42990, savings: 3000 },
      ],
    },
    {
      id: 3,
      name: "Nike Store - Brigade Road",
      address: "Brigade Road, Bengaluru",
      distance: "8.3 km",
      deals: [{ product: "Nike Air Zoom Pegasus 39", price: 8999, savings: 2000 }],
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
            <MapPin className="h-5 w-5 text-primary" />
            Nearby Deals
          </CardTitle>
          <CardDescription>Best prices at local stores</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {nearbyStores.map((store) => (
            <div key={store.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">{store.name}</p>
                  <p className="text-xs text-muted-foreground">{store.address}</p>
                </div>
                <Badge variant="outline" className="text-xs font-normal">
                  {store.distance}
                </Badge>
              </div>
              {store.deals.map((deal, index) => (
                <Link
                  key={index}
                  href={`/nearby?storeId=${store.id}`}
                  className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-md transition-colors"
                >
                  <p className="text-sm">{deal.product}</p>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(deal.price)}</p>
                    <p className="text-xs text-green-600">Save {formatPrice(deal.savings)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ))}
          <div className="p-3 text-center">
            <Link href="/nearby" className="text-sm text-primary hover:text-primary/80 transition-colors">
              View all nearby stores
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

