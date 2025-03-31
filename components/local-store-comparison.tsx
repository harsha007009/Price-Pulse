"use client"

import { useState, useEffect } from "react"
import { ExternalLink, MapPin, Navigation, Phone, Store } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LocalStoreTable } from "@/components/local-store-table"
import { Product } from "@/lib/types"

interface LocalStoreComparisonProps {
  productId: string
  productName: string
}

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`)
  if (!res.ok) throw new Error('Failed to fetch product')
  const data = await res.json()
  return data.product
}

export function LocalStoreComparison({ productId, productName }: LocalStoreComparisonProps) {
  const [view, setView] = useState<"table" | "cards">("table")
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    getProduct(productId).then(setProduct)
  }, [productId])

  if (!product) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Local Store Comparison</h3>
          <p className="text-sm text-muted-foreground">
            Compare prices for {productName} at local stores and online marketplaces
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={view === "table" ? "secondary" : "outline"}
            className={view === "table" ? "bg-purple-600 text-white" : ""}
            onClick={() => setView("table")}
          >
            Table
          </Button>
          <Button 
            variant={view === "cards" ? "secondary" : "outline"}
            className={view === "cards" ? "bg-purple-600 text-white" : ""}
            onClick={() => setView("cards")}
          >
            Cards
          </Button>
        </div>
      </div>

      {view === "table" ? (
        <LocalStoreTable stores={product.prices.localStores} />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {product.prices.localStores.map((store) => (
            <Card key={store.name} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{store.name}</h4>
                  <p className="text-sm text-muted-foreground">{store.branch}</p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(store.lastUpdated).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">₹{store.price.toLocaleString()}</div>
                  {store.inStock ? (
                    <span className="text-sm text-green-500">In Stock</span>
                  ) : (
                    <span className="text-sm text-red-500">Out of Stock</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

