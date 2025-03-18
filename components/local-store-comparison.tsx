"use client"

import { useState } from "react"
import { ExternalLink, MapPin, Navigation, Phone, Store } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LocalStoreComparisonProps {
  productId: string
  productName: string
}

export function LocalStoreComparison({ productId, productName }: LocalStoreComparisonProps) {
  const [viewType, setViewType] = useState<"table" | "cards">("table")

  // This would come from an API in a real application
  const storeData = [
    {
      id: 1,
      name: "Reliance Digital",
      branch: "Daba Gardens",
      address: "Daba Gardens Main Road, Visakhapatnam, Andhra Pradesh 530020",
      phone: "+91 9876543210",
      price: 84000,
      inStock: true,
      distance: "1.2 km",
      image: "/placeholder.svg?height=40&width=120",
    },
    {
      id: 2,
      name: "Cell-Point",
      branch: "Daba Gardens",
      address: "Daba Gardens Junction, Visakhapatnam, Andhra Pradesh 530020",
      phone: "+91 8765432109",
      price: 82000,
      inStock: true,
      distance: "1.5 km",
      image: "/placeholder.svg?height=40&width=120",
    },
    {
      id: 3,
      name: "Aptronix",
      branch: "Rama Talkies",
      address: "Rama Talkies Road, Visakhapatnam, Andhra Pradesh 530013",
      phone: "+91 7654321098",
      price: 78000,
      inStock: true,
      distance: "2.8 km",
      image: "/placeholder.svg?height=40&width=120",
    },
  ]

  // Sort stores by price (lowest first)
  const sortedStores = [...storeData].sort((a, b) => a.price - b.price)

  // Online marketplace data
  const onlineStores = [
    {
      name: "Amazon",
      price: 79999,
      link: `https://www.amazon.in/s?k=${encodeURIComponent(productName)}`,
      image: "/placeholder.svg?height=40&width=120",
    },
    {
      name: "Flipkart",
      price: 80999,
      link: `https://www.flipkart.com/search?q=${encodeURIComponent(productName)}`,
      image: "/placeholder.svg?height=40&width=120",
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
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Local Store Comparison
          </CardTitle>
          <CardDescription>Compare prices at local stores and online marketplaces</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant={viewType === "table" ? "default" : "outline"} size="sm" onClick={() => setViewType("table")}>
            Table
          </Button>
          <Button variant={viewType === "cards" ? "default" : "outline"} size="sm" onClick={() => setViewType("cards")}>
            Cards
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {viewType === "table" ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Distance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStores.map((store, index) => (
                  <TableRow key={store.id} className={index === 0 ? "bg-muted/50" : ""}>
                    <TableCell className="font-medium">
                      {store.name}{" "}
                      {index === 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-2 text-xs font-normal text-green-600 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-900"
                        >
                          Best Price
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{store.branch}</TableCell>
                    <TableCell className="text-right font-medium">{formatPrice(store.price)}</TableCell>
                    <TableCell className="text-right">{store.distance}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" asChild>
                                <a href={`tel:${store.phone}`}>
                                  <Phone className="h-4 w-4" />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{store.phone}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" asChild>
                          <a href={getDirectionsUrl(store)} target="_blank" rel="noopener noreferrer">
                            <Navigation className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Online marketplaces */}
                <TableRow className="bg-muted/20">
                  <TableCell colSpan={5} className="text-center py-2">
                    <span className="text-sm font-medium">Online Marketplaces</span>
                  </TableCell>
                </TableRow>
                {onlineStores.map((store) => (
                  <TableRow key={store.name}>
                    <TableCell className="font-medium">{store.name}</TableCell>
                    <TableCell>Online</TableCell>
                    <TableCell className="text-right font-medium">{formatPrice(store.price)}</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <a href={store.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedStores.map((store, index) => (
                <Card key={store.id} className={index === 0 ? "border-primary/50" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{store.name}</CardTitle>
                      {index === 0 && (
                        <Badge
                          variant="secondary"
                          className="text-xs font-normal text-green-600 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-900"
                        >
                          Best Price
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{store.branch}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{store.distance}</span>
                      </div>
                      <div className="text-xl font-bold">{formatPrice(store.price)}</div>
                    </div>
                    <div className="text-sm">{store.address}</div>
                    <div className="flex gap-2 justify-between">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a href={`tel:${store.phone}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a href={getDirectionsUrl(store)} target="_blank" rel="noopener noreferrer">
                          <Navigation className="h-4 w-4 mr-2" />
                          Directions
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Online Marketplaces</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {onlineStores.map((store) => (
                  <Card key={store.name}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{store.name}</CardTitle>
                      <CardDescription>Online</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Online Store</span>
                        </div>
                        <div className="text-xl font-bold">{formatPrice(store.price)}</div>
                      </div>
                      <Button className="w-full" asChild>
                        <a href={store.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Store
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

