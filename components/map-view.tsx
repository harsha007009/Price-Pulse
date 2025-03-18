"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Phone } from "lucide-react"
import { GoogleMap, type StoreLocation } from "@/components/google-map"

interface MapViewProps {
  selectedStoreId?: number
}

export function MapView({ selectedStoreId }: MapViewProps) {
  // Mock store data with proper coordinates for Visakhapatnam, India
  const stores: StoreLocation[] = [
    {
      id: 1,
      name: "Reliance Digital",
      branch: "Daba Gardens",
      address: "Daba Gardens Main Road, Visakhapatnam, Andhra Pradesh 530020",
      lat: 17.7252,
      lng: 83.3054,
      distance: "1.2 km",
      deals: [
        { product: "iPhone 15 Pro", price: 129990, savings: 5000 },
        { product: "Samsung Galaxy S23", price: 74999, savings: 10000 },
      ],
      phone: "+91 9876543210",
    },
    {
      id: 2,
      name: "Cell-Point",
      branch: "Daba Gardens",
      address: "Daba Gardens Junction, Visakhapatnam, Andhra Pradesh 530020",
      lat: 17.7242,
      lng: 83.3044,
      distance: "1.5 km",
      deals: [
        { product: "iPhone 15", price: 77990, savings: 2000 },
        { product: "Samsung Galaxy S23 Ultra", price: 124999, savings: 15000 },
      ],
      phone: "+91 8765432109",
    },
    {
      id: 3,
      name: "Aptronix",
      branch: "Rama Talkies",
      address: "Rama Talkies Road, Visakhapatnam, Andhra Pradesh 530013",
      lat: 17.7142,
      lng: 83.3001,
      distance: "2.8 km",
      deals: [
        { product: "iPhone 15 Pro Max", price: 154990, savings: 10000 },
        { product: "MacBook Air M2", price: 114990, savings: 15000 },
      ],
      phone: "+91 7654321098",
    },
  ]

  const [geolocationError, setGeolocationError] = useState<string | null>(null)

  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      setGeolocationError("Geolocation is not supported by your browser")
      return
    }

    // Test geolocation permissions
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        if (permissionStatus.state === "denied") {
          setGeolocationError("Location access is denied. Some features may be limited.")
        } else if (permissionStatus.state === "prompt") {
          // We'll handle this when the user interacts with the map
        }

        // Listen for permission changes
        permissionStatus.onchange = () => {
          if (permissionStatus.state === "denied") {
            setGeolocationError("Location access is denied. Some features may be limited.")
          } else if (permissionStatus.state === "granted") {
            setGeolocationError(null)
          }
        }
      })
      .catch(() => {
        // Permission query not supported or failed
        // We'll handle errors in the GoogleMap component
      })
  }, [])

  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(
    selectedStoreId ? stores.find((store) => store.id === selectedStoreId) || null : null,
  )

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Get Google Maps directions URL
  const getDirectionsUrl = (store: StoreLocation) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      `${store.name} ${store.branch}, ${store.address}`,
    )}`
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        {geolocationError && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 dark:bg-yellow-900/20 dark:border-yellow-600">
            <div className="flex">
              <div className="flex-shrink-0">
                <MapPin className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-200">{geolocationError}</p>
              </div>
            </div>
          </div>
        )}
        <GoogleMap stores={stores} onStoreSelect={setSelectedStore} selectedStoreId={selectedStore?.id} />
      </div>

      <div>
        <Card>
          <CardContent className="p-4">
            {selectedStore ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedStore.name}</h3>
                  <p className="text-sm font-medium">{selectedStore.branch}</p>
                  <p className="text-sm text-muted-foreground">{selectedStore.address}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{selectedStore.distance}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Current Deals:</h4>
                  {(selectedStore as any).deals?.map((deal: any, index: number) => (
                    <div key={index} className="flex justify-between items-center border p-2 rounded-md">
                      <p className="text-sm">{deal.product}</p>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(deal.price)}</p>
                        <p className="text-xs text-green-600">Save {formatPrice(deal.savings)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <a href={getDirectionsUrl(selectedStore)} target="_blank" rel="noopener noreferrer">
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </a>
                  </Button>

                  {(selectedStore as any).phone && (
                    <Button variant="outline" asChild>
                      <a href={`tel:${(selectedStore as any).phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Store
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
                <h3 className="mt-2 font-medium">Select a store</h3>
                <p className="text-sm text-muted-foreground mt-1">Click on a map marker to view store details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

