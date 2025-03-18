import { MapPin, Navigation, Phone, Store } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface NearbyStoresListProps {
  selectedStoreId?: number
}

export async function NearbyStoresList({ selectedStoreId }: NearbyStoresListProps) {
  // In a real app, this would be an API call to fetch nearby stores
  await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API delay

  // Mock nearby stores data with proper addresses
  const stores = [
    {
      id: 1,
      name: "Reliance Digital",
      branch: "Daba Gardens",
      address: "Daba Gardens Main Road, Visakhapatnam, Andhra Pradesh 530020",
      distance: "1.2 km (approximate)",
      deals: [
        { product: "iPhone 15 Pro", price: 129990, savings: 5000 },
        { product: "Samsung Galaxy S23", price: 74999, savings: 10000 },
      ],
      mapUrl: "https://www.google.com/maps/dir/?api=1&destination=Reliance+Digital+Daba+Gardens+Visakhapatnam",
      phone: "+91 9876543210",
    },
    {
      id: 2,
      name: "Cell-Point",
      branch: "Daba Gardens",
      address: "Daba Gardens Junction, Visakhapatnam, Andhra Pradesh 530020",
      distance: "1.5 km (approximate)",
      deals: [
        { product: "iPhone 15", price: 77990, savings: 2000 },
        { product: "Samsung Galaxy S23 Ultra", price: 124999, savings: 15000 },
      ],
      mapUrl: "https://www.google.com/maps/dir/?api=1&destination=Cell+Point+Daba+Gardens+Visakhapatnam",
      phone: "+91 8765432109",
    },
    {
      id: 3,
      name: "Aptronix",
      branch: "Rama Talkies",
      address: "Rama Talkies Road, Visakhapatnam, Andhra Pradesh 530013",
      distance: "2.8 km (approximate)",
      deals: [
        { product: "iPhone 15 Pro Max", price: 154990, savings: 10000 },
        { product: "MacBook Air M2", price: 114990, savings: 15000 },
      ],
      mapUrl: "https://www.google.com/maps/dir/?api=1&destination=Aptronix+Rama+Talkies+Visakhapatnam",
      phone: "+91 7654321098",
    },
    {
      id: 4,
      name: "Poorvika Mobiles",
      branch: "Gajuwaka",
      address: "Gajuwaka Main Road, Visakhapatnam, Andhra Pradesh 530026",
      distance: "4.2 km (approximate)",
      deals: [
        { product: "Samsung Galaxy S23 FE", price: 49999, savings: 5000 },
        { product: "OnePlus 12", price: 64999, savings: 5000 },
      ],
      mapUrl: "https://www.google.com/maps/dir/?api=1&destination=Poorvika+Mobiles+Gajuwaka+Visakhapatnam",
      phone: "+91 6543210987",
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
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input placeholder="Enter your location" className="max-w-md" />
        <Button>Search</Button>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Note: Distances shown are approximate. For precise directions, use the "Directions" button.
      </p>

      <div className="grid gap-4">
        {stores.map((store) => (
          <Card key={store.id} className={selectedStoreId === store.id ? "border-primary" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    {store.name}
                  </CardTitle>
                  <CardDescription>{store.address}</CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {store.distance}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Current Deals:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {store.deals.map((deal, index) => (
                    <div key={index} className="flex justify-between items-center border p-2 rounded-md">
                      <p className="text-sm">{deal.product}</p>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(deal.price)}</p>
                        <p className="text-xs text-green-600">Save {formatPrice(deal.savings)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${store.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={store.mapUrl} target="_blank" rel="noopener noreferrer">
                      <Navigation className="h-4 w-4 mr-2" />
                      Directions
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

