"use client"

import { useEffect, useState } from "react"
import { MapPin, Navigation, Phone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface LocalStoresProps {
  id: string
}

export function LocalStores({ id }: LocalStoresProps) {
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [stores, setStores] = useState<any[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Get user's location on component mount
  useEffect(() => {
    const getLocation = async () => {
      setIsLoading(true)

      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, enableHighAccuracy: false })
          })

          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        } catch (error) {
          console.warn("Geolocation error:", error)
          // Continue with default location or without location
          // We'll still allow searching by manually entered location
        } finally {
          // Trigger store search even if geolocation fails
          searchStores()
          setIsLoading(false)
        }
      } else {
        console.warn("Geolocation is not supported by this browser")
        // Continue without geolocation
        searchStores()
        setIsLoading(false)
      }
    }

    getLocation()
  }, [])

  // Mock search for local stores
  const searchStores = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock store data with proper addresses
      const mockStores = [
        {
          id: 1,
          name: "Reliance Digital",
          branch: "Daba Gardens",
          address: "Daba Gardens Main Road, Visakhapatnam, Andhra Pradesh 530020",
          phone: "+91 9876543210",
          distance: userLocation ? "1.2 km" : "Distance unknown",
          price: 84000,
          inStock: true,
        },
        {
          id: 2,
          name: "Cell-Point",
          branch: "Daba Gardens",
          address: "Daba Gardens Junction, Visakhapatnam, Andhra Pradesh 530020",
          phone: "+91 8765432109",
          distance: userLocation ? "1.5 km" : "Distance unknown",
          price: 82000,
          inStock: true,
        },
        {
          id: 3,
          name: "Aptronix",
          branch: "Rama Talkies",
          address: "Rama Talkies Road, Visakhapatnam, Andhra Pradesh 530013",
          phone: "+91 7654321098",
          distance: userLocation ? "2.8 km" : "Distance unknown",
          price: 78000,
          inStock: true,
        },
        {
          id: 4,
          name: "Poorvika Mobiles",
          branch: "Gajuwaka",
          address: "Gajuwaka Main Road, Visakhapatnam, Andhra Pradesh 530026",
          phone: "+91 6543210987",
          distance: userLocation ? "4.2 km" : "Distance unknown",
          price: 81500,
          inStock: true,
        },
      ]

      setStores(mockStores)
      setIsLoading(false)
    }, 1000)
  }

  // Search stores when location is entered or component mounts
  useEffect(() => {
    if (location) {
      searchStores()
    }
  }, [location, id])

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Get Google Maps directions URL
  const getDirectionsUrl = (store: any) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      `${store.name} ${store.branch}, ${store.address}`,
    )}`
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/50">
        <div className="space-y-1">
          <CardTitle>Nearby Stores</CardTitle>
          <CardDescription>Find this product in stores near you</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button onClick={searchStores} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          {userLocation && !location && <p className="text-sm text-muted-foreground">Using your current location</p>}

          {stores.length > 0 ? (
            <div className="space-y-4 mt-4">
              {stores.map((store) => (
                <div key={store.id} className="flex justify-between border p-4 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{store.name}</p>
                      <Badge variant="outline" className="text-xs font-normal">
                        {store.branch}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{store.address}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{store.distance}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{formatPrice(store.price)}</p>
                    {store.inStock ? (
                      <p className="text-xs text-green-600">In stock</p>
                    ) : (
                      <p className="text-xs text-red-500">Out of stock</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={`tel:${store.phone}`}>
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={getDirectionsUrl(store)} target="_blank" rel="noopener noreferrer">
                          <Navigation className="h-3 w-3 mr-1" />
                          Directions
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isLoading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {userLocation || location
                    ? "No stores found nearby with this product"
                    : "Enter your location or allow location access to find nearby stores"}
                </p>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  )
}

