"use client"

import { useState, useEffect } from "react"
import { Heart, Share2, ShoppingCart, ExternalLink, RefreshCw, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { SetPriceAlert } from "@/components/set-price-alert"
import type { Product } from "@/lib/product-fetcher"
import { useToast } from "@/hooks/use-toast"
import { ProductImage } from "@/components/product-image"

interface ProductDetailsEnhancedProps {
  productId: string
}

export function ProductDetailsEnhanced({ productId }: ProductDetailsEnhancedProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products/${productId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`)
        }

        const data = await response.json()
        setProduct(data)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  // Function to update product data
  const updateProductData = async () => {
    try {
      setUpdating(true)

      const response = await fetch("/api/products/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          amazonUrl: product?.prices.amazon?.link,
          flipkartUrl: product?.prices.flipkart?.link,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.statusText}`)
      }

      const result = await response.json()

      // In a real implementation, you would update the product state with the new data
      // For this demo, we'll just show a success message

      toast({
        title: "Product data updated",
        description: "Latest prices and information have been fetched.",
        variant: "default",
      })
    } catch (err) {
      console.error("Error updating product data:", err)
      toast({
        title: "Update failed",
        description: "Could not update product data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
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

  // Find the lowest price
  const findLowestPrice = () => {
    if (!product) return null

    const prices = [
      product.prices.amazon?.price,
      product.prices.flipkart?.price,
      ...(product.prices.localStores?.map((store) => store.price) || []),
    ].filter(Boolean) as number[]

    if (prices.length === 0) return null

    const lowestPrice = Math.min(...prices)

    // Find which platform has the lowest price
    let lowestPlatform = ""
    let lowestPlatformLink = ""

    if (product.prices.amazon?.price === lowestPrice) {
      lowestPlatform = "Amazon"
      lowestPlatformLink = product.prices.amazon.link
    } else if (product.prices.flipkart?.price === lowestPrice) {
      lowestPlatform = "Flipkart"
      lowestPlatformLink = product.prices.flipkart.link
    } else {
      const lowestStore = product.prices.localStores?.find((store) => store.price === lowestPrice)
      if (lowestStore) {
        lowestPlatform = `${lowestStore.name} (${lowestStore.branch})`
        lowestPlatformLink = "#"
      }
    }

    return { price: lowestPrice, platform: lowestPlatform, link: lowestPlatformLink }
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-none shadow-md overflow-hidden">
          <CardContent className="p-0">
            <div className="flex justify-center items-center bg-muted/30 p-8 h-96">
              <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="h-8 bg-muted/50 rounded-md w-3/4 animate-pulse"></div>
          <div className="h-6 bg-muted/50 rounded-md w-1/2 animate-pulse"></div>
          <div className="h-10 bg-muted/50 rounded-md w-1/3 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted/50 rounded-md w-full animate-pulse"></div>
            <div className="h-4 bg-muted/50 rounded-md w-full animate-pulse"></div>
            <div className="h-4 bg-muted/50 rounded-md w-2/3 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Product</h2>
        <p className="text-muted-foreground mb-6">{error || "Product not found"}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  const lowestPriceInfo = findLowestPrice()

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-none shadow-md overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-muted/30 p-4">
              <div className="relative h-[400px] w-full">
                <Carousel className="w-full">
                  <CarouselContent>
                    {product.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="flex justify-center items-center p-2">
                          <ProductImage
                            src={image || "/placeholder.svg"}
                            alt={`${product.name} - Image ${index + 1}`}
                            width={400}
                            height={400}
                            className="object-contain max-h-[400px]"
                            fallbackSrc={`/placeholder.svg?height=400&width=400&text=${encodeURIComponent(product.name)}`}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={updateProductData}
              disabled={updating}
              className="flex items-center gap-1"
            >
              {updating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh Prices</span>
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {product.reviews.rating} ★ ({product.reviews.count} reviews)
            </Badge>
            <Badge variant="outline" className="text-sm">
              {product.brand}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {product.category}
            </Badge>
          </div>

          {lowestPriceInfo && (
            <div className="pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatPrice(lowestPriceInfo.price)}</span>
                <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                  {lowestPriceInfo.platform}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Lowest price available</p>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <p className="text-sm">{product.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            {lowestPriceInfo && lowestPriceInfo.link !== "#" && (
              <Button className="flex-1" asChild>
                <a href={lowestPriceInfo.link} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy Now
                </a>
              </Button>
            )}
            {lowestPriceInfo && <SetPriceAlert productId={productId} currentPrice={lowestPriceInfo.price} />}
            <Button variant="outline" size="icon" className="rounded-full">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="specifications" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="prices">Price Comparison</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="specifications" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prices" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Online Prices</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.prices.amazon && (
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Amazon</h4>
                          <p className="text-sm text-muted-foreground">
                            Last updated: {formatDate(product.prices.amazon.lastUpdated)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{formatPrice(product.prices.amazon.price)}</p>
                          <Button size="sm" variant="outline" asChild className="mt-2">
                            <a href={product.prices.amazon.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Visit
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}

                    {product.prices.flipkart && (
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Flipkart</h4>
                          <p className="text-sm text-muted-foreground">
                            Last updated: {formatDate(product.prices.flipkart.lastUpdated)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{formatPrice(product.prices.flipkart.price)}</p>
                          <Button size="sm" variant="outline" asChild className="mt-2">
                            <a href={product.prices.flipkart.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Visit
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {product.prices.localStores && product.prices.localStores.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Local Store Prices</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.prices.localStores.map((store, index) => (
                        <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{store.name}</h4>
                            <p className="text-sm">{store.branch}</p>
                            <p className="text-sm text-muted-foreground">
                              Last updated: {formatDate(store.lastUpdated)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{formatPrice(store.price)}</p>
                            <p className="text-sm text-muted-foreground">
                              {store.inStock ? (
                                <span className="text-green-600 flex items-center justify-end gap-1">
                                  <Check className="h-3 w-3" /> In Stock
                                </span>
                              ) : (
                                <span className="text-red-500">Out of Stock</span>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Online Availability</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.prices.amazon && (
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Amazon</h4>
                          <p className="text-sm text-muted-foreground">Shipping: Free with Prime</p>
                        </div>
                        <div className="text-right">
                          {product.prices.amazon.inStock ? (
                            <span className="text-green-600 flex items-center justify-end gap-1">
                              <Check className="h-4 w-4" /> In Stock
                            </span>
                          ) : (
                            <span className="text-red-500">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    )}

                    {product.prices.flipkart && (
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Flipkart</h4>
                          <p className="text-sm text-muted-foreground">Shipping: Free with Flipkart Assured</p>
                        </div>
                        <div className="text-right">
                          {product.prices.flipkart.inStock ? (
                            <span className="text-green-600 flex items-center justify-end gap-1">
                              <Check className="h-4 w-4" /> In Stock
                            </span>
                          ) : (
                            <span className="text-red-500">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {product.prices.localStores && product.prices.localStores.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Local Store Availability</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.prices.localStores.map((store, index) => (
                        <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{store.name}</h4>
                            <p className="text-sm">{store.branch}</p>
                          </div>
                          <div className="text-right">
                            {store.inStock ? (
                              <span className="text-green-600 flex items-center justify-end gap-1">
                                <Check className="h-4 w-4" /> In Stock
                              </span>
                            ) : (
                              <span className="text-red-500">Out of Stock</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

