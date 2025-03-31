"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Navigation, ExternalLink } from "lucide-react"
import { LocalStore } from "@/lib/types"

interface LocalStoreTableProps {
  stores: LocalStore[]
}

export function LocalStoreTable({ stores }: LocalStoreTableProps) {
  // Sort stores by price (lowest first)
  const sortedStores = [...stores].sort((a, b) => a.price - b.price)

  // Get Google Maps directions URL
  const getDirectionsUrl = (store: LocalStore) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      `${store.name} ${store.branch}, ${store.address}`,
    )}`
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Stock Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStores.map((store, index) => (
            <TableRow key={store.name} className={index === 0 ? "bg-muted/50" : ""}>
              <TableCell className="font-medium">
                {store.name}
                {index === 0 && (
                  <Badge variant="secondary" className="ml-2">
                    Best Price
                  </Badge>
                )}
              </TableCell>
              <TableCell>{store.branch}</TableCell>
              <TableCell className="text-right font-medium">₹{store.price.toLocaleString()}</TableCell>
              <TableCell>
                {store.inStock ? (
                  <span className="text-green-500">In Stock</span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {store.phone && (
                    <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                      <a href={`tel:${store.phone}`}>
                        <Phone className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                    <a href={getDirectionsUrl(store)} target="_blank" rel="noopener noreferrer">
                      <Navigation className="h-4 w-4" />
                    </a>
                  </Button>
                  {store.website && (
                    <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                      <a href={store.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 