"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ExternalLink, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export function LinkSearch() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedProduct, setParsedProduct] = useState<any | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      setError("Please enter a product URL")
      return
    }

    setIsLoading(true)
    setError(null)
    setParsedProduct(null)

    try {
      // In a real application, this would be an API call to parse the URL
      // For this demo, we'll simulate the parsing with a timeout and mock data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check if it's an Amazon or Flipkart URL
      const isAmazon = url.includes("amazon.in") || url.includes("amazon.com")
      const isFlipkart = url.includes("flipkart.com")

      if (!isAmazon && !isFlipkart) {
        throw new Error("Only Amazon and Flipkart URLs are supported")
      }

      // Extract product ID from URL
      let productId = ""

      if (isAmazon) {
        // Extract Amazon product ID (ASIN)
        // Example: https://www.amazon.in/Apple-iPhone-15-Pro-128GB/dp/B0CHX1K3RV/
        const dpMatch = url.match(/\/dp\/([A-Z0-9]+)/)
        if (dpMatch && dpMatch[1]) {
          productId = dpMatch[1]
        } else {
          throw new Error("Could not extract product ID from Amazon URL")
        }

        // For demo purposes, map some known ASINs to our mock products
        if (productId === "B0CHX1K3RV") {
          productId = "iphone-15-pro-256gb"
        } else if (productId === "B09XS7JWHH") {
          productId = "sony-wh-1000xm5"
        } else if (productId === "B084LJKZ3M") {
          productId = "samsung-double-door-refrigerator"
        } else if (productId === "B08698C78N") {
          productId = "lg-front-load-washing-machine"
        } else if (productId === "B09TMNVF8L") {
          productId = "nike-air-zoom-pegasus"
        } else {
          // For unknown products, we'll simulate finding a match
          productId = "iphone-15-pro-256gb" // Default to iPhone for demo
        }
      } else if (isFlipkart) {
        // Extract Flipkart product ID
        // Example: https://www.flipkart.com/apple-iphone-15-pro-natural-titanium-256-gb/p/itm4a2c127a8473c
        const pMatch = url.match(/\/p\/([a-z0-9]+)/)
        if (pMatch && pMatch[1]) {
          productId = pMatch[1]
        } else {
          throw new Error("Could not extract product ID from Flipkart URL")
        }

        // For demo purposes, map some known Flipkart IDs to our mock products
        if (productId === "itm4a2c127a8473c") {
          productId = "iphone-15-pro-256gb"
        } else if (productId === "itm7987c1e6d2a79") {
          productId = "sony-wh-1000xm5"
        } else if (productId === "itm123456789") {
          productId = "samsung-double-door-refrigerator"
        } else if (productId === "itm987654321") {
          productId = "lg-front-load-washing-machine"
        } else if (productId === "itm246813579") {
          productId = "nike-air-zoom-pegasus"
        } else {
          // For unknown products, we'll simulate finding a match
          productId = "samsung-galaxy-s23-ultra" // Default to Samsung for demo
        }
      }

      // Fetch product details (in a real app, this would be an API call)
      // For this demo, we'll simulate the response
      const response = await fetch(`/api/products/${productId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch product details")
      }

      const product = await response.json()
      setParsedProduct(product)

      toast({
        title: "Product found!",
        description: `We found ${product.name} in our database.`,
      })
    } catch (err: any) {
      console.error("Error parsing URL:", err)
      setError(err.message || "Failed to parse the URL. Please check and try again.")

      toast({
        title: "Error",
        description: err.message || "Failed to parse the URL",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const viewProductDetails = () => {
    if (parsedProduct && parsedProduct.id) {
      router.push(`/product/${parsedProduct.id}`)
    }
  }

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="border-none shadow-none bg-muted/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Search by URL</CardTitle>
        <CardDescription>Paste a product link from Amazon or Flipkart</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="url"
              placeholder="Paste Amazon or Flipkart product URL here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {parsedProduct && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="bg-muted/50 p-4 rounded-md flex items-center justify-center w-full md:w-32 h-32">
                    {parsedProduct.images && parsedProduct.images[0] ? (
                      <img
                        src={parsedProduct.images[0] || "/placeholder.svg"}
                        alt={parsedProduct.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <ExternalLink className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{parsedProduct.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{parsedProduct.brand}</Badge>
                      <Badge variant="outline">{parsedProduct.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{parsedProduct.description}</p>

                    <div className="flex flex-wrap gap-4 mt-4">
                      {parsedProduct.prices?.amazon && (
                        <div>
                          <p className="text-sm font-medium">Amazon</p>
                          <p className="font-bold">{formatPrice(parsedProduct.prices.amazon.price)}</p>
                        </div>
                      )}
                      {parsedProduct.prices?.flipkart && (
                        <div>
                          <p className="text-sm font-medium">Flipkart</p>
                          <p className="font-bold">{formatPrice(parsedProduct.prices.flipkart.price)}</p>
                        </div>
                      )}
                    </div>

                    <Button onClick={viewProductDetails} className="mt-4">
                      View Full Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

